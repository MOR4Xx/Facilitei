// src/components/layout/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-transparent text-dark-text py-6 mt-auto border-t border-dark-surface/50">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {currentYear} Facilitei. Todos os direitos reservados.</p>
        <p className="text-sm text-dark-subtle mt-1">Conectando profissionais e clientes com facilidade.</p>
      </div>
    </footer>
  );
}