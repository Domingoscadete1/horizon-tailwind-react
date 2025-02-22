import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const GerenciamentoPostos = () => {
    // Estado para gerenciar a lista de postos
    const [postos, setPostos] = useState([
        { id: 1, nome: 'Posto A', criadoPor: 'Admin', dataCriacao: '2023-10-01' },
        { id: 2, nome: 'Posto B', criadoPor: 'Gerente', dataCriacao: '2023-10-05' },
    ]);

    // Estado para controlar a exibição do modal de cadastro
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para os campos do formulário de cadastro
    const [novoPosto, setNovoPosto] = useState({
        nome: '',
        criadoPor: '',
        dataCriacao: '',
    });

    // Função para abrir o modal de cadastro
    const abrirModal = () => {
        setMostrarModal(true);
    };

    // Função para fechar o modal de cadastro
    const fecharModal = () => {
        setMostrarModal(false);
        setNovoPosto({ nome: '', criadoPor: '', dataCriacao: '' }); // Limpa o formulário
    };

    // Função para lidar com a mudança nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoPosto({ ...novoPosto, [name]: value });
    };

    // Função para cadastrar um novo posto
    const cadastrarPosto = () => {
        if (!novoPosto.nome || !novoPosto.criadoPor || !novoPosto.dataCriacao) {
            alert('Preencha todos os campos para cadastrar o posto.');
            return;
        }

        const novoId = postos.length + 1; // Gera um novo ID
        const posto = { id: novoId, ...novoPosto };
        setPostos([...postos, posto]); // Adiciona o novo posto à lista
        fecharModal(); // Fecha o modal após o cadastro
    };

    // Função para editar um posto
    const editarPosto = (id) => {
        const posto = postos.find((p) => p.id === id);
        if (posto) {
            alert(`Editar posto: ${posto.nome}`);
            // Aqui você pode abrir um modal ou formulário para edição
        }
    };

    // Função para excluir um posto
    const excluirPosto = (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este posto?');
        if (confirmacao) {
            const novaLista = postos.filter((p) => p.id !== id);
            setPostos(novaLista);
        }
    };

    return (
        <div className="p-2">
            {/* Tabela de postos registrados */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Lista de Postos Registrados
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    ID
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    Nome do Posto
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    Criado Por
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    Data de Criação
                                </th>
                                <th className="text-sm font-bold text-gray-600 dark:text-white text-left p-2">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {postos.map((posto) => (
                                <tr key={posto.id} className="border-b border-gray-200">
                                    <td className="p-2">{posto.id}</td>
                                    <td className="p-2 text-sm font-bold text-blue-500 cursor-pointer hover:underline">{posto.nome}</td>
                                    <td className="p-2">{posto.criadoPor}</td>
                                    <td className="p-2">{posto.dataCriacao}</td>
                                    <td className="p-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => editarPosto(posto.id)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => excluirPosto(posto.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Botão para abrir o modal de cadastro */}
            <div className="flex justify-end">
                <button
                    onClick={abrirModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center mb-6"
                >
                    <FaPlus className="mr-2" />
                    Cadastrar Posto
                </button>
            </div>

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
                                    Criado Por
                                </label>
                                <input
                                    type="text"
                                    name="criadoPor"
                                    value={novoPosto.criadoPor}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Admin"
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Data de Criação
                                </label>
                                <input
                                    type="date"
                                    name="dataCriacao"
                                    value={novoPosto.dataCriacao}
                                    onChange={handleInputChange}
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
        </div>
    );
};

export default GerenciamentoPostos;