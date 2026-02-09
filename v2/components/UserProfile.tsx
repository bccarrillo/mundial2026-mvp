import VIPBadge from './VIPBadge';
import '../globals.css';

interface UserProfileProps {
  name?: string;
  email?: string;
  avatar?: string;
  isVip?: boolean;
}

export default function UserProfile({ 
  name = "¡Bienvenido!", 
  email = "usuario@memories26.com",
  avatar,
  isVip = false 
}: UserProfileProps) {
  return (
    <div className="py-8 border-b border-gray-50 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
            {avatar ? (
              <img 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                src={avatar}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-usa-blue flex items-center justify-center text-white text-2xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold dark:text-white">{name}</h2>
            {isVip && <VIPBadge size="sm" />}
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{email}</p>
        </div>
      </div>
    </div>
  );
}