import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents')({
  component: DocumentsComponent,
});

function DocumentsComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Documents</h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
