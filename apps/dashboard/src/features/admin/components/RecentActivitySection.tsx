/**
 * RecentActivitySection Component
 * Wrapper around InvoiceTable for displaying recent invoices
 */

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { InvoiceTable } from '@/features/invoices';
import { FileText } from 'lucide-react';
import type { Invoice } from '@/features/invoices/types/invoice.types';

interface RecentActivitySectionProps {
  invoices: Invoice[] | undefined;
  isLoading?: boolean;
  showViewAll?: boolean;
}

export function RecentActivitySection({ invoices, isLoading, showViewAll = true }: RecentActivitySectionProps) {
  const isEmpty = !invoices || invoices.length === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        {showViewAll && !isEmpty && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/invoices">View All Invoices</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No recent invoice activity
            </p>
          </div>
        ) : (
          <InvoiceTable invoices={invoices} />
        )}
      </CardContent>
    </Card>
  );
}
