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



////////////////////////////////

import React, { useState, useEffect } from "react";
import Banner from "./components/Banner";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NftCard from "components/card/NftCard";
import ImageModal from "./components/modal";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app/api/produtos/";

const Marketplace = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const nfts = [
        { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
        { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
        { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
        { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    ];

    const fetchProdutos = async (page = 1) => {
        try {
            const url = `${API_BASE_URL}?page=${page}`;
            const response = await fetch(url, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            console.log("Produtos carregados:", data);

            const produtosList = Array.isArray(data.results) ? data.results : [];
            setProdutos(produtosList);
            setFilteredProdutos(produtosList);
            setTotalPages(Math.ceil(data.count / data.results.length));
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    useEffect(() => {
        fetchProdutos(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const filtered = produtos.filter((produto) =>
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredProdutos(filtered);
    }, [searchTerm, produtos]);

    const handlePageChange = (direction) => {
        setCurrentPage((prev) => {
            if (direction === "next" && prev < totalPages) return prev + 1;
            if (direction === "prev" && prev > 1) return prev - 1;
            return prev;
        });
    };

    const handleImageClick = (produto) => {
        setSelectedNft(produto);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNft(null);
    };

    return (
        <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-1 2xl:grid-cols-1">
            <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
                <Banner />

                <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
                    <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
                        Categorias
                    </h4>
                    <ul className="mt-4 flex items-center justify-between md:mt-0 md:justify-center md:!gap-5 2xl:!gap-12">
                        <li>
                            <a className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white" href=" ">
                                Computador
                            </a>
                        </li>
                        <li>
                            <a className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white" href=" ">
                                Telefone
                            </a>
                        </li>
                        <li>
                            <a className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white" href=" ">
                                Carro
                            </a>
                        </li>
                        <li>
                            <a className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white" href=" ">
                                Teclado
                            </a>
                        </li>
                    </ul>
                </div>

                {/* NFTs Grid */}
                <div className="z-20 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
                    {nfts.map((nft, index) => (
                        <NftCard
                            key={index}
                            bidders={[avatar1, avatar2, avatar3]}
                            title={nft.title}
                            author={nft.author}
                            price={nft.price}
                            image={nft.image}
                            onImageClick={() => handleImageClick(nft)}
                        />
                    ))}
                </div>

                <div className="relative flex items-center justify-between pt-4">
                    <div className="text-xl mt-5 mb-5 ml-2 font-bold text-navy-700 dark:text-white">
                        Para Você
                    </div>
                    <input
                        type="text"
                        placeholder="Filtrar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-lg"
                    />
                </div>

                {/* Grid de produtos filtrados */}
                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                    {filteredProdutos.map((produto) => {
                        const imageUrl =
                            produto.imagens && produto.imagens.length > 0
                                ? produto.imagens[0].imagem
                                : "https://via.placeholder.com/150";

                        return (
                            <NftCard
                                key={produto.id}
                                bidders={[avatar1, avatar2, avatar3]}
                                title={produto.nome}
                                author={produto.empresa ? produto.empresa.nome : produto.usuario.nome}
                                price={`${produto.preco.toFixed(2)}`}
                                image={imageUrl}
                                quantidade={produto.quantidade}
                                status={produto.status}
                                image_user={
                                    produto.usuario
                                        ? produto.usuario.foto
                                        : produto.empresa?.imagens?.[0]?.imagem
                                }
                                onImageClick={() => handleImageClick(produto)}
                            />
                        );
                    })}
                </div>

                {/* Paginação */}
                <div className="flex justify-center mt-10 mb-4">
                    <div className="flex items-center space-x-2">
                        <button
                            className={`px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange("prev")}
                        >
                            <FaArrowLeft />
                        </button>
                        <span className="text-sm text-gray-600 dark:text-white">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className={`px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange("next")}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;

//////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaLock, FaSave, FaTimes, FaCheck, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import image1 from "assets/img/profile/image1.png";
import image2 from "assets/img/profile/image2.png";
import image3 from "assets/img/profile/image3.png";
import banner from "assets/img/profile/banner.png";
import NftCard from "components/card/NftCard";
import ImageModal from "../marketplace/components/modal";
const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app";

const PerfilUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4, // Alterado para 4 produtos por página
        totalPages: 1,
    });
    const [paginationTrasaction, setPaginationTrasaction] = useState({
        pageIndex: 0,
        pageSize: 2,
        totalPages: 1,
    });
    const [editando, setEditando] = useState(false);
    const [formData1, setFormData] = useState({
        status: 'Ativa',
    });
    const [filtroProdutos, setFiltroProdutos] = useState('');
    const [filtroTransacoes, setFiltroTransacoes] = useState('');

    const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`);
    };

    const fetchProdutos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos/usuario/${id}?page=${pagination.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setProdutos(data.results);
            setPagination((prev) => ({
                ...prev,
                totalPages: Math.ceil(data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransacoes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuario/transacoes/${id}?page=${paginationTrasaction.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setTransacoes(data.results);
            setPaginationTrasaction((prev) => ({
                ...prev,
                totalPages: Math.ceil(data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuario = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setUsuario(data);
        } catch (error) {
            console.error('Erro ao buscar usuario:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsuario();
            await fetchProdutos();
            await fetchTransacoes();
            setLoading(false);
        };

        fetchData();
    }, [id, pagination.pageIndex, paginationTrasaction.pageIndex]);

    if (loading) {
        return <div className="mt-10 text-center text-gray-500">Carregando...</div>;
    }

    if (!usuario) {
        return <div className="mt-10 text-center text-gray-500">Usuário não encontrado</div>;
    }

    const atualizarUsuario = async () => {
        try {
            const formData = new FormData();
            formData.append('nome', usuario.nome);
            formData.append('email', usuario.email);
            formData.append('numero_telefone', usuario.numero_telefone);
            formData.append('endereco', usuario.endereco);
            formData.append('data_nascimento', usuario.data_nascimento);
            formData.append('status', usuario.status);

            if (usuario.foto instanceof File) {
                formData.append('foto', usuario.foto);
            } else if (typeof usuario.foto === 'string') {
                console.log("A foto não foi alterada, mantendo a existente.");
            }

            const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsuario(updatedUser);
                alert('Perfil atualizado com sucesso!');
                setEditando(false);
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar o perfil: ${errorData.detail || 'Dados inválidos'}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar o perfil.');
        }
    };

    const suspenderUsuario = async (novoStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${id}/suspend/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (response.ok) {
                alert(`Conta da empresa ${novoStatus === 'Ativa' ? 'ativada' : 'suspensa'}.`);
                setFormData((prev) => ({ ...prev, status: novoStatus }));
            } else {
                alert('Erro ao alterar o status da conta.');
            }
        } catch (error) {
            console.error('Erro ao suspender usuário:', error);
            alert('Erro ao alterar o status da conta.');
        }
    };

    const apagarUsuario = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/deletar/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (response.ok) {
                alert('Conta excluída com sucesso.');
                window.location.href = '/';
            } else {
                alert('Erro ao excluir a conta.');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir a conta.');
        }
    };

    const salvarPerfil = () => {
        atualizarUsuario();
    };

    const handleImageClick = (nft) => {
        setSelectedNft(nft);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNft(null);
    };

    const handleStatusConta = (novoStatus) => {
        suspenderUsuario(novoStatus);
    };

    const cancelarEdicao = () => {
        setEditando(false);
    };

    // Função para filtrar produtos
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(filtroProdutos.toLowerCase())
    );

    // Função para filtrar transações
    const transacoesFiltradas = transacoes.filter(transacao =>
        transacao.produto.nome.toLowerCase().includes(filtroTransacoes.toLowerCase())
    );

    return (
        <div>
            <div className='mb-10 grid h-full grid-cols-1 gap-5 md:grid-cols-2'>
            </div>

            {/* Produtos Divulgados e Últimas Transações */}
            <div className="mt-5 mb-6 grid h-full grid-cols-1 gap-5 md:flex">
                <div className="w-full md:w-[65%]">
                    <Card extra={"w-full p-4 h-full"}>
                        <div className="mt-3 w-full ml-3">
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                                Produtos Divulgados
                            </h4>
                            {/* Input de filtro para produtos */}
                            <input
                                type="text"
                                placeholder="Filtrar produtos..."
                                value={filtroProdutos}
                                onChange={(e) => setFiltroProdutos(e.target.value)}
                                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        {produtosFiltrados.map((produto) => (
                            <div
                                key={produto.id}
                                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                            >
                                <div className="flex items-center">
                                    <div className="">
                                        <img
                                            className="h-[83px] w-[83px] rounded-lg cursor-pointer"
                                            src={`${API_BASE_URL}${produto.imagens[0]?.imagem}`}
                                            alt={produto.nome}
                                            onClick={() => handleProdutoClick(produto.id)}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-navy-700 dark:text-white">
                                            {produto.nome}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {produto.descricao}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {produto.preco}Kzs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                    </Card>
                </div>

                <div className="w-full md:w-[35%]">
                    <Card extra="w-full h-full sm:overflow-auto px-6">
                        <header className="relative flex items-center mt-3 justify-between pt-4">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">Últimas Transações</div>
                            {/* Input de filtro para transações */}
                            <input
                                type="text"
                                placeholder="Filtrar transações..."
                                value={filtroTransacoes}
                                onChange={(e) => setFiltroTransacoes(e.target.value)}
                                className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </header>
                        <div className="mt-3">
                            {transacoesFiltradas.map((transacao) => (
                                <div
                                    key={transacao.id}
                                    className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                                >
                                    <div className="flex items-center">
                                        <div className="">
                                            <img
                                                className="h-[83px] w-[83px] rounded-lg cursor-pointer"
                                                src={`${API_BASE_URL}${transacao?.produto.imagens[0]?.imagem}`}
                                                alt={transacao?.produto.nome}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base font-medium text-navy-700 dark:text-white">
                                                {transacao?.produto.nome}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {transacao.produto.descricao}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {transacao.transacao.lance?.preco} AOA
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {transacao?.comprador?.id == usuario.id ? 'compra' : 'venda'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Paginação */}
                            <div className="flex items-center justify-between mt-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                        onClick={() => setPaginationTrasaction((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                                        disabled={paginationTrasaction.pageIndex === 0}
                                    >
                                        <FaArrowLeft className="mr-2" /> Anterior
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                        onClick={() => setPaginationTrasaction((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                                        disabled={paginationTrasaction.pageIndex + 1 >= paginationTrasaction.totalPages}
                                    >
                                        Próxima <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-white">
                                    Página {paginationTrasaction.pageIndex + 1} de {paginationTrasaction.totalPages}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default PerfilUsuario;