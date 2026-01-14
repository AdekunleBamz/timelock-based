import type { ReactNode, HTMLAttributes } from 'react';
import './Text.css';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';
type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'inherit';

interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  children: ReactNode;
  as?: 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  truncate?: boolean;
  mono?: boolean;
}

export function Text({
  children,
  as: Component = 'span',
  size,
  weight,
  align,
  color,
  truncate = false,
  mono = false,
  className = '',
  ...props
}: TextProps) {
  const classes = [
    'text',
    size && `text-size--${size}`,
    weight && `text-weight--${weight}`,
    align && `text-align--${align}`,
    color && `text-color--${color}`,
    truncate && 'text--truncate',
    mono && 'text--mono',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

interface HeadingProps extends Omit<TextProps, 'as'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingSizes: Record<number, TextSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'base',
  6: 'sm',
};

export function Heading({
  level = 2,
  size,
  weight = 'semibold',
  color = 'primary',
  ...props
}: HeadingProps) {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <Text
      as={Component}
      size={size ?? headingSizes[level]}
      weight={weight}
      color={color}
      {...props}
    />
  );
}
