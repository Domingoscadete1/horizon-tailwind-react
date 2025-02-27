import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEdit, FaLock, FaSave, FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import image1 from "assets/img/profile/image1.png";
import image2 from "assets/img/profile/image2.png";
import image3 from "assets/img/profile/image3.png";
import banner from "assets/img/profile/banner.png";
import NftCard from "components/card/NftCard";
import ImageModal from "../marketplace/components/modal";
const API_BASE_URL = "https://fad7-154-71-159-172.ngrok-free.app";

const PerfilUsuario = () => {
    // Estado para gerenciar informações do usuário
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    // Estado para controlar o modo de edição
    const [editando, setEditando] = useState(false);
    const [formData1, setFormData] = useState({
        status: 'Ativa',
    });
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                const data = await response.json();
                setUsuario(data);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
            }
        };

        const fetchProdutos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/produtos/usuario/${id}`, {
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
            await fetchUsuario();
            await fetchProdutos();
            setLoading(false); // Agora só desativa o loading após buscar os dados
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="mt-10 text-center text-gray-500">Carregando...</div>;
    }

    if (!usuario) {
        return <div className="mt-10 text-center text-gray-500">Usuário não encontrado</div>;
    }
    const atualizarUsuario = async () => {
        try {
            // Cria um objeto FormData
            const formData = new FormData();

            // Adiciona os campos do usuário ao FormData
            formData.append('nome', usuario.nome);
            formData.append('email', usuario.email);
            formData.append('numero_telefone', usuario.numero_telefone);
            formData.append('endereco', usuario.endereco);
            formData.append('data_nascimento', usuario.data_nascimento);

            // Se houver uma nova foto de perfil, adiciona ao FormData
            if (usuario.foto instanceof File) {
                formData.append('foto', usuario.foto);
            }

            // Faz a requisição PUT com o FormData
            const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    // Não defina 'Content-Type' manualmente, o navegador fará isso automaticamente
                },
                body: formData, // Envia o FormData
            });
            console.log(formData);

            if (response.ok) {
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

    const suspenderUsuario = async (novoStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${id}/suspend/`, {
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

    const apagarUsuario = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuario/${id}/deletar/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (response.ok) {
                alert('Conta excluída com sucesso.');
                window.location.href = '/';
            } else {
                alert('Erro ao excluir a conta.');
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir a conta.');
        }
    };

    const salvarPerfil = () => {
        atualizarUsuario();
    };

    const handleImageClick = (nft) => {
        setSelectedNft(nft);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNft(null);
    };

    const handleStatusConta = (novoStatus) => {
        suspenderUsuario(novoStatus);
    };


    // Função para salvar as alterações do perfil


    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditando(false);
    };

    return (
        <div>
            <div className=' mb-10 grid h-full grid-cols-1 gap-5 md:grid-cols-2'>
                <Card extra={"items-center w-full h-full p-[16px] mt-3 bg-cover"}>
                    {/* Background and Foto */}

                    <div
                        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                        style={{ backgroundImage: `url(${banner})` }}
                    >
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-white dark:!border-navy-700">
                            <img
                                src={usuario.foto}
                                alt="Foto de Perfil"
                                className="w-full h-full rounded-full object-cover"
                            />
                            {editando && (
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setUsuario({ ...usuario, foto: file });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <FaEdit />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Nome e Email */}
                    <div className="mt-16 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                            {usuario.nome}
                        </h4>
                        <p className="text-base font-normal text-gray-600">{usuario.email}</p>
                    </div>

                    {/* Contadores */}
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

                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-3 mb-6"}>
                    <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
                        <header className="relative flex mb-8 mt-4 items-center justify-between pt-4">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">
                                Informações do Perfil
                            </div>
                            {!editando ? (
                                <button
                                    onClick={() => setEditando(true)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <FaEdit className="mr-2" />
                                    Editar Perfil
                                </button>
                            ) : (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={salvarPerfil}
                                        className="text-green-500 hover:text-green-700 flex items-center"
                                    >
                                        <FaSave className="mr-2" />
                                        Salvar
                                    </button>
                                    <button
                                        onClick={cancelarEdicao}
                                        className="text-red-500 hover:text-red-700 flex items-center"
                                    >
                                        <FaTimes className="mr-2" />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </header>

                        {/* Cards */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                            {/* Nome */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Nome</p>
                                {editando ? (
                                    <input
                                        type="text"
                                        value={usuario.nome}
                                        onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-white">
                                        {usuario.nome}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Email</p>
                                {editando ? (
                                    <input
                                        type="email"
                                        value={usuario.email}
                                        onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.email}
                                    </p>
                                )}

                            </div>

                            {/* Department */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Department</p>
                                <p className="text-base font-medium text-navy-700 dark:text-white">
                                    Product Design
                                </p>
                            </div>

                            {/* Número de Telefone */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Número de Telefone</p>
                                {editando ? (
                                    <input
                                        type="text"
                                        value={usuario.numero_telefone}
                                        onChange={(e) => setUsuario({ ...usuario, numero_telefone: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-white">
                                        {usuario.numero_telefone}
                                    </p>
                                )}
                            </div>

                            {/* Morada */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Morada</p>
                                {editando ? (
                                    <input
                                        type="morada"
                                        value={usuario.endereco}
                                        onChange={(e) => setUsuario({ ...usuario, endereco: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.endereco}
                                    </p>
                                )}
                            </div>

                            {/* Data de Nascimento */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Data de Nascimento</p>
                                {editando ? (
                                    <input
                                        type="aniversario"
                                        value={usuario.data_nascimento}
                                        onChange={(e) => setUsuario({ ...usuario, data_nascimento: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.data_nascimento}
                                    </p>
                                )}

                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-5">
                <div className="text-xl mb-5 mt-2 ml-2 font-bold text-navy-700 dark:text-white">
                    Produtos Divulgados
                </div>

                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                    {produtos.length > 0 ? (
                        produtos.map((produto) => (

                            <NftCard
                                key={produto.id}
                                title={produto.nome}
                                // author={produto.descricao}
                                price={produto.preco}
                                image={`${API_BASE_URL}${produto.imagens[0].imagem}` || ''}
                                image_user={
                                    produto.usuario
                                        ? `${API_BASE_URL}${produto.usuario.foto}`
                                        : `${API_BASE_URL}${produto.empresa?.imagens?.[0]?.imagem}`
                                }
                                onImageClick={() => handleImageClick(produto)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 mt-3">Nenhum produto divulgado.</p>
                    )}
                </div>
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

            <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-1">

                <Card extra="w-full p-4 h-full">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">Status da Conta</div>
                    </header>
                    <div className="mt-5">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">Status atual: {usuario.status}</p>
                        <div className="flex space-x-2 mt-4">
                            {usuario.status === 'ativo' ? (
                                <button onClick={() => handleStatusConta('Suspensa')} className="bg-red-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                                    <FaTimes className="mr-2" /> Suspender Conta
                                </button>
                            ) : (
                                <button onClick={() => handleStatusConta('Ativa')} className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                                    <FaCheck className="mr-2" /> Ativar Conta
                                </button>
                            )}
                            <button onClick={() => alert('Conta excluída com sucesso.')} className="bg-gray-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
                                <FaTrash className="mr-2" /> Excluir Conta
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PerfilUsuario;