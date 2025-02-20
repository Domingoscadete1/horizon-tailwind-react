import React from 'react';
import { FaChartLine, FaUsers, FaShoppingCart, FaBox, FaBuilding } from 'react-icons/fa';
import Card from 'components/card'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Biblioteca para gráficos

const RelatoriosMetricas = () => {
    // Dados de exemplo para gráficos e métricas
    const dadosVendas = [
        { name: 'Jan', vendas: 4000 },
        { name: 'Fev', vendas: 3000 },
        { name: 'Mar', vendas: 2000 },
        { name: 'Abr', vendas: 2780 },
        { name: 'Mai', vendas: 1890 },
        { name: 'Jun', vendas: 2390 },
    ];

    const dadosCadastros = [
        { name: 'Jan', cadastros: 100 },
        { name: 'Fev', cadastros: 150 },
        { name: 'Mar', cadastros: 200 },
        { name: 'Abr', cadastros: 180 },
        { name: 'Mai', cadastros: 250 },
        { name: 'Jun', cadastros: 300 },
    ];

    const metricas = {
        usuariosAtivos: 1200,
        transacoesHoje: 150,
        produtosCadastrados: 500,
        produtosVendidos: 300,
        empresasLucrativas: 50,
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-6">
                Relatórios e Métricas
            </h1>

            {/* Seção de Métricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card extra={"p-4"}>
                    <div className="flex items-center">
                        <FaUsers className="text-2xl text-blue-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-white">Usuários Ativos</p>
                            <p className="text-xl font-bold text-navy-700 dark:text-white">{metricas.usuariosAtivos}</p>
                        </div>
                    </div>
                </Card>

                <Card extra={"p-4"}>
                    <div className="flex items-center">
                        <FaShoppingCart className="text-2xl text-green-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-white">Transações Hoje</p>
                            <p className="text-xl font-bold text-navy-700 dark:text-white">{metricas.transacoesHoje}</p>
                        </div>
                    </div>
                </Card>

                <Card extra={"p-4"}>
                    <div className="flex items-center">
                        <FaBox className="text-2xl text-purple-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-white">Produtos Cadastrados</p>
                            <p className="text-xl font-bold text-navy-700 dark:text-white">{metricas.produtosCadastrados}</p>
                        </div>
                    </div>
                </Card>

                <Card extra={"p-4"}>
                    <div className="flex items-center">
                        <FaBuilding className="text-2xl text-yellow-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-white">Empresas Lucrativas</p>
                            <p className="text-xl font-bold text-navy-700 dark:text-white">{metricas.empresasLucrativas}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Seção de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card extra={"p-4"}>
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
                        <FaChartLine className="inline-block mr-2" />
                        Vendas Mensais
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosVendas}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="vendas" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card extra={"p-4"}>
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
                        <FaUsers className="inline-block mr-2" />
                        Cadastros Mensais
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosCadastros}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cadastros" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Seção de Tabela de Produtos Populares */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaBox className="inline-block mr-2" />
                        Produtos Mais Vendidos
                    </div>
                </header>

                <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                    <p className="text-xs text-gray-200">Produto</p>
                                </th>
                                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                    <p className="text-xs text-gray-200">Vendas</p>
                                </th>
                                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                    <p className="text-xs text-gray-200">Receita</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">Produto A</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">150</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">R$ 15.000,00</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">Produto B</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">120</p>
                                </td>
                                <td className="min-w-[150px] border-white/0 py-3 pr-4">
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">R$ 12.000,00</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default RelatoriosMetricas;