import React, { useState } from 'react';
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

const PerfilEmpresa = () => {
    const [editing, setEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Estado para armazenar a imagem selecionada
    const [formData, setFormData] = useState({
        nome: 'Empresa A',
        cnpj: '12.345.678/0001-99',
        endereco: 'Rua Exemplo, 123',
        telefone: '(11) 9999-9999',
        email: 'empresaA@exemplo.com',
        status: 'Ativa',
        metricas: {
            vendas: 15000,
            clientes: 120,
            avaliacao: 4.5,
        },
        historico: [
            { data: '2023-10-01', acao: 'Cadastro aprovado' },
            { data: '2023-10-05', acao: 'Promoção cadastrada' },
            { data: '2023-10-10', acao: 'Venda realizada: R$ 1.000,00' },
        ],
    });

    const handleSalvarEdicao = () => {
        setEditing(false);
        alert('Dados da empresa atualizados com sucesso.');
    };

    const handleStatusConta = (novoStatus) => {
        setFormData((prev) => ({ ...prev, status: novoStatus }));
        alert(`Conta da empresa ${novoStatus === 'Ativa' ? 'ativada' : 'suspensa'}.`);
    };

    // Função para abrir a imagem em um modal
    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    // Função para fechar o modal
    const closeImageModal = () => {
        setSelectedImage(null);
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
                            <img className="h-full w-full rounded-full" src={avatar} alt="" />
                        </div>
                    </div>

                    {/* Name and position */}
                    <div className="mt-16 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                            Bernardo Valdir
                        </h4>
                        <p className="text-base font-normal text-gray-600">tesedanilo@gmail.com</p>
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
                        {[banner, banner, banner, banner, banner, banner].map((image, index) => (
                            <div
                                key={index}
                            // className="cursor-pointer"
                            // onClick={() => openImageModal(image)}
                            >
                                <img
                                    className="h-[150px] w-[150px] rounded-xl object-cover"
                                    src={image}
                                    alt={`Imagem ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className=""> 

            <div className="text-xl mb-5 mt-2 ml-2 font-bold text-navy-700 dark:text-white">
                        Produtos Divulgados
                    </div>

                <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Computador"
                        author="Esthera Jackson"
                        price="0.91"
                        image={NFt3}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Telefone"
                        author="Nick Wilson"
                        price="0.7"
                        image={NFt2}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Carro"
                        author="Will Smith"
                        price="2.91"
                        image={NFt4}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Teclado"
                        author="Esthera Jackson"
                        price="0.91"
                        image={NFt3}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Computador"
                        author="Esthera Jackson"
                        price="0.91"
                        image={NFt3}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Telefone"
                        author="Nick Wilson"
                        price="0.7"
                        image={NFt2}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Carro"
                        author="Will Smith"
                        price="2.91"
                        image={NFt4}
                    />
                    <NftCard
                        bidders={[avatar1, avatar2, avatar3]}
                        title="Teclado"
                        author="Esthera Jackson"
                        price="0.91"
                        image={NFt3}
                    />
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
                        {['nome', 'cnpj', 'endereco', 'telefone', 'email'].map((campo) => (
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
                        <p className="text-sm font-bold text-navy-700 dark:text-white">Status atual: {formData.status}</p>
                        <div className="flex space-x-2 mt-4">
                            {formData.status === 'Ativa' ? (
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

export default PerfilEmpresa;