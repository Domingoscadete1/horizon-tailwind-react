import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import Card from 'components/card';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

const API_BASE_URL = Config.getApiUrl();

const EmpresasParaAprovar = () => {
    const mediaUrl = Config.getApiUrlMedia();
    const navigate = useNavigate();
    const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`);
    };
    const [empresas, setEmpresas] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    useEffect(() => {
        fetchWithToken(`api/listar-empreasa-nao-vericadas/`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((response) => response.json())
            .then((data) => setEmpresas(data.empresas || []));

    }, []);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) =>
                <p className="text-sm text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>,
        }),
        columnHelper.accessor(row => row.imagens?.[0]?.imagem, {
            id: "imagem_produto",
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
            cell: (info) => (
                <img
                    src={`${mediaUrl}${info.getValue()}` || "https://via.placeholder.com/150"}
                    alt="Foto da Empresa"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => handleEmpresaClick(info.row.original.id)}
                />
            ),
        }),
        columnHelper.accessor('nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
            cell: (info) => (
                <p
                    className="text-sm font-bold text-navy-51"
                >
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor('categoria', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">CATEGORIA</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('endereco', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ENDEREÇO</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('email', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">EMAIL</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('telefone1', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TELEFONE 1</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('created_at', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA DE SOLICITAÇÃO</p>,
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700">
                    {info.getValue()}
                </p>
            ),
        }),
    ];

    const table = useReactTable({
        data: empresas,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });


    return (
        <div className="p-4">
            <Card extra="w-full h-full p-4 sm:p-6 overflow-x-auto">
                <header className="relative flex flex-col gap-4 sm:flex-row sm:items-center justify-between pt-2 sm:pt-4">
                    <div className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                        Pendentes de Aprovação
                    </div>

                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Pesquise aqui..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full p-2 border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </header>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border-b py-2 px-3 text-start text-sm sm:text-base whitespace-nowrap"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className=" transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="py-3 px-3 text-sm sm:text-base"
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

export default EmpresasParaAprovar;