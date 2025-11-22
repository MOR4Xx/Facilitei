import { type ComponentProps } from 'react';

// Base style para garantir consistência
const iconBase = "stroke-[1.5] fill-none stroke-current";

// Construção (Capacete)
export function BuildingIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a9 9 0 0 0-9 9v9.75a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75v-9.75a9 9 0 0 0-9-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25V12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12H3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
    </svg>
  );
}

// Domésticos (Casa/Vassoura vibe)
export function HomeIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

// Técnicos (Chave de fenda e inglesa)
export function WrenchIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.937l-2.699 3.374c-.318.398-1.013.478-1.423.164l-2.63-2.015c-.41-.314-.297-1.065.13-1.339l2.98-1.914c.95-.611 1.322-1.832 1.26-2.929a4.5 4.5 0 1 1 10.216-.762Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 16.125 3 21l3-6" />
    </svg>
  );
}

// Jardinagem (Folha moderna)
export function LeafIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c1.866-2.039 4.97-4.63 8.33-4.63 3.358 0 6.463 2.591 8.33 4.63" />
    </svg>
  );
}

// Educação (Livro aberto)
export function BookIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

// Todos (Brilhos)
export function SparklesIcon(props: ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  );
}