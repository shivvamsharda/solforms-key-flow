import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableField } from "./SortableField";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

interface FormCanvasProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  selectedField: FormField | null;
  onFieldSelect: (field: FormField | null) => void;
}

export function FormCanvas({ fields, onFieldsChange, selectedField, onFieldSelect }: FormCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas"
  });


  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = fields
      .filter(field => field.id !== fieldId)
      .map((field, index) => ({ ...field, field_order: index }));
    
    onFieldsChange(updatedFields);
    
    if (selectedField?.id === fieldId) {
      onFieldSelect(null);
    }
  };

  const handleFieldUpdate = (updatedField: FormField) => {
    const updatedFields = fields.map(field =>
      field.id === updatedField.id ? updatedField : field
    );
    onFieldsChange(updatedFields);
  };

  return (
    <div className="h-full bg-muted/10">
      <div 
        ref={setNodeRef}
        className={`max-w-2xl mx-auto p-8 min-h-full ${
          isOver ? 'bg-primary/5 border-2 border-dashed border-primary' : ''
        }`}
      >
        {fields.length === 0 ? (
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Start building your form
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Drag question types from the left panel or click to add them to your form
              </p>
            </CardContent>
          </Card>
        ) : (
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedField?.id === field.id}
                  onSelect={() => onFieldSelect(field)}
                  onDelete={() => handleFieldDelete(field.id)}
                  onUpdate={handleFieldUpdate}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}