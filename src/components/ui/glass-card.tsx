import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  borderGold?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverGlow = true,
  borderGold = false,
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 ${
        hoverGlow ? 'glass-panel-hover' : ''
      } ${
        borderGold ? 'border-brand-bronze/20 hover:border-brand-bronze/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
