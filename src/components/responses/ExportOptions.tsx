import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Database } from "lucide-react";
import { FormResponse, FormField, downloadFile } from "@/utils/analyticsCalculations";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  responses: FormResponse[];
  fields: FormField[];
  formTitle: string;
}

export const ExportOptions = ({ responses, fields, formTitle }: ExportOptionsProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    try {
      // Create headers
      const headers = ['Wallet Address', 'Submitted At', 'IP Address', ...fields.map(f => f.title)];
      
      // Create rows
      const rows = responses.map(response => {
        const fieldResponsesMap = response.field_responses?.reduce((acc, fr) => {
          acc[fr.field_id] = fr.response_value;
          return acc;
        }, {} as Record<string, any>) || {};

        const row = [
          response.wallet_address,
          new Date(response.submitted_at).toISOString(),
          response.ip_address || '',
          ...fields.map(field => {
            const value = fieldResponsesMap[field.id];
            if (value == null || value === '') return '';
            
            // Handle different field types for CSV export
            switch (field.field_type) {
              case 'checkboxes':
                return Array.isArray(value) ? value.join('; ') : value;
              case 'file':
                return typeof value === 'object' && value.filename ? value.filename : value;
              case 'yes-no':
                return value === true || value === 'yes' ? 'Yes' : 'No';
              default:
                return typeof value === 'object' ? JSON.stringify(value) : value;
            }
          })
        ];
        
        return row;
      });

      // Convert to CSV
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      downloadFile(csvContent, `${formTitle.replace(/\s+/g, '_')}_responses.csv`, 'text/csv');
      
      toast({
        title: "Export Successful",
        description: "CSV file has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV file",
        variant: "destructive",
      });
    }
  };

  const exportToJSON = () => {
    try {
      const exportData = {
        form: {
          title: formTitle,
          fields: fields
        },
        responses: responses,
        exportedAt: new Date().toISOString(),
        totalResponses: responses.length,
        uniqueWallets: new Set(responses.map(r => r.wallet_address)).size
      };

      downloadFile(
        JSON.stringify(exportData, null, 2),
        `${formTitle.replace(/\s+/g, '_')}_responses.json`,
        'application/json'
      );

      toast({
        title: "Export Successful",
        description: "JSON file has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export JSON file",
        variant: "destructive",
      });
    }
  };

  const generateSummaryReport = () => {
    try {
      const uniqueWallets = new Set(responses.map(r => r.wallet_address)).size;
      const completionRates = responses.map(response => {
        const answered = response.field_responses?.length || 0;
        return Math.round((answered / fields.length) * 100);
      });
      const avgCompletion = completionRates.length > 0 
        ? Math.round(completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length)
        : 0;

      const report = `
FORM ANALYTICS REPORT
====================

Form: ${formTitle}
Generated: ${new Date().toLocaleString()}

OVERVIEW STATISTICS
------------------
Total Responses: ${responses.length}
Unique Wallets: ${uniqueWallets}
Average Completion Rate: ${avgCompletion}%

FIELD STATISTICS
---------------
${fields.map(field => {
  const fieldResponses = responses.filter(r => 
    r.field_responses?.some(fr => fr.field_id === field.id && fr.response_value != null && fr.response_value !== '')
  );
  const responseRate = Math.round((fieldResponses.length / responses.length) * 100);
  return `${field.title}: ${fieldResponses.length}/${responses.length} responses (${responseRate}%)`;
}).join('\n')}

SUBMISSION TIMELINE
------------------
${responses.slice(-10).map(r => 
  `${new Date(r.submitted_at).toLocaleString()} - ${r.wallet_address.slice(0, 12)}...`
).join('\n')}
      `.trim();

      downloadFile(report, `${formTitle.replace(/\s+/g, '_')}_summary_report.txt`, 'text/plain');

      toast({
        title: "Report Generated",
        description: "Summary report has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Report Failed",
        description: "Failed to generate summary report",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Download your form responses in different formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={exportToCSV} 
            variant="outline"
            className="h-20 flex-col gap-2 border-border hover:bg-muted/30"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Export CSV</div>
              <div className="text-xs text-muted-foreground">Spreadsheet format</div>
            </div>
          </Button>

          <Button 
            onClick={exportToJSON} 
            variant="outline"
            className="h-20 flex-col gap-2 border-border hover:bg-muted/30"
          >
            <Database className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Export JSON</div>
              <div className="text-xs text-muted-foreground">Raw data format</div>
            </div>
          </Button>

          <Button 
            onClick={generateSummaryReport} 
            variant="outline"
            className="h-20 flex-col gap-2 border-border hover:bg-muted/30"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">Summary Report</div>
              <div className="text-xs text-muted-foreground">Text summary</div>
            </div>
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Export Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• CSV: Compatible with Excel, Google Sheets, and other spreadsheet applications</li>
            <li>• JSON: Raw data format for developers and advanced analysis</li>
            <li>• Summary: Human-readable overview of key statistics and insights</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};