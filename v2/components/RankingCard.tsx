import '../globals.css';

interface RankingUser {
  id: string;
  username: string;
  level: string;
  levelName: string;
  points: number;
  position: number;
  isCurrentUser?: boolean;
  avatar?: string;
  badge?: string;
}

interface RankingCardProps {
  user: RankingUser;
}

const getMedalEmoji = (position: number) => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return position.toString();
  }
};

const getCardStyle = (user: RankingUser) => {
  if (user.isCurrentUser && user.position === 1) {
    return 'bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 ring-1 ring-amber-400/20';
  }
  return 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow';
};

const getAvatarStyle = (user: RankingUser) => {
  if (user.isCurrentUser && user.position === 1) {
    return 'w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold border-2 border-white shadow-sm';
  }
  return 'w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold';
};

const getPointsStyle = (user: RankingUser) => {
  if (user.isCurrentUser && user.position === 1) {
    return 'text-lg font-black text-amber-700 dark:text-amber-400';
  }
  return 'text-lg font-black text-text-dark dark:text-white';
};

export default function RankingCard({ user }: RankingCardProps) {
  const medal = getMedalEmoji(user.position);
  const cardStyle = getCardStyle(user);
  const avatarStyle = getAvatarStyle(user);
  const pointsStyle = getPointsStyle(user);

  return (
    <div className={`rounded-2xl p-4 flex items-center justify-between ${cardStyle}`}>
      <div className="flex items-center gap-4">
        <span className="text-2xl w-8 text-center">
          {typeof medal === 'string' && medal.length > 1 ? medal : (
            <span className="text-sm font-black text-gray-400">{medal}</span>
          )}
        </span>
        
        <div className="relative">
          <div className={avatarStyle}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.isCurrentUser && user.position === 1 ? 
                user.username.substring(0, 2).toUpperCase() :
                <span className="text-xl">👤</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
            <span className="text-xs text-mexico-green">⚽</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-text-dark dark:text-white">
              {user.username}{user.isCurrentUser ? ' (TÚ)' : ''}
            </h3>
            {user.badge && (
              <span className="bg-amber-400 text-[8px] font-black text-white px-1 rounded uppercase tracking-tighter">
                {user.badge}
              </span>
            )}
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-wide ${
            user.isCurrentUser && user.position === 1 ? 
              'text-amber-700 dark:text-amber-400' : 
              'text-gray-400'
          }`}>
            {user.level} {user.levelName}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <span className={`block ${pointsStyle}`}>{user.points}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          puntos
        </span>
      </div>
    </div>
  );
}