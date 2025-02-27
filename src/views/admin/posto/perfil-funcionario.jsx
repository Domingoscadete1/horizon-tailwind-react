import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaBriefcase, FaCalendar, FaEdit, FaSave } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const PerfilFuncionario = () => {
    // Estado para controlar o modo de edição
    const [editando, setEditando] = useState(false);

    // Estado para armazenar os dados do funcionário
    const [dadosFuncionario, setDadosFuncionario] = useState({
        nome: 'João Silva',
        email: 'joao.silva@empresa.com',
        telefone: '(11) 98765-4321',
        endereco: 'Rua Exemplo, 123, São Paulo - SP',
        cargo: 'Desenvolvedor Front-end',
        departamento: 'Tecnologia',
        dataAdmissao: '2020-05-15',
        foto: 'https://i.pinimg.com/originals/e0/63/97/e063975655d0cff787fbb4a789adcb50.png', // URL da foto de perfil
    });

    // Estado para armazenar a nova foto de perfil
    const [novaFoto, setNovaFoto] = useState(null);

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
        <div>

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
                        {dadosFuncionario.nome}
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
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
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
                                            value={dadosFuncionario.endereco}
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
                                            value={dadosFuncionario.cargo}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <FaUser className="text-gray-500 mr-2" />
                                        <input
                                            type="text"
                                            name="departamento"
                                            value={dadosFuncionario.departamento}
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
                                            name="dataAdmissao"
                                            value={dadosFuncionario.dataAdmissao}
                                            onChange={handleInputChange}
                                            disabled={!editando}
                                            className={`w-full p-2 border rounded-lg focus:outline-none ${
                                                editando ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Editar/Salvar */}
                    <div className="mt-6">
                        {editando ? (
                            <button
                                onClick={salvarAlteracoes}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                            >
                                <FaSave className="mr-2" />
                                Salvar
                            </button>
                        ) : (
                            <button
                                onClick={toggleEdicao}
                                className="bg-blue-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
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