import React, { useState, useEffect } from 'react';
import { FaTag, FaBullhorn, FaPaperPlane } from 'react-icons/fa';
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
  background-color: rgba(255, 255, 255, 0.0); /* Fundo semi-transparente */
`;

const API_BASE_URL = Config.getApiUrl();

const PromocoesMarketing = () => {
    const [desconto, setDesconto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [condicoes, setCondicoes] = useState('');
    const [imagens, setImagens] = useState([null, null, null, null]); 
    const [imagensPreview, setImagensPreview] = useState([null, null, null, null]); 
    const [mensagem, setMensagem] = useState('');
    const [tipoNotificacao, setTipoNotificacao] = useState('todos'); 
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Erro ao recuperar dados:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);
    
    const criarCampanha = async () => {
        if (!desconto || !condicoes || imagens.every(img => img === null)) {
            alert('Preencha todos os campos e adicione pelo menos uma imagem.');
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append("descricao", descricao);

        imagens.forEach((imagem, index) => {
            if (imagem) {
                formData.append(`imagem${index + 1}`, imagem);
            }
        });

        formData.append("desconto", desconto);
        formData.append("condicoes", condicoes);
        formData.append("user_id", userData.id)

        try {
            const response = await fetchWithToken(`api/anuncio-app/create/`, {
                method: 'POST',
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData,
            });

            if (response.ok) {
                alert('Campanha criada com sucesso!');
                setDesconto('');
                setCondicoes('');
                setImagens([null, null, null, null]);
                setImagensPreview([null, null, null, null]);

            } else {
                alert('Erro ao criar campanha.');
            }
        } catch (error) {
            console.error('Erro ao criar campanha:', error);
            alert('Erro ao conectar com o servidor.');
        }
        finally {
            setIsLoading(false); 

        }
    };

    const handleImagemChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const novasImagens = [...imagens];
            const novasImagensPreview = [...imagensPreview];

            novasImagens[index] = file;
            novasImagensPreview[index] = URL.createObjectURL(file);

            setImagens(novasImagens);
            setImagensPreview(novasImagensPreview);
        }
    };


    const enviarNotificacao = async () => {
        if (!mensagem) {
            alert('Escreva uma mensagem para enviar a notificação.');
            return;
        }
        setIsLoading(true);


        const data = {
            tipo: tipoNotificacao,
            titulo: 'Nova Promoção!',
            conteudo: mensagem,
        };

        try {
            const response = await fetchWithToken(`api/mandar-notificacoes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Notificação enviada com sucesso!');
                setMensagem('');
            } else {
                alert('Erro ao enviar notificação.');
            }
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            alert('Erro ao conectar com o servidor.');
        }
        finally {
            setIsLoading(false); 

        }
    };


    return (
        <div className="p-6">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <SyncLoader color="#3B82F6" size={15} /> {/* Spinner animado */}
                </div>
            )}
            
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
                            Descricao
                        </label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Feira da novidade"
                            className="mt-1 p-2 w-full border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Desconto ou Oferta
                        </label>
                        <input
                            type="text"
                            value={desconto}
                            onChange={(e) => setDesconto(e.target.value)}
                            placeholder="Ex: 10% de desconto"
                            className="mt-1 p-2 w-full border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                            className="mt-1 p-2 w-full border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={3}
                        />
                    </div>

                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Imagem {index + 1}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImagemChange(e, index)}
                                className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            {imagensPreview[index] && (
                                <div className="mt-4">
                                    <img
                                        src={imagensPreview[index]}
                                        alt={`Prévia ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={criarCampanha}
                        className="bg-green-500 mb-6 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <FaTag className="mr-2" />
                        Criar Campanha
                    </button>
                </div>
            </Card>

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
                            Tipo de Destinatário
                        </label>
                        <select
                            value={tipoNotificacao}
                            onChange={(e) => setTipoNotificacao(e.target.value)}
                            className="mt-1 p-2 w-full text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="todos" className='text-gray-700'>Todos</option>
                            <option value="empresa" className='text-gray-700'>Empresas</option>
                            <option value="usuario" className='text-gray-700'>Usuários</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Mensagem
                        </label>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Ex: Nova promoção disponível! Aproveite agora."
                            className="mt-1 p-2 w-full border text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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