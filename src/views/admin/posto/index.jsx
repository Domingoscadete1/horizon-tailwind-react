import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const API_BASE_URL = "https://83dc-154-71-159-172.ngrok-free.app";

const GerenciamentoPostos = () => {
    const [postos, setPostos] = useState([]); // Começa vazio
    const [loading, setLoading] = useState(true); // Para indicar carregamento

    // Estado para controlar a exibição do modal de cadastro
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para os campos do formulário de cadastro
    const [novoPosto, setNovoPosto] = useState({
        nome: '',
        criadoPor: '',
        dataCriacao: '',
    });
    const [funcionarios, setFuncionarios] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [postoSelecionado, setPostoSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [proximaPagina, setProximaPagina] = useState(null);
    const [paginaAnterior, setPaginaAnterior] = useState(null);

    const fetchFuncionarios = async (postoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/funcionarios/posto/?posto_id=${postoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar funcionários");
            }

            const data = await response.json();
            setFuncionarios(data.funcionarios || []);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    };


    // Buscar atividades do posto selecionado
    const fetchAtividades = async (postoId, page = 1) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posto/registro/${postoId}/?page=${page}`, {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            console.log(data);
            setAtividades(data.results.latest || []);
            setPaginaAtual(page);
            setProximaPagina(data.next);
            setPaginaAnterior(data.previous);
            setTotalPages(Math.ceil(data.count / data.results.length));
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
        }
    };


    // Quando o usuário clica em um posto, busca os detalhes
    const selecionarPosto = (posto) => {
        if (postoSelecionado && postoSelecionado.id === posto.id) {
            setPostoSelecionado(null);
            setFuncionarios([]);
            setAtividades([]);
        } else {
            setPostoSelecionado(posto);
            fetchFuncionarios(posto.id);
            fetchAtividades(posto.id);
        }
    };

    // 🔥 Função para buscar postos da API
    const fetchPostos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/postos/`, {
                headers: {
                    "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
            }); // URL da API
            if (!response.ok) {
                throw new Error("Erro ao buscar postos");
            }
            const data = await response.json();
            setPostos(data); // Atualiza o estado com os postos da API
        } catch (error) {
            console.error("Erro ao buscar postos:", error);
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    useEffect(() => {
        fetchPostos();
    }, []);
    // Função para abrir o modal de cadastro
    const abrirModal = () => {
        setMostrarModal(true);
    };

    // Função para fechar o modal de cadastro
    const fecharModal = () => {
        setMostrarModal(false);
        setNovoPosto({ nome: '', criadoPor: '', dataCriacao: '' }); // Limpa o formulário
    };

    // Função para lidar com a mudança nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoPosto({ ...novoPosto, [name]: value });
    };

    // Função para cadastrar um novo posto
    const cadastrarPosto = () => {
        if (!novoPosto.nome || !novoPosto.criadoPor || !novoPosto.dataCriacao) {
            alert('Preencha todos os campos para cadastrar o posto.');
            return;
        }

        const novoId = postos.length + 1; // Gera um novo ID
        const posto = { id: novoId, ...novoPosto };
        setPostos([...postos, posto]); // Adiciona o novo posto à lista
        fecharModal(); // Fecha o modal após o cadastro
    };

    // Função para editar um posto
    const editarPosto = (id) => {
        const posto = postos.find((p) => p.id === id);
        if (posto) {
            alert(`Editar posto: ${posto.nome}`);
            // Aqui você pode abrir um modal ou formulário para edição
        }
    };

    // Função para excluir um posto
    const excluirPosto = (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este posto?');
        if (confirmacao) {
            const novaLista = postos.filter((p) => p.id !== id);
            setPostos(novaLista);
        }
    };

    // Configuração das colunas para postos
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => (
                <p
                    className="text-sm font-bold text-blue-500 cursor-pointer hover:underline"
                    onClick={() => selecionarPosto(info.row.original)}
                >
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor('localizacao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">LOCALIZAÇÃO</p>,
            cell: (info) => info.getValue() || "Não informado",
        }),
        columnHelper.accessor('responsavel', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">RESPONSÁVEL</p>,
            cell: (info) => info.getValue() || "Não informado",
        }),
        columnHelper.accessor('telefone', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TELEFONE</p>,
            cell: (info) => info.getValue() || "Sem telefone",
        }),
        columnHelper.accessor("acao", {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
            cell: (info) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => editarPosto(info.row.original.id)}
                        className="text-green-500 hover:text-green-700"
                        title="Editar"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => excluirPosto(info.row.original.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        }),
    ];

    // Configuração das colunas para funcionários
    const funcionariosColumns = [
        columnHelper.accessor('foto', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
            cell: (info) => (
                <img
                    src={`${API_BASE_URL}${info.getValue()}`}
                    alt="Funcionário"
                    className="w-10 h-10 rounded-full object-cover"
                />
            ),
        }),
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('email', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">EMAIL</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('numero_telefone', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TELEFONE</p>,
            cell: (info) => info.getValue(),
        }),
    ];

    // Configuração das colunas para atividades
    const atividadesColumns = [
        columnHelper.accessor(row => row.transacao?.lance?.produto?.imagens?.[0]?.imagem, {
            id: "imagem_produto", // Adicione um ID único
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGEM DO PRODUTO</p>,
            cell: (info) => {
                const imageUrl = info.getValue();
                return imageUrl ? (
                    <img
                        src={`${API_BASE_URL}${imageUrl}`}
                        alt="Produto"
                        className="w-16 h-16 object-cover"
                    />
                ) : (
                    <p className="text-xs text-gray-500">Sem imagem</p>
                );
            },
        }),
        
        
        columnHelper.accessor('transacao.lance.produto.nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME DO PRODUTO</p>,
            cell: (info) => info.getValue() || "Sem produto",
        }),
        columnHelper.accessor('transacao.lance.preco', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">PREÇO</p>,
            cell: (info) => `${info.getValue()} AOA` || "Sem preço",
        }),
        columnHelper.accessor('tipo', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('responsavel.nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">RESPONSÁVEL</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('data_operacao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA</p>,
            cell: (info) => new Date(info.getValue()).toLocaleString(),
        }),
    ];

    // Tabelas com react-table
    const table = useReactTable({
        data: postos,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const funcionariosTable = useReactTable({
        data: funcionarios,
        columns: funcionariosColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    const atividadesTable = useReactTable({
        data: atividades,
        columns: atividadesColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-2">

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Postos Registrados
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="border-b text-start p-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {postoSelecionado && postoSelecionado.id && (
                <div>
                    <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                        <header className="relative flex items-center justify-between pt-4">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">
                                Funcionários do Posto
                            </div>
                        </header>
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    {funcionariosTable.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id} className="border-b py-2 text-start">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {funcionariosTable.getRowModel().rows.map((row) => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="py-2">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </Card>

                    <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                        <div className="mt-5 overflow-x-auto">
                            <header className="relative flex items-center justify-between pt-4">
                                <div className="text-xl font-bold text-navy-700 dark:text-white">
                                    Últimas Actividades
                                </div>
                            </header>
                            <table className="w-full">
                                <thead>
                                    {atividadesTable.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th key={header.id} className="border-b py-2 text-start">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {atividadesTable.getRowModel().rows.map((row) => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="py-2">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-center mt-10 mb-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual - 1)}
                                        disabled={!paginaAnterior}
                                        className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${paginaAnterior === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <FaArrowLeft className="w-20" />
                                    </button>

                                    <span className="text-sm text-gray-600 dark:text-white">
                                        Página {paginaAtual} 
                                    </span>

                                    <button
                                        onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual + 1)}
                                        disabled={!proximaPagina}
                                        className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${proximaPagina ? "bg-blue-500 text-white" : ""}`}
                                    >
                                        <FaArrowRight className="w-20" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </Card>
                </div>

            )}


            {/* Botão para abrir o modal de cadastro */}
            <div className="flex justify-end">
                <button
                    onClick={abrirModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6"
                >
                    <FaPlus className="mr-2" />
                    Cadastrar Posto
                </button>
            </div>

            {/* Modal de Cadastro de Posto */}
            {mostrarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-navy-700">Cadastrar Novo Posto</h2>
                        </header>

                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome do Posto
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={novoPosto.nome}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Posto Central"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Criado Por
                                </label>
                                <input
                                    type="text"
                                    name="criadoPor"
                                    value={novoPosto.criadoPor}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Admin"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Data de Criação
                                </label>
                                <input
                                    type="date"
                                    name="dataCriacao"
                                    value={novoPosto.dataCriacao}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={fecharModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={cadastrarPosto}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciamentoPostos;