import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";

interface FormField {
  id: string;
  title: string;
  description?: string;
  field_type: string;
  required: boolean;
  options?: string[];
  field_order: number;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  thank_you_message?: string;
  published: boolean;
  expires_at?: string;
  response_limit?: number;
}

export default function PublicForm() {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      // Load form details
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .eq("published", true)
        .single();

      if (formError) throw formError;

      // Check if form is expired
      if (formData.expires_at && new Date(formData.expires_at) < new Date()) {
        throw new Error("This form has expired");
      }

      setForm(formData);

      // Load form fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", formId)
        .order("field_order");

      if (fieldsError) throw fieldsError;

      setFields(fieldsData || []);
    } catch (error: any) {
      console.error("Error loading form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load form",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const submitForm = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Solana wallet to submit this form.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !responses[field.id]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in all required fields: ${missingFields.map(f => f.title).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form response record
      const { data: responseData, error: responseError } = await supabase
        .from("form_responses")
        .insert({
          form_id: formId,
          wallet_address: publicKey.toString(),
          ip_address: null, // Could be populated server-side
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create field responses
      const fieldResponses = fields.map(field => ({
        form_response_id: responseData.id,
        field_id: field.id,
        response_value: responses[field.id] || null,
      }));

      const { error: fieldResponsesError } = await supabase
        .from("field_responses")
        .insert(fieldResponses);

      if (fieldResponsesError) throw fieldResponsesError;

      // Track analytics
      await supabase
        .from("form_analytics")
        .insert({
          form_id: formId,
          event_type: "form_submitted",
          wallet_address: publicKey.toString(),
        });

      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your response has been submitted successfully.",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = responses[field.id];

    switch (field.field_type) {
      case "text":
      case "email":
      case "url":
        return (
          <Input
            type={field.field_type}
            value={value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.description || `Enter ${field.title.toLowerCase()}`}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.description || `Enter ${field.title.toLowerCase()}`}
            required={field.required}
            rows={4}
          />
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.id, val)}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkboxes":
        const checkboxValue = value || [];
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={checkboxValue.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleFieldChange(field.id, [...checkboxValue, option]);
                    } else {
                      handleFieldChange(field.id, checkboxValue.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <Select value={value || ""} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.title.toLowerCase()}`} />
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

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case "rating":
        const rating = value || 0;
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-muted-foreground'
                } hover:text-yellow-400`}
                onClick={() => handleFieldChange(field.id, star)}
              >
                ⭐
              </button>
            ))}
          </div>
        );

      case "yes_no":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(val) => handleFieldChange(field.id, val)}
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

      default:
        return <div className="text-muted-foreground">Unsupported field type: {field.field_type}</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground">
              This form doesn't exist or is no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground">
              {form.thank_you_message || "Your response has been submitted successfully."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && (
              <p className="text-muted-foreground mt-2">{form.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Wallet Connection Banner */}
            {!connected && (
              <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Wallet Required
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Please connect your Solana wallet to submit this form.
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <WalletMultiButton />
                </div>
              </div>
            )}

            {/* Form Fields */}
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-base font-medium">
                  {field.title}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.description && (
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                )}
                {renderField(field)}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={submitForm}
                disabled={!connected || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}