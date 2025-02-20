import React, { useState } from 'react';
import { FaTag, FaBullhorn, FaPaperPlane } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const PromocoesMarketing = () => {
    // Estado para gerenciar descontos e ofertas
    const [desconto, setDesconto] = useState('');
    const [condicoes, setCondicoes] = useState('');
    const [imagem, setImagem] = useState(null); // Estado para armazenar a imagem selecionada
    const [imagemPreview, setImagemPreview] = useState(null); // Estado para exibir a prévia da imagem
    const [mensagem, setMensagem] = useState('');

    // Função para criar uma campanha promocional
    const criarCampanha = () => {
        if (!desconto || !condicoes || !imagem) {
            alert('Preencha todos os campos e adicione uma imagem para criar a campanha.');
            return;
        }
        alert(`Campanha criada com sucesso!\nDesconto: ${desconto}\nCondições: ${condicoes}`);
        setDesconto('');
        setCondicoes('');
        setImagem(null);
        setImagemPreview(null);
    };

    // Função para lidar com o upload da imagem
    const handleImagemChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setImagemPreview(URL.createObjectURL(file)); // Cria uma URL para a prévia da imagem
        }
    };

    const enviarNotificacao = () => {
        if (!mensagem) {
            alert('Escreva uma mensagem para enviar a notificação.');
            return;
        }
        alert(`Notificação enviada com sucesso!\nMensagem: ${mensagem}`);
        setMensagem('');
    };

    return (
        <div className="p-6">

            {/* Seção de Campanhas Promocionais */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaTag className="inline-block mr-2" />
                        Criar Campanhas Promocionais
                    </div>
                </header>

                <div className="mt-5">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Desconto ou Oferta
                        </label>
                        <input
                            type="text"
                            value={desconto}
                            onChange={(e) => setDesconto(e.target.value)}
                            placeholder="Ex: 10% de desconto"
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Condições da Promoção
                        </label>
                        <textarea
                            value={condicoes}
                            onChange={(e) => setCondicoes(e.target.value)}
                            placeholder="Ex: Válido apenas para compras acima de 10.000Kzs"
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={3}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Imagem da Campanha
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagemChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {imagemPreview && (
                            <div className="mt-4">
                                <img
                                    src={imagemPreview}
                                    alt="Prévia da Imagem"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={criarCampanha}
                        className="bg-green-500 mb-6 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <FaTag className="mr-2" />
                        Criar Campanha
                    </button>
                </div>
            </Card>

            {/* Seção de Notificações em Massa */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaBullhorn className="inline-block mr-2" />
                        Enviar Notificações
                    </div>
                </header>

                <div className="mt-5">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Mensagem
                        </label>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Ex: Nova promoção disponível! Aproveite agora."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <button
                        onClick={enviarNotificacao}
                        className="bg-blue-500 mb-6 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <FaPaperPlane className="mr-2" />
                        Enviar Notificação
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default PromocoesMarketing;