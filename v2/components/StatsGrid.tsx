interface StatsGridProps {
  usersCount: number;
  memoriesCount: number;
}

export default function StatsGrid({ usersCount, memoriesCount }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 mb-8">
      <div className="bg-background-light p-4 rounded-2xl text-center ios-shadow">
        <span className="block text-2xl font-bold text-primary">{usersCount}</span>
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          usuarios registrados
        </span>
      </div>
      <div className="bg-background-light p-4 rounded-2xl text-center ios-shadow">
        <span className="block text-2xl font-bold text-usa-blue">{memoriesCount}</span>
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          recuerdos creados
        </span>
      </div>
    </div>
  );
}