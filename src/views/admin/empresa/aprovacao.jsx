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
            <Card extra="w-full h-full sm:overflow-auto p-6">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Pendentes de Aprovação
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquise aqui..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border text-gray-700 rounded-lg"
                    />
                </header>

                <div className="mt-5">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
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
        </div>
    );
};

export default EmpresasParaAprovar;