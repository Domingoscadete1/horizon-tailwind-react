import React, { useState,useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useParams,useNavigate } from 'react-router-dom';

import Card from 'components/card';
import NftCard from "components/card/NftCard";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import { SyncLoader } from 'react-spinners'; // Importe o spinner
import styled from 'styled-components'; // Para estilização adicional


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;

const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app";

const DetalhesProduto = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);    
    const [produto, setProduto] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState();
    const [mediaPrincipal, setMediaPrincipal] = useState(null); 
    const [tipoMedia, setTipoMedia] = useState('imagem'); 
    const navigate = useNavigate(); 



    
    const deletarProduto = async () => {
        const confirmacao = window.confirm("Tem certeza que deseja deletar este produto?");
    
        if (confirmacao) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/produto/${id}/deletar/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
    
                if (response.ok) {
                    alert("Produto deletado com sucesso!");
                    navigate(-1);
                } else {
                    alert("Erro ao deletar o produto.");
                }
            } catch (error) {
                console.error('Erro ao deletar produto:', error);
                alert("Erro ao deletar o produto.");
            }
        } else {
            // Se o usuário cancelar, não faz nada
            console.log("Deleção cancelada pelo usuário.");
        }
    };
    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/produto/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                console.log(data);
                setProduto(data);
                setMediaPrincipal(data.imagens[0].imagem);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };

        

        const fetchData = async () => {
            await fetchProduto();
            setLoading(false); // Agora só desativa o loading após buscar os dados
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <LoaderContainer>
        <SyncLoader color="#3B82F6" size={15} />
    </LoaderContainer>
    }

    if (!produto) {
        return <div className="mt-10 text-center text-gray-500">Usuário não encontrado</div>;
    }

    const nfts = [
        { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
        { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
        { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
        { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    ];

    // Estado para controlar a imagem principal

    // Função para trocar a imagem principal
    const trocarMediaPrincipal = (novaMedia, tipo) => {
        setMediaPrincipal(novaMedia);
        setTipoMedia(tipo);
    };


    return (
        <div className="p-4">
            {/* Card de Detalhes do Produto */}
            <Card extra="w-full h-full sm:overflow-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Coluna da Imagem */}
                    <div className="w-full md:w-1/2">
                        {tipoMedia === 'imagem' ? (
                            <img
                                src={mediaPrincipal}
                                alt={produto.nome}
                                className="w-120 h-96 object-cover center rounded-lg"
                            />
                        ) : (
                            <video
                                src={mediaPrincipal}
                                controls
                                className="w-120 h-96 object-cover center rounded-lg"
                            >
                                <track kind="captions" src="" label="Legendas" />
                            </video>
                        )}

                        {/* Miniaturas de Imagens */}
                        <div className="mt-4 flex gap-2">
                            {produto.imagens.map((img, index) => (
                                <img
                                    key={index}
                                    src={`${img.imagem}`}
                                    alt={`Imagem adicional ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                    onClick={() => trocarMediaPrincipal(img.imagem, 'imagem')}
                                />
                            ))}
                        </div>

                        {/* Miniaturas de Vídeos */}
                        {produto.videos && produto.videos.length > 0 && (
                            <div className="mt-4 flex gap-2">
                                {produto.videos.map((video, index) => (
                                    <video
                                        key={index}
                                        src={`${video.video}`}
                                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                        onClick={() => trocarMediaPrincipal(video.video, 'video')}
                                    >
                                        <track kind="captions" src="" label="Legendas" />
                                    </video>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coluna de Detalhes */}
                    <div className="w-full md:w-1/2">
                        <h1 className="text-3xl mt-3 mb-4 font-bold text-navy-700 dark:text-white">{produto.nome}</h1>
                        <p className="text-gray-600 text-justify">{produto.descricao}</p>
                        <div className="mt-2">
                        <p className="text-gray-600">
                                <strong>Categoria:</strong> {produto.categoria.nome}
                            </p>
                            <p className="text-gray-600">
                                <strong>Quantidade:</strong> {produto.quantidade}
                            </p>
                            <p className="text-gray-600">
                                <strong>Status:</strong> {produto.status}
                            </p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xl font-bold text-navy-700 dark:text-white">
                                {produto.preco} AOA
                            </p>
                        </div>
                        <div className="mt-4">
                            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={deletarProduto}>
                                Apagar
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Título dos Produtos Relacionados */}
            <div className="relative flex items-center justify-between pt-4">
                <div className="text-2xl mt-2 mb-5 ml-2 font-bold text-navy-700 dark:text-white">
                    Produtos Relacionados
                </div>
            </div>

            {/* Grid de Produtos Relacionados */}
            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                {nfts.map((nft, index) => (
                    <div key={index} className="h-full">
                        <NftCard
                            bidders={[avatar1, avatar2, avatar3]}
                            title={nft.title}
                            author={nft.author}
                            price={nft.price}
                            image={nft.image}
                            extraClasses="h-full" // Garante que o card ocupe toda a altura do container
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetalhesProduto;