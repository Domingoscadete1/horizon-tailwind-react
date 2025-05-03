import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaLock, FaSave, FaTimes, FaCheck, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Card from 'components/card';
import image1 from "assets/img/profile/image1.png";
import image2 from "assets/img/profile/image2.png";
import image3 from "assets/img/profile/image3.png";
import banner from "assets/img/profile/banner.png";
import NftCard from "components/card/NftCard";
import ImageModal from "../marketplace/components/modal";
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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
  background-color: rgba(255, 255, 255, 0.0); /* Fundo semi-transparente */
`;


const API_BASE_URL = Config.getApiUrl();

const PerfilUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4,
        totalPages: 1,
    });
    const [paginationTrasaction, setPaginationTrasaction] = useState({
        pageIndex: 0,
        pageSize: 2,
        totalPages: 1,
    });
    const [editando, setEditando] = useState(false);
    const [formData1, setFormData] = useState({
        status: 'Ativa',
    });
    const [mostrarModalNotificacao, setMostrarModalNotificacao] = useState(false);
    const [notificacao, setNotificacao] = useState({
        tipo: '',
        conteudo: '',
        usuario_id: id
    });
    const tiposNotificacao = [
        {
            tipo: 'promocao',
            titulo: 'Promoção Especial!',
            descricao: 'Enviar promoção exclusiva para o usuário'
        },
        {
            tipo: 'atualizacao',
            titulo: 'Atualização do Sistema',
            descricao: 'Notificar sobre atualizações ou manutenção'
        },
        {
            tipo: 'seguranca',
            titulo: 'Alerta de Segurança',
            descricao: 'Avisos importantes sobre segurança da conta'
        },
        {
            tipo: 'novidade',
            titulo: 'Novidades no App',
            descricao: 'Informar sobre novas funcionalidades'
        },
        {
            tipo: 'personalizada',
            titulo: 'Mensagem Personalizada',
            descricao: 'Enviar uma mensagem específica'
        }
    ];

    const enviarNotificacao = async () => {
        if (!notificacao.tipo || !notificacao.conteudo) {
            alert('Selecione o tipo e preencha o conteúdo da notificação.');
            return;
        }

        try {
            const tipoSelecionado = tiposNotificacao.find(t => t.tipo === notificacao.tipo);
            const titulo = tipoSelecionado ? tipoSelecionado.titulo : 'Notificação';

            const response = await fetchWithToken(`api/mandar-notificacao-usuario/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    usuario_id: id,
                    titulo: titulo,
                    conteudo: notificacao.conteudo
                }),
            });

            if (response.ok) {
                alert('Notificação enviada com sucesso!');
                setMostrarModalNotificacao(false);
                setNotificacao({
                    tipo: '',
                    conteudo: '',
                    usuario_id: id
                });
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Erro ao enviar notificação.');
            }
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            alert('Erro ao enviar notificação.');
        }
    };

    const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`);
    };

    const fetchProdutos = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`api/produtos/usuario/${id}?page=${pagination.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setProdutos(data.results || []);
            setPagination((prev) => ({
                ...prev,
                totalPages: Math.ceil(data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransacoes = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`api/usuario/transacoes/${id}?page=${paginationTrasaction.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setTransacoes(data.results || []);
            setPaginationTrasaction((prev) => ({
                ...prev,
                totalPages: Math.ceil(data.count / prev.pageSize),
            }));
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuario = async () => {
        try {
            const response = await fetchWithToken(`api/usuario/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setUsuario(data);
            console.log(data);
        } catch (error) {
            console.error('Erro ao buscar usuario:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUsuario();
            await fetchProdutos();
            await fetchTransacoes();
            setLoading(false);
        };

        fetchData();
    }, [id, pagination.pageIndex, paginationTrasaction.pageIndex]);

    if (loading) {
        return (
            <LoaderContainer>
                <SyncLoader color="#3B82F6" size={15} />
            </LoaderContainer>
        );
    }

    if (!usuario) {
        return <div className="mt-10 text-center text-gray-500">Usuário não encontrado</div>;
    }
    const atualizarUsuario = async () => {
        try {
            const formData = new FormData();

            // Adiciona os campos do usuário ao FormData
            formData.append('nome', usuario.nome);
            formData.append('email', usuario.email);
            formData.append('numero_telefone', usuario.numero_telefone);
            formData.append('endereco', usuario.endereco);
            formData.append('data_nascimento', usuario.data_nascimento);
            formData.append('status', usuario.status);

            // Se houver uma nova foto de perfil, adiciona ao FormData
            if (usuario.foto instanceof File) {
                formData.append('foto', usuario.foto);
            } else if (typeof usuario.foto === 'string') {
                // Se a foto for uma URL (string), não a envie no FormData
                console.log("A foto não foi alterada, mantendo a existente.");
            }

            // Debug: Verifique o conteúdo do FormData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            console.log(formData);

            // Faz a requisição PUT com o FormData
            const response = await fetchWithToken(`api/usuario/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData, // Envia o FormData
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsuario(updatedUser); // Atualiza o estado com os dados retornados pela API
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
            const response = await fetchWithToken(`api/user/${id}/suspend/`, {
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
            const response = await fetchWithToken(`api/usuario/${id}/deletar/`, {
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
        setModalIsOpen(false);
    };

    const handleStatusConta = (novoStatus) => {
        suspenderUsuario(novoStatus);
    };

    const cancelarEdicao = () => {
        setEditando(false);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    return (
        <div>
            <div className=' mb-10 grid h-full grid-cols-1 gap-5 md:grid-cols-2'>
                <Card extra={"items-center w-full h-full p-[16px] mt-3 bg-cover"}>
                    <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                        style={{ backgroundImage: `url(${banner})` }}>
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-white dark:!border-navy-700">
                            <img
                                src={usuario.foto}
                                alt="Foto de Perfil"
                                className="w-full h-full rounded-full object-cover cursor-pointer"
                                onClick={openModal}
                            />
                            {editando && (
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const newPhoto = URL.createObjectURL(file);
                                                setUsuario({ ...usuario, foto: newPhoto });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <FaEdit />
                                </label>
                            )}
                        </div>
                    </div>

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Foto de Perfil Ampliada"
                    >
                        <img
                            src={usuario.foto}
                            alt="Foto de Perfil Ampliada"
                            className="max-w-full max-h-screen rounded-full"
                            onClick={closeModal}
                        />
                    </Modal>

                    <div className="mt-16 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                            {usuario.nome}
                        </h4>
                        <p className="text-base font-normal text-gray-600">{usuario.email}</p>
                    </div>

                    <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">{usuario?.quantidade_produtos}</p>
                            <p className="text-sm font-normal text-gray-600">Posts</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                {usuario?.quantidade_vendas}
                            </p>
                            <p className="text-sm font-normal text-gray-600">Produtos Vendidos</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                {usuario?.quantidade_comprados}
                            </p>
                            <p className="text-sm font-normal text-gray-600">Produtos Comprados</p>
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

                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Data de Adesão</p>
                                <p className="text-base font-medium text-navy-700 dark:text-white">
                                    {usuario.created_at}
                                </p>
                            </div>

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

                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Morada</p>

                                <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                    {usuario.endereco}
                                </p>

                            </div>

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

            <div className="mt-5 mb-6 grid h-full grid-cols-1 gap-5 md:flex">
                <div className="w-full md:w-[65%]">
                    <Card extra={"w-full p-4 h-full"}>
                        <div className="mt-3 w-full ml-3">
                            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                                Produtos Divulgados
                            </h4>
                        </div>

                        {produtos.map((produto) => (
                            <div
                                key={produto.id}
                                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                            >
                                <div className="flex items-center">
                                    <div className="">
                                        <img
                                            className="h-[83px] w-[83px] rounded-lg cursor-pointer"
                                            src={`${Config.getApiUrlMedia()}${produto.imagens[0]?.imagem}`}
                                            alt={produto.nome}
                                            onClick={() => handleProdutoClick(produto.id)}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-navy-700 dark:text-white" >
                                            {produto.nome}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {produto.descricao}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {produto.preco}Kzs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between mt-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                    onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                                    disabled={pagination.pageIndex === 0}
                                >
                                    <FaArrowLeft className="mr-2" /> Anterior
                                </button>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                    onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                                    disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                                >
                                    Próxima <FaArrowRight className="ml-2" />
                                </button>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-white">
                                Página {pagination.pageIndex + 1} de {pagination.totalPages}
                            </span>
                        </div>
                    </Card>
                </div>

                <div className="w-full md:w-[35%]">
                    <Card extra="w-full h-full sm:overflow-auto px-6">
                        <header className="relative flex items-center mt-3 justify-between pt-4">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">Últimas Transações</div>
                        </header>
                        <div className="mt-3">
                            {transacoes.map((transacao) => (
                                <div
                                    key={transacao.id}
                                    className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
                                >
                                    <div className="flex items-center">
                                        <div className="">
                                            <img
                                                className="h-[83px] w-[83px] rounded-lg cursor-pointer"
                                                src={`${Config.getApiUrlMedia()}${transacao?.produto.imagens[0]?.imagem}`}
                                                alt={transacao?.produto.nome}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base font-medium text-navy-700 dark:text-white" >
                                                {transacao?.produto.nome}
                                            </p>
                                            <p className=" text-sm text-gray-600">
                                                {transacao.produto.descricao}
                                            </p>
                                            <p className=" text-sm text-gray-600">
                                                {transacao.transacao.lance?.preco} AOA
                                            </p>
                                            <p className=" text-sm text-gray-600">
                                                {
                                                    transacao?.comprador?.id == usuario.id
                                                        ? 'compra'
                                                        : 'venda'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between mt-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                        onClick={() => setPaginationTrasaction((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
                                        disabled={paginationTrasaction.pageIndex === 0}
                                    >
                                        <FaArrowLeft className="mr-2" /> Anterior
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center"
                                        onClick={() => setPaginationTrasaction((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
                                        disabled={paginationTrasaction.pageIndex + 1 >= paginationTrasaction.totalPages}
                                    >
                                        Próxima <FaArrowRight className="ml-2" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-white">
                                    Página {paginationTrasaction.pageIndex + 1} de {paginationTrasaction.totalPages}
                                </span>
                            </div>

                        </div>
                    </Card>
                </div>
            </div>

            {
                isModalOpen && selectedNft && (
                    <ImageModal
                        imageUrl={`${Config.getApiUrlMedia()}${selectedNft.imagens[0]?.imagem}` || ''}
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
                            <button
                                onClick={() => setMostrarModalNotificacao(true)}
                                className="bg-blue-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                            >
                                Enviar Notificação
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {mostrarModalNotificacao && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-navy-700">
                                Enviar Notificação para {usuario.nome}
                            </h2>
                            <button
                                onClick={() => setMostrarModalNotificacao(false)}
                                className="text-navy-700 hover:text-blue-700"
                            >
                                <FaTimes />
                            </button>
                        </header>

                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tipo de Notificação *
                                </label>
                                <select
                                    value={notificacao.tipo}
                                    onChange={(e) => setNotificacao({ ...notificacao, tipo: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                >
                                    <option value="">Selecione um tipo</option>
                                    {tiposNotificacao.map((tipo) => (
                                        <option key={tipo.tipo} value={tipo.tipo}>
                                            {tipo.descricao}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {notificacao.tipo && (
                                <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">
                                        Título: {tiposNotificacao.find(t => t.tipo === notificacao.tipo)?.titulo}
                                    </p>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Conteúdo da Mensagem *
                                </label>
                                <textarea
                                    value={notificacao.conteudo}
                                    onChange={(e) => setNotificacao({ ...notificacao, conteudo: e.target.value })}
                                    className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setMostrarModalNotificacao(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={enviarNotificacao}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfilUsuario;