/**
 * EntityInfoSection Component
 * Displays entity information in a card with two-column grid layout
 */

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';

interface EntityField {
  label: string;
  value: string | number | undefined | null;
  format?: 'date' | 'currency' | 'text';
}

interface EntityInfoSectionProps {
  title: string;
  status?: 'active' | 'inactive' | 'pending';
  fields: EntityField[];
}

function formatValue(value: string | number | undefined | null, format?: 'date' | 'currency' | 'text'): string {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'date':
      return new Date(value).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    case 'currency':
      return `$${Number(value).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'text':
    default:
      return String(value);
  }
}

export function EntityInfoSection({ title, status, fields }: EntityInfoSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {status && (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-muted-foreground">{field.label}</p>
              <p className="text-sm font-medium">
                {formatValue(field.value, field.format)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
