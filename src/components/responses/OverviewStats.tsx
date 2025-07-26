import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Clock } from "lucide-react";

interface OverviewStatsProps {
  stats: {
    totalResponses: number;
    uniqueWallets: number;
    responseRate: number;
    avgCompletionTime: string;
  };
}

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Responses
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            Submitted responses
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique Wallets
          </CardTitle>
          <Users className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.uniqueWallets}</div>
          <p className="text-xs text-muted-foreground">
            Individual respondents
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Response Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-primary-glow" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.responseRate}%</div>
          <p className="text-xs text-muted-foreground">
            Conversion rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Completion
          </CardTitle>
          <Clock className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.avgCompletionTime}</div>
          <p className="text-xs text-muted-foreground">
            Time to complete
          </p>
        </CardContent>
      </Card>
    </div>
  );
};