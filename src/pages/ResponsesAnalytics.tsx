import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Users, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

import { OverviewStats } from "@/components/responses/OverviewStats";
import { SubmissionChart } from "@/components/responses/SubmissionChart";
import { QuestionAnalytics } from "@/components/responses/QuestionAnalytics";
import { ResponsesTable } from "@/components/responses/ResponsesTable";
import { ExportOptions } from "@/components/responses/ExportOptions";

import {
  FormResponse,
  FormField,
  generateQuestionAnalytics,
  generateSubmissionTrend,
  generateTimeAnalytics,
  generateWalletAnalytics,
  calculateOverviewStats
} from "@/utils/analyticsCalculations";

interface Form {
  id: string;
  title: string;
  description: string;
  user_id: string;
  published: boolean;
  created_at: string;
}

export default function ResponsesAnalytics() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (authLoading || !user || !id) return;

    const loadAnalyticsData = async () => {
      try {
        // Load form details
        const { data: formData, error: formError } = await supabase
          .from("forms")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (formError) {
          if (formError.code === 'PGRST116') {
            toast({
              title: "Access Denied",
              description: "You don't have permission to view this form's analytics.",
              variant: "destructive",
            });
            return;
          }
          throw formError;
        }

        setForm(formData);

        // Load form fields
        const { data: fieldsData, error: fieldsError } = await supabase
          .from("form_fields")
          .select("*")
          .eq("form_id", id)
          .order("field_order");

        if (fieldsError) throw fieldsError;
        setFields(fieldsData || []);

        // Load form responses with field responses
        const { data: responsesData, error: responsesError } = await supabase
          .from("form_responses")
          .select(`
            *,
            field_responses (*)
          `)
          .eq("form_id", id)
          .order("submitted_at", { ascending: false });

        if (responsesError) throw responsesError;
        setResponses(responsesData || []);

      } catch (error) {
        console.error("Error loading analytics data:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [authLoading, user, id, toast]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-96 bg-gradient-card border-border">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-96 bg-gradient-card border-border">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-96 bg-gradient-card border-border">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The form you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/dashboard">
              <Button variant="outline" className="border-border">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate analytics data
  const questionAnalytics = generateQuestionAnalytics(fields, responses);
  const submissionTrend = generateSubmissionTrend(responses);
  const timeAnalytics = generateTimeAnalytics(responses);
  const walletAnalytics = generateWalletAnalytics(responses);
  const overviewStats = calculateOverviewStats(responses, questionAnalytics);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <span>/</span>
              <span>Analytics</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{form.title}</h1>
            <p className="text-muted-foreground">
              {form.description || "Form response analytics and insights"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" className="border-border">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <OverviewStats stats={overviewStats} />

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Questions</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Responses</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SubmissionChart data={submissionTrend} />
              
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Insights</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Key metrics at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{responses.length}</div>
                      <div className="text-sm text-muted-foreground">Total Submissions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-accent">{overviewStats.uniqueWallets}</div>
                      <div className="text-sm text-muted-foreground">Unique Wallets</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Most Active Field:</span>
                      <span className="text-sm font-medium text-foreground">
                        {fields.length > 0 ? fields[0].title : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Response Rate:</span>
                      <span className="text-sm font-medium text-primary">{overviewStats.responseRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Form Status:</span>
                      <span className={`text-sm font-medium ${form.published ? 'text-accent' : 'text-muted-foreground'}`}>
                        {form.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <QuestionAnalytics fields={fields} analytics={questionAnalytics} />
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <ResponsesTable responses={responses} fields={fields} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportOptions 
              responses={responses} 
              fields={fields} 
              formTitle={form.title} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}