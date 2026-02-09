import '../globals.css';

interface Action {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

const actions: Action[] = [
  {
    icon: '⬇',
    label: 'Descargar',
    onClick: () => console.log('Download memory')
  },
  {
    icon: '↗',
    label: 'Compartir', 
    onClick: () => console.log('Share memory')
  },
  {
    icon: '♥',
    label: 'Favorito',
    onClick: () => console.log('Toggle favorite'),
    isActive: true
  }
];

export default function ActionGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-10">
      {actions.map((action, index) => (
        <button 
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
            <span className={`text-2xl ${action.isActive ? 'text-primary' : ''}`}>
              {action.icon}
            </span>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}