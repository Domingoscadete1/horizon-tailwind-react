import React, { useState } from 'react';
import { MdArchive, MdPayment, MdSettings } from 'react-icons/md';
import Card from 'components/card';
import { FaTrash, FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

const Transacao = () => {
    const [showHistory, setShowHistory] = useState(false); // Estado para controlar a visibilidade da tabela

    // Dados de exemplo para o histórico de compras e vendas
    const historyData = [
        { id: 1, user: 'João Silva', type: 'Compra', amount: 'R$ 150,00', date: '2023-10-01' },
        { id: 2, user: 'Maria Souza', type: 'Venda', amount: 'R$ 300,00', date: '2023-10-02' },
        { id: 3, user: 'Pedro Costa', type: 'Compra', amount: 'R$ 200,00', date: '2023-10-03' },
        { id: 4, user: 'Ana Lima', type: 'Venda', amount: 'R$ 450,00', date: '2023-10-04' },
        { id: 5, user: 'Carlos Rocha', type: 'Compra', amount: 'R$ 100,00', date: '2023-10-05' },
    ];

    // Dados de exemplo para o gerenciamento de pagamentos
    const paymentData = [
        { id: 1, user: 'João Silva', amount: 'R$ 150,00', date: '2023-10-01', status: 'Pendente' },
        { id: 2, user: 'Maria Souza', amount: 'R$ 300,00', date: '2023-10-02', status: 'Pendente' },
        { id: 3, user: 'Pedro Costa', amount: 'R$ 200,00', date: '2023-10-03', status: 'Pendente' },
        { id: 4, user: 'Ana Lima', amount: 'R$ 450,00', date: '2023-10-04', status: 'Pendente' },
        { id: 5, user: 'Carlos Rocha', amount: 'R$ 100,00', date: '2023-10-05', status: 'Pendente' },
    ];

    // Configuração da tabela de histórico
    const columnHelper = createColumnHelper();
    const historyColumns = [
        columnHelper.accessor('user', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">USUÁRIO</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('type', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TIPO</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('amount', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">VALOR</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('date', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('acao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÃO</p>,
            cell: () => (
                <div className="flex space-x-4">
                <button className="text-gray-500 hover:text-gray-700" title="Excluir">
                    <FaTrash />
                </button>
                <button className="text-gray-500 hover:text-gray-700" title="Download">
                    <FaDownload />
                </button>
            </div>
            ),
        }),
    ];

    // Configuração da tabela de gerenciamento de pagamentos
    const paymentColumns = [
        columnHelper.accessor('user', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">USUÁRIO</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('amount', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">VALOR</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('date', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('status', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('acao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÃO</p>,
            cell: () => (
                <div className="flex space-x-3">
                    <button className="text-green-500 hover:text-green-700" title="Aceitar">
                        <FaCheck />
                    </button>
                    <button className="text-red-500 hover:text-red-700" title="Rejeitar">
                        <FaTimes />
                    </button>
                </div>
            ),
        }),
    ];

    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const historyTable = useReactTable({
        data: historyData,
        columns: historyColumns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const paymentTable = useReactTable({
        data: paymentData,
        columns: paymentColumns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Função para alternar a visibilidade da tabela e resetar o estado
    const toggleHistory = () => {
        setShowHistory(!showHistory);
        if (!showHistory) {
            // Resetar o estado da tabela ao abrir
            setSorting([]);
            setPagination({
                pageIndex: 0,
                pageSize: 5,
            });
        }
    };

    return (
        <div className="p-6">
            {/* Exibir tabela de histórico */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Histórico de Compras e Vendas
                    </div>
                </header>

                <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
                    <table className="w-full">
                        <thead>
                            {historyTable.getHeaderGroups().map((headerGroup) => (
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
                            {historyTable.getRowModel().rows.map((row) => (
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

                {/* Controles de paginação */}
                <div className="flex items-center justify-between mt-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                            onClick={() => historyTable.previousPage()}
                            disabled={!historyTable.getCanPreviousPage()}
                        >
                            <FaArrowLeft className="mr-2" /> Anterior
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                            onClick={() => historyTable.nextPage()}
                            disabled={!historyTable.getCanNextPage()}
                        >
                            Próxima <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white">
                        Página {historyTable.getState().pagination.pageIndex + 1} de{" "}
                        {historyTable.getPageCount()}
                    </span>
                </div>
            </Card>

            {/* Gerenciar Pagamentos */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Gerenciar Pagamentos</h2>
                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            Pagamentos Pendentes
                        </div>
                    </header>

                    <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
                        <table className="w-full">
                            <thead>
                                {paymentTable.getHeaderGroups().map((headerGroup) => (
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
                                {paymentTable.getRowModel().rows.map((row) => (
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

                    {/* Controles de paginação */}
                    <div className="flex items-center justify-between mt-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                onClick={() => paymentTable.previousPage()}
                                disabled={!paymentTable.getCanPreviousPage()}
                            >
                                <FaArrowLeft className="mr-2" /> Anterior
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                onClick={() => paymentTable.nextPage()}
                                disabled={!paymentTable.getCanNextPage()}
                            >
                                Próxima <FaArrowRight className="ml-2" />
                            </button>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-white">
                            Página {paymentTable.getState().pagination.pageIndex + 1} de{" "}
                            {paymentTable.getPageCount()}
                        </span>
                    </div>
                </Card>
            </section>

            {/* Configurar Taxas e Comissões */}
            {/* <section>
                <h2 className="text-xl font-semibold mb-4">Configurar Taxas e Comissões</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium mb-2">Definir Taxas e Comissões</h3>
                    <p>Defina as taxas cobradas pela plataforma para empresas ou vendedores.</p>
                    <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Configurar Taxas
                    </button>
                </div>
            </section> */}
        </div>
    );
};

export default Transacao;