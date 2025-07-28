import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // Importação necessária

import { FaPlus, FaEdit, FaTrash, FaEye, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import L from 'leaflet';
import { Icon } from "leaflet";
import UpdatePostoModal from "./UpdatePostoModal";
import 'leaflet/dist/leaflet.css';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const postoDeTrocaIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'posto-de-troca-icon',
});

const API_BASE_URL = Config.getApiUrl();

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

    const [postos, setPostos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarMapa, setMostrarMapa] = useState(false);
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
    const [postoSelecionadoinformacao, setPostoSelecionadoInformacao] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [proximaPagina, setProximaPagina] = useState(null);
    const [paginaAnterior, setPaginaAnterior] = useState(null);
    const [mostrarModalFuncionario, setMostrarModalFuncionario] = useState(false);
    const [novoFuncionario, setNovoFuncionario] = useState({
        nome: '',
        email: '',
        numero_telefone: '',
        endereco: '',
        foto: null,
        posto_id: null
    });

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

    const PostoMap = ({ postos }) => {
        const extrairCoordenadas = (localizacao) => {
            if (!localizacao) return null;

            const partes = localizacao.split(',');

            if (partes.length === 2) {
                const latitude = parseFloat(partes[0].trim());
                const longitude = parseFloat(partes[1].trim());

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    return { latitude, longitude };
                }
            }
            return null;
        };

        const postosComCoordenadas = postos
            .map((posto) => {
                const coordenadas = extrairCoordenadas(posto.localizacao);
                return coordenadas ? { ...posto, ...coordenadas } : null;
            })
            .filter((posto) => posto !== null);

        return (
            <MapContainer center={[-8.8383, 13.2344]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {postosComCoordenadas.map((posto) => (
                    <Marker key={posto.id} position={[posto.latitude, posto.longitude]} icon={postoDeTrocaIcon}>
                        <Popup  >
                            <p className="text-sm text-navy-700 dark:text-white" >{posto.nome}</p> <br /> {posto.localizacao}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        );
    };

    const [modalInfo, setModalInfo] = useState(false);

    const fetchFuncionarios = async (postoId) => {
        try {
            const response = await fetchWithToken(`api/funcionarios/posto/?posto_id=${postoId}`, {
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

    const fetchAtividades = async (postoId, page = 1) => {
        try {
            const response = await fetchWithToken(`api/posto/registro/${postoId}/?page=${page}`, {
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

    const selecionarPosto = (posto) => {
        if (postoSelecionado && postoSelecionado.id === posto.id) {
            setPostoSelecionado(null);
            setFuncionarios([]);
            setAtividades([]);
            setMostrarMapa(false);
        } else {
            setPostoSelecionado(posto);
            fetchFuncionarios(posto.id);
            fetchAtividades(posto.id);
            setMostrarMapa(false);
        }
    };

    const fetchPostos = async () => {
        try {
            const response = await fetchWithToken(`api/postos/`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar postos");
            }
            const data = await response.json();
            setPostos(Array.isArray(data) ? data : []);
            console.log(data);
        } catch (error) {
            console.error("Erro ao buscar postos:", error);
            setPostos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostos();
        fetchDados();
    }, []);

    const abrirModal = () => {
        setMostrarModal(true);
    };
    const abrirMapa = () => {

        setMostrarMapa(true);
    };

    const abrirModalInfo = (posto) => {
        setModalInfo(true);
        setPostoSelecionadoInformacao(posto);
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

    const fecharModalInfo = () => {
        setModalInfo(false);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setNovoPosto({ nome: '', criadoPor: '', dataCriacao: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoPosto({ ...novoPosto, [name]: value });
    };

    const cadastrarPosto = async () => {
        if (!novoPosto.nome || !novoPosto.telefone || !novoPosto.email) {
            alert('Preencha todos os campos para cadastrar o posto.');
            return;
        }
        try {
            const response = await fetchWithToken(`api/posto/create/`, {
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
    };

    const editarPosto = (posto) => {
        setPostoSelecionadoUpdate(posto);
        setMostrarModalUpdate(true);
    };

    const visualizarPosto = (id) => {
        const posto = postos.find((p) => p.id === id);
        if (posto) {
            alert(`Visualizar: ${posto.nome}`);
        }
    };

    const excluirPosto = (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este posto?');
        if (confirmacao) {
            const novaLista = postos.filter((p) => p.id !== id);
            setPostos(novaLista);
        }
    };
    const suspenderposto = async (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja suspender este posto?");

        if (!confirmacao) {
            return;
        }
        try {
            const response = await fetchWithToken(`api/posto/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (response.ok) {
                window.location.reload();

            } else {
                alert('Erro ao alterar o status da conta.');
            }
        } catch (error) {
            console.error('Erro ao suspender usuário:', error);
            alert('Erro ao alterar o status da conta.');
        }
    };

    const cadastrarFuncionario = async () => {
        if (!novoFuncionario.nome || !novoFuncionario.email || !novoFuncionario.numero_telefone) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (!postoSelecionado) {
            alert('Selecione um posto primeiro.');
            return;
        }

        const formData = new FormData();
        formData.append('nome', novoFuncionario.nome);
        formData.append('email', novoFuncionario.email);
        formData.append('numero_telefone', novoFuncionario.numero_telefone);
        formData.append('endereco', novoFuncionario.endereco || '');
        formData.append('posto_id', postoSelecionado.id);
        if (novoFuncionario.foto) {
            formData.append('foto', novoFuncionario.foto);
        }

        try {
            const response = await fetchWithToken(`api/funcionario/create/`, {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert('Funcionário cadastrado com sucesso!');
                setMostrarModalFuncionario(false);
                fetchFuncionarios(postoSelecionado.id);
                setNovoFuncionario({
                    nome: '',
                    email: '',
                    numero_telefone: '',
                    endereco: '',
                    foto: null,
                    posto_id: null
                });
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Erro ao cadastrar funcionário.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            alert('Erro ao cadastrar funcionário.');
        }
    };
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setNovoFuncionario({ ...novoFuncionario, foto: e.target.files[0] });
    };
    const handleFuncionarioClick = (funcionarioId) => {
        navigate(`/admin/funcionario-posto/${funcionarioId}`);
    };

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
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">CAPACIDADE</p>,
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
                        onClick={() => abrirModalInfo(info.row.original)}
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
                        onClick={() => suspenderposto(info.row.original.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        }),
    ];

    const funcionariosColumns = [
        columnHelper.accessor('id', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('foto', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
            cell: (info) => (
                <img
                    src={`${Config.getApiUrlMedia()}${info.getValue()}`}
                    alt="Funcionário"
                    className="w-10 h-10 cursor-pointer rounded-full object-cover"
                    onClick={() => handleFuncionarioClick(info.row.original.id)}
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
                        src={`${Config.getApiUrlMedia()}${imageUrl}`}
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

    const table = useReactTable({
        data: postos,
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
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const atividadesTable = useReactTable({
        data: atividades,
        columns: atividadesColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
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
                <header className="relative flex flex-col md:flex-row items-center justify-between pt-4 gap-4">
                    <div className="text-xl md:text-xl font-bold text-navy-700 dark:text-white text-center md:text-left">
                        Lista de Postos Registrados
                    </div>
                    <div className="text-xl md:text-xl font-bold text-navy-700 dark:text-white text-center md:text-left">
                        Total de Postos - {dados?.postos_total}
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquise aqui..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full md:w-auto p-2 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border-b dark:border-gray-600 py-3 px-3 sm:px-4 text-start text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                        >
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
                                        <td
                                            key={cell.id}
                                            className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap"
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

            {postoSelecionado && postoSelecionado.id && (
                <div>
                    {funcionarios.length >= 0 && (
                        <Card extra="w-full h-full p-4 sm:p-6 mt-4 sm:mt-6 mb-4 sm:mb-6">
                            <header className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-4">
                                <div className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                                    Funcionários do Posto
                                </div>

                                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={globalFilter}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="w-full sm:w-48 p-2 border rounded-lg text-sm dark:bg-navy-800 dark:border-gray-600 dark:text-white"
                                    />

                                    <button
                                        onClick={() => setMostrarModalFuncionario(true)}
                                        className="bg-brand-900 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
                                    >
                                        <FaPlus className="mr-1 sm:mr-2" size={14} />
                                        <span>Adicionar</span>
                                        <span className="hidden sm:inline ml-1">Funcionário</span>
                                    </button>
                                </div>
                            </header>

                            <div className="mt-4 sm:mt-6 overflow-x-auto">
                                <table className="w-full min-w-[600px] sm:min-w-full">
                                    <thead>
                                        {funcionariosTable.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="border-b dark:border-gray-600 py-3 px-3 sm:px-4 text-start text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {funcionariosTable.getRowModel().rows.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-navy-600/50">
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap"
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

                    {atividades.length > 0 && (
                        <Card extra="w-full h-full p-4 sm:p-6 mt-4 sm:mt-6 mb-4 sm:mb-6">
                            <div className="mt-2 sm:mt-3">
                                <header className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2 sm:pt-4 pb-4">
                                    <div className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
                                        Últimas Actividades
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nome..."
                                        value={globalFilter}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="w-full sm:w-64 p-2 border rounded-lg text-sm dark:bg-navy-800 dark:border-gray-600 dark:text-white"
                                    />
                                </header>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] sm:min-w-full">
                                        <thead>
                                            {atividadesTable.getHeaderGroups().map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <th
                                                            key={header.id}
                                                            className="border-b dark:border-gray-600 py-3 px-3 sm:px-4 text-start text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                            {atividadesTable.getRowModel().rows.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-navy-600/50">
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap"
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginação */}
                                <div className="flex justify-center mt-6 sm:mt-10 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <button
                                            onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual - 1)}
                                            disabled={!paginaAnterior}
                                            className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full flex items-center gap-1 ${paginaAnterior
                                                ? "bg-brand-900 text-white hover:bg-brand-800"
                                                : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">Anterior</span>
                                        </button>

                                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-2">
                                            Página {paginaAtual}
                                        </span>

                                        <button
                                            onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual + 1)}
                                            disabled={!proximaPagina}
                                            className={`px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full flex items-center gap-1 ${proximaPagina
                                                ? "bg-brand-900 text-white hover:bg-brand-800"
                                                : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <span className="hidden sm:inline">Próxima</span>
                                            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={abrirMapa}
                    className="bg-brand-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6 mr-5"
                >
                    {/* <FaPlus className="mr-2" /> */}
                    Mostrar Mapa
                </button>
                <button
                    onClick={abrirModal}
                    className="bg-brand-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6"
                >
                    <FaPlus className="mr-2" />
                    Cadastrar Posto
                </button>
            </div>

            {/* Modal de Informação de Posto */}
            {modalInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70 dark:bg-opacity-70 p-4 sm:p-6">
                    <div className="bg-white rounded-lg w-full max-w-md mx-auto overflow-hidden shadow-xl">
                        <header className="flex justify-between items-start p-4 sm:p-6 border-b">
                            <div className="flex-1">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Informações do Posto</h2>
                                <h3 className="text-md sm:text-lg font-semibold text-gray-700 mt-1">{postoSelecionadoinformacao.nome}</h3>
                            </div>
                            <button
                                onClick={fecharModalInfo}
                                className="text-gray-500 hover:text-gray-700 ml-4"
                                aria-label="Fechar modal"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </header>

                        <div className="p-4 sm:p-6">
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={`${postoSelecionadoinformacao.imagem}`}
                                    alt={`Imagem do posto ${postoSelecionadoinformacao.nome}`}
                                    className="max-h-60 sm:max-h-80 w-auto rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalFuncionario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-navy-700">
                                Adicionar Funcionário ao Posto: {postoSelecionado?.nome}
                            </h2>
                            <button
                                onClick={() => setMostrarModalFuncionario(false)}
                                className="text-navy-700 hover:text-blue-700"
                            >
                                <FaTimes />
                            </button>
                        </header>

                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={novoFuncionario.nome}
                                    onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={novoFuncionario.email}
                                    onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Telefone *
                                </label>
                                <input
                                    type="tel"
                                    name="numero_telefone"
                                    value={novoFuncionario.numero_telefone}
                                    onChange={(e) => setNovoFuncionario({ ...novoFuncionario, numero_telefone: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    name="endereco"
                                    value={novoFuncionario.endereco}
                                    onChange={(e) => setNovoFuncionario({ ...novoFuncionario, endereco: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Foto
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setMostrarModalFuncionario(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={cadastrarFuncionario}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mostrarMapa && (
                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                    <div className="text-xl font-bold text-navy-700 dark:text-white mb-4 mt-5">Mapa de Postos</div>
                    <PostoMap postos={postos} />
                </Card>

            )}
            {mostrarModalUpdate && (
                <UpdatePostoModal
                    postoParaEditar={postoSelecionadoUpdate}
                    atualizarPostoNaAPI={fetchPostos}
                    onClose={() => setMostrarModalUpdate(false)}
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