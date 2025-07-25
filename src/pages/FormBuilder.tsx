import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Eye, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
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
    try {
      const { data: form, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .single();

      if (formError) throw formError;

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
                placeholder="Form Title"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement preview */}}
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
      <div className="flex-1 flex">
        {/* Question Palette */}
        <aside className="w-64 border-r border-border bg-card">
          <QuestionPalette />
        </aside>

        {/* Form Canvas */}
        <main className="flex-1 relative">
          <FormCanvas
            fields={formData.fields}
            onFieldsChange={(fields) => setFormData(prev => ({ ...prev, fields }))}
            selectedField={selectedField}
            onFieldSelect={setSelectedField}
          />
        </main>

        {/* Property Panel */}
        <aside className="w-80 border-l border-border bg-card">
          <PropertyPanel
            selectedField={selectedField}
            onFieldUpdate={(updatedField) => {
              setFormData(prev => ({
                ...prev,
                fields: prev.fields.map(field =>
                  field.id === updatedField.id ? updatedField : field
                )
              }));
            }}
            formSettings={formData.settings}
            onFormSettingsUpdate={(settings) => setFormData(prev => ({ ...prev, settings }))}
          />
        </aside>
      </div>
    </div>
  );
}