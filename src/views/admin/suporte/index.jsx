import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaComments, FaStar, FaThumbsUp, FaPaperPlane, FaCheck, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import axios from 'axios';

import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';
const API_BASE_URL = Config.getApiUrl();

const SuporteCliente = () => {
    // Estado para gerenciar solicitações de suporte
    const wssUrl=Config.getApiUrlWs()
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const socketRef = useRef(null);
    const [funcionarioId, setfuncionarioId] = useState('');

    // Estado para gerenciar feedbacks
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, produto: 'Smartphone XYZ', vendedor: 'TechStore', avaliacao: 4, comentario: 'Ótimo produto, entrega rápida.' },
        { id: 2, produto: 'Notebook ABC', vendedor: 'EletroShop', avaliacao: 2, comentario: 'Produto veio com defeito.' },
        { id: 3, produto: 'Fone de Ouvido', vendedor: 'AudioPlus', avaliacao: 5, comentario: 'Excelente qualidade de som.' },
    ]);

    // Estado para gerenciar o chat ativo
    const [chatAtivo, setChatAtivo] = useState(null);

    // Função para abrir o chat de uma solicitação
    useEffect(() => {
        const token = localStorage.getItem('userData');
        if (token) {
            const userData = JSON.parse(token);
            const postoId = userData.id;
            console.log(userData);
            if (postoId) {
                setfuncionarioId(postoId);
            }
        }
    }, []);

    // Função para enviar uma mensagem no chat
    useEffect(() => {
        // Carregar lista de solicitações de suporte
        fetchWithToken(`api/chats-suporte/`, {
            method:'GET',
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        })
            .then(response => response.json())  
            .then(data => {
                const data1 = data.results || []; // Armazena a resposta na variável
                console.log("Resposta da API:", data1); // Log para debug
                setSolicitacoes(data1); // Atualiza o estado
            })
            .catch(error => console.error('Erro ao buscar chats:', error));
    }, []);

    const abrirChat = (chat) => {
        fetchWithToken(`api/chat-suporte/mensagens/${chat.id}/`, {
            method:'GET',
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        })
            .then(response => response.json()) 
            .then(data => {
                console.log("Mensagens carregadas:", data);
                setChatAtivo({
                    ...chat,
                    mensagens: data.mensagens || [] 
                });
                conectarWebSocket(chat);
            })
            .catch(error => {
                console.error("Erro ao buscar mensagens do chat:", error);
                setChatAtivo({
                    ...chat,
                    mensagens: []
                });
            });
    };


    const conectarWebSocket = (chat) => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        var socketUrl='';

        if (chat.empresa_nome){
            socketUrl = `wss://${wssUrl}/ws/suporte/empresa/${chat.id}/`;

        }
        else{
            socketUrl = `wss://${wssUrl}/ws/suporte/usuario/${chat.id}/`;

        }
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onmessage = (event) => {
            const novaMensagem = JSON.parse(event.data);
            console.log("Nova mensagem recebida:", novaMensagem);

            setChatAtivo((prevChat) => {
                if (!prevChat || !prevChat.mensagens) {
                    console.error("Chat não encontrado!");
                    return prevChat;
                }

                return {
                    ...prevChat,
                    mensagens: [
                        ...prevChat.mensagens,
                        {
                            //id: novaMensagem.id, // Especifique as chaves necessárias
                            conteudo: novaMensagem.message, // Aqui pegamos a chave correta da nova mensagem
                            remetente: novaMensagem.remetente, // Supondo que exista um usuário associado
                            //timestamp: novaMensagem.timestamp, // Se houver um timestamp
                        },
                    ],
                };
            });
        };
    };

    const enviarMensagem = () => {
        if (novaMensagem.trim() && socketRef.current) {
            const mensagemData = { mensagem: novaMensagem, funcionario_id: funcionarioId, chat_id: chatAtivo.id };
            socketRef.current.send(JSON.stringify(mensagemData));
            setNovaMensagem('');
        }
    };
    // Função para marcar uma solicitação como resolvida
    const marcarComoResolvida = (id) => {
        setSolicitacoes((prev) =>
            prev.map((solicitacao) =>
                solicitacao.id === id ? { ...solicitacao, status: 'Resolvido' } : solicitacao
            )
        );
        setChatAtivo(null); // Fecha o chat após marcar como resolvido
        alert(`Solicitação com ID ${id} marcada como resolvida.`);
    };

    // Função para remover uma solicitação
    const removerSolicitacao = (id) => {
        setSolicitacoes(solicitacoes.filter((solicitacao) => solicitacao.id !== id));
        alert(`Solicitação com ID ${id} removida com sucesso.`);
    };

    return (
        <div className="p-6">

            {/* Seção de Gerenciamento de Solicitações de Suporte */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaComments className="inline-block mr-2" />
                        Solicitações de Suporte
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-left py-2 px-4">Usuário</th>
                                <th className="text-left py-2 px-4">Tipo</th>
                                <th className="text-left py-2 px-4">Mensagem</th>
                                <th className="text-left py-2 px-4">Status</th>
                                <th className="text-left py-2 px-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitacoes.map((solicitacao) => (
                                <tr key={solicitacao.id} className="border-b border-gray-200">
                                    <td className="py-2 px-4">{solicitacao.empresa_nome || solicitacao.empresa?.nome || solicitacao.usuario_nome}</td>
                                    <td className="py-2 px-4">{solicitacao.created_at}</td>
                                    <td className="py-2 px-4 flex space-x-4">
                                        <button
                                            onClick={() => abrirChat(solicitacao)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Abrir Chat"
                                        >
                                            <FaComments />
                                        </button>
                                        {/* <button
                                            onClick={() => removerSolicitacao(solicitacao.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remover Solicitação"
                                        >
                                            <FaTrash />
                                        </button> */}
                                    </td>
                                    <td className="py-2 px-4">
                                        {/* <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                solicitacao.status === 'Pendente'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {solicitacao.status}
                                        </span> */}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Seção de Chat Personalizado */}
            {chatAtivo && (
                <Card extra="w-full h-full sm:overflow-auto px-6 mt-2 mb-6">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            Chat com {chatAtivo.usuario}
                        </div>
                    </header>
                    <div className="mt-5 h-64 overflow-y-auto border rounded-lg p-4">
                        {chatAtivo.mensagens.map((msg, index) => (
                            <div key={index} className="mb-4">
                                <p className="font-bold">{msg.remetente}:</p>
                                <p>{msg.conteudo}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 mb-5 flex space-x-4">
                        <input
                            type="text"
                            value={novaMensagem}
                            onChange={(e) => setNovaMensagem(e.target.value)}
                            className='p-2 w-full border rounded-lg focus:outline-none text-navy-700 focus:ring-2 focus:ring-brand-500'
                            placeholder="Digite sua resposta..."
                        />
                        <button onClick={enviarMensagem} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                            <FaPaperPlane className="mr-2" /> Enviar
                        </button>
                    </div>
                </Card>
            )}

            {/* Seção de Acompanhamento de Feedbacks
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaStar className="inline-block mr-2" />
                        Feedbacks de Produtos e Vendedores
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-left py-2 px-4">Produto</th>
                                <th className="text-left py-2 px-4">Vendedor</th>
                                <th className="text-left py-2 px-4">Avaliação</th>
                                <th className="text-left py-2 px-4">Comentário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <tr key={feedback.id} className="border-b border-gray-200">
                                    <td className="py-2 px-4">{feedback.produto}</td>
                                    <td className="py-2 px-4">{feedback.vendedor}</td>
                                    <td className="py-2 px-4">
                                        {Array.from({ length: feedback.avaliacao }, (_, i) => (
                                            <FaStar key={i} className="text-yellow-500 inline-block" />
                                        ))}
                                    </td>
                                    <td className="py-2 px-4">{feedback.comentario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card> */}
        </div>
    );
};

export default SuporteCliente;