import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Settings, FileText } from "lucide-react";

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

interface PropertyPanelProps {
  selectedField: FormField | null;
  onFieldUpdate: (field: FormField) => void;
  formSettings: any;
  onFormSettingsUpdate: (settings: any) => void;
}

export function PropertyPanel({ 
  selectedField, 
  onFieldUpdate, 
  formSettings, 
  onFormSettingsUpdate 
}: PropertyPanelProps) {
  const [newOption, setNewOption] = useState("");

  const updateField = (updates: Partial<FormField>) => {
    if (!selectedField) return;
    onFieldUpdate({ ...selectedField, ...updates });
  };

  const addOption = () => {
    if (!selectedField || !newOption.trim()) return;
    const currentOptions = selectedField.options || [];
    updateField({ options: [...currentOptions, newOption.trim()] });
    setNewOption("");
  };

  const removeOption = (index: number) => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || [];
    updateField({ options: currentOptions.filter((_, i) => i !== index) });
  };

  const updateOption = (index: number, value: string) => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    updateField({ options: updatedOptions });
  };

  const hasOptions = selectedField?.field_type && 
    ["multiple_choice", "checkbox", "dropdown"].includes(selectedField.field_type);

  return (
    <div className="h-full p-4 overflow-y-auto">
      <Tabs defaultValue="field" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="field" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Field</span>
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Form</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="field" className="mt-6">
          {selectedField ? (
            <div className="space-y-6">
              {/* Field Basic Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Field Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="field-title">Title</Label>
                    <Input
                      id="field-title"
                      value={selectedField.title}
                      onChange={(e) => updateField({ title: e.target.value })}
                      placeholder="Question title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="field-description">Description</Label>
                    <Textarea
                      id="field-description"
                      value={selectedField.description || ""}
                      onChange={(e) => updateField({ description: e.target.value })}
                      placeholder="Optional description or help text"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-required"
                      checked={selectedField.required}
                      onCheckedChange={(checked) => updateField({ required: checked })}
                    />
                    <Label htmlFor="field-required">Required field</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Options for choice fields */}
              {hasOptions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add new option..."
                        onKeyPress={(e) => e.key === "Enter" && addOption()}
                      />
                      <Button onClick={addOption} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Validation Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Validation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedField.field_type === "text" && (
                    <>
                      <div>
                        <Label htmlFor="min-length">Minimum length</Label>
                        <Input
                          id="min-length"
                          type="number"
                          value={selectedField.validation?.minLength || ""}
                          onChange={(e) => updateField({ 
                            validation: { 
                              ...selectedField.validation, 
                              minLength: parseInt(e.target.value) || undefined 
                            } 
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-length">Maximum length</Label>
                        <Input
                          id="max-length"
                          type="number"
                          value={selectedField.validation?.maxLength || ""}
                          onChange={(e) => updateField({ 
                            validation: { 
                              ...selectedField.validation, 
                              maxLength: parseInt(e.target.value) || undefined 
                            } 
                          })}
                          placeholder="No limit"
                        />
                      </div>
                    </>
                  )}

                  {selectedField.field_type === "checkbox" && (
                    <>
                      <div>
                        <Label htmlFor="min-selections">Minimum selections</Label>
                        <Input
                          id="min-selections"
                          type="number"
                          value={selectedField.validation?.minSelections || ""}
                          onChange={(e) => updateField({ 
                            validation: { 
                              ...selectedField.validation, 
                              minSelections: parseInt(e.target.value) || undefined 
                            } 
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-selections">Maximum selections</Label>
                        <Input
                          id="max-selections"
                          type="number"
                          value={selectedField.validation?.maxSelections || ""}
                          onChange={(e) => updateField({ 
                            validation: { 
                              ...selectedField.validation, 
                              maxSelections: parseInt(e.target.value) || undefined 
                            } 
                          })}
                          placeholder="No limit"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Select a field to edit its properties
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <div className="space-y-6">
            {/* Form Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-anonymous"
                    checked={formSettings.allowAnonymous || false}
                    onCheckedChange={(checked) => 
                      onFormSettingsUpdate({ ...formSettings, allowAnonymous: checked })
                    }
                  />
                  <Label htmlFor="allow-anonymous">Allow anonymous responses</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="multiple-responses"
                    checked={formSettings.allowMultipleResponses || false}
                    onCheckedChange={(checked) => 
                      onFormSettingsUpdate({ ...formSettings, allowMultipleResponses: checked })
                    }
                  />
                  <Label htmlFor="multiple-responses">Allow multiple responses per wallet</Label>
                </div>

                <div>
                  <Label htmlFor="response-limit">Response limit</Label>
                  <Input
                    id="response-limit"
                    type="number"
                    value={formSettings.responseLimit || ""}
                    onChange={(e) => 
                      onFormSettingsUpdate({ 
                        ...formSettings, 
                        responseLimit: parseInt(e.target.value) || undefined 
                      })
                    }
                    placeholder="No limit"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Token Gating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Token Gating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="token-gating"
                    checked={formSettings.tokenGating?.enabled || false}
                    onCheckedChange={(checked) => 
                      onFormSettingsUpdate({ 
                        ...formSettings, 
                        tokenGating: { ...formSettings.tokenGating, enabled: checked }
                      })
                    }
                  />
                  <Label htmlFor="token-gating">Enable token gating</Label>
                </div>

                {formSettings.tokenGating?.enabled && (
                  <>
                    <div>
                      <Label htmlFor="token-mint">Token mint address</Label>
                      <Input
                        id="token-mint"
                        value={formSettings.tokenGating?.tokenMint || ""}
                        onChange={(e) => 
                          onFormSettingsUpdate({ 
                            ...formSettings, 
                            tokenGating: { 
                              ...formSettings.tokenGating, 
                              tokenMint: e.target.value 
                            }
                          })
                        }
                        placeholder="Enter token mint address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="min-balance">Minimum token balance</Label>
                      <Input
                        id="min-balance"
                        type="number"
                        value={formSettings.tokenGating?.minBalance || ""}
                        onChange={(e) => 
                          onFormSettingsUpdate({ 
                            ...formSettings, 
                            tokenGating: { 
                              ...formSettings.tokenGating, 
                              minBalance: parseFloat(e.target.value) || 0 
                            }
                          })
                        }
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="access-denied-message">Access denied message</Label>
                      <Textarea
                        id="access-denied-message"
                        value={formSettings.tokenGating?.accessDeniedMessage || ""}
                        onChange={(e) => 
                          onFormSettingsUpdate({ 
                            ...formSettings, 
                            tokenGating: { 
                              ...formSettings.tokenGating, 
                              accessDeniedMessage: e.target.value 
                            }
                          })
                        }
                        placeholder="You need to hold at least X tokens to access this form."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}