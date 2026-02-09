import '../globals.css';

interface ActionCard {
  icon: string;
  title: string;
  bgColor: string;
  iconColor: string;
  hoverColor: string;
  onClick?: () => void;
}

const actions: ActionCard[] = [
  {
    icon: '+',
    title: 'Crear Nuevo Recuerdo',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    iconColor: 'text-primary',
    hoverColor: 'group-hover:text-primary',
    onClick: () => console.log('Navigate to create memory')
  },
  {
    icon: '$',
    title: 'Ver Mis NFTs',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-usa-blue dark:text-blue-400',
    hoverColor: 'group-hover:text-usa-blue',
    onClick: () => console.log('Navigate to NFTs')
  },
  {
    icon: '◉',
    title: 'Explorar Eventos',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    iconColor: 'text-mexico-green dark:text-green-400',
    hoverColor: 'group-hover:text-mexico-green',
    onClick: () => console.log('Navigate to events')
  }
];

export default function ActionCards() {
  return (
    <div className="py-8 space-y-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center ${action.iconColor}`}>
              <span className="text-3xl font-bold">{action.icon}</span>
            </div>
            <span className="font-bold text-lg dark:text-white">{action.title}</span>
          </div>
          <span className="text-gray-300 text-xl transition-colors">
            ›
          </span>
        </button>
      ))}
    </div>
  );
}