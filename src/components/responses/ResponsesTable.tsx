import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Filter } from "lucide-react";
import { FormResponse } from "@/utils/analyticsCalculations";
import { ResponseDetailModal } from "./ResponseDetailModal";

interface ResponsesTableProps {
  responses: FormResponse[];
  fields: any[];
}

export const ResponsesTable = ({ responses, fields }: ResponsesTableProps) => {
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [searchWallet, setSearchWallet] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  const filteredResponses = responses.filter(response => {
    const matchesSearch = !searchWallet || 
      response.wallet_address.toLowerCase().includes(searchWallet.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const responseDate = new Date(response.submitted_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'recent':
          matchesDate = (now.getTime() - responseDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesDate = (now.getTime() - responseDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  const calculateCompletion = (response: FormResponse) => {
    if (!response.field_responses) return 0;
    const answeredFields = response.field_responses.length;
    const totalFields = fields.length;
    return totalFields > 0 ? Math.round((answeredFields / totalFields) * 100) : 0;
  };

  return (
    <>
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Individual Responses
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            View and analyze individual form submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by wallet address..."
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Responses</SelectItem>
                <SelectItem value="recent">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Responses Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-border">
                  <TableHead className="text-muted-foreground">Wallet Address</TableHead>
                  <TableHead className="text-muted-foreground">Submitted</TableHead>
                  <TableHead className="text-muted-foreground">Completion</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No responses found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResponses.map((response) => {
                    const completion = calculateCompletion(response);
                    return (
                      <TableRow key={response.id} className="border-border hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">
                          {response.wallet_address.slice(0, 12)}...
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(response.submitted_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={completion === 100 ? "default" : completion >= 50 ? "secondary" : "destructive"}
                            className="bg-opacity-20"
                          >
                            {completion}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedResponse(response)}
                            className="border-border hover:bg-muted/30"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredResponses.length} of {responses.length} responses
          </div>
        </CardContent>
      </Card>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <ResponseDetailModal 
          response={selectedResponse}
          fields={fields}
          onClose={() => setSelectedResponse(null)}
        />
      )}
    </>
  );
};