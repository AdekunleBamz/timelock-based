import type { ReactNode, CSSProperties } from 'react';
import './Stack.css';

type Direction = 'horizontal' | 'vertical';
type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackProps {
  children: ReactNode;
  direction?: Direction;
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  style,
  as: Component = 'div',
}: StackProps) {
  const classes = [
    'stack',
    `stack--${direction}`,
    `stack-gap--${gap}`,
    `stack-align--${align}`,
    `stack-justify--${justify}`,
    wrap ? 'stack--wrap' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
}

interface HStackProps extends Omit<StackProps, 'direction'> {}

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="horizontal" />;
}

interface VStackProps extends Omit<StackProps, 'direction'> {}

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="vertical" />;
}

interface SpacerProps {
  size?: Spacing | 'auto';
}

export function Spacer({ size = 'auto' }: SpacerProps) {
  if (size === 'auto') {
    return <div className="spacer-auto" />;
  }
  
  return <div className={`spacer spacer--${size}`} />;
}
