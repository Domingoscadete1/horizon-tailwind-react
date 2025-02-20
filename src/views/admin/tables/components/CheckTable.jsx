import React from "react";
import Card from "components/card";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importando ícones de setas
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

function CheckTable(props) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Página inicial
    pageSize: 5, // Itens por página
  });

  const navigate = useNavigate();
  let defaultData = tableData;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm cursor-pointer font-bold text-gray-600 dark:text-white">NOME</p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p
            className="cursor-pointer text-sm font-bold text-navy-700 dark:text-white hover:text-brand-500"
            onClick={() => navigate('')} 
          >
            {info.getValue()[0]}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("progress", {
      id: "progress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">EMAIL</p>
      ),
      cell: (info) => (
        <p className="text-sm cursor-pointer font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("quantity", {
      id: "quantity",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NÚMERO</p>
      ),
      cell: (info) => (
        <p className="text-sm cursor-pointer font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">DATA DE NASCIMENTO</p>
      ),
      cell: (info) => (
        <p className="text-sm cursor-pointer font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("acao", {
      id: "acao",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">AÇÃO</p>
      ),
      cell: (info) => (
        <div className="flex items-center space-x-1">
          <button
            className="text-gray-500 hover:text-gray-700"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      ),
    }),
  ];

  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Adiciona suporte à paginação
    debugTable: true,
  });

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Empresas Cadastradas
        </div>
      </header>

      <div className="mt-5 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="min-w-[150px] border-white/0 py-3  pr-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Controles de paginação com setas */}
      <div className="flex items-center justify-between mt-4 mb-4">
        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FaArrowLeft className="mr-2" /> Anterior
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima <FaArrowRight className="ml-2" />
          </button>
        </div>
        <span className="text-sm text-gray-600 dark:text-white">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
      </div>
    </Card>
  );
}

export default CheckTable;