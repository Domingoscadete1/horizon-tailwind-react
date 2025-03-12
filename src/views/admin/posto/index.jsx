import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { Icon } from "leaflet";
import UpdatePostoModal from "./UpdatePostoModal";


import "leaflet/dist/leaflet.css"; // Importa os estilos do Leaflet corretamente

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';

const API_BASE_URL = "https://fad7-154-71-159-172.ngrok-free.app";

const customIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMarker = ({ position }) => {
    return position ? (
        <Marker position={position} icon={customIcon}>
            <Popup>Localização Selecionada</Popup>
        </Marker>
    ) : null;
};
const GerenciamentoPostos = () => {
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(false);
    const [postoSelecionadoUpdate, setPostoSelecionadoUpdate] = useState(null);

    const [postos, setPostos] = useState([]); // Começa vazio
    const [loading, setLoading] = useState(true); // Para indicar carregamento
    const [mostrarModal, setMostrarModal] = useState(false);
    const [novoPosto, setNovoPosto] = useState({
        nome: '',
        localizacao: '',
        imagem: '',
        horario: '',
        responsavel: '',
        telefone: '',
        email: '',
        capacidade: '',

    });
    const [globalFilter, setGlobalFilter] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [postoSelecionado, setPostoSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [proximaPagina, setProximaPagina] = useState(null);
    const [paginaAnterior, setPaginaAnterior] = useState(null);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [openMapModal, setOpenMapModal] = useState(false);
    const MapWithInvalidate = ({ location }) => {
        const map = useMap();

        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }, [map]);

        return null;
    };



    const [modalInfo, setModalInfo] = useState(false);

    const fetchFuncionarios = async (postoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/funcionarios/posto/?posto_id=${postoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar funcionários");
            }

            const data = await response.json();
            setFuncionarios(Array.isArray(data.funcionarios) ? data.funcionarios : []);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            setFuncionarios([]);
        }
    };
    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            },
        });

        return location ? (
            <Marker position={[location.lat, location.lng]} icon={L.icon({
                iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            })} />
        ) : null;
    }
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        }
    }, []);


    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setNovoPosto((prev) => ({ ...prev, localizacao: `${latitude}, ${longitude}` }));
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        } else {
            alert('Geolocalização não é suportada pelo seu navegador.');
        }
    };



    // Buscar atividades do posto selecionado
    const fetchAtividades = async (postoId, page = 1) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posto/registro/${postoId}/?page=${page}`, {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            console.log(data);
            setAtividades(Array.isArray(data.results.latest) ? data.results.latest : []);
            setPaginaAtual(page);
            setProximaPagina(data.next);
            setPaginaAnterior(data.previous);
            setTotalPages(Math.ceil(data.count / data.results.length));
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
            setAtividades([]);

        }
    };


    // Quando o usuário clica em um posto, busca os detalhes
    const selecionarPosto = (posto) => {
        if (postoSelecionado && postoSelecionado.id === posto.id) {
            setPostoSelecionado(null);
            setFuncionarios([]);
            setAtividades([]);
        } else {
            setPostoSelecionado(posto);
            fetchFuncionarios(posto.id);
            fetchAtividades(posto.id);
        }
    };

    // 🔥 Função para buscar postos da API
    const fetchPostos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/postos/`, {
                headers: {
                    "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
            }); // URL da API
            if (!response.ok) {
                throw new Error("Erro ao buscar postos");
            }
            const data = await response.json();
            setPostos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar postos:", error);
            setPostos([]);
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    useEffect(() => {
        fetchPostos();
    }, []);

    // Função para abrir o modal de cadastro
    const abrirModal = () => {
        setMostrarModal(true);
    };

    // Função para abrir o modal de cadastro
    const abrirModalInfo = () => {
        setModalInfo(true);
    };

    const handleOpenMapModal = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setOpenMapModal(true);
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                    setOpenMapModal(true);
                }
            );
        } else {
            setOpenMapModal(true);
        }
    };
    // Função para fechar o modal de cadastro
    const fecharModalInfo = () => {
        setModalInfo(false);
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
    const cadastrarPosto = async () => {
        if (!novoPosto.nome || !novoPosto.telefone || !novoPosto.email) {
            alert('Preencha todos os campos para cadastrar o posto.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/posto/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(novoPosto),
            });

            if (response.ok) {
                const updatedEmpresa = await response.json();
                fecharModal();
                window.location.reload();
            } else {
                alert('Erro ao atualizar os dados da empresa.');
            }
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            alert('Erro ao atualizar os dados da empresa.');
        }
        // const novoId = postos.length + 1; // Gera um novo ID
        // const posto = { id: novoId, ...novoPosto };
        // setPostos([...postos, posto]); // Adiciona o novo posto à lista
        //  // Fecha o modal após o cadastro
    };

    // Função para editar um posto
    const editarPosto = (posto) => {
        setPostoSelecionadoUpdate(posto);
        setMostrarModalUpdate(true);
    };

    const visualizarPosto = (id) => {
        const posto = postos.find((p) => p.id === id);
        if (posto) {
            alert(`Visualizar: ${posto.nome}`);
            // Aqui você pode abrir um modal ou formulário para edição
        }
    };

    // Função para excluir um posto
    const excluirPosto = (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este posto?');
        if (confirmacao) {
            const novaLista = postos.filter((p) => p.id !== id);
            setPostos(novaLista);
        }
    };
    

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
        columnHelper.accessor('capacidade', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Capacidade</p>,
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
                        onClick={abrirModalInfo}
                        className="text-blue-500 hover:text-blue-700"
                        title="Visualizar"
                    >
                        <FaEye />
                    </button>
                    <button
                        onClick={() => editarPosto(info.row.original)}
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
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) => info.getValue(),
        }),
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
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor(row => row.transacao?.lance?.produto?.imagens?.[0]?.imagem, {
            id: "imagem_produto", // Adicione um ID único
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGEM DO PRODUTO</p>,
            cell: (info) => {
                const imageUrl = info.getValue();
                return imageUrl ? (
                    <img
                        src={`${API_BASE_URL}${imageUrl}`}
                        alt="Produto"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <p className="text-xs text-gray-500">Sem imagem</p>
                );
            },
        }),

        columnHelper.accessor('transacao.lance.produto.nome', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME DO PRODUTO</p>,
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
        getFilteredRowModel: getFilteredRowModel(), // Adicionado para suporte a filtros
        state: {
            globalFilter, // Estado do filtro global
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const funcionariosTable = useReactTable({
        data: funcionarios,
        columns: funcionariosColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Adicionado para suporte a filtros
        state: {
            globalFilter, // Estado do filtro global
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const atividadesTable = useReactTable({
        data: atividades,
        columns: atividadesColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Adicionado para suporte a filtros
        state: {
            globalFilter, // Estado do filtro global
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const handleConfirmLocation = () => {
        setNovoPosto((prev) => ({
            ...prev,
            localizacao: `${location.lat}, ${location.lng}`,
        }));
        setOpenMapModal(false);
    };

    return (
        <div className="p-2">

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Postos Registrados
                    </div>
                    <input
                        type="text"
                        placeholder="Filtrar por nome..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded-lg"
                    />
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="border-b text-start p-2">
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

            {postoSelecionado && postoSelecionado.id && (
                <div>
                    {funcionarios.length > 0 && (
                        <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                            <header className="relative flex items-center justify-between pt-4">
                                <div className="text-xl font-bold text-navy-700 dark:text-white">
                                    Funcionários do Posto
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filtrar por nome..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="p-2 border rounded-lg"
                                />
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

                    {atividades.length > 0 && (
                        <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
                            <div className="mt-5 overflow-x-auto">
                                <header className="relative mb-6 flex items-center justify-between pt-4">
                                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                                        Últimas Actividades
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={globalFilter}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="p-2 border rounded-lg"
                                    />
                                </header>
                                <table className="w-full">
                                    <thead>
                                        {atividadesTable.getHeaderGroups().map((headerGroup) => (
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
                                        {atividadesTable.getRowModel().rows.map((row) => (
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
                                <div className="flex justify-center mt-10 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual - 1)}
                                            disabled={!paginaAnterior}
                                            className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${paginaAnterior === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <FaArrowLeft className="w-20" />
                                        </button>

                                        <span className="text-sm text-gray-600 dark:text-white">
                                            Página {paginaAtual}
                                        </span>

                                        <button
                                            onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual + 1)}
                                            disabled={!proximaPagina}
                                            className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${proximaPagina ? "bg-blue-500 text-white" : ""}`}
                                        >
                                            <FaArrowRight className="w-20" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}

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

            {/* Modal de Informação de Posto */}
            {modalInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-navy-700">Informações do Posto</h2>

                            <button
                                onClick={fecharModalInfo}
                                className="text-navy-700 hover:text-blue-700"
                                title="Visualizar"
                            >
                                <FaTimes />
                            </button>
                        </header>
                    </div>
                </div>

            )}
            {mostrarModalUpdate && (
                <UpdatePostoModal
                    postoParaEditar={postoSelecionadoUpdate}
                    atualizarPostoNaAPI={fetchPostos}
                    onClose={() => setMostrarModalUpdate(false)} // Passa a função para fechar o modal
                />
            )}

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
                                    Localização
                                </label>
                                <button
                                    onClick={handleGetCurrentLocation}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Localização atual
                                </button>
                                <button
                                    onClick={handleOpenMapModal}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Escolher no mapa
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    imagem
                                </label>
                                <input
                                    type="file"
                                    name="imagem"
                                    value={novoPosto.imagem}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Imagem"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Horário
                                </label>
                                <input
                                    type="text"
                                    name="horario"
                                    value={novoPosto.horario}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Responsavel
                                </label>
                                <input
                                    type="text"
                                    name="responsavel"
                                    value={novoPosto.responsavel}
                                    onChange={handleInputChange}
                                    placeholder="Ex: José"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Telefone
                                </label>
                                <input
                                    type="number"
                                    name="telefone"
                                    value={novoPosto.telefone}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 922333444"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={novoPosto.email}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Email"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Capacidade
                                </label>
                                <input
                                    type="number"
                                    name="capacidade"
                                    value={novoPosto.capacidade}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Admin"
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

            {/* Modal de Escolha de Localização */}
            {openMapModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="bg-white shadow-lg p-4 rounded-md w-[600px] h-[500px] flex flex-col relative"
                    >
                        <header className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-navy-700">Escolha a Localização</h2>
                            <button
                                onClick={() => setOpenMapModal(false)}
                                className="text-navy-700 hover:text-blue-700"
                                title="Fechar"
                            >
                                <FaTimes />
                            </button>
                        </header>

                        {/* Contêiner fixo para o mapa */}
                        <div className="flex-grow relative overflow-hidden rounded-md">
                            <MapContainer
                                center={location}
                                zoom={13}
                                className="w-full h-full"
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker position={location} />
                                <MapWithInvalidate />
                            </MapContainer>
                        </div>

                        <button
                            onClick={handleConfirmLocation}
                            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                        >
                            Confirmar Localização
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GerenciamentoPostos;