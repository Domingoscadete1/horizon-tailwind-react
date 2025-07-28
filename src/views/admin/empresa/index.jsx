import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
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
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const criarIconeUsuario = (fotoUrl) => {
    return new L.Icon({
        iconUrl: fotoUrl || 'https://via.placeholder.com/150',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'icone-usuario',
    });
};

const API_BASE_URL = Config.getApiUrl();

const GerenciamentoEmpresas = () => {
    const navigate = useNavigate();
    const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`);
    };
    const handleFuncionarioClick = (funcionarioId) => {
        navigate(`/admin/funcionario/${funcionarioId}`);
    };
    const mediaUrl = Config.getApiUrlMedia();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [funcionarios, setFuncionarios] = useState([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
    const [nomeEmpresaSelecionada, setNomeEmpresaSelecionada] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        fetchWithToken(`api/empresas`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((response) => response.json())
            .then((data) => setEmpresas(data.results || []));
    }, []);
    const [dados, setDados] = useState();
    const obterDataAtual = () => {
      const data = new Date();
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    };
    const dataAtual = obterDataAtual();
  
    const fetchDados = async () => {
      try {
        const response = await fetchWithToken(`api/admin-analise?data=${dataAtual}`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar postos");
        }
        const data = await response.json();
        console.log(data);
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar postos:", error);
        setDados([]);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
        fetchDados();
    }, []);
    
    const fetchFuncionarios = (empresaId, empresaNome) => {
        try {
            fetchWithToken(`api/empresa/funcionarios/${empresaId}/`, {
                method: 'GET',
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFuncionarios(data.funcionarios);
                    setEmpresaSelecionada(empresaId);
                    setNomeEmpresaSelecionada(empresaNome);
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
                    {new Intl.NumberFormat('pt-AO', {
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(info.getValue() | 0)} AOA
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
                <img src={`${mediaUrl}${info.getValue()}`} alt="Foto" className="w-10 h-10 rounded-full cursor-pointer" onClick={() => handleFuncionarioClick(info.row.original.id)} />
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
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const funcionariosTable = useReactTable({
        data: funcionarios,
        columns: funcionariosColumns,
        getCoreRowModel: getCoreRowModel(),
    });
    const EmpresaMap = ({ empresas }) => {

        const extrairCoordenadas = (endereco) => {
            if (!endereco) return null;

            const partes = endereco.split(',');

            if (partes.length === 2) {
                const latitude = parseFloat(partes[0].trim());
                const longitude = parseFloat(partes[1].trim());

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    return { latitude, longitude };
                }
            }
            return null;
        };

        const empresasComCoordenadas = empresas
            .map((empresa) => {
                const coordenadas = extrairCoordenadas(empresa.endereco);
                return coordenadas ? { ...empresa, ...coordenadas } : null;
            })
            .filter((empresa) => empresa !== null);

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

            <div>
                <div className="flex flex-col gap-4 p-2 sm:p-4">
                    <Card extra="w-full h-full overflow-x-auto p-4 sm:p-6">
                        <header className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between pt-2 sm:pt-4">
                            <h1 className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                                Lista de Empresas
                            </h1>
                            <h1 className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                                Total De Empresas{dados?.empresas_total}
                            </h1>
                            <div className="w-full sm:w-64">
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
                                                    className="border-b py-3 px-3 text-start text-sm sm:text-base whitespace-nowrap"
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
                                            className="transition-colors"
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

                    {empresaSelecionada && (
                        <Card extra="w-full h-full overflow-x-auto p-4 sm:p-6 mt-4">
                            <header className="pt-2 sm:pt-4">
                                <h2 className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                                    Funcionários da Empresa: {nomeEmpresaSelecionada}
                                </h2>
                            </header>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        {funcionariosTable.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="border-b py-3 px-3 text-start text-sm sm:text-base whitespace-nowrap"
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {funcionariosTable.getRowModel().rows.map((row) => (
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
                    )}
                </div>

                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                    <div className="text-xl font-bold text-navy-700 dark:text-white mb-4 mt-4">Mapa de Empresas</div>
                    <EmpresaMap empresas={empresas} />
                </Card>

            </div>
        </div>
    );
};

export default GerenciamentoEmpresas;