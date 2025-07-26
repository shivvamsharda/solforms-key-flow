import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Eye, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { FormCanvas } from "@/components/form-builder/FormCanvas";
import { QuestionPalette } from "@/components/form-builder/QuestionPalette";
import { PropertyPanel } from "@/components/form-builder/PropertyPanel";

interface FormField {
  id: string;
  field_type: string;
  title: string;
  description?: string;
  required: boolean;
  field_order: number;
  options?: string[];
  validation?: any;
  settings?: any;
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  settings: any;
  published: boolean;
  fields: FormField[];
}

export default function FormBuilder() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    title: "Untitled Form",
    description: "",
    settings: {},
    published: false,
    fields: []
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (isEditing && user) {
      loadForm();
    }
  }, [user, loading, navigate, id, isEditing]);

  const loadForm = async () => {
    if (!user) return;
    
    try {
      // CRITICAL: Verify ownership before loading form
      const { data: form, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id) // Only allow access to user's own forms
        .single();

      if (formError) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to edit this form",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      const { data: fields, error: fieldsError } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", id)
        .order("field_order");

      if (fieldsError) throw fieldsError;

      setFormData({
        id: form.id,
        title: form.title,
        description: form.description || "",
        settings: form.settings || {},
        published: form.published,
        fields: fields || []
      });
    } catch (error) {
      console.error("Error loading form:", error);
      toast({
        title: "Error",
        description: "Failed to load form",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const saveForm = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      let formId = formData.id;

      if (isEditing) {
        // Update existing form
        const { error: formError } = await supabase
          .from("forms")
          .update({
            title: formData.title,
            description: formData.description,
            settings: formData.settings,
            updated_at: new Date().toISOString()
          })
          .eq("id", formId);

        if (formError) throw formError;
      } else {
        // Create new form
        const { data: newForm, error: formError } = await supabase
          .from("forms")
          .insert({
            title: formData.title,
            description: formData.description,
            settings: formData.settings,
            user_id: user.id,
            published: false
          })
          .select()
          .single();

        if (formError) throw formError;
        formId = newForm.id;
        setFormData(prev => ({ ...prev, id: formId }));
      }

      // Update fields
      if (formId) {
        // Delete existing fields
        await supabase
          .from("form_fields")
          .delete()
          .eq("form_id", formId);

        // Insert new fields
        if (formData.fields.length > 0) {
          const fieldsToInsert = formData.fields.map(field => ({
            form_id: formId,
            field_type: field.field_type,
            title: field.title,
            description: field.description,
            required: field.required,
            field_order: field.field_order,
            options: field.options,
            validation: field.validation,
            settings: field.settings
          }));

          const { error: fieldsError } = await supabase
            .from("form_fields")
            .insert(fieldsToInsert);

          if (fieldsError) throw fieldsError;
        }
      }

      toast({
        title: "Success",
        description: "Form saved successfully",
      });

      if (!isEditing && formId) {
        navigate(`/forms/${formId}/edit`);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping a new question type
    if (active.data.current?.type === "question-type") {
      const questionType = active.data.current.questionType;
      const newField: FormField = {
        id: `field-${Date.now()}`,
        field_type: questionType.type,
        title: questionType.title,
        description: "",
        required: false,
        field_order: formData.fields.length,
        options: questionType.type === "multiple_choice" || questionType.type === "checkbox" || questionType.type === "dropdown" 
          ? ["Option 1", "Option 2"] 
          : undefined,
        validation: {},
        settings: {}
      };

      setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }));
      setSelectedField(newField);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle reordering fields
    const { active, over } = event;
    
    if (!over || !active.data.current || active.data.current.type !== "field") return;

    const activeIndex = formData.fields.findIndex(field => field.id === active.id);
    const overIndex = formData.fields.findIndex(field => field.id === over.id);

    if (activeIndex !== overIndex) {
      const newFields = [...formData.fields];
      const [removed] = newFields.splice(activeIndex, 1);
      newFields.splice(overIndex, 0, removed);
      
      // Update field orders
      const updatedFields = newFields.map((field, index) => ({
        ...field,
        field_order: index
      }));

      setFormData(prev => ({ ...prev, fields: updatedFields }));
    }
  };

  const addQuestion = (questionType: any) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      field_type: questionType.type,
      title: questionType.title,
      description: "",
      required: false,
      field_order: formData.fields.length,
      options: questionType.type === "multiple_choice" || questionType.type === "checkbox" || questionType.type === "dropdown" 
        ? ["Option 1", "Option 2"] 
        : undefined,
      validation: {},
      settings: {}
    };

    setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedField(newField);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}
    >
      <div className="min-h-screen w-full bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 lg:px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0 truncate"
                  placeholder="Form Title"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Implement preview */}}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={saveForm}
                disabled={isSaving}
                className="bg-gradient-primary hover:shadow-glow"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Form Description */}
          <div className="mt-2">
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Form description (optional)"
              className="border-none bg-transparent px-0 text-sm text-muted-foreground resize-none focus-visible:ring-0"
              rows={1}
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Question Palette - Collapsible on mobile */}
          <aside className="w-64 lg:w-72 xl:w-80 border-r border-border bg-card flex-shrink-0 hidden md:flex">
            <QuestionPalette onAddQuestion={addQuestion} />
          </aside>

          {/* Form Canvas - Flexible width */}
          <main className="flex-1 min-w-0 relative">
            <FormCanvas
              fields={formData.fields}
              onFieldsChange={(fields) => setFormData(prev => ({ ...prev, fields }))}
              selectedField={selectedField}
              onFieldSelect={setSelectedField}
            />
          </main>

          {/* Property Panel - Hide on smaller screens */}
          <aside className="w-80 xl:w-96 border-l border-border bg-card flex-shrink-0 hidden lg:flex">
            <PropertyPanel
              selectedField={selectedField}
              onFieldUpdate={(updatedField) => {
                setFormData(prev => ({
                  ...prev,
                  fields: prev.fields.map(field =>
                    field.id === updatedField.id ? updatedField : field
                  )
                }));
                setSelectedField(updatedField);
              }}
              formSettings={formData.settings}
              onFormSettingsUpdate={(settings) => setFormData(prev => ({ ...prev, settings }))}
            />
          </aside>
        </div>
      </div>
    </DndContext>
  );
}