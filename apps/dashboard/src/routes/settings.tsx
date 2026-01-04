import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
