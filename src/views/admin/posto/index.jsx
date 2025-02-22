import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const API_BASE_URL = "https://83dc-154-71-159-172.ngrok-free.app";

const GerenciamentoPostos = () => {
    const [postos, setPostos] = useState([]); // Começa vazio
    const [loading, setLoading] = useState(true); // Para indicar carregamento
    // Estado para controlar a exibição do modal de cadastro
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para os campos do formulário de cadastro
    const [novoPosto, setNovoPosto] = useState({
        nome: '',
        criadoPor: '',
        dataCriacao: '',
    });
    const [funcionarios, setFuncionarios] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [postoSelecionado, setPostoSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [proximaPagina, setProximaPagina] = useState(null);
    const [paginaAnterior, setPaginaAnterior] = useState(null);

    const fetchFuncionarios = async (postoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/funcionarios/posto/?posto_id=${postoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar funcionários");
            }

            const data = await response.json();
            setFuncionarios(data.funcionarios || []);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    };


    // Buscar atividades do posto selecionado
    const fetchAtividades = async (postoId, page = 1) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posto/registro/${postoId}/?page=${page}`, {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            console.log(data);
            setAtividades(data.results.latest || []);
            setPaginaAtual(page);
            setProximaPagina(data.next);
            setPaginaAnterior(data.previous);
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
        }
    };


    // Quando o usuário clica em um posto, busca os detalhes
    const selecionarPosto = (posto) => {
        if (postoSelecionado && postoSelecionado.id === posto.id) {
            setPostoSelecionado(null);
            setFuncionarios([]);
            setAtividades([]);
        } else {
            setPostoSelecionado(posto);
            fetchFuncionarios(posto.id);
            fetchAtividades(posto.id);
        }
    };



    // 🔥 Função para buscar postos da API
    const fetchPostos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/postos/`, {
                headers: {
                    "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
                },
            }); // URL da API
            if (!response.ok) {
                throw new Error("Erro ao buscar postos");
            }
            const data = await response.json();
            setPostos(data); // Atualiza o estado com os postos da API
        } catch (error) {
            console.error("Erro ao buscar postos:", error);
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    useEffect(() => {
        fetchPostos();
    }, []);
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
            {loading ? (
                <p>Carregando postos...</p>
            ) : (
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
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Nome</th>
                                    <th className="p-2">Localização</th>
                                    <th className="p-2">Responsável</th>
                                    <th className="p-2">Telefone</th>
                                    <th className="p-2">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postos.map((posto) => (
                                    <React.Fragment key={posto.id}>
                                        <tr
                                            className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                            onClick={() => selecionarPosto(posto)}
                                        >
                                            <td className="p-2">{posto.id}</td>
                                            <td className="p-2">{posto.nome}</td>
                                            <td className="p-2">{posto.localizacao || "Não informado"}</td>
                                            <td className="p-2">{posto.responsavel || "Não informado"}</td>
                                            <td className="p-2">{posto.telefone || "Sem telefone"}</td>
                                            <td className="p-2">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-700">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {postoSelecionado && postoSelecionado.id === posto.id && (
                                            <tr>
                                                <td colSpan="6">
                                                    <div className="p-4 bg-gray-100">
                                                        <h3 className="text-lg font-bold mb-2">Funcionários do Posto</h3>
                                                        <table className="w-full border-collapse border">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border p-2">Nome</th>
                                                                    <th className="border p-2">Nome</th>
                                                                    <th className="border p-2">Email</th>
                                                                    <th className="border p-2">Telefone</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {funcionarios.length > 0 ? (
                                                                    funcionarios.map((func) => (
                                                                        <tr key={func.id}>
                                                                            <td className="border p-2"><img
                                                                                src={`${API_BASE_URL}${func.foto}` || "fallback.jpg"}
                                                                                alt="Produto"
                                                                                className="w-16 h-16 object-cover"
                                                                            />
                                                                            </td>
                                                                            <td className="border p-2">{func.nome}</td>
                                                                            <td className="border p-2">{func.email}</td>
                                                                            <td className="border p-2">{func.numero_telefone}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="3" className="border p-2 text-center">
                                                                            Nenhum funcionário encontrado
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>

                                                        <h3 className="text-lg font-bold mt-4 mb-2">Últimas Atividades</h3>
                                                        <table className="w-full border-collapse border">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border p-2"></th>
                                                                    <th className="border p-2">Produto</th>
                                                                    <th className="border p-2">Preço</th>
                                                                    <th className="border p-2">Tipo</th>

                                                                    <th className="border p-2">Responsável</th>
                                                                    <th className="border p-2">Data</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {atividades.length > 0 ? (
                                                                    atividades.map((atividade, index) => (
                                                                        <tr key={index}>
                                                                            <td className="border p-2"><img
                                                                                src={`${API_BASE_URL}${atividade?.transacao?.lance?.produto?.imagens?.[0]?.imagem}` || "fallback.jpg"}
                                                                                alt="Produto"
                                                                                className="w-16 h-16 object-cover"
                                                                            />
                                                                            </td>

                                                                            <td className="border p-2">{atividade.transacao.lance.produto.nome || "Sem produto"}</td>
                                                                            <td className="border p-2">{atividade.transacao.lance.preco || "Sem preco"} AOA</td>

                                                                            <td className="border p-2">{atividade.tipo || "Sem Tipo"}</td>
                                                                            <td className="border p-2">{atividade.responsavel.nome || "Responsavel"}</td>
                                                                            <td className="border p-2">{new Date(atividade.data_operacao).toLocaleString()}</td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="2" className="border p-2 text-center">
                                                                            Nenhuma atividade recente
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual - 1)}
                                disabled={!paginaAnterior}
                                className={`px-4 py-2 rounded ${paginaAnterior ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            >
                                Página Anterior
                            </button>

                            <span className="px-4 py-2">Página {paginaAtual}</span>

                            <button
                                onClick={() => fetchAtividades(postoSelecionado.id, paginaAtual + 1)}
                                disabled={!proximaPagina}
                                className={`px-4 py-2 rounded ${proximaPagina ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            >
                                Próxima Página
                            </button>
                        </div>

                    </div>
                </Card>)}

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