import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [localState, setLocalState] = useState<Record<string, any>>({});

  const renderField = () => {
    switch (field.field_type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Enter your answer..."
            value={localState[`text-${field.id}`] || ""}
            onChange={(e) => {
              setLocalState(prev => ({
                ...prev,
                [`text-${field.id}`]: e.target.value
              }));
              onChange?.(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder="Enter your answer..."
            value={localState[`textarea-${field.id}`] || ""}
            onChange={(e) => {
              setLocalState(prev => ({
                ...prev,
                [`textarea-${field.id}`]: e.target.value
              }));
              onChange?.(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            rows={3}
            className="w-full p-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        );

      case "multiple_choice":
        return (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`radio-${field.id}`}
                  id={`${field.id}-${index}`}
                  value={option}
                  checked={localState[`radio-${field.id}`] === option}
                  onChange={(e) => {
                    setLocalState(prev => ({
                      ...prev,
                      [`radio-${field.id}`]: e.target.value
                    }));
                    onChange?.(e.target.value);
                  }}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <label htmlFor={`${field.id}-${index}`} className="text-foreground cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(localState[`checkbox-${field.id}`]) && localState[`checkbox-${field.id}`].includes(option)}
                  onChange={(e) => {
                    const currentValue = Array.isArray(localState[`checkbox-${field.id}`]) ? localState[`checkbox-${field.id}`] : [];
                    const newValue = e.target.checked 
                      ? [...currentValue, option]
                      : currentValue.filter((v: string) => v !== option);
                    
                    setLocalState(prev => ({
                      ...prev,
                      [`checkbox-${field.id}`]: newValue
                    }));
                    onChange?.(newValue);
                  }}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor={`${field.id}-${index}`} className="text-foreground cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select 
              value={localState[`dropdown-${field.id}`] || ""} 
              onValueChange={(value) => {
                setLocalState(prev => ({
                  ...prev,
                  [`dropdown-${field.id}`]: value
                }));
                onChange?.(value);
              }}
            >
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
          </div>
        );

      case "rating":
        const rating = localState[`rating-${field.id}`] || 0;
        const hoverRating = localState[`hover-${field.id}`] || 0;
        
        return (
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400"
                    : "text-muted-foreground"
                } hover:text-yellow-300`}
                onClick={() => {
                  setLocalState(prev => ({
                    ...prev,
                    [`rating-${field.id}`]: star
                  }));
                  onChange?.(star);
                }}
                onMouseEnter={() => {
                  setLocalState(prev => ({
                    ...prev,
                    [`hover-${field.id}`]: star
                  }));
                }}
                onMouseLeave={() => {
                  setLocalState(prev => ({
                    ...prev,
                    [`hover-${field.id}`]: 0
                  }));
                }}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        );

      case "yes_no":
        return (
          <div className="flex space-x-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name={`yesno-${field.id}`}
                id={`${field.id}-yes`}
                value="yes"
                checked={localState[`yesno-${field.id}`] === "yes"}
                onChange={(e) => {
                  setLocalState(prev => ({
                    ...prev,
                    [`yesno-${field.id}`]: e.target.value
                  }));
                  onChange?.(e.target.value);
                }}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <label htmlFor={`${field.id}-yes`} className="text-foreground cursor-pointer">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name={`yesno-${field.id}`}
                id={`${field.id}-no`}
                value="no"
                checked={localState[`yesno-${field.id}`] === "no"}
                onChange={(e) => {
                  setLocalState(prev => ({
                    ...prev,
                    [`yesno-${field.id}`]: e.target.value
                  }));
                  onChange?.(e.target.value);
                }}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <label htmlFor={`${field.id}-no`} className="text-foreground cursor-pointer">No</label>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={localState[`date-${field.id}`] || ""}
              onChange={(e) => {
                setLocalState(prev => ({
                  ...prev,
                  [`date-${field.id}`]: e.target.value
                }));
                onChange?.(e.target.value);
              }}
              className="w-full p-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        );

      case "file":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <input
              type="file"
              className="hidden"
              id={`file-${field.id}`}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLocalState(prev => ({
                    ...prev,
                    [`file-${field.id}`]: file.name
                  }));
                  onChange?.(file);
                }
              }}
            />
            <label
              htmlFor={`file-${field.id}`}
              className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
            >
              Choose file
            </label>
            {localState[`file-${field.id}`] && (
              <p className="text-xs text-foreground mt-2">
                Selected: {localState[`file-${field.id}`]}
              </p>
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