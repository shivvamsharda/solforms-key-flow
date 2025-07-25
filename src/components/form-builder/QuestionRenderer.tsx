import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Upload, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";

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

interface QuestionRendererProps {
  field: FormField;
  preview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function QuestionRenderer({ field, preview = false, value, onChange }: QuestionRendererProps) {
  const renderField = () => {
    switch (field.field_type) {
      case "text":
        return (
          <Input
            placeholder="Enter your answer..."
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={preview}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder="Enter your answer..."
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={preview}
            rows={3}
          />
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            disabled={preview}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => {
                    if (!onChange) return;
                    const currentValue = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValue, option]);
                    } else {
                      onChange(currentValue.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={preview}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <Select value={value} onValueChange={onChange} disabled={preview}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => onChange?.(rating)}
                disabled={preview}
              >
                <Star
                  className={`w-6 h-6 ${
                    (value || 0) >= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            ))}
          </div>
        );

      case "yes_no":
        return (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            disabled={preview}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${field.id}-yes`} />
              <Label htmlFor={`${field.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${field.id}-no`} />
              <Label htmlFor={`${field.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "date":
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={preview}
            />
          </div>
        );

      case "file":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {preview ? "File upload field" : "Click to upload or drag and drop"}
            </p>
            {!preview && (
              <input
                type="file"
                className="hidden"
                onChange={(e) => onChange?.(e.target.files?.[0])}
              />
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted rounded-md text-center text-muted-foreground">
            Unknown field type: {field.field_type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {renderField()}
    </div>
  );
}