import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FaEdit, FaTrash, FaChartLine, FaCheck, FaTimes } from 'react-icons/fa';
import Card from 'components/card';
import avatar from "assets/img/avatars/avatar11.png";
import banner from "assets/img/profile/banner.png";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NftCard from "components/card/NftCard";
import ImageModal from "../marketplace/components/modal";

const nfts = [
    { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
    { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
    { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
];
const API_BASE_URL = "https://fad7-154-71-159-172.ngrok-free.app";

const PerfilEmpresa = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [editing, setEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para armazenar a imagem selecionada
    const [formData, setFormData] = useState();
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/empresa/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                setEmpresa(data);
                setFormData(data);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };

        const fetchProdutos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/produtos/empresa/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                console.log(data);

                setProdutos(data.produtos);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        const fetchData = async () => {
            await fetchEmpresa();
            await fetchProdutos();
            setLoading(false); // Agora só desativa o loading após buscar os dados
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="mt-10 text-center text-gray-500">Carregando...</div>;
    }

    if (!empresa) {
        return <div className="mt-10 text-center text-gray-500">Empresa não encontrada.</div>;
    }

    const handleSalvarEdicao = () => {
        setEditing(false);
        alert('Dados da empresa atualizados com sucesso.');
    };

    const handleStatusConta = (novoStatus) => {
        suspenderUsuario(novoStatus);
    };

    // Função para abrir a imagem em um modal
    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    // Função para fechar o modal
    const closeImageModal = () => {
        setSelectedImage(null);
    };


    const handleImageClick = (nft) => {
        setSelectedNft(nft);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNft(null);
    };
    const suspenderUsuario = async (novoStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresa/${id}/suspend/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                //body: JSON.stringify({ status: novoStatus }),
            });

            if (response.ok) {
                alert(`Conta da empresa ${novoStatus === 'Ativa' ? 'ativada' : 'suspensa'}.`);
                setFormData((prev) => ({ ...prev, status: novoStatus }));
            } else {
                alert('Erro ao alterar o status da conta.');
            }
        } catch (error) {
            console.error('Erro ao suspender usuário:', error);
            alert('Erro ao alterar o status da conta.');
        }
    };
    const atualizarEmpresa = async () => {
        try {
            // Cria um objeto FormData
            const formData = new FormData();
    
            // Adiciona os campos do usuário ao FormData
            formData.append('nome', empresa.nome);
            formData.append('descricao', empresa.descricao);
            formData.append('email', empresa.email);
            formData.append('telefone1', empresa.telefone1);
            formData.append('telefone2', empresa.telefone2);
            formData.append('endereco', empresa.endereco);
            formData.append('categoria', empresa.categoria);
            formData.append('status', empresa.status);
    
            
    
            // Debug: Verifique o conteúdo do FormData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            console.log(formData);
    
            // Faz a requisição PUT com o FormData
            const response = await fetch(`${API_BASE_URL}/api/empresa/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    // Não defina 'Content-Type' manualmente, o navegador fará isso automaticamente
                },
                body: formData, // Envia o FormData
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                setEmpresa(updatedUser); // Atualiza o estado com os dados retornados pela API
                alert('Perfil atualizado com sucesso!');
                setEditando(false);
            } else {
                const errorData = await response.json(); // Captura os detalhes do erro
                alert(`Erro ao atualizar o perfil: ${errorData.detail || 'Dados inválidos'}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar o perfil.');
        }
    };

    return (
        <div>
            {/* Modal para exibir a imagem em tamanho grande */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                        >
                            &times;
                        </button>
                        <img src={selectedImage} alt="Imagem ampliada" className="max-w-full max-h-[80vh]" />
                    </div>
                </div>
            )}

            <div className="mt-5 mb-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
                <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
                    {/* Background and profile */}
                    <div
                        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                        style={{ backgroundImage: `url(${banner})` }}
                    >
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                            <img className="h-full w-full rounded-full" src={empresa.imagens[0]?.imagem || ''} alt="Logo" />
                        </div>
                    </div>

                    {/* Name and position */}
                    <div className="mt-16 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                            {empresa.nome}
                        </h4>
                        <p className="text-base font-normal text-gray-600">{empresa.nome}</p>
                    </div>

                    {/* Post followers */}
                    <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                            <p className="text-sm font-normal text-gray-600">Posts</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                9
                            </p>
                            <p className="text-sm font-normal text-gray-600">Produtos Vendidos</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                8
                            </p>
                            <p className="text-sm font-normal text-gray-600">Disponíveis</p>
                        </div>
                    </div>
                </Card>

                <Card extra="w-full h-full sm:overflow-auto p-6">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Imagens da empresa
                    </div>

                    <div className="mt-6 flex flex-wrap gap-4">
                        {empresa.imagens && empresa.imagens.length > 0 ? (
                            empresa.imagens.map((img, index) => (
                                <div key={index} className="cursor-pointer" onClick={() => openImageModal(img.imagem)}>
                                    <img className="h-[150px] w-[150px] rounded-xl object-cover" src={img.imagem} alt={`Imagem ${index + 1}`} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">Nenhuma imagem disponível</p>
                        )}
                    </div>

                </Card>
            </div>

            <div className="">

                <div className="text-xl mb-5 mt-2 ml-2 font-bold text-navy-700 dark:text-white">
                    Produtos Divulgados
                </div>

                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                    {produtos.map((produto) => (
                        <NftCard
                            key={produto.id}
                            bidders={[avatar1, avatar2, avatar3]}
                            title={produto.nome}
                            author={empresa.nome}
                            price={produto.preco}
                            image={`${API_BASE_URL}${produto.imagens[0].imagem}` || ''}
                            image_user={
                                produto.usuario
                                  ? `${API_BASE_URL}${produto.usuario.foto}`
                                  : `${API_BASE_URL}${produto.empresa?.imagens?.[0]?.imagem}`
                              }
                            onImageClick={() => handleImageClick(produto)}
                        />
                    ))}

                </div>
            </div>

            <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-1">
                <Card extra="w-full h-full sm:overflow-auto px-6 mt-6">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                            Informações Cadastrais
                        </div>
                        <button onClick={() => setEditing(!editing)} className="text-blue-500 mb-5 hover:text-blue-700 flex items-center">
                            <FaEdit className="mr-2" />
                            {editing ? 'Cancelar Edição' : 'Editar Dados'}
                        </button>
                    </header>
                    <div className="mt-5">
                        {['nome', 'descricao', 'endereco', 'telefone1', 'telefone2','email','categoria'].map((campo) => (
                            <div key={campo} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                    {campo.charAt(0).toUpperCase() + campo.slice(1)}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData[campo]}
                                        onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">{formData[campo]}</p>
                                )}
                            </div>
                        ))}
                        {editing && (
                            <button onClick={handleSalvarEdicao} className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                                <FaCheck className="mr-2" /> Salvar Alterações
                            </button>
                        )}
                    </div>
                </Card>

                <Card extra="w-full h-full sm:overflow-auto px-6 mt-6">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">Status da Conta</div>
                    </header>
                    <div className="mt-5">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">Status atual: {empresa.status}</p>
                        <div className="flex space-x-2 mt-4">
                            {empresa.status === 'ativo' ? (
                                <button onClick={() => handleStatusConta('Suspensa')} className="bg-red-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                                    <FaTimes className="mr-2" /> Suspender Conta
                                </button>
                            ) : (
                                <button onClick={() => handleStatusConta('Ativa')} className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                                    <FaCheck className="mr-2" /> Ativar Conta
                                </button>
                            )}
                            {/* <button onClick={() => alert('Conta excluída com sucesso.')} className="bg-gray-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
                                <FaTrash className="mr-2" /> Excluir Conta
                            </button> */}
                        </div>
                    </div>
                </Card>
            </div>
            {/* Modal com imagens adicionais */}
            {
                isModalOpen && selectedNft && (
                    <ImageModal
                        imageUrl={`${API_BASE_URL}${selectedNft.imagens[0]?.imagem}` || ''}
                        additionalImages={selectedNft.imagens.map(img => `${API_BASE_URL}${img.imagem}`) || []}
                        onClose={closeModal}
                    />
                )
            }
        </div>
    );
};

export default PerfilEmpresa;