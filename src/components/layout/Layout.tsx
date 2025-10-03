import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}

// O Flex e o Grid podem ser usados diretamente com Tailwind,
// mas aqui estão como componentes para maior clareza.

type FlexProps = {
  children: ReactNode;
  className?: string;
};

export function Flex({ children, className = '' }: FlexProps) {
  return <div className={`flex ${className}`}>{children}</div>;
}

type GridProps = {
  children: ReactNode;
  className?: string;
};

export function Grid({ children, className = '' }: GridProps) {
  return <div className={`grid ${className}`}>{children}</div>;
}