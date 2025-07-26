import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, BarChart3, Settings, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WalletButton } from "@/components/WalletButton";
import { ShareModal } from "@/components/ShareModal";
import { toast } from "@/hooks/use-toast";

interface Form {
  id: string;
  title: string;
  description: string;
  published: boolean;
  created_at: string;
  _count?: {
    responses: number;
  };
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string>("");

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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("forms")
        .select(`
          id,
          title,
          description,
          published,
          created_at
        `)
        .eq("user_id", user.id) // CRITICAL: Only show forms owned by the user
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Error",
        description: "Failed to load your forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openShareModal = (formId: string) => {
    setSelectedFormId(formId);
    setShareModalOpen(true);
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
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="w-full px-4 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="flex items-center space-x-3">
              <img 
                src="https://sszxqukimsedglqwkneg.supabase.co/storage/v1/object/public/form-files//web3forms_logo_transparent.png" 
                alt="web3forms logo" 
                className="w-8 h-8 flex-shrink-0"
              />
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                web3forms
              </h1>
            </div>
            <span className="text-muted-foreground hidden sm:inline">Dashboard</span>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="w-full px-4 lg:px-8 py-6 lg:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
              <div className="text-2xl font-bold">0</div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Your Forms</h2>
          <Button 
            onClick={() => navigate("/forms/create")}
            className="bg-gradient-primary hover:shadow-glow hover:scale-105 w-full sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1 mr-2">
                      <CardTitle className="text-lg truncate">{form.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {form.description || "No description"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        form.published ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {form.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-muted-foreground">
                      Created {new Date(form.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/forms/${form.id}/edit`)}
                        className="w-full sm:w-auto"
                      >
                        Edit
                      </Button>
                      {form.published && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/forms/${form.id}/responses`)}
                            className="w-full sm:w-auto"
                          >
                            Responses
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openShareModal(form.id)}
                            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal 
        formId={selectedFormId}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}