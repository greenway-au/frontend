import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/participants')({
  component: ParticipantsComponent,
});

function ParticipantsComponent() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Participants</h2>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
