import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/overview')({
  component: OverviewComponent,
});

function OverviewComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Overview</h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
