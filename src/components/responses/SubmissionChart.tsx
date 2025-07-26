import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface SubmissionChartProps {
  data: { date: string; submissions: number }[];
}

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--primary))",
  },
};

export const SubmissionChart = ({ data }: SubmissionChartProps) => {
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Submissions Over Time</CardTitle>
        <CardDescription className="text-muted-foreground">
          Daily submission count for the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="submissions" 
              stroke="var(--color-submissions)"
              strokeWidth={2}
              dot={{ fill: "var(--color-submissions)", r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};