import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaBriefcase, FaCalendar, FaEdit, FaSave } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import { SyncLoader } from 'react-spinners'; // Importe o spinner
import styled from 'styled-components'; // Para estilização adicional


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Fundo semi-transparente */
`;

const API_BASE_URL = "https://fad7-154-71-159-172.ngrok-free.app";

const PerfilFuncionario = () => {
    // Estado para controlar o modo de edição
    const [editando, setEditando] = useState(false);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [dadosFuncionario, setDadosFuncionario] = useState(null);
    const [novaFoto, setNovaFoto] = useState(null);

    // Estado para armazenar os dados do funcionário
    // const [dadosFuncionario, setDadosFuncionario] = useState({
    //     nome: 'João Silva',
    //     email: 'joao.silva@empresa.com',
    //     telefone: '(11) 98765-4321',
    //     endereco: 'Rua Exemplo, 123, São Paulo - SP',
    //     cargo: 'Desenvolvedor Front-end da empresa: Kipungo Corp',
    //     departamento: 'Tecnologia',
    //     dataAdmissao: '2020-05-15',
    //     foto: 'https://i1.sndcdn.com/artworks-MICz28u7gUgjVqeV-PwRvkw-t500x500.jpg', // URL da foto de perfil
    // });
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/empresa-usuario/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                setDadosFuncionario(data);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };



        const fetchData = async () => {
            await fetchUsuario();
            setLoading(false); // Agora só desativa o loading após buscar os dados
        };

        fetchData();
    }, [id]);

    if (loading) {
        <LoaderContainer>
            <SyncLoader color="#3B82F6" size={15} />
        </LoaderContainer>
    }

    if (!dadosFuncionario) {
        return <div className="mt-10 text-center text-gray-500">Usuário não encontrado</div>;
    }

    // Estado para armazenar a nova foto de perfil

    // Função para alternar o modo de edição
    const toggleEdicao = () => {
        setEditando(!editando);
    };

    // Função para salvar as alterações
    const salvarAlteracoes = () => {
        if (novaFoto) {
            setDadosFuncionario({ ...dadosFuncionario, foto: URL.createObjectURL(novaFoto) });
            setNovaFoto(null);
        }
        setEditando(false);
    };

    // Função para lidar com a mudança nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosFuncionario({ ...dadosFuncionario, [name]: value });
    };

    // Função para lidar com o upload da foto
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovaFoto(file);
        }
    };

    return (
        <div className="p-3">

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
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
                        {dadosFuncionario.usuario_username}
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
                                            value={dadosFuncionario.email}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={dadosFuncionario.telefone}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapMarker className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={dadosFuncionario.endereco}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
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
                                            value={dadosFuncionario.role}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="departamento"
                                            value={dadosFuncionario.empresa_nome}
                                            onChange={handleInputChange}
                                            disabled
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaCalendar className="text-gray-500 mr-2" />
                                        <input
                                            type="date"
                                            name="dataAdmissao"
                                            value={dadosFuncionario.data_associacao}
                                            onChange={handleInputChange}
                                            disabled
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${editando ? 'bg-white' : 'bg-gray-100'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Editar/Salvar */}
                    <div className="mt-6 flex justify-end">
                        {editando ? (
                            <button
                                onClick={salvarAlteracoes}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6"
                            >
                                <FaSave className="mr-2" />
                                Salvar
                            </button>
                        ) : (
                            <button
                                onClick={toggleEdicao}
                                className="bg-blue-500 mb-4 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PerfilFuncionario;