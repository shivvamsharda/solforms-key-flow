import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import ResponsesAnalytics from "./pages/ResponsesAnalytics";
import PublicForm from "./pages/PublicForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms/create" element={<FormBuilder />} />
            <Route path="/forms/:id/edit" element={<FormBuilder />} />
            <Route path="/forms/:id/responses" element={<ResponsesAnalytics />} />
            <Route path="/form/:formId" element={<PublicForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletContextProvider>
  </QueryClientProvider>
);

export default App;
