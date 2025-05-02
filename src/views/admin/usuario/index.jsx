import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Card from "components/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
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

const personIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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

const GerenciamentoUsuarios = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  const handleUsuarioClick = (usuarioId) => {
    navigate(`/admin/perfiluser/${usuarioId}`);
  };
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
  });
  const fetchUsuarios = async () => {
    try {
      const response = await fetchWithToken(`api/usuarios/?page=${pagination.pageIndex + 1}`, {
        method: 'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar usuários: ${response.status}`);
      }

      const data = await response.json();
      console.log("Usuários carregados:", data);
      setUsuarios(data.results);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.count / prev.pageSize),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [pagination.pageIndex]);

  const usuariosFiltrados = usuarios.filter(user =>
    filtroStatus === "Todos" || user.status === "suspenso"
  );

  const excluirUsuario = (id) => {
    setUsuarios(usuarios.filter((user) => user.user_id !== id));
  };

  const visualizarUsuario = (id) => {
    alert(`Visualizar detalhes do usuário com ID: ${id}`);
  };

  const iniciarEdicao = (id) => {
    const usuario = usuarios.find((user) => user.user_id === id);
    if (usuario) {
      setUsuarioEditando(id);
      setDadosEditados({ ...usuario });
    }
  };

  const salvarEdicao = (id) => {
    const novosUsuarios = usuarios.map((user) =>
      user.user_id === id ? { ...user, ...dadosEditados } : user
    );
    setUsuarios(novosUsuarios);
    setUsuarioEditando(null);
  };

  const cancelarEdicao = () => {
    setUsuarioEditando(null);
  };

  const handleEdicaoChange = (e, campo) => {
    const { value } = e.target;
    setDadosEditados({ ...dadosEditados, [campo]: value });
  };
  const UserMap = ({ usuarios }) => {
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

    const usuariosComCoordenadas = usuarios
      .map((usuario) => {
        const coordenadas = extrairCoordenadas(usuario.endereco);
        return coordenadas ? { ...usuario, ...coordenadas } : null;
      })
      .filter((usuario) => usuario !== null);

    return (
      <MapContainer center={[-8.8383, 13.2344]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {usuariosComCoordenadas.map((usuario) => (
          <Marker key={usuario.user_id} position={[usuario.latitude, usuario.longitude]} onClick={() => handleUsuarioClick(usuario.id)} icon={criarIconeUsuario(usuario.foto)}>
            <Popup  >
              <p className="text-sm text-navy-700 dark:text-white" onClick={() => handleUsuarioClick(usuario.id)}>{usuario.nome}</p> <br /> {usuario.endereco}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("user_id", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
      cell: (info) => <p className="text-sm text-gray-51">{info.getValue()}</p>,
    }),
    columnHelper.accessor("foto", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
      cell: (info) => (
        <img
          src={info.getValue() || "https://via.placeholder.com/150"}
          alt="Foto do usuário"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => handleUsuarioClick(info.row.original.id)}

        />
      ),
    }),
    columnHelper.accessor("nome", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
      cell: (info) =>
        usuarioEditando === info.row.original.user_id ? (
          <input
            type="text"
            value={dadosEditados.nome}
            onChange={(e) => handleEdicaoChange(e, "nome")}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ) : (
          <p className="text-sm font-bold text-gray-20">
            {info.getValue()}
          </p>
        ),
    }),
    columnHelper.accessor("numero_telefone", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TELEFONE</p>,
      cell: (info) =>
        usuarioEditando === info.row.original.user_id ? (
          <input
            type="text"
            value={dadosEditados.numero_telefone}
            onChange={(e) => handleEdicaoChange(e, "numero_telefone")}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ) : (
          <p className="text-sm text-gray-51">{info.getValue() || "N/A"}</p>
        ),
    }),
    columnHelper.accessor("endereco", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ENDEREÇO</p>,
      cell: (info) =>
        usuarioEditando === info.row.original.user_id ? (
          <input
            type="text"
            value={dadosEditados.endereco}
            onChange={(e) => handleEdicaoChange(e, "endereco")}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ) : (
          <p className="text-sm text-gray-51">{info.getValue() || "N/A"}</p>
        ),
    }),
    columnHelper.accessor("saldo", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">SALDO</p>,
      cell: (info) =>
        usuarioEditando === info.row.original.user_id ? (
          <input
            type="number"
            value={dadosEditados.saldo}
            onChange={(e) => handleEdicaoChange(e, "saldo")}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        ) : (
          <p className="text-sm text-gray-51">{info.getValue()?.toFixed(2) || '0.0'} AOA</p>
        ),
    }),
    columnHelper.accessor("status", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
      cell: (info) =>
        usuarioEditando === info.row.original.user_id ? (
          <select
            value={dadosEditados.status}
            onChange={(e) => handleEdicaoChange(e, "status")}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        ) : (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${info.getValue() === "ativo" ? "bg-green-100 text-green-800" :
              info.getValue() === "suspenso" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}
          >
            {info.getValue()}
          </span>
        ),
    }),
    // columnHelper.accessor("acao", {
    //   header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
    //   cell: (info) => (
    //     <div className="flex space-x-4">
    //       {usuarioEditando === info.row.original.user_id ? (
    //         <>
    //           <button
    //             onClick={() => salvarEdicao(info.row.original.user_id)}
    //             className="text-green-500 hover:text-green-700"
    //             title="Salvar"
    //           >
    //             <FaSave />
    //           </button>
    //           <button
    //             onClick={cancelarEdicao}
    //             className="text-red-500 hover:text-red-700"
    //             title="Cancelar"
    //           >
    //             <FaTimes />
    //           </button>
    //         </>
    //       ) : (
    //         <>
    //           <button
    //             onClick={() => iniciarEdicao(info.row.original.user_id)}
    //             className="text-green-500 hover:text-green-700"
    //             title="Editar"
    //           >
    //             <FaEdit />
    //           </button>
    //           <button
    //             onClick={() => excluirUsuario(info.row.original.user_id)}
    //             className="text-red-500 hover:text-red-700"
    //             title="Excluir"
    //           >
    //             <FaTrash />
    //           </button>
    //         </>
    //       )}
    //     </div>
    //   ),
    // }),
  ];

  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

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
          <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
            <header className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Usuários</div>
              <input
                type="text"
                placeholder="Pesquise aqui..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="p-2 border text-navy-700 rounded-lg"
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
          </Card>

          <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
            <div className="text-xl font-bold text-navy-700 dark:text-white mb-4 mt-4">Mapa de Usuários</div>
            <UserMap usuarios={usuarios} />
          </Card>
        </>
      )}
    </div>
  );
};

export default GerenciamentoUsuarios;