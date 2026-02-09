import '../globals.css';

interface FormInputProps {
  type: 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
}

export default function FormInput({ type, placeholder, value, onChange, icon }: FormInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <span className="text-xl">{icon}</span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[#181111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
    </div>
  );
}