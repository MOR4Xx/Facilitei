import { ReactNode } from 'react';

type TypographyProps = {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
};

// Mapeamento de estilos base para cada tag
const tagStyles = {
  h1: 'text-4xl md:text-5xl font-extrabold text-dark-text tracking-tight',
  h2: 'text-3xl font-bold text-dark-text',
  h3: 'text-2xl font-semibold text-dark-text',
  p: 'text-base text-dark-subtle',
  span: 'text-base',
};

export function Typography({ children, as: Tag = 'p', className = '' }: TypographyProps) {
  return <Tag className={`${tagStyles[Tag]} ${className}`}>{children}</Tag>;
}