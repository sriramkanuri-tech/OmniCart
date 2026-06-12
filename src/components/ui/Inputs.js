import React, { useId, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';
export const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}, ref) => {
  return <button ref={ref} className={cn("inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none", {
    'bg-primary text-on-primary hover:bg-primary-container': variant === 'primary',
    'bg-background border border-primary text-primary hover:bg-primary/5': variant === 'secondary',
    'border border-outline hover:bg-on-surface/5 text-on-surface': variant === 'outline',
    'hover:text-primary text-on-surface-variant transition-colors': variant === 'ghost'
  }, {
    'px-4 py-2 text-xs': size === 'sm',
    'px-8 py-4 text-sm': size === 'md',
    'px-12 py-5 text-base': size === 'lg',
    'p-3': size === 'icon'
  }, className)} {...props} />;
});
Button.displayName = 'Button';
export const Input = forwardRef(({
  className,
  label,
  error,
  icon,
  ...props
}, ref) => {
  const id = useId();
  return <div className="w-full space-y-2">
        {label && <label htmlFor={id} className="text-sm font-medium text-on-surface-variant ml-1">
            {label}
          </label>}
        <div className="relative group">
          {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              {icon}
            </div>}
          <input id={id} ref={ref} className={cn("w-full bg-surface border border-outline rounded-xl py-4 px-5 outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10", icon && "pl-12", error && "border-error focus:border-error focus:ring-error/10", className)} {...props} />
        </div>
        {error && <p className="text-xs text-error font-medium ml-1">{error}</p>}
      </div>;
});
Input.displayName = 'Input';