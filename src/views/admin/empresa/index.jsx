import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; // Importação necessária

import Card from 'components/card';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SyncLoader } from 'react-spinners'; // Importe o spinner
import styled from 'styled-components'; // Para estilização adicional


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Fundo semi-transparente */
`;

// Fix para ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const criarIconeUsuario = (fotoUrl) => {
    return new L.Icon({
        iconUrl: fotoUrl || 'https://via.placeholder.com/150', // URL da foto ou imagem padrão
        iconSize: [32, 32], // Tamanho do ícone
        iconAnchor: [16, 32], // Ponto de ancoragem do ícone
        popupAnchor: [0, -32], // Ponto de ancoragem do popup
        className: 'icone-usuario', // Classe CSS personalizada (opcional)
    });
};

const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app";

const GerenciamentoEmpresas = () => {
    const navigate = useNavigate(); // Hook de navegação
    const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`); // Redireciona para o perfil da empresa
    };
    const handleFuncionarioClick = (funcionarioId) => {
        navigate(`/admin/funcionario/${funcionarioId}`); // Redireciona para o perfil da empresa
    };
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [funcionarios, setFuncionarios] = useState([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
    const [nomeEmpresaSelecionada, setNomeEmpresaSelecionada] = useState('');
    const [globalFilter, setGlobalFilter] = useState(''); // Estado para o filtro global

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/empresas`, {
            headers: {
                "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
            },
        })
            .then((response) => response.json())
            .then((data) => setEmpresas(data.results));
    }, []);

    const fetchFuncionarios = (empresaId, empresaNome) => {
        try {
            fetch(`${API_BASE_URL}/api/empresa/funcionarios/${empresaId}/`, {
                headers: {
                    "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFuncionarios(data.funcionarios);
                    setEmpresaSelecionada(empresaId);
                    setNomeEmpresaSelecionada(empresaNome); // Armazena o nome da empresa selecionada
                });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                    src={`${info.getValue()}` || "https://via.placeholder.com/150"}
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
                    className="text-sm font-bold text-blue-500 cursor-pointer hover:underline"
                    onClick={() => fetchFuncionarios(info.row.original.id, info.row.original.nome)}
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
        columnHelper.accessor('saldo', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">SALDO</p>,
            cell: (info) => (
                <p className="text-sm font-bold text-gray-51">
                    {parseFloat(info.getValue()).toFixed(2) | '0'} AOA
                </p>
            ),
        }),
    ];

    const funcionariosColumns = [
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('foto', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
            cell: (info) => (
                <img src={`${API_BASE_URL}${info.getValue()}`} alt="Foto" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => handleFuncionarioClick(info.row.original.id)} />
            ),
        }),
        columnHelper.accessor('usuario_username', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">USUÁRIO</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('email', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">EMAIL</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('role', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">CARGO</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('data_associacao', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA DE ASSOCIAÇÃO</p>,
            cell: (info) => <p className="text-sm text-navy-700 dark:text-white">{new Date(info.getValue()).toLocaleDateString()}</p>,
        }),
        columnHelper.accessor('deleted', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
            cell: (info) => (
                <p className={`text-sm font-bold ${info.getValue() ? 'text-red-500' : 'text-green-500'}`}>
                    {info.getValue() ? "Desativado" : "Ativo"}
                </p>
            ),
        }),
    ];

    const table = useReactTable({
        data: empresas,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Adicionado para suporte a filtros
        state: {
            globalFilter, // Estado do filtro global
        },
        onGlobalFilterChange: setGlobalFilter, // Função para atualizar o filtro global
    });

    const funcionariosTable = useReactTable({
        data: funcionarios,
        columns: funcionariosColumns,
        getCoreRowModel: getCoreRowModel(),
    });
    const EmpresaMap = ({ empresas }) => {
        // Função para extrair latitude e longitude do campo endereco
        const extrairCoordenadas = (endereco) => {
            if (!endereco) return null;

            // Divide o endereco em partes usando a vírgula como separador
            const partes = endereco.split(',');

            // Verifica se há exatamente duas partes (latitude e longitude)
            if (partes.length === 2) {
                const latitude = parseFloat(partes[0].trim());
                const longitude = parseFloat(partes[1].trim());

                // Verifica se os valores são números válidos
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    return { latitude, longitude };
                }
            }

            // Retorna null se as coordenadas não forem válidas
            return null;
        };

        // Filtra usuários com coordenadas válidas
        const empresasComCoordenadas = empresas
            .map((empresa) => {
                const coordenadas = extrairCoordenadas(empresa.endereco);
                return coordenadas ? { ...empresa, ...coordenadas } : null;
            })
            .filter((empresa) => empresa !== null); // Remove usuários sem coordenadas válidas

        return (
            <MapContainer center={[-8.8383, 13.2344]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {empresasComCoordenadas.map((empresa) => (
                    <Marker key={empresa.user_id} position={[empresa.latitude, empresa.longitude]} icon={criarIconeUsuario(empresa.imagens[0].imagem)}>
                        <Popup  >
                            <p className="text-sm text-navy-700 dark:text-white" onClick={() => handleEmpresaClick(empresa.id)}>{empresa.nome}</p> <br /> {empresa.endereco}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        );
    };



    return (
        <div>
            {loading ? (
                <div>
                    <LoaderContainer>
                        <SyncLoader color="#3B82F6" size={15} />
                    </LoaderContainer>
                </div>
            ) : (
                <>
                    <div>
                        <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                            <header className="relative flex items-center justify-between pt-4">
                                <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Empresas</div>
                                <input
                                    type="text"
                                    placeholder="Pesquise aqui..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="p-2 border rounded-lg"
                                />
                            </header>
                            <div className="mt-5 overflow-x-auto">
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

                        {empresaSelecionada && (
                            <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                                <header className="relative flex items-center justify-between pt-4">
                                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                                        Funcionários da Empresa: {nomeEmpresaSelecionada} {/* Exibe o nome da empresa selecionada */}
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


                        )}
                        <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                            <div className="text-xl font-bold text-navy-700 dark:text-white mb-4 mt-4">Mapa de Empresas</div>
                            <EmpresaMap empresas={empresas} />
                        </Card>

                    </div>
                </>
            )}
        </div>
    );
};

export default GerenciamentoEmpresas;