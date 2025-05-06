import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
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
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import Modal from 'react-modal';

import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90%',
        maxHeight: '90%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        overflow: 'hidden'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000
    }
};

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;

const API_BASE_URL = Config.getApiUrl();

Modal.setAppElement('#root');

const DetalhesProduto = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [produto, setProduto] = useState(null);
    const [produtosemelhantes, setProdutoSemelhantes] = useState(null);
    const [mediaPrincipal, setMediaPrincipal] = useState(null);
    const [tipoMedia, setTipoMedia] = useState('imagem');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const deletarProduto = async () => {
        const confirmacao = window.confirm("Tem certeza que deseja deletar este produto?");

        if (confirmacao) {
            try {
                const response = await fetchWithToken(`api/produto/${id}/deletar/`, {
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
            console.log("Deleção cancelada pelo usuário.");
        }
    };

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await fetchWithToken(`api/produto/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                setProduto(data || []);
                setMediaPrincipal(data.imagens[0].imagem);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };

        const fetchProdutoSemelhantes = async () => {
            try {
                const response = await fetchWithToken(`api/produtos/categoria/${produto?.categoria?.id}/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                setProdutoSemelhantes(data.results || []);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };

        const fetchData = async () => {
            await fetchProduto();
            await fetchProdutoSemelhantes();
            setLoading(false);
        };

        fetchData();
    }, [id, produto?.categoria?.id]);

    if (loading) {
        return <LoaderContainer>
            <SyncLoader color="#3B82F6" size={15} />
        </LoaderContainer>
    }

    if (!produto) {
        return <div className="mt-10 text-center text-gray-500">Produto não encontrado</div>;
    }

    const trocarMediaPrincipal = (novaMedia, tipo) => {
        setMediaPrincipal(novaMedia);
        setTipoMedia(tipo);
    };

    const handleUsuarioClick = (usuarioId) => {
        navigate(`/admin/perfiluser/${usuarioId}`);
    };

    const handleEmpresaClick = (empresaId) => {
        navigate(`/admin/perfilempresa/${empresaId}`);
    };

    const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`);
    };

    return (
        <div className="p-4">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Mídia em tamanho grande"
            >
                {tipoMedia === 'imagem' ? (
                    <img
                        src={mediaPrincipal}
                        alt="Visualização ampliada"
                        className="max-w-full max-h-screen"
                        onClick={closeModal}
                    />
                ) : (
                    <video
                        src={mediaPrincipal}
                        controls
                        autoPlay
                        className="max-w-full max-h-screen"
                    >
                        <track kind="captions" src="" label="Legendas" />
                    </video>
                )}
            </Modal>

            <Card extra="w-full h-full sm:overflow-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2">
                        {tipoMedia === 'imagem' ? (
                            <img
                                src={mediaPrincipal}
                                alt={produto.nome}
                                className="w-120 h-96 object-cover center rounded-lg cursor-pointer"
                                onClick={openModal}
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

                    <div className="w-full md:w-1/2">

                        <div className="mb-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div
                                    className="cursor-pointer"
                                    onClick={produto.usuario
                                        ? () => handleUsuarioClick(produto.usuario.id)
                                        : () => handleEmpresaClick(produto.empresa.id)}
                                >
                                    <img
                                        src={produto.usuario
                                            ? `${produto.usuario.foto}`
                                            : `${produto.empresa?.imagens?.[0]?.imagem}`}
                                        alt="..."
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p
                                        className="font-medium text-xl cursor-pointer hover:text-blue-500"
                                        onClick={produto.usuario
                                            ? () => handleUsuarioClick(produto.usuario.id)
                                            : () => handleEmpresaClick(produto.empresa.id)}
                                    >
                                        {produto.usuario ? produto.usuario.nome : produto.empresa.nome}
                                    </p>
                                    <p className="text-sm text-gray-500">Vendedor</p>
                                </div>
                            </div>
                        </div>

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

            <div className="relative flex items-center justify-between pt-4">
                <div className="text-2xl mt-2 mb-5 ml-2 font-bold text-navy-700 dark:text-white">
                    Produtos Relacionados
                </div>
            </div>

            <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                {produtosemelhantes?.map((nft, index) => (
                    <div key={index} className="h-full">
                        <NftCard
                            key={nft.id}
                            bidders={[avatar1, avatar2, avatar3]}
                            title={nft.nome}
                            author={nft.empresa ? nft.empresa.nome : nft.usuario.nome}
                            price={`${nft.preco}`}
                            image={`${Config.getApiUrlMedia()}${nft?.imagens[0]?.imagem}`}
                            quantidade={nft.quantidade}
                            status={nft.status}
                            descricao={nft?.descricao}
                            image_user={
                                nft.usuario
                                    ? `${Config.getApiUrlMedia()}${nft.usuario.foto}`
                                    : `${Config.getApiUrlMedia()}${nft.empresa?.imagens?.[0]?.imagem}`
                            }
                            onImageClick={() => handleProdutoClick(nft.id)}
                            onNameClick={() => handleProdutoClick(nft.id)}
                            onUserClick={
                                nft.usuario
                                    ? () => handleUsuarioClick(nft.usuario.id)
                                    : () => handleEmpresaClick(nft.empresa.id)
                            }
                            extraClasses="h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetalhesProduto;