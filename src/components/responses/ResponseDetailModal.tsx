import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { FormResponse, FormField } from "@/utils/analyticsCalculations";

interface ResponseDetailModalProps {
  response: FormResponse;
  fields: FormField[];
  onClose: () => void;
}

export const ResponseDetailModal = ({ response, fields, onClose }: ResponseDetailModalProps) => {
  // Create a map of field responses by field_id
  const fieldResponsesMap = response.field_responses?.reduce((acc, fieldResponse) => {
    acc[fieldResponse.field_id] = fieldResponse.response_value;
    return acc;
  }, {} as Record<string, any>) || {};

  const formatResponseValue = (field: FormField, value: any) => {
    if (value == null || value === '') return 'No response';
    
    switch (field.field_type) {
      case 'checkboxes':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'yes-no':
        return value === true || value === 'yes' ? 'Yes' : 'No';
      case 'rating':
        return `${value} / 5`;
      case 'file':
        if (typeof value === 'object' && value.filename) {
          return (
            <div className="space-y-1">
              <div className="font-medium">{value.filename}</div>
              <div className="text-sm text-muted-foreground">
                {value.size ? `${(value.size / 1024 / 1024).toFixed(2)} MB` : ''} • {value.type || 'Unknown type'}
              </div>
              {value.url && (
                <a 
                  href={value.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View File
                </a>
              )}
            </div>
          );
        }
        return value;
      default:
        return value;
    }
  };

  const completedFields = fields.filter(field => fieldResponsesMap[field.id] != null && fieldResponsesMap[field.id] !== '');
  const completionRate = Math.round((completedFields.length / fields.length) * 100);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Response Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete submission details and answers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Response Metadata */}
          <Card className="bg-muted/30 border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Submission Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Wallet Address:</span>
                  </div>
                  <div className="font-mono text-sm bg-background p-2 rounded border border-border">
                    {response.wallet_address}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Submitted:</span>
                  </div>
                  <div className="text-sm">
                    {new Date(response.submitted_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Completion Rate:</span>
                </div>
                <Badge variant={completionRate === 100 ? "default" : completionRate >= 50 ? "secondary" : "destructive"}>
                  {completedFields.length}/{fields.length} fields ({completionRate}%)
                </Badge>
              </div>

              {response.ip_address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">IP Address:</span>
                  </div>
                  <div className="text-sm font-mono">{String(response.ip_address)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Responses */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Form Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => {
                const value = fieldResponsesMap[field.id];
                const hasResponse = value != null && value !== '';
                
                return (
                  <div key={field.id}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{field.title}</span>
                            {field.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          {field.description && (
                            <p className="text-sm text-muted-foreground">{field.description}</p>
                          )}
                        </div>
                        <Badge variant={hasResponse ? "default" : "secondary"} className="ml-2">
                          {hasResponse ? "Answered" : "Skipped"}
                        </Badge>
                      </div>
                      
                      <div className="pl-4 border-l-2 border-border">
                        <div className="min-h-[2rem] flex items-center">
                          {hasResponse ? (
                            <div className="text-foreground">
                              {formatResponseValue(field, value)}
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic">
                              No response provided
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {index < fields.length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};