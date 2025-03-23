import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // Importação necessária

import { FaTrash, FaExclamationTriangle,FaBan ,FaUserSlash} from 'react-icons/fa';
import Card from 'components/card';

const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app";

const ModeracaoConteudo = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook de navegação

    const handleUsuarioClick = (usuarioId) => {
        navigate(`/admin/perfiluser/${usuarioId}`); // Redireciona para o perfil da empresa
      };
      const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`); // Redireciona para o perfil da empresa
      };
      const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`); // Redireciona para o perfil da empresa
      };

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/reportes/`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                }); 
                const data = await response.json();
                console.log(data);
                setReportes(data.results);
            } catch (error) {
                console.error('Erro ao buscar reportes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);

    const reportesEmpresas = reportes.filter(rep => rep.tipo === 'empresa');
    const reportesUsuarios = reportes.filter(rep => rep.tipo === 'usuario');
    const reportesProdutos = reportes.filter(rep => rep.tipo === 'produto');

    const removerReporte = (id) => {
        setReportes(reportes.filter(rep => rep.id !== id));
        alert(`Reporte com ID ${id} removido.`);
    };

    const renderTabela = (titulo, dados) => (
        <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    <FaExclamationTriangle className="inline-block mr-2" />
                    {titulo}
                </div>
            </header>

            {dados.length === 0 ? (
                <p className="text-gray-600 p-4">Nenhum reporte encontrado.</p>
            ) : (
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-left py-2 px-4">Denunciante</th>
                                <th className="text-left py-2 px-4">Denunciado</th>
                                <th className="text-left py-2 px-4">Motivo</th>
                                <th className="text-left py-2 px-4">Descrição</th>
                                <th className="text-left py-2 px-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map(rep => (
                                <tr key={rep.id} className="border-b border-gray-200">
                                    {/* Célula do Denunciante */}
                                    <td
                                        className="py-2 px-4 cursor-pointer hover:text-brand-500"
                                        onClick={() => {
                                            if (rep.usuario_denunciante) {
                                                handleUsuarioClick(rep.usuario_denunciante.id);
                                            } else if (rep.empresa_denunciante) {
                                                handleEmpresaClick(rep.empresa_denunciante.id);
                                            }
                                        }}
                                    >
                                        {rep.usuario_denunciante?.nome || rep.empresa_denunciante?.nome || 'N/A'}
                                    </td>

                                    {/* Célula do Denunciado */}
                                    <td
                                        className="py-2 px-4 cursor-pointer hover:text-brand-500"
                                        onClick={() => {
                                            if (rep.denunciado_usuario) {
                                                handleUsuarioClick(rep.denunciado_usuario.id);
                                            } else if (rep.denunciado_empresa) {
                                                handleEmpresaClick(rep.denunciado_empresa.id);
                                            } else if (rep.produto) {
                                                handleProdutoClick(rep.produto.id);
                                            }
                                        }}
                                    >
                                        {rep.denunciado_usuario?.nome || rep.denunciado_empresa?.nome || rep.produto?.nome || 'N/A'}
                                    </td>

                                    {/* Outras células */}
                                    <td className="py-2 px-4">{rep.motivo}</td>
                                    <td className="py-2 px-4">{rep.descricao}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => removerReporte(rep.id)}
                                            className="text-red-500 hover:text-red-700 ml-4"
                                            title="Remover Reporte"
                                        >
                                            <FaBan className="text-red text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    return (
        <div className="p-6">
            {loading ? (
                <p>Carregando reportes...</p>
            ) : (
                <>
                    {renderTabela('Reportes de Empresas', reportesEmpresas)}
                    {renderTabela('Reportes de Usuários', reportesUsuarios)}
                    {renderTabela('Reportes de Produtos', reportesProdutos)}
                </>
            )}
        </div>
    );
};

export default ModeracaoConteudo;
