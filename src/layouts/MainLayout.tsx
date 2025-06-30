import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-propor-gold text-white'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`
    }
  >
    {children}
  </NavLink>
);

const Header = () => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/static/logo/LOGO_PROPOR_PEQUENO.jpg" alt="Logo Propor" className="h-12 mr-4" />
        <div>
          <h1 className="text-xl font-bold text-gray-800">APP Compras.gov</h1>
          <p className="text-sm text-gray-600">Propor Engenharia Ltda</p>
        </div>
      </div>
      <nav className="flex space-x-4">
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/pesquisa">Pesquisa de Preços</NavItem>
      </nav>
      <div className="text-right text-sm text-gray-500">
        <p>CNPJ: 41.556.670/0001-76</p>
        <p>Marca: Propor (registrada)</p>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-propor-blue text-white mt-auto">
    <div className="container mx-auto px-6 py-4 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Propor Engenharia Ltda &nbsp;|&nbsp; Marca registrada Propor
      </p>
      <p className="text-xs mt-1 text-gray-400">
        Responsável técnico: Eng. Rodrigo Emanuel Rabello - CREA-RS 167.175-D
      </p>
    </div>
  </footer>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 