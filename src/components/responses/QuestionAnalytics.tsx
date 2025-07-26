import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { FormField, QuestionAnalytics as QuestionAnalyticsType } from "@/utils/analyticsCalculations";

interface QuestionAnalyticsProps {
  fields: FormField[];
  analytics: QuestionAnalyticsType;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--primary-glow))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

export const QuestionAnalytics = ({ fields, analytics }: QuestionAnalyticsProps) => {
  const renderQuestionChart = (field: FormField) => {
    const questionData = analytics[field.id];
    if (!questionData) return null;

    const chartConfig = {
      count: {
        label: "Count",
        color: "hsl(var(--primary))",
      },
    };

    switch (field.field_type) {
      case 'multiple-choice':
      case 'dropdown':
      case 'checkboxes':
        return (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={questionData.choices}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="option" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string, props: any) => [
                  `${value} (${props.payload.percentage}%)`,
                  "Responses"
                ]}
              />
              <Bar 
                dataKey="count" 
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={questionData.ratings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="rating" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--accent))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{questionData.avgRating}</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{questionData.totalResponses}</div>
                <div className="text-muted-foreground">Total Responses</div>
              </div>
            </div>
          </div>
        );

      case 'yes-no':
        return (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={questionData.yesno}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {questionData.yesno?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );

      case 'text-input':
      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{questionData.totalResponses}</div>
                <div className="text-sm text-muted-foreground">Total Responses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{questionData.avgLength}</div>
                <div className="text-sm text-muted-foreground">Avg. Characters</div>
              </div>
            </div>
            {questionData.recentResponses && questionData.recentResponses.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recent Responses:</h4>
                {questionData.recentResponses.map((response, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">"{response.text}"</p>
                    <small className="text-muted-foreground">
                      - {response.wallet} on {response.date}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="text-2xl font-bold text-primary">{questionData.totalResponses}</div>
            <div className="text-muted-foreground">Total Responses</div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <Card key={field.id} className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{field.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {field.description || `Analysis for ${field.field_type} field`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuestionChart(field)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};