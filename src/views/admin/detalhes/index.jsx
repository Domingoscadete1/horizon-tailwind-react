import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
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

const DetalhesProduto = () => {
    const produto = {
        nome: "Produtos de Limpeza",
        descricao: "Os produtos de limpeza são agentes químicos que removem sujidades, microrganismos, manchas e odores. São utilizados para higienizar, desinfetar e limpar ambientes e superfícies.",
        preco: 499,
        imagens: [
            "https://www.guimaraespl.com/files/produto/Produto-20240621150521.png",
            "https://medlimp.com.br/wp-content/uploads/2021/03/Lista-de-produtos-de-limpeza.jpg",
            "https://prakolar.com.br/wp-content/uploads/2024/02/Rotulo-de-produto-de-limpeza-quais-informacoes-sao-obrigatorias.webp",
            "https://medlimp.com.br/wp-content/uploads/2021/03/Lista-de-produtos-de-limpeza.jpg",
            "https://prakolar.com.br/wp-content/uploads/2024/02/Rotulo-de-produto-de-limpeza-quais-informacoes-sao-obrigatorias.webp",
        ],
        quantidade: 9,
        status: "A Venda",
    };

    const nfts = [
        { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
        { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
        { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
        { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    ];

    // Estado para controlar a imagem principal
    const [imagemPrincipal, setImagemPrincipal] = useState(produto.imagens[0]);

    // Função para trocar a imagem principal
    const trocarImagemPrincipal = (novaImagem) => {
        setImagemPrincipal(novaImagem);
    };

    return (
        <div className="p-4">
            {/* Card de Detalhes do Produto */}
            <Card extra="w-full h-full sm:overflow-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Coluna da Imagem */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={imagemPrincipal}
                            alt={produto.nome}
                            className="w-120 h-96 object-cover center rounded-lg"
                        />
                        <div className="mt-4 flex gap-2">
                            {produto.imagens.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Imagem adicional ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                    onClick={() => trocarImagemPrincipal(img)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Coluna de Detalhes */}
                    <div className="w-full md:w-1/2">
                        <h1 className="text-3xl mt-3 mb-4 font-bold text-navy-700 dark:text-white">{produto.nome}</h1>
                        <p className="text-gray-600 text-justify">{produto.descricao}</p>
                        <div className="mt-2">
                            <p className="text-gray-600">
                                <strong>Quantidade:</strong> {produto.quantidade}
                            </p>
                            <p className="text-gray-600">
                                <strong>Status:</strong> {produto.status}
                            </p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xl font-bold text-navy-700 dark:text-white">
                                {produto.preco}Kzs
                            </p>
                        </div>
                        <div className="mt-4">
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                                Desactivar
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