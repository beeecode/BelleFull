import { cn } from '../lib/utils/cn';

export function Button({
  children,
  className,
  variant = 'primary',
  as: Component = 'button',
  ...props
}) {
  return (
    <Component className={cn('btn', `btn-${variant}`, className)} {...props}>
      {children}
    </Component>
  );
}
