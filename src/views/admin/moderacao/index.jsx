import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaTrash, FaExclamationTriangle, FaBan, FaUserSlash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Card from 'components/card';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;

const API_BASE_URL = Config.getApiUrl();

const ModeracaoConteudo = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0
    });

    const fetchReportes = async (pageIndex = 0) => {
        try {
            setLoading(true);
            const response = await fetchWithToken(`api/reportes/?page=${pageIndex + 1}&page_size=${pagination.pageSize}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            console.log(data);
            setReportes(data.results);
            setPagination(prev => ({
                ...prev,
                pageIndex,
                totalPages: Math.ceil(data.count / pagination.pageSize),
                totalCount: data.count
            }));
        } catch (error) {
            console.error('Erro ao buscar reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, []);

    const handleUsuarioClick = (usuarioId) => {
        navigate(`/admin/perfiluser/${usuarioId}`);
    };
    const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`);
    };
    const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`);
    };

    const reportesEmpresas = reportes.filter(rep => rep.tipo === 'empresa');
    const reportesUsuarios = reportes.filter(rep => rep.tipo === 'usuario');
    const reportesProdutos = reportes.filter(rep => rep.tipo === 'produto');

    const removerReporte = (id) => {
        setReportes(reportes.filter(rep => rep.id !== id));
        alert(`Reporte com ID ${id} removido.`);
    };

    const handlePreviousPage = () => {
        if (pagination.pageIndex > 0) {
            fetchReportes(pagination.pageIndex - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.pageIndex + 1 < pagination.totalPages) {
            fetchReportes(pagination.pageIndex + 1);
        }
    };

    const renderTabela = (titulo, dados) => (
        <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    <FaExclamationTriangle className="inline-block mr-2" />
                    {titulo} ({dados.length})
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
                                    <td
                                        className="py-2 px-4 text-sm cursor-pointer text-brand-500 font-bold hover:underline"
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

                                    <td
                                        className="py-2 px-4 text-sm cursor-pointer text-brand-500 font-bold hover:underline"
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
                <LoaderContainer>
                    <SyncLoader color="#3B82F6" size={15} />
                </LoaderContainer>
            ) : (
                <>
                    {renderTabela('Reportes de Empresas', reportesEmpresas)}
                    {renderTabela('Reportes de Usuários', reportesUsuarios)}
                    {renderTabela('Reportes de Produtos', reportesProdutos)}

                    <div className="flex items-center justify-between mt-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                onClick={handlePreviousPage}
                                disabled={pagination.pageIndex === 0}
                            >
                                <FaArrowLeft className="mr-2" /> Anterior
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                onClick={handleNextPage}
                                disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                            >
                                Próxima <FaArrowRight className="ml-2" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-white">
                            Página {pagination.pageIndex + 1} de {pagination.totalPages} - Total: {pagination.totalCount} reportes
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default ModeracaoConteudo;