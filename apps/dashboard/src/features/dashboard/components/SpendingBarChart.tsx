/**
 * Spending Bar Chart Component
 * Displays spending by day of week as a bar chart
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { BarChart3 } from 'lucide-react';
import type { SpendingByDay } from '../types/dashboard.types';

interface SpendingBarChartProps {
  data: SpendingByDay[];
  isLoading?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SpendingBarChart({ data, isLoading }: SpendingBarChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-5" />
          Spending by Day of Week
        </CardTitle>
        <CardDescription>Distribution of spending across weekdays</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="space-y-3 pt-4">
              {data.map((item) => {
                const percentage = (item.amount / maxAmount) * 100;

                return (
                  <div key={item.day} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-24">{item.day}</span>
                      <span className="text-muted-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="relative w-full bg-muted rounded-full h-8">
                      <div
                        className="absolute left-0 top-0 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs font-medium text-primary-foreground">
                            {Math.round(percentage)}%
                          </span>
                        )}
                      </div>
                      {percentage <= 20 && percentage > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                          {Math.round(percentage)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Weekly Spending</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
