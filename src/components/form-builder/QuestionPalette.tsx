import { useDraggable } from "@dnd-kit/core";
import { 
  Type, 
  AlignLeft, 
  Circle, 
  CheckSquare, 
  ChevronDown, 
  Star, 
  ToggleLeft, 
  Calendar,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionType {
  id: string;
  type: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const questionTypes: QuestionType[] = [
  {
    id: "text",
    type: "text",
    title: "Text Input",
    icon: Type,
    description: "Single line text field"
  },
  {
    id: "textarea",
    type: "textarea", 
    title: "Textarea",
    icon: AlignLeft,
    description: "Multi-line text area"
  },
  {
    id: "multiple_choice",
    type: "multiple_choice",
    title: "Multiple Choice",
    icon: Circle,
    description: "Radio button selection"
  },
  {
    id: "checkbox",
    type: "checkbox",
    title: "Checkboxes",
    icon: CheckSquare,
    description: "Multi-select options"
  },
  {
    id: "dropdown",
    type: "dropdown",
    title: "Dropdown",
    icon: ChevronDown,
    description: "Select from dropdown"
  },
  {
    id: "rating",
    type: "rating",
    title: "Rating Scale",
    icon: Star,
    description: "1-5 star rating"
  },
  {
    id: "yes_no",
    type: "yes_no",
    title: "Yes/No",
    icon: ToggleLeft,
    description: "Simple toggle button"
  },
  {
    id: "date",
    type: "date",
    title: "Date Picker",
    icon: Calendar,
    description: "Calendar date selection"
  },
  {
    id: "file",
    type: "file",
    title: "File Upload",
    icon: Upload,
    description: "File attachment"
  }
];

interface DraggableQuestionTypeProps {
  questionType: QuestionType;
}

function DraggableQuestionType({ questionType }: DraggableQuestionTypeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: questionType.id,
    data: {
      type: "question-type",
      questionType
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 border border-border rounded-lg cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-muted rounded-md">
          <questionType.icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h4 className="text-sm font-medium">{questionType.title}</h4>
          <p className="text-xs text-muted-foreground">{questionType.description}</p>
        </div>
      </div>
    </div>
  );
}

export function QuestionPalette() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {questionTypes.map((questionType) => (
            <DraggableQuestionType
              key={questionType.id}
              questionType={questionType}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}