import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reports')({
  component: ReportsComponent,
});

function ReportsComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Reports</h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
