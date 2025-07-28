import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, BarChart3, Settings, Users, Share2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ShareModal } from "@/components/ShareModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Form {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  accepting_responses: boolean;
  created_at: string;
  responses?: { count: number }[];
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalForm, setShareModalForm] = useState<Form | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      fetchForms();
    }
  }, [user, loading, navigate]);

  const fetchForms = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('forms')
        .select(`
          id, 
          title, 
          description, 
          published, 
          accepting_responses,
          created_at,
          responses:form_responses(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching forms:', error);
        return;
      }

      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAcceptingResponses = async (formId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('forms')
        .update({ accepting_responses: !currentStatus })
        .eq('id', formId);

      if (error) {
        console.error('Error updating form:', error);
        toast({
          title: "Error",
          description: "Failed to update response settings",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setForms(forms.map(form => 
        form.id === formId 
          ? { ...form, accepting_responses: !currentStatus }
          : form
      ));

      toast({
        title: "Success",
        description: !currentStatus ? "Form is now accepting responses" : "Form stopped accepting responses",
      });
    } catch (error) {
      console.error('Error updating form:', error);
      toast({
        title: "Error",
        description: "Failed to update response settings",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://sszxqukimsedglqwkneg.supabase.co/storage/v1/object/public/form-files//web3forms_logo_transparent.png" 
                alt="web3forms logo" 
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                web3forms
              </h1>
            </div>
            <span className="text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.filter(f => f.published).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.reduce((total, form) => total + (form.responses?.[0]?.count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Live</div>
            </CardContent>
          </Card>
        </div>

        {/* Forms List */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Forms</h2>
          <Button 
            onClick={() => navigate("/forms/create")}
            className="bg-gradient-primary hover:shadow-glow hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first form to start collecting responses
              </p>
              <Button 
                onClick={() => navigate("/forms/create")}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{form.title}</CardTitle>
                      <CardDescription>
                        {form.description || "No description"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={form.published ? "default" : "secondary"}>
                        {form.published ? "Published" : "Draft"}
                      </Badge>
                      {form.published && (
                        <Badge variant={form.accepting_responses ? "default" : "destructive"}>
                          {form.accepting_responses ? "Accepting" : "Closed"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(form.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                
                <Separator />
                
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/forms/${form.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    {form.published && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/forms/${form.id}/responses`)}
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Responses
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShareModalForm(form)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>

                  {form.published && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Accept Responses</span>
                      <Switch
                        checked={form.accepting_responses}
                        onCheckedChange={() => toggleAcceptingResponses(form.id, form.accepting_responses)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModalForm && (
        <ShareModal 
          formId={shareModalForm.id}
          isOpen={!!shareModalForm}
          onClose={() => setShareModalForm(null)}
        />
      )}
    </div>
  );
}