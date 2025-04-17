import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaBriefcase, FaCalendar, FaEdit, FaSave,FaTrash } from 'react-icons/fa';
import Card from 'components/card';
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

const PerfilFuncionario2 = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [dadosFuncionario, setDadosFuncionario] = useState([]);
    const [novaFoto, setNovaFoto] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


    const toggleEdicao = () => {
        setEditando(!editando);
    };

    const salvarAlteracoes = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            
            formData.append('nome', dadosFuncionario.nome);
            formData.append('endereco', dadosFuncionario.endereco);
            formData.append('numero_telefone', dadosFuncionario.numero_telefone);
            formData.append('posto_id', dadosFuncionario.posto.id);
            
            if (novaFoto) {
                formData.append('foto', novaFoto);
            }

            const response = await fetchWithToken(`api/funcionario/${id}/atualizar/`, {
                method: "PUT",
                body: formData,
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erro ao atualizar funcionário");
            }

            setSuccess("Funcionário atualizado com sucesso!");
            setEditando(false);
            setNovaFoto(null);
            await fetchFuncionario(); 
        } catch (error) {
            console.error("Erro:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteFuncionario = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`api/funcionario/${id}/deletar/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erro ao deletar funcionário");
            }

            setSuccess("Funcionário deletado com sucesso!");
            
            setTimeout(() => {
                window.history.back(); 
            }, 1500);
        } catch (error) {
            console.error("Erro:", error);
            setError(error.message);
        } finally {
            setLoading(false);
            setShowDeleteConfirmation(false);
        }
    };
    const confirmDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosFuncionario(prev => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovaFoto(file);
        }
    };

    const fetchFuncionario = async () => {
        try {
            const response = await fetchWithToken(`api/funcionario/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setDadosFuncionario(data || []);
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            setError("Erro ao carregar dados do funcionário");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchFuncionario();
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <LoaderContainer>
                <SyncLoader color="#3B82F6" size={15} />
            </LoaderContainer>
        );
    }

    return (
        <div>
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
                        <p className="mb-6">Tem certeza que deseja deletar o funcionário {dadosFuncionario.nome}? Esta ação não pode ser desfeita.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteFuncionario}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                            >
                                {loading ? (
                                    <SyncLoader color="#ffffff" size={8} />
                                ) : (
                                    <>
                                        <FaTrash className="mr-2" />
                                        Deletar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}
                
                <div className="flex flex-col items-center mt-5">
                    {/* Foto de Perfil */}
                    <div className="relative">
                        <img
                            src={novaFoto ? URL.createObjectURL(novaFoto) : dadosFuncionario.foto}
                            alt="Foto de Perfil"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        {editando && (
                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    className="hidden"
                                />
                                <FaEdit />
                            </label>
                        )}
                    </div>

                    {/* Nome do Funcionário */}
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white mt-4">
                        {editando ? (
                            <input
                                type="text"
                                name="nome"
                                value={dadosFuncionario.nome || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg focus:outline-none bg-white"
                            />
                        ) : (
                            dadosFuncionario.nome
                        )}
                    </h2>

                    {/* Informações Pessoais e Profissionais */}
                    <div className="w-full mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Informações Pessoais */}
                            <div>
                                <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-4">
                                    Informações Pessoais
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-500 mr-2" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={dadosFuncionario.email || ''}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="numero_telefone"
                                            value={dadosFuncionario.numero_telefone || ''}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapMarker className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={dadosFuncionario.endereco || ''}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informações Profissionais */}
                            <div>
                                <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-4">
                                    Informações Profissionais
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaBriefcase className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="cargo"
                                            value={dadosFuncionario.posto?.nome || ''}
                                            disabled // Posto shouldn't be editable here
                                            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="departamento"
                                            value={dadosFuncionario.departamento || ''}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendar className="text-gray-500 mr-2" />
                                        <input
                                            type="date"
                                            name="data_de_registro"
                                            value={dadosFuncionario.data_de_registro || ''}
                                            disabled // Registration date shouldn't be editable
                                            className="w-full p-2 border rounded-lg focus:outline-none bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Editar/Salvar */}
                    <div className="flex space-x-4 mt-6 mb-5">
                        {editando ? (
                            <button
                                onClick={salvarAlteracoes}
                                disabled={loading}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                            >
                                {loading ? (
                                    <SyncLoader color="#ffffff" size={8} />
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        Salvar
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={toggleEdicao}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Editar Perfil
                            </button>
                        )}
                        {!editando && (
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                            >
                                <FaTrash className="mr-2" />
                                Deletar
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PerfilFuncionario2;