import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaDownload, FaTrash } from "react-icons/fa";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import Card from "components/card";
import { data } from 'autoprefixer';

const API_BASE_URL = "https://83dc-154-71-159-172.ngrok-free.app";

const Transacao = () => {
    const [transacoes, setTransacoes] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
        totalPages: 1,
    });

    useEffect(() => {
        fetchTransacoes();
    }, [pagination.pageIndex]);

    const fetchTransacoes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/transacaos?page=${pagination.pageIndex + 1}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
            });
            console.log(response.data.results);
            setTransacoes(response.data.results);
            setPagination((prev) => ({
                ...prev,
                totalPages: Math.ceil(response.data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error("Erro ao buscar transações", error);
        }
    };
    const handleDownload = (id) => {
        console.log(`Baixando transação ID: ${id}`);
        // Implementar lógica de download
    };

    const handleDelete = (id) => {
        console.log(`Deletando transação ID: ${id}`);
        // Implementar lógica de exclusão
    };

    const transacaoColumns = [
        {
            accessorKey: "lance",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO</p>,
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.lance?.produto?.nome}</p>
                </span>
            ),
        },
        {
            accessorKey: "tipo_transacao",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO</p>,
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{row.getValue("tipo_transacao")}</p>
                </span>
            ),
        },
        {
            accessorKey: "valor",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">VALOR</p>,
            cell: ({ row }) => (
                <p className="text-sm text-gray-500">R$ {parseFloat(row.getValue("valor")).toFixed(2)}</p>
            ),
        },
        {
            accessorKey: "data_transacao",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA</p>,
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{row.getValue("data_transacao")}</p>
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: ({ row }) => (
                <span className="flex items-center gap-2">

                    <p className="text-sm text-gray-500">{row.getValue("status")}</p>
                </span>
            ),
        },
        {
            accessorKey: "acoes",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,// Sem accessorKey, pois não vem da API
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDownload(row.original.id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Download"
                    >
                        <FaDownload />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },


    ];

    const table = useReactTable({
        data: transacoes,
        columns: transacaoColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Transações</div>
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
                                        <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
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

export default Transacao;

