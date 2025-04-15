import React, { useEffect, useState } from 'react';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle,
  FaUser,
  FaBuilding,
  FaBox,
  FaShoppingCart,
  FaComments,
  FaHeadset,
  FaBell,
  FaLock,
  FaLockOpen,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaEnvelope,
  FaCog
} from "react-icons/fa";
import { 
    FaPlus,
    FaEdit,
    FaTrash,
    FaTruck,
    FaBoxOpen,
    FaStar,
    FaBullhorn,
    FaSync,
    FaGavel
  } from 'react-icons/fa';
import { 
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
  MdArchive,
  MdBlock,
  MdOutlinePendingActions
} from "react-icons/md";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import Card from "components/card";
import { createColumnHelper } from "@tanstack/react-table";
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0);
`;

// Mapeamento de ícones para tipos de ação
const tipoIcones = {
  login: <FaLockOpen className="text-blue-500" />,
  logout: <FaLock className="text-blue-700" />,
  criacao: <FaPlus className="text-green-500" />,
  edicao: <FaEdit className="text-yellow-500" />,
  exclusao: <FaTrash className="text-red-500" />,
  negar: <FaTimesCircle className="text-red-600" />,
  aceitar: <FaCheckCircle className="text-green-600" />,
  compra: <FaShoppingCart className="text-purple-500" />,
  venda: <FaMoneyBillWave className="text-green-600" />,
  reserva: <FaClipboardCheck className="text-orange-500" />,
  entrega: <FaTruck className="text-blue-600" />,
  recebimento: <FaBoxOpen className="text-teal-500" />,
  devolucao: <FaExchangeAlt className="text-red-500" />,
  mensagem: <FaEnvelope className="text-blue-400" />,
  denuncia: <FaExclamationTriangle className="text-red-600" />,
  suporte: <FaHeadset className="text-purple-400" />,
  avaliacao: <FaStar className="text-yellow-400" />,
  anuncio: <FaBullhorn className="text-orange-400" />,
  pagamento: <FaMoneyBillWave className="text-green-500" />,
  status_change: <FaSync className="text-blue-500" />,
  system: <FaCog className="text-gray-500" />,
  verificacao: <FaCheckCircle className="text-green-500" />,
};

// Mapeamento de ícones para módulos
const moduloIcones = {
  usuario: <FaUser className="text-blue-500" />,
  empresa: <FaBuilding className="text-green-500" />,
  produto: <FaBox className="text-yellow-500" />,
  posto: <MdHome className="text-red-500" />,
  transacao: <FaMoneyBillWave className="text-green-600" />,
  lance: <FaGavel className="text-purple-500" />,
  chat: <FaComments className="text-blue-400" />,
  chat_suporte: <FaHeadset className="text-purple-400" />,
  suporte: <FaHeadset className="text-teal-500" />,
  mensagem_suporte: <FaEnvelope className="text-blue-300" />,
  anuncio: <FaBullhorn className="text-orange-400" />,
  sistema: <FaCog className="text-gray-500" />,
  autenticacao: <FaLock className="text-blue-600" />,
};

const columnHelper = createColumnHelper();
const API_BASE_URL = Config.getApiUrl();

const AcoesSistema = () => {
    const [acoes, setAcoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
    });
    const [filters, setFilters] = useState({
        tipo: '',
        modulo: '',
        usuario: '',
        empresa: '',
        sucesso: '',
        data_hora_inicio: '',
        data_hora_fim: '',
        objeto_tipo: '',
        search: '',
        ip: '',
        dispositivo: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAcoes();
    }, [pagination.pageIndex, filters]);

    const fetchAcoes = async () => {
        try {
            let url = `api/acoes/?page=${pagination.pageIndex + 1}`;
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            if (params.toString()) {
                url += `&${params.toString()}`;
            }

            const response = await fetchWithToken(url, {
                method: 'GET',
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            
            const data = await response.json();
            console.log(data);
            setAcoes(data.results || []);
            setPagination((prev) => ({
                ...prev,
                totalPages: Math.ceil(data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error("Erro ao buscar ações do sistema", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            tipo: '',
            modulo: '',
            usuario: '',
            empresa: '',
            sucesso: '',
            data_hora_inicio: '',
            data_hora_fim: '',
            objeto_tipo: '',
            search: '',
            ip: '',
            dispositivo: '',
        });
    };
    const handleDownload = (id) => {
        console.log(`Baixando transação ID: ${id}`);
        try {
            const apiUrl = `${API_BASE_URL}api/acao-pdf/${id}/`;
            window.open(apiUrl, '_blank'); // Abre a fatura em uma nova aba
        } catch (error) {
            console.error('Erro ao baixar fatura:', error);
            alert('Não foi possível baixar a fatura.');
        }
        // Implementar lógica de download
    };

    const acoesColumns = [
        {
            accessorKey: "data_hora",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA/HORA</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">
                    {new Date(row.getValue("data_hora")).toLocaleString()}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "usuario.username",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">USUÁRIO</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">
                    {row.original.usuario?.username || 'Sistema'}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "tipo",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO</p>,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {tipoIcones[row.getValue("tipo")] || <FaInfoCircle className="text-gray-500" />}
                    <p className="text-sm font-bold text-navy-700 dark:text-white capitalize">
                        {row.getValue("tipo").replace(/_/g, ' ')}
                    </p>
                </div>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "modulo",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">MÓDULO</p>,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {moduloIcones[row.getValue("modulo")] || <FaBox className="text-gray-500" />}
                    <p className="text-sm text-gray-500 capitalize">
                        {row.getValue("modulo").replace(/_/g, ' ')}
                    </p>
                </div>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "descricao",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DESCRIÇÃO</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500 truncate max-w-xs">
                    {row.getValue("descricao")}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "dispositivo",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Dispositivo</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">
                    {row.original.dispositivo || '-'}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "ip",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IP</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">
                    {row.original.ip || '-'}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "localizacao",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Localização</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">
                    {row.original.localizacao || '-'}
                </p>
            ),
            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "sucesso",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    {row.getValue("sucesso") ? (
                        <FaCheckCircle className="text-green-500" />
                    ) : (
                        <FaTimesCircle className="text-red-500" />
                    )}
                    <p className="text-sm text-gray-500">
                        {row.getValue("sucesso") ? 'Sucesso' : 'Falha'}
                        {row.original.mensagem_erro && ' - ' + row.original.mensagem_erro}
                    </p>
                </span>
            ),

            size: 150, // Largura aproximada em pixels

        },
        {
            accessorKey: "detalhes",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDownload(row.original.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Ver detalhes"
                    >
                        <FaInfoCircle />
                    </button>
                </div>
            ),
            size: 150, // Largura aproximada em pixels

        },
    ];

    const table = useReactTable({
        data: acoes,
        columns: acoesColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return (
            <LoaderContainer>
                <SyncLoader color="#3B82F6" size={15} />
            </LoaderContainer>
        );
    }

    return (
        <div className="px-2 sm:px-4">
            <Card extra={"w-full h-full overflow-x-auto px-2 sm:px-4 mt-4 mb-4"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Registro de Ações do Sistema</div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center space-x-2"
                        >
                            <FaFilter />
                            <span>Filtros</span>
                        </button>
                    </div>
                </header>

                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Filtro de Tipo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ação</label>
                                <select
                                    name="tipo"
                                    value={filters.tipo}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Todos</option>
                                    <option value="login">Login</option>
                                    <option value="logout">Logout</option>
                                    <option value="criacao">Criação</option>
                                    <option value="edicao">Edição</option>
                                    <option value="exclusao">Exclusão</option>
                                    <option value="negar">Negação</option>
                                    <option value="aceitar">Aceitar</option>
                                    <option value="compra">Compra</option>
                                    <option value="venda">Venda</option>
                                    <option value="reserva">Reserva</option>
                                    <option value="entrega">Entrega</option>
                                    <option value="recebimento">Recebimento</option>
                                    <option value="devolucao">Devolução</option>
                                    <option value="mensagem">Mensagem</option>
                                    <option value="denuncia">Denúncia</option>
                                    <option value="suporte">Suporte</option>
                                    <option value="avaliacao">Avaliação</option>
                                    <option value="anuncio">Anúncio</option>
                                    <option value="pagamento">Pagamento</option>
                                    <option value="status_change">Mudança de Status</option>
                                    <option value="system">Ação do Sistema</option>
                                    <option value="verificacao">Verificação</option>
                                </select>
                            </div>
                            
                            {/* Filtro de Módulo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                                <select
                                    name="modulo"
                                    value={filters.modulo}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Todos</option>
                                    <option value="usuario">Usuário</option>
                                    <option value="empresa">Empresa</option>
                                    <option value="produto">Produto</option>
                                    <option value="posto">Posto</option>
                                    <option value="transacao">Transação</option>
                                    <option value="lance">Lance</option>
                                    <option value="chat">Chat</option>
                                    <option value="chat_suporte">Chat Suporte</option>
                                    <option value="suporte">Suporte</option>
                                    <option value="mensagem_suporte">Mensagem Suporte</option>
                                    <option value="anuncio">Anúncio</option>
                                    <option value="sistema">Sistema</option>
                                    <option value="autenticacao">Autenticação</option>
                                </select>
                            </div>
                            
                            {/* Filtro de Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="sucesso"
                                    value={filters.sucesso}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Todos</option>
                                    <option value="true">Sucesso</option>
                                    <option value="false">Falha</option>
                                </select>
                            </div>
                            
                            {/* Filtro de IP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço IP</label>
                                <input
                                    type="text"
                                    name="ip"
                                    placeholder="Ex: 192.168.1.1"
                                    value={filters.ip}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* Filtro de Dispositivo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dispositivo</label>
                                <input
                                    type="text"
                                    name="dispositivo"
                                    placeholder="Ex: Chrome, Android"
                                    value={filters.dispositivo}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* Filtro de Data Início */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                                <input
                                    type="datetime-local"
                                    name="data_hora_inicio"
                                    value={filters.data_hora_inicio}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* Filtro de Data Fim */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                                <input
                                    type="datetime-local"
                                    name="data_hora_fim"
                                    value={filters.data_hora_fim}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* Filtro de Objeto Tipo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Objeto</label>
                                <input
                                    type="text"
                                    name="objeto_tipo"
                                    placeholder="Ex: produto, usuario"
                                    value={filters.objeto_tipo}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* Botões de Ação */}
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Limpar Filtros
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-5 overflow-x-auto hidden sm:block">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                        >
                                            <div className="items-center justify-between text-xs text-gray-200">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={acoesColumns.length} className="text-center py-4 text-gray-500">
                                        Nenhuma ação encontrada com os filtros aplicados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4 mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                        onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                        disabled={pagination.pageIndex === 0}
                    >
                        <FaArrowLeft className="mr-2" /> Anterior
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                        onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                        disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                    >
                        Próxima <FaArrowRight className="ml-2" />
                    </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-white">
                    Página {pagination.pageIndex + 1} de {pagination.totalPages}
                </span>
            </div>
        </div>
    );
};

export default AcoesSistema;