import React, { useState } from 'react';
import { FaHeadset, FaComments, FaStar, FaThumbsUp, FaPaperPlane, FaCheck, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const SuporteCliente = () => {
    // Estado para gerenciar solicitações de suporte
    const [solicitacoes, setSolicitacoes] = useState([
        {
            id: 1,
            usuario: 'João Silva',
            tipo: 'Dúvida',
            mensagem: 'Como faço para rastrear meu pedido?',
            status: 'Pendente',
            chat: [],
        },
        {
            id: 2,
            usuario: 'Maria Souza',
            tipo: 'Problema',
            mensagem: 'Meu produto chegou danificado.',
            status: 'Pendente',
            chat: [],
        },
        {
            id: 3,
            usuario: 'Pedro Costa',
            tipo: 'Disputa',
            mensagem: 'O vendedor não enviou o produto.',
            status: 'Resolvido',
            chat: [],
        },
    ]);

    // Estado para gerenciar feedbacks
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, produto: 'Smartphone XYZ', vendedor: 'TechStore', avaliacao: 4, comentario: 'Ótimo produto, entrega rápida.' },
        { id: 2, produto: 'Notebook ABC', vendedor: 'EletroShop', avaliacao: 2, comentario: 'Produto veio com defeito.' },
        { id: 3, produto: 'Fone de Ouvido', vendedor: 'AudioPlus', avaliacao: 5, comentario: 'Excelente qualidade de som.' },
    ]);

    // Estado para gerenciar o chat ativo
    const [chatAtivo, setChatAtivo] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState('');

    // Função para abrir o chat de uma solicitação
    const abrirChat = (id) => {
        const solicitacao = solicitacoes.find((s) => s.id === id);
        setChatAtivo(solicitacao);
    };

    // Função para enviar uma mensagem no chat
    const enviarMensagem = () => {
        if (!novaMensagem.trim()) {
            alert('Escreva uma mensagem para enviar.');
            return;
        }

        // Adiciona a nova mensagem ao chat da solicitação ativa
        const novaResposta = {
            remetente: 'Atendente',
            mensagem: novaMensagem,
            timestamp: new Date().toLocaleTimeString(),
        };

        setSolicitacoes((prev) =>
            prev.map((solicitacao) =>
                solicitacao.id === chatAtivo.id
                    ? { ...solicitacao, chat: [...solicitacao.chat, novaResposta] }
                    : solicitacao
            )
        );

        setNovaMensagem(''); // Limpa o campo de texto
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
                                    <td className="py-2 px-4">{solicitacao.usuario}</td>
                                    <td className="py-2 px-4">{solicitacao.tipo}</td>
                                    <td className="py-2 px-4">{solicitacao.mensagem}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                solicitacao.status === 'Pendente'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {solicitacao.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 flex space-x-4">
                                        <button
                                            onClick={() => abrirChat(solicitacao.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Abrir Chat"
                                        >
                                            <FaComments />
                                        </button>
                                        <button
                                            onClick={() => removerSolicitacao(solicitacao.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remover Solicitação"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Seção de Chat Personalizado */}
            {chatAtivo && (
                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            <FaComments className="inline-block mr-2" />
                            Chat de Suporte: {chatAtivo.usuario}
                        </div>
                        <button
                            onClick={() => marcarComoResolvida(chatAtivo.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                        >
                            <FaCheck className="mr-2" />
                            Marcar como Resolvido
                        </button>
                    </header>

                    <div className="mt-5">
                        <div className="border rounded-lg p-4 h-64 overflow-y-auto">
                            {/* Exibir a mensagem original */}
                            <div className="mb-4">
                                <p className="font-bold">{chatAtivo.usuario}:</p>
                                <p>{chatAtivo.mensagem}</p>
                            </div>

                            {/* Exibir respostas */}
                            {chatAtivo.chat.map((resposta, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-bold">{resposta.remetente}:</p>
                                    <p>{resposta.mensagem}</p>
                                    <p className="text-xs text-gray-500">{resposta.timestamp}</p>
                                </div>
                            ))}
                        </div>

                        {/* Campo para enviar nova mensagem */}
                        <div className="mt-4 mb-5 flex space-x-2">
                            <input
                                type="text"
                                value={novaMensagem}
                                onChange={(e) => setNovaMensagem(e.target.value)}
                                placeholder="Digite sua resposta..."
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={enviarMensagem}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <FaPaperPlane className="mr-2" />
                                Enviar
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Seção de Acompanhamento de Feedbacks */}
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
            </Card>
        </div>
    );
};

export default SuporteCliente;