import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaChartLine, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaFilePdf } from 'react-icons/fa';
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
import { SyncLoader } from 'react-spinners'; // Importe o spinner
import styled from 'styled-components'; // Para estilização adicional


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.0); 
`;


const nfts = [
    { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
    { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
    { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
];
const API_BASE_URL = "https://dce9-154-71-159-172.ngrok-free.app";

const PerfilEmpresa = () => {
    const navigate = useNavigate(); // Hook de navegação

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [editing, setEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState();
    const [transacoes, setTransacoes] = useState([]);

    const [editando, setEditando] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2,
        totalPages: 1,
    });
    const [paginationTrasaction, setPaginationTrasaction] = useState({
        pageIndex: 0,
        pageSize: 2,
        totalPages: 1,
    });
    const [mostrarModalNotificacao, setMostrarModalNotificacao] = useState(false);
    const [notificacao, setNotificacao] = useState({
        tipo: '',
        conteudo: '',
        empresa_id: id
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
            // Encontra o tipo selecionado para obter o título correspondente
            const tipoSelecionado = tiposNotificacao.find(t => t.tipo === notificacao.tipo);
            const titulo = tipoSelecionado ? tipoSelecionado.titulo : 'Notificação';
    
            const response = await fetch(`${API_BASE_URL}/api/mandar-notificacao-empresa/`, {
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
            console.log(data);
            setEmpresa(data);
            setFormData(data);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
        }
    };
    const fetchTransacoes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresa/transacoes/${id}?page=${paginationTrasaction.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            console.log(data);
            setTransacoes(data.results.transacoes);
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
    const aceitarEmpresa = async (empresaId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/aceitar-empresa/${empresaId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erro ao aceitar empresa");
            }

            alert("Empresa aprovada com sucesso!");
            window.location.reload(); // Recarregar a página ou atualizar a lista

        } catch (error) {
            console.error("Erro:", error);
            alert(error.message);
        }
    };

    // Função para negar uma empresa
    const negarEmpresa = async (empresaId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/negar-empresa/${empresaId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erro ao negar empresa");
            }

            alert("Empresa negada com sucesso!");
            window.location.reload(); // Recarregar a página ou atualizar a lista

        } catch (error) {
            console.error("Erro:", error);
            alert(error.message);
        }
    };


    const fetchProdutos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/produtos/empresa/${id}?page=${pagination.pageIndex + 1}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
            });
            const data = await response.json();
            setProdutos(data.results);
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
    useEffect(() => {
        const fetchData = async () => {
            await fetchEmpresa();
            await fetchProdutos(); // Garante que a página 1 seja carregada por padrão
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

    if (!empresa) {
        return <div className="mt-10 text-center text-gray-500">Empresa não encontrada.</div>;
    }
    const handleProdutoClick = (produtoId) => {
        navigate(`/admin/detalhes/${produtoId}`); // Redireciona para o perfil da empresa
    };
    const handleSalvarEdicao = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/empresa/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedEmpresa = await response.json();
                setEmpresa(updatedEmpresa);
                setEditing(false);
                alert('Dados da empresa atualizados com sucesso.');
                window.location.reload();
            } else {
                alert('Erro ao atualizar os dados da empresa.');
            }
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            alert('Erro ao atualizar os dados da empresa.');
        }
    };

    const handleStatusConta = (novoStatus) => {
        suspenderUsuario(novoStatus);
    };

    const openImageModal = (image) => {
        setSelectedImage(image);
    };

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
            const formData = new FormData();
            formData.append('nome', empresa.nome);
            formData.append('descricao', empresa.descricao);
            formData.append('email', empresa.email);
            formData.append('telefone1', empresa.telefone1);
            formData.append('telefone2', empresa.telefone2);
            formData.append('endereco', empresa.endereco);
            formData.append('categoria', empresa.categoria);
            formData.append('status', empresa.status);
            formData.append('nif', empresa.nif);


            const response = await fetch(`${API_BASE_URL}/api/empresa/${id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData,
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setEmpresa(updatedUser);
                alert('Perfil atualizado com sucesso!');
                setEditando(false);
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar o perfil: ${errorData.detail || 'Dados inválidos'}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar o perfil.');
        }
    };

    return (
        <>
            <div>
                {/* Modal para exibir a imagem em tamanho grande */}
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
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
                                <img className="h-full w-full rounded-full" src={empresa.imagens[0]?.imagem || 'ol'} alt="Logo" />
                            </div>
                        </div>

                        {/* Name and position */}
                        <div className="mt-16 flex flex-col items-center">
                            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                {empresa.nome}
                            </h4>
                            <p className="text-base font-normal text-gray-600">{empresa.email}</p>
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

                {/* Produtos Divulgados e Últimas Transações*/}

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
                                                src={`${API_BASE_URL}${produto.imagens[0]?.imagem}`}
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

                            {/* Paginação */}
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
                                                    src={`${API_BASE_URL}${transacao?.produto.imagens[0]?.imagem}`}
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
                                                        transacao?.comprador?.id == empresa.id
                                                            ? 'compra'
                                                            : 'venda'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Paginação */}
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

                <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-1">
                    <Card extra="w-full h-full sm:overflow-auto px-6 mt-6">
                        <header className="relative mt-5 flex items-center justify-between pt-2">
                            <div className="text-2xl font-bold text-navy-700 dark:text-white">
                                Informações Cadastrais
                            </div>
                            <button onClick={() => setEditing(!editing)} className="text-blue-500 mb-5 hover:text-blue-700 flex items-center">
                                <FaEdit className="mr-2" />
                                {editing ? 'Cancelar Edição' : 'Editar Dados'}
                            </button>
                        </header>
                        <div className="mt-2">
                            {['nome', 'descricao', 'endereco', 'telefone1', 'telefone2', 'email', 'categoria', 'nif'].map((campo) => (
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
                            <div className="mt-4 flex space-x-4">
                                {empresa.alvara_comercial && (
                                    <a
                                        href={empresa.alvara_comercial}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-blue-500 hover:underline"
                                    >
                                        <FaFilePdf className="text-red-500" size={20} />
                                        <span>Alvará Comercial</span>
                                    </a>
                                )}

                                {empresa.certidao_registro_comercial && (
                                    <a
                                        href={empresa.certidao_registro_comercial}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-blue-500 hover:underline"
                                    >
                                        <FaFilePdf className="text-red-500" size={20} />
                                        <span>Registro Comercial</span>
                                    </a>
                                )}
                            </div>
                            
                            {/* Exibir ativar/desativar conta apenas se a empresa estiver verificada */}
                            {empresa.verificada && (
                                <div className="flex space-x-2 mt-4">
                                    {empresa.status === "ativo" ? (
                                        <button
                                            onClick={() => handleStatusConta("Suspensa")}
                                            className="bg-red-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                                        >
                                            <FaTimes className="mr-2" /> Suspender Conta
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusConta("Ativa")}
                                            className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                                        >
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
                            )}

                            <div className="flex space-x-2 mt-4">
                                {!empresa.verificada ? (
                                    <>
                                        <button
                                            onClick={() => aceitarEmpresa(empresa.id)}
                                            className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                                        >
                                            <FaCheck className="mr-2" /> Aprovar Empresa
                                        </button>
                                        <button
                                            onClick={() => negarEmpresa(empresa.id)}
                                            className="bg-red-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                                        >
                                            <FaTimes className="mr-2" /> Negar Empresa
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm font-bold text-navy-700 dark:text-white">Empresa Aprovada</p>
                                )}
                            </div>
                        </div>
                    </Card>

                </div>
                {mostrarModalNotificacao && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-navy-700">
                    Enviar Notificação para {empresa.nome}
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
                        onChange={(e) => setNotificacao({...notificacao, tipo: e.target.value})}
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
                        onChange={(e) => setNotificacao({...notificacao, conteudo: e.target.value})}
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

                {/* Modal com imagens adicionais */}
                {isModalOpen && selectedNft && (
                    <ImageModal
                        imageUrl={`${API_BASE_URL}${selectedNft.imagens[0]?.imagem}` || ''}
                        additionalImages={selectedNft.imagens.map(img => `${API_BASE_URL}${img.imagem}`) || []}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>);
};

export default PerfilEmpresa;