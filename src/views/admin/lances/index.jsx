import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaEye, FaTrash, FaPlus, FaLock } from "react-icons/fa";
import Card from 'components/card';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import { fetchWithToken } from '../../../authService';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;

const LancesList = () => {
  const [lances, setLances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [formData, setFormData] = useState({ senha: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedLance, setSelectedLance] = useState(null);
  const [estadoProduto, setEstadoProduto] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5, totalPages: 1 });

  useEffect(() => {
    fetchLances();
  }, [pagination.pageIndex]);

  const fetchLances = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(`api/lances/?page=${pagination.pageIndex + 1}`, {
        method: 'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) throw new Error('Falha ao carregar lances');

      const data = await response.json();
      setLances(data.results || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.count / prev.pageSize),
      }));
    } catch (error) {
      console.error("Erro ao buscar lances:", error);
      setError('Erro ao carregar lances');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken('api/admins/verificar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ senha: formData.senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro na verificação');
      }

      setSuccess('Identidade verificada com sucesso!');
      setShowVerifyModal(false);
      setFormData({ ...formData, senha: '' });
      setShowDenyModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDenyLance = async () => {
    try {
      const fd = new FormData();
      fd.append('lance_id', selectedLance.id);
      fd.append('posto_id', selectedLance.posto.id);
      //fd.append('funcionario_id', selectedLance.posto.funcionario.id);
      fd.append('estado_produto', estadoProduto);
      fd.append('observacoes', observacoes);
      console.log(fd);

      if (selectedImage) {
        fd.append('imagem', selectedImage);
      }

      const response = await fetchWithToken('api/posto/negar-produto/', {
        method: 'POST',
        body: fd,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Falha ao negar produto');
      }

      setSuccess('Produto negado com sucesso!');
      fetchLances();
      setShowDenyModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const prepareDenyLance = (lance) => {
    setSelectedLance(lance);
    setShowVerifyModal(true);
  };

  const columnHelper = createColumnHelper();
  const columns = [
    {
        accessorKey: "id",
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
        cell: ({ row }) => (
          <p className="text-sm text-gray-500">
            {row.original.id || 'N-A'}
          </p>
        ),
      },
    columnHelper.accessor(row => row.produto?.imagens?.[0]?.imagem, {
      id: "imagem_produto",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IMAGEM</p>,
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <img
            src={`${imageUrl}`}
            alt="Produto"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <p className="text-xs text-gray-500">Sem imagem</p>
        );
      },
    }),
    {
      accessorKey: "usuario.username",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">USUÁRIO</p>,
      cell: ({ row }) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {row.original.usuario?.username || row.original?.empresa_compradora?.nome|| 'N/A'}
        </p>
      ),
    },
    {
      accessorKey: "produto.nome",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">PRODUTO</p>,
      cell: ({ row }) => (
        <p className="text-sm text-gray-500">
          {row.original.produto?.nome || 'N/A'}
        </p>
      ),
    },
    {
      accessorKey: "preco",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">PREÇO</p>,
      cell: ({ row }) => (
        <p className="text-sm text-gray-500">
          {parseFloat(row.getValue("preco")).toFixed(2)} AOA
        </p>
      ),
    },
    {
      accessorKey: "quantidade",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">QUANTIDADE</p>,
      cell: ({ row }) => (
        <p className="text-sm text-gray-500">
          {row.original.quantidade || '1'}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          {row.getValue("status") === 'aceite' ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
          <p className="text-sm text-gray-500">{row.getValue("status")}</p>
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATA</p>,
      cell: ({ row }) => (
        <p className="text-sm text-gray-500">
          {new Date(row.getValue("created_at")).toLocaleDateString()}
        </p>
      ),
    },
    {
      id: "acoes",
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
      cell: ({ row }) => (
        <div className="flex gap-2 space-x-4">
          <button
            onClick={() => prepareDenyLance(row.original)}
            className="text-red-500 hover:text-red-700"
            title="Negar lance"
          >
            <FaTimesCircle />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: lances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading && lances.length === 0) {
    return (
      <LoaderContainer>
        <SyncLoader color="#3B82F6" size={15} />
      </LoaderContainer>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
          <button onClick={() => setSuccess(null)} className="float-right font-bold">
            ×
          </button>
        </div>
      )}

      <Card extra="w-full h-full sm:overflow-auto px-6 mt-6 mb-6">
        <header className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Lances</div>
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))}
            disabled={pagination.pageIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            <FaArrowLeft /> Anterior
          </button>
          <span>Página {pagination.pageIndex + 1} de {pagination.totalPages}</span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.min(prev.pageIndex + 1, prev.totalPages - 1) }))}
            disabled={pagination.pageIndex >= pagination.totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Próxima <FaArrowRight />
          </button>
        </div>
      </Card>

      {/* Modal de Verificação */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Verificar Identidade</h3>
            <p className="mb-4">Digite sua senha de administrador para confirmar esta ação:</p>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Sua senha"
              autoComplete="current-password"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setFormData({ senha: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyAdmin}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              >
                {loading ? <SyncLoader color="#fff" size={8} /> : <><FaLock className="mr-2" /> Verificar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Negar Lance */}
      {showDenyModal && selectedLance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h3 className="text-xl font-semibold mb-4">Negar Recebimento do Produto</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <p><strong>Produto:</strong> {selectedLance?.produto?.nome || 'N/A'}</p>
              <p><strong>Comprador:</strong> {selectedLance?.usuario?.username || selectedLance?.empresa_compradora?.nome || 'N/A'}</p>
              <p><strong>Posto:</strong> {selectedLance?.posto?.nome || 'N/A'}</p>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estado do Produto *</label>
                <textarea
                  value={estadoProduto}
                  onChange={(e) => setEstadoProduto(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Descreva o estado do produto recebido"
                  required
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Adicione observações relevantes"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Foto do Estado do Produto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500"
                  capture="environment"
                />
                <p className="text-xs text-gray-500 mt-1">Recomendado tirar foto do produto no estado atual</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button 
                onClick={() => {
                  setShowDenyModal(false);
                  setEstadoProduto('');
                  setObservacoes('');
                  setSelectedImage(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDenyLance} 
                disabled={!estadoProduto}
                className={`px-4 py-2 text-white rounded-md ${!estadoProduto ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
              >
                Confirmar Negação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LancesList;