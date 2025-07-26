import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export interface FormResponse {
  id: string;
  form_id: string;
  wallet_address: string;
  submitted_at: string;
  user_id?: string;
  ip_address?: string | unknown;
  field_responses?: FieldResponse[];
}

export interface FieldResponse {
  id: string;
  field_id: string;
  response_value: any;
  form_response_id: string;
  created_at?: string;
}

export interface FormField {
  id: string;
  field_type: string;
  title: string;
  description?: string;
  options?: string[];
  required: boolean;
  field_order: number;
}

export interface QuestionAnalytics {
  [questionId: string]: {
    choices?: { option: string; count: number; percentage: number }[];
    ratings?: { rating: string; count: number }[];
    avgRating?: number;
    totalResponses?: number;
    recentResponses?: { text: string; wallet: string; date: string }[];
    yesno?: { name: string; count: number }[];
    avgLength?: number;
  };
}

export const generateQuestionAnalytics = (
  fields: FormField[],
  responses: FormResponse[]
): QuestionAnalytics => {
  const analytics: QuestionAnalytics = {};

  // Create a map of field responses by field_id
  const fieldResponsesMap: { [fieldId: string]: any[] } = {};
  
  responses.forEach(response => {
    if (response.field_responses) {
      response.field_responses.forEach(fieldResponse => {
        if (!fieldResponsesMap[fieldResponse.field_id]) {
          fieldResponsesMap[fieldResponse.field_id] = [];
        }
        fieldResponsesMap[fieldResponse.field_id].push({
          value: fieldResponse.response_value,
          wallet: response.wallet_address,
          date: response.submitted_at
        });
      });
    }
  });

  fields.forEach(field => {
    const fieldResponses = fieldResponsesMap[field.id] || [];
    const values = fieldResponses.map(r => r.value).filter(v => v != null && v !== '');

    switch (field.field_type) {
      case 'multiple-choice':
      case 'dropdown':
        analytics[field.id] = {
          choices: field.options?.map(option => {
            const count = values.filter(v => v === option).length;
            return {
              option,
              count,
              percentage: values.length > 0 ? Math.round((count / values.length) * 100) : 0
            };
          }) || []
        };
        break;

      case 'checkboxes':
        analytics[field.id] = {
          choices: field.options?.map(option => {
            const count = values.filter(v => Array.isArray(v) ? v.includes(option) : v === option).length;
            return {
              option,
              count,
              percentage: values.length > 0 ? Math.round((count / values.length) * 100) : 0
            };
          }) || []
        };
        break;

      case 'rating':
        const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
          rating: rating.toString(),
          count: values.filter(v => parseInt(v) === rating).length
        }));
        
        const totalRatings = values.filter(v => !isNaN(parseInt(v)));
        const avgRating = totalRatings.length > 0 
          ? totalRatings.reduce((sum, v) => sum + parseInt(v), 0) / totalRatings.length 
          : 0;

        analytics[field.id] = {
          ratings: ratingCounts,
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalResponses: totalRatings.length
        };
        break;

      case 'text-input':
      case 'textarea':
        const textResponses = values.filter(v => typeof v === 'string');
        analytics[field.id] = {
          totalResponses: textResponses.length,
          avgLength: textResponses.length > 0 
            ? Math.round(textResponses.reduce((sum, v) => sum + v.length, 0) / textResponses.length)
            : 0,
          recentResponses: fieldResponses
            .filter(r => typeof r.value === 'string' && r.value.trim())
            .slice(-5)
            .map(r => ({
              text: r.value.length > 100 ? r.value.slice(0, 100) + '...' : r.value,
              wallet: r.wallet?.slice(0, 12) + '...' || 'Unknown',
              date: new Date(r.date).toLocaleDateString()
            }))
        };
        break;

      case 'yes-no':
        analytics[field.id] = {
          yesno: [
            { name: 'Yes', count: values.filter(v => v === 'yes' || v === true).length },
            { name: 'No', count: values.filter(v => v === 'no' || v === false).length }
          ]
        };
        break;

      default:
        analytics[field.id] = {
          totalResponses: values.length
        };
    }
  });

  return analytics;
};

export const generateSubmissionTrend = (responses: FormResponse[]) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  return last30Days.map(date => ({
    date: format(new Date(date), 'MMM dd'),
    submissions: responses.filter(r => 
      format(new Date(r.submitted_at), 'yyyy-MM-dd') === date
    ).length
  }));
};

export const generateTimeAnalytics = (responses: FormResponse[]) => {
  const timeRanges = [
    { range: '0-5 min', min: 0, max: 5 },
    { range: '5-15 min', min: 5, max: 15 },
    { range: '15-30 min', min: 15, max: 30 },
    { range: '30+ min', min: 30, max: Infinity }
  ];

  // For now, we'll simulate response times since we don't track them yet
  return timeRanges.map(range => ({
    timeRange: range.range,
    count: Math.floor(Math.random() * responses.length * 0.3) // Simulated data
  }));
};

export const generateWalletAnalytics = (responses: FormResponse[]) => {
  const walletTypes = responses.reduce((acc, response) => {
    // Simple heuristic to determine wallet type based on address patterns
    const address = response.wallet_address;
    let type = 'Unknown';
    
    if (address?.length >= 32 && address?.length <= 44) {
      // Rough heuristics for common Solana wallet types
      type = 'Phantom';
    }
    
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(walletTypes).map(([type, count]) => ({
    name: type,
    count
  }));
};

export const calculateOverviewStats = (responses: FormResponse[], analytics: any) => {
  const uniqueWallets = new Set(responses.map(r => r.wallet_address)).size;
  const totalViews = responses.length * 1.5; // Estimated views
  const responseRate = totalViews > 0 ? Math.round((responses.length / totalViews) * 100) : 0;
  
  return {
    totalResponses: responses.length,
    uniqueWallets,
    responseRate,
    avgCompletionTime: '8.5 min' // Simulated
  };
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};