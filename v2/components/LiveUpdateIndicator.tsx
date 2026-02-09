import '../globals.css';

interface LiveUpdateIndicatorProps {
  lastUpdate?: string;
}

export default function LiveUpdateIndicator({ 
  lastUpdate = "4:58:34 a. m." 
}: LiveUpdateIndicatorProps) {
  return (
    <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
      <span className="text-xs text-gray-400">⏰</span>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
        Última actualización: {lastUpdate}
      </p>
    </div>
  );
}