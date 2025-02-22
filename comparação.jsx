import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Card from 'components/card';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app";

const GerenciamentoEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editingData, setEditingData] = useState({});

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/empresas`, {
            headers: { "ngrok-skip-browser-warning": "true" },
        })
            .then((response) => response.json())
            .then((data) => setEmpresas(data.results));
    }, []);

    // Função para entrar no modo de edição
    const entrarModoEdicao = (row) => {
        setEditingRowId(row.id);
        setEditingData({ ...row.original });
    };

    // Função para salvar edições
    const salvarEdicoes = async () => {
        try {
            // Aqui você deve implementar a chamada à API para salvar as alterações
            // await fetch(`${API_BASE_URL}/api/empresa/${editingRowId}/`, {
            //     method: 'PUT',
            //     body: JSON.stringify(editingData),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });

            setEmpresas(empresas.map(empresa =>
                empresa.id === editingRowId ? { ...empresa, ...editingData } : empresa
            ));
            setEditingRowId(null);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    // Função para cancelar edição
    const cancelarEdicao = () => {
        setEditingRowId(null);
        setEditingData({});
    };

    // Modifique as colunas para suportar edição
    const columns = [
        // ... (outras colunas permanecem iguais)
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => editingRowId === info.row.original.id ? (
                <input
                    className="text-sm p-1 border rounded dark:bg-gray-800 dark:text-white"
                    value={editingData.nome}
                    onChange={(e) => setEditingData({ ...editingData, nome: e.target.value })}
                />
            ) : (
                <p
                    className="text-sm font-bold text-blue-500 cursor-pointer hover:underline"
                    onClick={() => fetchFuncionarios(info.row.original.id, info.row.original.nome)}
                >
                    {info.getValue()}
                </p>
            ),
        }),
        // Repita o padrão acima para as outras colunas editáveis...

        columnHelper.accessor("acao", {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
            cell: (info) => (
                <div className="flex space-x-4">
                    {editingRowId === info.row.original.id ? (
                        <>
                            <button
                                onClick={salvarEdicoes}
                                className="text-green-500 hover:text-green-700"
                                title="Salvar"
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={cancelarEdicao}
                                className="text-red-500 hover:text-red-700"
                                title="Cancelar"
                            >
                                <FaTimes />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => entrarModoEdicao(info.row)}
                                className="text-green-500 hover:text-green-700"
                                title="Editar"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => excluirUsuario(info.row.original.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Excluir"
                            >
                                <FaTrash />
                            </button>
                        </>
                    )}
                </div>
            ),
        }),
    ];

    // Adicione estilos personalizados para o scroll
    const scrollStyles = `
        .scrollbar-styled::-webkit-scrollbar {
            height: 8px;
            background-color: #f5f5f5;
        }

        .scrollbar-styled::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 4px;
        }

        .scrollbar-styled::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }

        .dark .scrollbar-styled::-webkit-scrollbar {
            background-color: #1a202c;
        }

        .dark .scrollbar-styled::-webkit-scrollbar-thumb {
            background-color: #4a5568;
        }
    `;

    return (
        <div>
            <style>{scrollStyles}</style>

            <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Empresas</div>
                </header>
                <div className="mt-5 overflow-x-auto scrollbar-styled">
                    <table className="w-full">
                        {/* ... (o restante da tabela permanece igual) */}
                    </table>
                </div>
            </Card>

            {empresaSelecionada && (
                <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            Funcionários da Empresa: {nomeEmpresaSelecionada}
                        </div>
                    </header>
                    <div className="mt-5 overflow-x-auto scrollbar-styled">
                        <table className="w-full">
                            {/* ... (o restante da tabela permanece igual) */}
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GerenciamentoEmpresas;

///////////////////////////////////

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const GerenciamentoPostos = () => {
    // Estado para gerenciar a lista de postos
    const [postos, setPostos] = useState([
        { id: 1, nome: 'Nova Vida', criadoPor: 'Admin', dataCriacao: '2023-05-22' },
        { id: 2, nome: 'Vila', criadoPor: 'Dilsond', dataCriacao: '2024-10-05' },
        { id: 3, nome: 'Benfica', criadoPor: 'Admin', dataCriacao: '2023-08-01' },
        { id: 4, nome: 'Kilamba', criadoPor: 'Gerente', dataCriacao: '2025-11-05' },
        { id: 5, nome: 'Morro Bneto', criadoPor: 'Admin', dataCriacao: '2024-12-17' },
        { id: 6, nome: 'Cacuaco', criadoPor: 'Gerente', dataCriacao: '2025-06-05' },
    ]);

    // Estado para controlar qual posto está sendo editado
    const [postoEditando, setPostoEditando] = useState(null);

    // Estado para armazenar os dados temporários durante a edição
    const [dadosEditados, setDadosEditados] = useState({});

    // Estado para controlar a exibição do modal de cadastro
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para os campos do formulário de cadastro
    const [novoPosto, setNovoPosto] = useState({
        nome: '',
        criadoPor: '',
        dataCriacao: '',
    });

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

    // Função para iniciar a edição de um posto
    const iniciarEdicao = (id) => {
        const posto = postos.find((p) => p.id === id);
        if (posto) {
            setPostoEditando(id);
            setDadosEditados({ ...posto }); // Copia os dados do posto para edição
        }
    };

    // Função para salvar as alterações de um posto
    const salvarEdicao = (id) => {
        const novosPostos = postos.map((p) =>
            p.id === id ? { ...p, ...dadosEditados } : p
        );
        setPostos(novosPostos); // Atualiza a lista de postos
        setPostoEditando(null); // Sai do modo de edição
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setPostoEditando(null); // Sai do modo de edição
    };

    // Função para lidar com a mudança nos campos de edição
    const handleEdicaoChange = (e, campo) => {
        const { value } = e.target;
        setDadosEditados({ ...dadosEditados, [campo]: value });
    };

    // Função para excluir um posto
    const excluirPosto = (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este posto?');
        if (confirmacao) {
            const novaLista = postos.filter((p) => p.id !== id);
            setPostos(novaLista);
        }
    };

    return (
        <div className="p-2">
            {/* Tabela de postos registrados */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Postos Registrados
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    ID
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    NOME DO POSTO
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    CRIADO POR
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    DATA DE CRIAÇÃO
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    AÇÃO
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {postos.map((posto) => (
                                <tr key={posto.id} className="border-b border-gray-200">
                                    <td className="p-2">{posto.id}</td>
                                    <td className="p-2">
                                        {postoEditando === posto.id ? (
                                            <input
                                                type="text"
                                                value={dadosEditados.nome}
                                                onChange={(e) => handleEdicaoChange(e, 'nome')}
                                                className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        ) : (
                                            posto.nome
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {postoEditando === posto.id ? (
                                            <input
                                                type="text"
                                                value={dadosEditados.criadoPor}
                                                onChange={(e) => handleEdicaoChange(e, 'criadoPor')}
                                                className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        ) : (
                                            posto.criadoPor
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {postoEditando === posto.id ? (
                                            <input
                                                type="date"
                                                value={dadosEditados.dataCriacao}
                                                onChange={(e) => handleEdicaoChange(e, 'dataCriacao')}
                                                className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        ) : (
                                            posto.dataCriacao
                                        )}
                                    </td>
                                    <td className="p-2">
                                        <div className="flex space-x-4">
                                            {postoEditando === posto.id ? (
                                                <>
                                                    <button
                                                        onClick={() => salvarEdicao(posto.id)}
                                                        className="text-green-500 hover:text-green-700"
                                                        title="Salvar"
                                                    >
                                                        <FaSave />
                                                    </button>
                                                    <button
                                                        onClick={cancelarEdicao}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Cancelar"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => iniciarEdicao(posto.id)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Editar"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => excluirPosto(posto.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Excluir"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

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


////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from 'components/card';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app";

const GerenciamentoPostos = () => {
    const [postos, setPostos] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [postoSelecionado, setPostoSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [proximaPagina, setProximaPagina] = useState(null);
    const [paginaAnterior, setPaginaAnterior] = useState(null);
    const [loading, setLoading] = useState(true);

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
        columnHelper.accessor('transacao.lance.produto.imagens[0].imagem', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGEM</p>,
            cell: (info) => (
                <img
                    src={`${API_BASE_URL}${info.getValue()}`}
                    alt="Produto"
                    className="w-16 h-16 object-cover"
                />
            ),
        }),
        columnHelper.accessor('transacao.lance.produto.nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">PRODUTO</p>,
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

    // Funções de busca de dados
    useEffect(() => {
        fetchPostos();
    }, []);

    const fetchPostos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/postos/`, {
                headers: { "ngrok-skip-browser-warning": "true" },
            });
            const data = await response.json();
            setPostos(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar postos:", error);
            setLoading(false);
        }
    };

    // Resto das funções mantidas igual...

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
                                        <th key={header.id} className="text-start p-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <tr className="border-b border-gray-200">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    
                                    {postoSelecionado && postoSelecionado.id === row.original.id && (
                                        <tr>
                                            <td colSpan={columns.length}>
                                                <div className="p-4 bg-gray-100">
                                                    <h3 className="text-lg font-bold mb-2">Funcionários do Posto</h3>
                                                    <table className="w-full">
                                                        <thead>
                                                            {funcionariosTable.getHeaderGroups().map((headerGroup) => (
                                                                <tr key={headerGroup.id}>
                                                                    {headerGroup.headers.map((header) => (
                                                                        <th key={header.id} className="text-start p-2">
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
                                                                        <td key={cell.id} className="p-2">
                                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    <h3 className="text-lg font-bold mt-4 mb-2">Últimas Atividades</h3>
                                                    <table className="w-full">
                                                        <thead>
                                                            {atividadesTable.getHeaderGroups().map((headerGroup) => (
                                                                <tr key={headerGroup.id}>
                                                                    {headerGroup.headers.map((header) => (
                                                                        <th key={header.id} className="text-start p-2">
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
                                                                        <td key={cell.id} className="p-2">
                                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Resto do código mantido igual... */}
        </div>
    );
};

export default GerenciamentoPostos;