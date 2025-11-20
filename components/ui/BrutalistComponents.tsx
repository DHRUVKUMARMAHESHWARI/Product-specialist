import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "font-bold py-3 px-6 transition-all active:translate-x-1 active:translate-y-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm tracking-wide uppercase";
  
  const variants = {
    primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
    secondary: "bg-[#a3e635] text-black hover:bg-[#84cc16]",
    outline: "bg-white text-black hover:bg-gray-50",
    danger: "bg-[#ec4899] text-white hover:bg-[#db2777]"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, ...props }) => {
  return (
    <div className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`} {...props}>
      {title && <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter border-b-2 border-black pb-2">{title}</h3>}
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({ value, max, color = 'bg-[#2563eb]' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-4 border-2 border-black bg-gray-100 relative">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-yellow-400' }) => {
  return (
    <span className={`inline-block ${color} border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
      {children}
    </span>
  );
};