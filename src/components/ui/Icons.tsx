import { type ComponentProps } from 'react';

// --- ÍCONES DE NAVEGAÇÃO (NOVOS) ---

// Ícone de Menu (Hambúrguer)
export function MenuIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

// Ícone para "Recusar" ou "Fechar"
export function XMarkIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

// --- ÍCONES EXISTENTES ---

// Ícone para "Novas Solicitações"
export function BellIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

// Ícone para "Serviços Ativos"
export function BriefcaseIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-4.07m16.5 0M20.25 14.15V9a2.25 2.25 0 0 0-2.25-2.25h-12A2.25 2.25 0 0 0 3.75 9v5.15m16.5 0v-2.175a2.25 2.25 0 0 0-2.25-2.25h-12a2.25 2.25 0 0 0-2.25 2.25V14.15"
      />
    </svg>
  );
}

// Ícone para "Chat"
export function ChatBubbleLeftRightIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.7-2.038a2.25 2.25 0 0 0-1.581.082l-4.144 2.541a2.25 2.25 0 0 1-2.193-.283L5.61 14.61a2.25 2.25 0 0 1-1.18-1.969V6.63c0-.969.616-1.813 1.5-2.097m14.25 3.985L18 10.5m-3 0h.008v.008H15v-.008ZM12 10.5h.008v.008H12v-.008ZM9 10.5h.008v.008H9v-.008ZM18 13.5h.008v.008H18v-.008Zm-3 0h.008v.008H15v-.008Zm-3 0h.008v.008H12v-.008Zm-3 0h.008v.008H9v-.008Z"
      />
    </svg>
  );
}

// Ícone para "Aprovar"
export function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

// Ícone para "Serviços"
export function WrenchScrewdriverIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l.75-.75M11.42 15.17l-1.5 1.5M10.5 5.25 3 12.75l-1.5-1.5L8.25 3l7.5 7.5-1.5 1.5M10.5 5.25l1.5-1.5M10.5 5.25v3.75m0 0h3.75l1.5-1.5M10.5 5.25v3.75m0 0l-1.5 1.5m1.5-1.5H5.625m1.5-1.5H5.625m7.5 0v3.75m0 0h3.75M10.5 12.75v3.75m0 0h3.75m-3.75 0h-3.75m0 0v-3.75m0 0h3.75M3 12.75h3.75m0 0v3.75m0 0h3.75m0 0H3m3.75 0v-3.75m0 0h3.75"
      />
    </svg>
  );
}

// Ícone para "Configurações"
export function CogIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0H3.75m16.5 0h-1.5m0 0H6.75m10.5 0h-1.5m1.5 0H8.25m9.75 0h-1.5m1.5 0H12m0 0v-1.5m0 1.5v-1.5m0 0v-1.5m0 1.5V9m0 3V9m0 3v1.5m0-1.5V9m0 6.75v-1.5m0 1.5v-1.5m0 0v-1.5m0 1.5V15m0 3v-1.5m0 0v-1.5m0 0V15m0 0v-1.5m0 1.5v-1.5"
      />
    </svg>
  );
}

// Ícone para "Calendário" (Agenda)
export function CalendarDaysIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008Zm-2.25-2.25h.008v.008H7.5v-.008Zm0 2.25h.008v.008H7.5v-.008Zm-2.25-2.25h.008v.008H5.25v-.008Zm0 2.25h.008v.008H5.25v-.008Zm6.75-2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-2.25h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5v-.008Z"
      />
    </svg>
  );
}