// src/components/layout/Footer.tsx
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background-dark text-text-light py-6 mt-auto border-t border-gray-700">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {currentYear} Facilitei. Todos os direitos reservados.</p>
        <p className="text-sm text-gray-400 mt-1">Conectando profissionais e clientes com facilidade.</p>
      </div>
    </footer>
  );
}