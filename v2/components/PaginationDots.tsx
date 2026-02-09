import '../globals.css';

interface PaginationDotsProps {
  total: number;
  current: number;
}

export default function PaginationDots({ total, current }: PaginationDotsProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            index === current
              ? 'w-10 bg-primary'
              : 'w-2 bg-gray-200 dark:bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
}