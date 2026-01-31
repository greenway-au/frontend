/**
 * Funding Donut Chart Component
 * Displays support category breakdown as a donut chart
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { PieChart } from 'lucide-react';
import type { SupportBreakdown } from '../types/dashboard.types';

interface FundingDonutChartProps {
  data: SupportBreakdown[];
  isLoading?: boolean;
}

const categoryColors = {
  core_supports: '#3b82f6', // blue
  capital_supports: '#10b981', // green
  capacity_building: '#f59e0b', // amber
};

const categoryLabels = {
  core_supports: 'Core Supports',
  capital_supports: 'Capital Supports',
  capacity_building: 'Capacity Building',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FundingDonutChart({ data, isLoading }: FundingDonutChartProps) {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);

  // Calculate percentages and create segments
  let currentAngle = 0;
  const segments = data.map((item) => {
    const percentage = totalBudget > 0 ? (item.budget / totalBudget) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: categoryColors[item.category],
      label: categoryLabels[item.category],
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="size-5" />
          Support Category Breakdown
        </CardTitle>
        <CardDescription>Budget allocation by NDIS support type</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* SVG Donut */}
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {segments.map((segment, index) => {
                    const radius = 35;
                    const circumference = 2 * Math.PI * radius;
                    const dashArray = (segment.percentage / 100) * circumference;
                    const dashOffset = -(currentAngle / 360) * circumference;

                    // Update for next segment
                    const segmentOffset = ((segment.startAngle / 360) * circumference);

                    return (
                      <circle
                        key={segment.category}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="20"
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-segmentOffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">of {formatCurrency(totalBudget)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% spent
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {segments.map((segment) => {
                const remaining = segment.budget - segment.spent;
                const percentSpent = segment.budget > 0 ? (segment.spent / segment.budget) * 100 : 0;

                return (
                  <div key={segment.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium">{segment.label}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatCurrency(segment.spent)} / {formatCurrency(segment.budget)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(percentSpent, 100)}%`,
                          backgroundColor: segment.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(percentSpent)}% utilized</span>
                      <span>{formatCurrency(remaining)} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
