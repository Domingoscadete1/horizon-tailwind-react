import React, { useState } from 'react';
import { FaTrash, FaComment, FaExclamationTriangle, FaCheck, FaReply } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const ModeracaoConteudo = () => {
    // Dados de exemplo para mensagens e conteúdos reportados
    const [mensagens, setMensagens] = useState([
        { id: 1, remetente: 'João Silva', destinatario: 'Empresa A', conteudo: 'Olá, gostaria de mais informações sobre o produto.', status: 'Normal' },
        { id: 2, remetente: 'Maria Souza', destinatario: 'Usuário B', conteudo: 'Este produto é uma fraude!', status: 'Reportado' },
        { id: 3, remetente: 'Carlos Rocha', destinatario: 'Empresa C', conteudo: 'Quando chega o próximo lote?', status: 'Normal' },
    ]);

    const [conteudosReportados, setConteudosReportados] = useState([
        { id: 1, tipo: 'Produto', descricao: 'Produto com descrição enganosa.', motivo: 'Descrição imprópria' },
        { id: 2, tipo: 'Mensagem', descricao: 'Mensagem ofensiva enviada por um usuário.', motivo: 'Linguagem inadequada' },
        { id: 3, tipo: 'Descrição', descricao: 'Descrição contendo informações falsas.', motivo: 'Informação falsa' },
    ]);

    // Estado para gerenciar o chat ativo
    const [chatAtivo, setChatAtivo] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState('');

    // Função para abrir o chat de uma mensagem específica
    const abrirChat = (id) => {
        const mensagem = mensagens.find((msg) => msg.id === id);
        setChatAtivo(mensagem);
    };

    // Função para enviar uma resposta no chat
    const enviarResposta = () => {
        if (!novaMensagem.trim()) {
            alert('Escreva uma mensagem para enviar.');
            return;
        }

        // Simulação de envio de resposta (pode ser integrado com o backend)
        const resposta = {
            id: chatAtivo.id,
            remetente: 'Moderador',
            conteudo: novaMensagem,
            timestamp: new Date().toLocaleTimeString(),
        };

        // Atualiza a mensagem com a resposta
        setMensagens((prev) =>
            prev.map((msg) =>
                msg.id === chatAtivo.id
                    ? { ...msg, respostas: [...(msg.respostas || []), resposta] }
                    : msg
            )
        );

        setNovaMensagem(''); // Limpa o campo de texto
    };

    // Função para marcar uma mensagem como resolvida
    const marcarComoResolvida = (id) => {
        setMensagens((prev) =>
            prev.map((msg) =>
                msg.id === id ? { ...msg, status: 'Resolvido' } : msg
            )
        );
        setChatAtivo(null); // Fecha o chat após marcar como resolvido
        alert(`Mensagem com ID ${id} marcada como resolvida.`);
    };

    // Função para remover uma mensagem
    const removerMensagem = (id) => {
        setMensagens(mensagens.filter((msg) => msg.id !== id));
        alert(`Mensagem com ID ${id} removida com sucesso.`);
    };

    // Função para remover um conteúdo reportado
    const removerConteudo = (id) => {
        setConteudosReportados(conteudosReportados.filter((conteudo) => conteudo.id !== id));
        alert(`Conteúdo com ID ${id} removido com sucesso.`);
    };

    return (
        <div className="p-6">

            {/* Seção de Gerenciamento de Mensagens */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaComment className="inline-block mr-2" />
                        Gerenciar Mensagens
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-left py-2 px-4">Remetente</th>
                                <th className="text-left py-2 px-4">Destinatário</th>
                                <th className="text-left py-2 px-4">Conteúdo</th>
                                <th className="text-left py-2 px-4">Status</th>
                                <th className="text-left py-2 px-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensagens.map((msg) => (
                                <tr key={msg.id} className="border-b border-gray-200">
                                    <td className="py-2 px-4">{msg.remetente}</td>
                                    <td className="py-2 px-4">{msg.destinatario}</td>
                                    <td className="py-2 px-4">{msg.conteudo}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                msg.status === 'Reportado'
                                                    ? 'bg-red-100 text-red-700'
                                                    : msg.status === 'Resolvido'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 flex space-x-4">
                                        <button
                                            onClick={() => abrirChat(msg.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Abrir Chat"
                                        >
                                            <FaComment />
                                        </button>
                                        <button
                                            onClick={() => removerMensagem(msg.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remover Mensagem"
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

            {/* Chat Personalizado */}
            {chatAtivo && (
                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            <FaComment className="inline-block mr-2" />
                            Chat: {chatAtivo.remetente} → {chatAtivo.destinatario}
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
                                <p className="font-bold">{chatAtivo.remetente}:</p>
                                <p>{chatAtivo.conteudo}</p>
                            </div>

                            {/* Exibir respostas */}
                            {chatAtivo.respostas?.map((resposta, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-bold">{resposta.remetente}:</p>
                                    <p>{resposta.conteudo}</p>
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
                                onClick={enviarResposta}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                <FaReply className="mr-2" />
                                Enviar
                            </button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Seção de Conteúdos Reportados */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaExclamationTriangle className="inline-block mr-2" />
                        Conteúdos Reportados
                    </div>
                </header>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-left py-2 px-4">Tipo</th>
                                <th className="text-left py-2 px-4">Descrição</th>
                                <th className="text-left py-2 px-4">Motivo</th>
                                <th className="text-left py-2 px-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conteudosReportados.map((conteudo) => (
                                <tr key={conteudo.id} className="border-b border-gray-200">
                                    <td className="py-2 px-4">{conteudo.tipo}</td>
                                    <td className="py-2 px-4">{conteudo.descricao}</td>
                                    <td className="py-2 px-4">{conteudo.motivo}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => removerConteudo(conteudo.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remover Conteúdo"
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
        </div>
    );
};

export default ModeracaoConteudo;