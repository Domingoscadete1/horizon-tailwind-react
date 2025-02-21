import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaDownload, FaTrash } from "react-icons/fa";
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app";

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
            const response = await axios.get(`${API_BASE_URL}/api/transacaos?page=${pagination.pageIndex + 1}`,{
                headers: {
                  "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
              });
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
            accessorKey: "tipo_transacao",
            header: "Tipo",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500" />
                    {row.getValue("tipo_transacao")}
                </span>
            ),
        },
        {
            accessorKey: "valor",
            header: "Valor",
            cell: ({ row }) => `R$ ${parseFloat(row.getValue("valor")).toFixed(2)}`,
        },
        {
            accessorKey: "data_transacao",
            header: "Data",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {row.getValue("data_transacao")}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className="flex items-center gap-2">
                    {row.getValue("status") === "Concluído" ? (
                        <FaCheckCircle className="text-green-500" />
                    ) : (
                        <FaTimesCircle className="text-red-500" />
                    )}
                    {row.getValue("status")}
                </span>
            ),
        },
        {
            header: "Ações", // Sem accessorKey, pois não vem da API
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleDownload(row.original.id)} className="text-blue-500 hover:text-blue-700">
                        <FaDownload />
                    </button>
                    <button onClick={() => handleDelete(row.original.id)} className="text-red-500 hover:text-red-700">
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
            <h2 className="text-xl font-bold">Transações</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <th key={header.id}>{header.column.columnDef.header}</th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{cell.renderValue()}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded"
                    onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                    disabled={pagination.pageIndex === 0}
                >
                    <FaArrowLeft /> Anterior
                </button>
                <span>Página {pagination.pageIndex + 1} de {pagination.totalPages}</span>
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded"
                    onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                    disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                >
                    Próxima <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default Transacao;
