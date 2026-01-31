/**
 * RelationshipsList Component
 * Displays list of related entities with navigation
 */

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Users } from 'lucide-react';

interface RelatedEntity {
  id: string;
  name: string;
  status?: 'active' | 'inactive';
  subtitle?: string;
}

interface RelationshipsListProps {
  title: string;
  entities: RelatedEntity[] | undefined;
  type: 'participant' | 'provider' | 'coordinator';
  emptyMessage?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getLinkPath(type: 'participant' | 'provider' | 'coordinator', id: string): string {
  switch (type) {
    case 'participant':
      return `/admin/participants/${id}`;
    case 'provider':
      return `/admin/providers/${id}`;
    case 'coordinator':
      return `/admin/coordinators/${id}`;
  }
}

export function RelationshipsList({ title, entities, type, emptyMessage }: RelationshipsListProps) {
  const isEmpty = !entities || entities.length === 0;
  const defaultEmptyMessage = `No ${type}s linked`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {emptyMessage || defaultEmptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entities.map((entity) => (
              <Link
                key={entity.id}
                to={getLinkPath(type, entity.id)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar>
                  <AvatarFallback>{getInitials(entity.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{entity.name}</p>
                  {entity.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {entity.subtitle}
                    </p>
                  )}
                </div>
                {entity.status && (
                  <Badge variant={entity.status === 'active' ? 'default' : 'secondary'} className="ml-auto">
                    {entity.status}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
