import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Card from "components/card";
import axios from "axios";
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

const API_BASE_URL = Config.getApiUrl();

const UsuariosBloqueados = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    imagem: null,
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(categorias.length / itemsPerPage);
  const paginatedCategorias = categorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchCategorias = async () => {
    try {
      const response = await fetchWithToken(`api/categorias/`, {
        method: 'GET',
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await response.json();
      setCategorias(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const openModal = (categoria = null) => {
    setCurrentCategoria(categoria);
    setFormData({
      nome: categoria ? categoria.nome : "",
      descricao: categoria ? categoria.descricao : "",
      imagem: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategoria(null);
    setFormData({ nome: "", descricao: "", imagem: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagem") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("nome", formData.nome);
    formDataToSend.append("descricao", formData.descricao);
    if (formData.imagem) {
      formDataToSend.append("imagem", formData.imagem);
    }

    try {
      if (currentCategoria) {
        await fetchWithToken(`api/categoria/${currentCategoria.id}/atualizar/`, {
          method: 'PUT',
          headers: { "ngrok-skip-browser-warning": "true" },
          body: formDataToSend,
        });
      } else {
        await fetchWithToken(`api/categoria/create/`, {
          method: 'POST',
          headers: { "ngrok-skip-browser-warning": "true" },
          body: formDataToSend,
        });
      }
      fetchCategorias();
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta categoria?");
    if (!confirmacao) {
      setLoading(false);
      return;
    }

    try {
      await fetchWithToken(`api/categoria/${id}/deletar/`, {
        method: 'DELETE',
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      fetchCategorias();
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card extra="w-full h-full sm:overflow-auto p-6">
        <div className="relative flex items-center justify-between pt-2 sm:pt-4">
          <header className="text-lg sm:text-xl font-bold text-navy-700 dark:text-white">
            Gerenciamento de Categorias
          </header>
        </div>

        <div className="mt-5">
          {loading ? (
            <LoaderContainer>
              <SyncLoader color="#3B82F6" size={15} />
            </LoaderContainer>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="!border-px !border-gray-400">
                      <th className="text-start py-2">Nome</th>
                      <th className="text-start py-2">Descrição</th>
                      <th className="text-start py-2">Imagem</th>
                      <th className="text-start py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCategorias.map((categoria) => (
                      <tr key={categoria.id} className="border-b border-gray-200">
                        <td className="py-3">{categoria.nome}</td>
                        <td className="py-3">{categoria.descricao}</td>
                        <td className="py-3">
                          {categoria.imagem && (
                            <img
                              src={categoria.imagem}
                              alt={categoria.nome}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => openModal(categoria)}
                            className="text-green-500 hover:text-green-700 mr-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(categoria.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => openModal()}
          className="bg-brand-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6"
        >
          <FaPlus className="mr-2" /> Adicionar Categoria
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70 p-4">
          <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-1/3">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {currentCategoria ? "Editar Categoria" : "Adicionar Categoria"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Imagem</label>
                  <input
                    type="file"
                    name="imagem"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mt-1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 order-2 sm:order-1 sm:mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-lg hover:bg-brand-800 order-1 sm:order-2"
                  >
                    {currentCategoria ? "Salvar" : "Adicionar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosBloqueados;
