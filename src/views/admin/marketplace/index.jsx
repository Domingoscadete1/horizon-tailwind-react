import React, { useState, useEffect } from "react";
import Banner from "./components/Banner";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NftCard from "components/card/NftCard";
import ImageModal from "./components/modal";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app/api/produtos/";

const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const nfts = [
    { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
    { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
    { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
  ];

  const fetchProdutos = async (page = 1) => {
    try {
      const url = `${API_BASE_URL}?page=${page}`;
      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true", // Evita bloqueios do ngrok
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Produtos carregados:", data);

      setProdutos(Array.isArray(data.results) ? data.results : []);
      setTotalPages(Math.ceil(data.count / data.results.length)); // Calcula total de páginas
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos(currentPage);
  }, [currentPage]); // Atualiza ao mudar de página

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleImageClick = (produto) => {
    setSelectedNft(produto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNft(null);
  };

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-1 2xl:grid-cols-1">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <Banner />

        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Categorias
          </h4>
          <ul className="mt-4 flex items-center justify-between md:mt-0 md:justify-center md:!gap-5 2xl:!gap-12">
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Computador
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Telefone
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Carro
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                <a href=" ">Teclado</a>
              </a>
            </li>
          </ul>
        </div>

        {/* NFTs Grid */}
        <div className="z-20 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
          {nfts.map((nft, index) => (
            <NftCard
              key={index}
              bidders={[avatar1, avatar2, avatar3]}
              title={nft.title}
              author={nft.author}
              price={nft.price}
              image={nft.image}
              onImageClick={() => handleImageClick(nft)}
            />
          ))}
        </div>

        <div className="text-xl mt-5 mb-5 ml-2 font-bold text-navy-700 dark:text-white">
          Para Você
        </div>

        {/* Grid de produtos */}
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
          {produtos.map((produto) => {
            const imageUrl =
              produto.imagens && produto.imagens.length > 0
                ? produto.imagens[0].imagem
                : "https://via.placeholder.com/150";

            return (
              <NftCard
                key={produto.id}
                bidders={[avatar1, avatar2, avatar3]}
                title={produto.nome}
                author={produto.empresa ? produto.empresa.nome : produto.usuario.nome}
                price={`${produto.preco.toFixed(2)}`}
                image={imageUrl}
                quantidade={produto.quantidade}
                status={produto.status}
                image_user={
                  produto.usuario
                    ? produto.usuario.foto
                    : produto.empresa?.imagens?.[0]?.imagem
                }
                onImageClick={() => handleImageClick(produto)}
              />
            );
          })}
        </div>

        {/* Paginação */}
        <div className="flex justify-center mt-10 mb-4">
          <div className="flex items-center space-x-2">
            <button
              className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              <FaArrowLeft className="w-20" /> 
            </button>
            <span className="text-sm text-gray-600 dark:text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={`"px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center" ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange("next")}
            >
               <FaArrowRight className="w-20" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal com imagens adicionais */}
      {isModalOpen && selectedNft && (
        <ImageModal
          imageUrl={selectedNft.imagens?.[0]?.imagem || "https://via.placeholder.com/150"}
          additionalImages={selectedNft.imagens?.map((img) => img.imagem) || []}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Marketplace;
