import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Card from "components/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app/api/usuarios/";

const GerenciamentoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Funções para gerenciar usuários
  const excluirUsuario = (id) => {
    setUsuarios(usuarios.filter((user) => user.id !== id));
  };

  const visualizarUsuario = (id) => {
    alert(`Visualizar detalhes do usuário com ID: ${id}`);
  };

  const editarUsuario = (id) => {
    alert(`Editar usuário com ID: ${id}`);
  };

  // Configuração da tabela
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("user_id", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
      cell: (info) => <p className="text-sm text-gray-500">{info.getValue()}</p>,
    }),
    columnHelper.accessor("foto", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">FOTO</p>,
      cell: (info) => (
        <img
          src={info.getValue() || "https://via.placeholder.com/150"} // URL da foto ou imagem padrão
          alt="Foto do usuário"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    }),
    columnHelper.accessor("nome", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NOME</p>,
      cell: (info) => <p className="text-sm font-bold text-blue-500 cursor-pointer hover:underline">{info.getValue()}</p>,
    }),
    columnHelper.accessor("numero_telefone", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">TELEFONE</p>,
      cell: (info) => <p className="text-sm text-gray-500">{info.getValue() || "N/A"}</p>,
    }),
    columnHelper.accessor("endereco", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ENDEREÇO</p>,
      cell: (info) => <p className="text-sm text-gray-500">{info.getValue() || "N/A"}</p>,
    }),
    columnHelper.accessor("saldo", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">SALDO</p>,
      cell: (info) => <p className="text-sm text-gray-500">KZ {info.getValue()?.toFixed(2)}</p>,
    }),
    columnHelper.accessor("status", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p>,
      cell: (info) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            info.getValue() === "Ativo" ? "bg-green-100 text-green-800" :
            info.getValue() === "Inativo" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("acao", {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÕES</p>,
      cell: (info) => (
        <div className="flex space-x-4">
          {/* <button
            onClick={() => visualizarUsuario(info.row.original.id)}
            className="text-blue-500 hover:text-blue-700"
            title="Visualizar"
          >
            <FaEye />
          </button> */}
          <button
            onClick={() => editarUsuario(info.row.original.id)}
            className="text-green-500 hover:text-green-700"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => excluirUsuario(info.row.original.id)}
            className="text-red-500 hover:text-red-700"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {/* Exibir indicador de carregamento */}
      {loading ? (
        <p className=" mt-10 text-center text-gray-500">Carregando usuários...</p>
      ) : (
        <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
          <header className="relative flex items-center justify-between pt-4">
            <div className="text-xl font-bold text-navy-700 dark:text-white">Lista de Usuários</div>
          </header>

          <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
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
      )}
    </div>
  );
};

export default GerenciamentoUsuarios;