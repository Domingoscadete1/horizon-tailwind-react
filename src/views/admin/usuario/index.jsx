import React, { useState, useEffect,useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import Card from "components/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom"; // Importação necessária
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const personIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // URL da imagem do ícone
  iconSize: [32, 32], // Tamanho do ícone
  iconAnchor: [16, 32], // Ponto de ancoragem do ícone
  popupAnchor: [0, -32], // Ponto de ancoragem do popup
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
const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app/api/usuarios/";

const GerenciamentoUsuarios = () => {
  const navigate = useNavigate(); // Hook de navegação
  const [globalFilter, setGlobalFilter] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("Todos"); // Filtro de status


  // Estado para controlar qual usuário está sendo editado
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Estado para armazenar os dados temporários durante a edição
  const [dadosEditados, setDadosEditados] = useState({});
  const handleUsuarioClick = (usuarioId) => {
    navigate(`/admin/perfiluser/${usuarioId}`); // Redireciona para o perfil da empresa
  };
  // Fetch dos usuários
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar usuários: ${response.status}`);
      }

      const data = await response.json();
      console.log("Usuários carregados:", data);
      setUsuarios(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);
  const usuariosFiltrados = usuarios.filter(user =>
    filtroStatus === "Todos" || user.status === "suspenso"
  );
  // Funções para gerenciar usuários
  const excluirUsuario = (id) => {
    setUsuarios(usuarios.filter((user) => user.user_id !== id));
  };

  const visualizarUsuario = (id) => {
    alert(`Visualizar detalhes do usuário com ID: ${id}`);
  };

  // Função para iniciar a edição de um usuário
  const iniciarEdicao = (id) => {
    const usuario = usuarios.find((user) => user.user_id === id);
    if (usuario) {
      setUsuarioEditando(id);
      setDadosEditados({ ...usuario }); // Copia os dados do usuário para edição
    }
  };

  // Função para salvar as alterações de um usuário
  const salvarEdicao = (id) => {
    const novosUsuarios = usuarios.map((user) =>
      user.user_id === id ? { ...user, ...dadosEditados } : user
    );
    setUsuarios(novosUsuarios); // Atualiza a lista de usuários
    setUsuarioEditando(null); // Sai do modo de edição
  };

  // Função para cancelar a edição
  const cancelarEdicao = () => {
    setUsuarioEditando(null); // Sai do modo de edição
  };

  // Função para lidar com a mudança nos campos de edição
  const handleEdicaoChange = (e, campo) => {
    const { value } = e.target;
    setDadosEditados({ ...dadosEditados, [campo]: value });
  };
  const UserMap = ({ usuarios }) => {
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
    const usuariosComCoordenadas = usuarios
      .map((usuario) => {
        const coordenadas = extrairCoordenadas(usuario.endereco);
        return coordenadas ? { ...usuario, ...coordenadas } : null;
      })
      .filter((usuario) => usuario !== null); // Remove usuários sem coordenadas válidas
  
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

  // Configuração da tabela
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
          src={info.getValue() || "https://via.placeholder.com/150"} // URL da foto ou imagem padrão
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
          <p className="text-sm font-bold text-gray-20 cursor-pointer hover:underline">
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
    getFilteredRowModel: getFilteredRowModel(), // Adicionado para suporte a filtros
    state: {
      globalFilter, // Estado do filtro global
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      {/* Exibir indicador de carregamento */}
      {loading ? (
        <p className="mt-10 text-center text-gray-500">Carregando usuários...</p>
      ) : (
        <>
          <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
            <header className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Usuários</div>
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </header>

            {/* Adicionando scroll horizontal à tabela */}
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
          </Card>

          <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
            <div className="text-xl font-bold text-navy-700 dark:text-white mb-4">Mapa de Usuários</div>
            <UserMap usuarios={usuarios} />
          </Card>
        </>

      )}
    </div>
  );
};

export default GerenciamentoUsuarios;