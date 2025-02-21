import React, { useState } from 'react';
import { FaUser, FaUsers, FaEdit, FaTrash, FaLock, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const GerenciamentoUsuarios = () => {
    // Dados de exemplo para usuários
    const [users, setUsers] = useState([
        { id: 1, nome: 'João Silva', email: 'joao@example.com', status: 'Ativo' },
        { id: 2, nome: 'Maria Souza', email: 'maria@example.com', status: 'Inativo' },
        { id: 3, nome: 'Pedro Costa', email: 'pedro@example.com', status: 'Ativo' },
        { id: 4, nome: 'Ana Lima', email: 'ana@example.com', status: 'Suspenso' },
    ]);

    // Funções para gerenciar usuários
    const ativarUsuario = (id) => {
        setUsers(users.map(user => user.id === id ? { ...user, status: 'Ativo' } : user));
    };

    const desativarUsuario = (id) => {
        setUsers(users.map(user => user.id === id ? { ...user, status: 'Inativo' } : user));
    };

    const excluirUsuario = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const resetarSenha = (id) => {
        alert(`Senha resetada para o usuário com ID: ${id}`);
    };

    const editarUsuario = (id) => {
        alert(`Editar usuário com ID: ${id}`);
    };

    const visualizarUsuario = (id) => {
        alert(`Visualizar detalhes do usuário com ID: ${id}`);
    };

    // Configuração da tabela
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('email', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">E-MAIL</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('status', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: (info) => (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        info.getValue() === 'Ativo' ? 'bg-green-100 text-green-800' :
                        info.getValue() === 'Inativo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}
                >
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('acao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
            cell: (info) => (
                <div className="flex space-x-4">
                    <button
                        onClick={() => visualizarUsuario(info.row.original.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Visualizar"
                    >
                        <FaEye />
                    </button>
                    <button
                        onClick={() => editarUsuario(info.row.original.id)}
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
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6">

            {/* Tabela de Usuários */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Usuários
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
        </div>
    );
};

export default GerenciamentoUsuarios;