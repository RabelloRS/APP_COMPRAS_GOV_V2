import { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';

interface StatsData {
  totalMateriais: number;
  totalGrupos: number;
  totalClasses: number;
  totalPDMs: number;
}

const StatCard = ({ title, value }: { title: string; value: number | string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:-translate-y-1">
        <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
        <p className="text-3xl font-bold text-propor-blue-500">{value}</p>
    </div>
);

const MaterialsAnalysisPage = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/materiais/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-propor-blue-500 mb-6">Análise de Materiais</h1>
        
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-propor-blue-400 mb-4">Estatísticas Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total de Materiais" value={loading ? '...' : formatNumber(stats?.totalMateriais ?? 0)} />
                <StatCard title="Grupos" value={loading ? '...' : formatNumber(stats?.totalGrupos ?? 0)} />
                <StatCard title="Classes" value={loading ? '...' : formatNumber(stats?.totalClasses ?? 0)} />
                <StatCard title="PDMs" value={loading ? '...' : formatNumber(stats?.totalPDMs ?? 0)} />
            </div>
        </div>

        {/* Seção de Filtros e Tabela (a ser implementada) */}
        <div>
            <h2 className="text-2xl font-semibold text-propor-blue-400 mb-4">Explorar Materiais</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Em breve: filtros e tabela paginada de materiais.</p>
            </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default MaterialsAnalysisPage; 