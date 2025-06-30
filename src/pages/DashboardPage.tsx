import React from 'react';
import ItensDownloader from '../components/ItensDownloader';

const DashboardPage = () => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Downloader de Itens</h2>
        <p className="text-gray-600 mb-6">
          Selecione um grupo e, opcionalmente, uma classe para iniciar o download dos itens de material do Compras.gov.br. 
          Os dados serão salvos localmente para permitir buscas e análises mais rápidas.
        </p>
        <ItensDownloader />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Funcionalidades Futuras</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Exportação dos dados para CSV/Excel</li>
          <li>Filtros avançados e busca por descrição parcial</li>
          <li>Logs detalhados de download e atualização</li>
          <li>Visualização e exportação de serviços</li>
          <li>Documentação detalhada de endpoints e exemplos de uso</li>
        </ul>
      </div>
    </>
  );
};

export default DashboardPage; 