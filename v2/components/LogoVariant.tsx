'use client';

import '../globals.css';

interface LogoVariantProps {
  variant: number;
  isActive?: boolean;
}

export default function LogoVariant({ variant, isActive = false }: LogoVariantProps) {
  const getPixelPattern = () => {
    // Different patterns for each variant
    const patterns = {
      1: [
        ['', 'primary', 'primary', 'primary', ''],
        ['mexico-green', 'gray-800', 'white', 'gray-800', 'usa-blue'],
        ['mexico-green', 'gray-800', 'white', 'gray-800', 'usa-blue'],
        ['', 'primary', 'primary', 'primary', '']
      ],
      2: [
        ['', 'usa-blue', 'usa-blue', 'usa-blue', ''],
        ['primary', 'gray-800', 'white', 'gray-800', 'mexico-green'],
        ['primary', 'gray-800', 'white', 'gray-800', 'mexico-green'],
        ['', 'usa-blue', 'usa-blue', 'usa-blue', '']
      ],
      3: [
        ['', 'mexico-green', 'mexico-green', 'mexico-green', ''],
        ['usa-blue', 'gray-800', 'white', 'gray-800', 'primary'],
        ['usa-blue', 'gray-800', 'white', 'gray-800', 'primary'],
        ['', 'mexico-green', 'mexico-green', 'mexico-green', '']
      ],
      4: [
        ['', 'primary', 'primary', 'primary', ''],
        ['mexico-green', 'gray-800', 'white', 'gray-800', 'usa-blue'],
        ['mexico-green', 'gray-800', 'white', 'gray-800', 'usa-blue'],
        ['', 'primary', 'primary', 'primary', '']
      ],
      5: [
        ['primary', 'primary', 'primary', 'primary', 'primary'],
        ['mexico-green', 'white', 'gray-800', 'white', 'usa-blue'],
        ['mexico-green', 'white', 'gray-800', 'white', 'usa-blue'],
        ['primary', 'primary', 'primary', 'primary', 'primary']
      ],
      6: [
        ['mexico-green', 'usa-blue', 'primary', 'usa-blue', 'mexico-green'],
        ['usa-blue', 'gray-800', 'white', 'gray-800', 'primary'],
        ['primary', 'gray-800', 'white', 'gray-800', 'mexico-green'],
        ['usa-blue', 'mexico-green', 'primary', 'mexico-green', 'usa-blue']
      ]
    };

    const pattern = patterns[variant as keyof typeof patterns] || patterns[1];
    
    return (
      <div className="grid grid-cols-5 gap-1 w-32 h-32">
        {pattern.flat().map((color, index) => {
          const getColorClass = (colorName: string) => {
            switch(colorName) {
              case 'primary': return 'bg-primary';
              case 'mexico-green': return 'bg-mexico-green';
              case 'usa-blue': return 'bg-usa-blue';
              case 'gray-800': return 'bg-gray-800';
              case 'white': return 'bg-white border border-gray-100';
              default: return '';
            }
          };
          
          return (
            <div 
              key={index}
              className={`w-full h-full ${getColorClass(color)}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
      isActive 
        ? 'border-primary bg-primary/5' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      <div className="mb-4">
        {getPixelPattern()}
      </div>
      <h2 className="text-2xl font-bold dark:text-white mb-2">Memories26</h2>
      <div className="h-1 w-12 bg-primary rounded-full mb-3"></div>
      <p className="text-xs text-gray-500 text-center">
        Variant {variant} of 6
      </p>
    </div>
  );
}