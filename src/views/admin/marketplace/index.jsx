import React, { useState, useEffect } from "react";
import Banner from "./components/Banner";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NftCard from "components/card/NftCard";
import ImageModal from "./components/modal";

const API_BASE_URL = "https://408e-154-71-159-172.ngrok-free.app/api/produtos/";

const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        <div className="flex justify-center mt-5">
          <button
            className={`px-4 py-2 mx-2 bg-gray-300 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
          >
            Anterior
          </button>
          <span className="px-4 py-2">Página {currentPage} de {totalPages}</span>
          <button
            className={`px-4 py-2 mx-2 bg-gray-300 rounded ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange("next")}
          >
            Próximo
          </button>
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
