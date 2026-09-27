import React from 'react';

interface VianLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white';
  showText?: boolean;
}

export const VianLogo: React.FC<VianLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 28, textVian: 'text-lg', textCapital: 'text-[9px] tracking-[0.25em]' },
    md: { icon: 38, textVian: 'text-2xl', textCapital: 'text-[11px] tracking-[0.28em]' },
    lg: { icon: 48, textVian: 'text-3xl', textCapital: 'text-[13px] tracking-[0.3em]' },
    xl: { icon: 64, textVian: 'text-4xl', textCapital: 'text-[16px] tracking-[0.32em]' },
  };

  const currentSize = sizeMap[size];
  const primaryColor = variant === 'light' || variant === 'white' ? '#FFFFFF' : '#051B63';
  const textColor = variant === 'light' || variant === 'white' ? 'text-white' : 'text-[#051B63]';
  const capitalColor = variant === 'light' || variant === 'white' ? 'text-blue-200' : 'text-[#0A2540]';

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* SVG Monogram matching exact uploaded Vian Capital logo geometry */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Outer Circular Arc - Open at the top right */}
        <path
          d="M 68 22 A 40 40 0 1 0 88 56"
          stroke={primaryColor}
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        
        {/* Stylized 'V' Monogram */}
        {/* Left descending stroke intersecting circular sweep */}
        <path
          d="M 28 36 L 47 76"
          stroke={primaryColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right ascending stroke shooting past the circle */}
        <path
          d="M 47 76 L 82 14"
          stroke={primaryColor}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black ${currentSize.textVian} ${textColor} tracking-tight font-heading`}>
            VIAN
          </span>
          <span className={`font-medium ${currentSize.textCapital} ${capitalColor} font-sans uppercase font-semibold -mt-0.5`}>
            CAPITAL
          </span>
        </div>
      )}
    </div>
  );
};
