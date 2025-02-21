import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaChartLine } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const GerenciamentoEmpresas = () => {
    // Dados de exemplo para empresas cadastradas
    const [empresas, setEmpresas] = useState([
        { id: 1, nome: 'Empresa A', cnpj: '12.345.678/0001-99', status: 'Ativa' },
        { id: 2, nome: 'Empresa B', cnpj: '98.765.432/0001-11', status: 'Pendente' },
        { id: 3, nome: 'Empresa C', cnpj: '11.223.344/0001-55', status: 'Suspensa' },
    ]);

    // Estado para gerenciar a edição de dados
    const [editingEmpresa, setEditingEmpresa] = useState(null);

    // Função para aprovar ou rejeitar cadastro
    const handleAprovarRejeitar = (id, acao) => {
        setEmpresas((prev) =>
            prev.map((empresa) =>
                empresa.id === id ? { ...empresa, status: acao } : empresa
            )
        );
        alert(`Cadastro da empresa ${id} ${acao === 'Ativa' ? 'aprovado' : 'rejeitado'}.`);
    };

    // Função para suspender, ativar ou excluir conta
    const handleStatusConta = (id, acao) => {
        setEmpresas((prev) =>
            prev.map((empresa) =>
                empresa.id === id ? { ...empresa, status: acao } : empresa
            )
        );
        alert(`Conta da empresa ${id} ${acao}.`);
    };

    // Função para editar dados cadastrais
    const handleEditar = (id) => {
        const empresa = empresas.find((emp) => emp.id === id);
        setEditingEmpresa(empresa);
    };

    // Função para salvar edição
    const handleSalvarEdicao = () => {
        setEmpresas((prev) =>
            prev.map((empresa) =>
                empresa.id === editingEmpresa.id ? editingEmpresa : empresa
            )
        );
        setEditingEmpresa(null);
        alert('Dados da empresa atualizados com sucesso.');
    };

    // Configuração da tabela
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('cnpj', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">CNPJ</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('status', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('acao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÃO</p>,
            cell: (info) => (
                <div className="flex space-x-4">
                    {info.row.original.status === 'Pendente' && (
                        <>
                            <button
                                className="text-green-500 hover:text-green-700"
                                title="Aprovar"
                                onClick={() => handleAprovarRejeitar(info.row.original.id, 'Ativa')}
                            >
                                <FaCheck />
                            </button>
                            <button
                                className="text-red-500 hover:text-red-700"
                                title="Rejeitar"
                                onClick={() => handleAprovarRejeitar(info.row.original.id, 'Rejeitada')}
                            >
                                <FaTimes />
                            </button>
                        </>
                    )}
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                        onClick={() => handleEditar(info.row.original.id)}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                        onClick={() => handleStatusConta(info.row.original.id, 'Excluída')}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: empresas,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6">

            {/* Tabela de Empresas Cadastradas */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Empresas Cadastradas
                    </div>
                </header>

                <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
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
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="min-w-[150px] border-white/0 py-3 pr-4"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edição de Dados Cadastrais */}
            {editingEmpresa && (
                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            Editar Dados da Empresa
                        </div>
                    </header>

                    <div className="mt-5">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={editingEmpresa.nome}
                                onChange={(e) =>
                                    setEditingEmpresa({ ...editingEmpresa, nome: e.target.value })
                                }
                                className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                CNPJ
                            </label>
                            <input
                                type="text"
                                value={editingEmpresa.cnpj}
                                onChange={(e) =>
                                    setEditingEmpresa({ ...editingEmpresa, cnpj: e.target.value })
                                }
                                className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <button
                            onClick={handleSalvarEdicao}
                            className="bg-green-500 mb-4 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                        >
                            <FaCheck className="mr-2" />
                            Salvar Alterações
                        </button>
                    </div>
                </Card>
            )}

        </div>
    );
};

export default GerenciamentoEmpresas;