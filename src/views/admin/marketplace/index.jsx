import React, { useState } from "react";
import Banner from "./components/Banner";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import NftCard from "components/card/NftCard";
import ImageModal from "./components/modal";

const nfts = [
  { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
  { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
  { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
  { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
];

const Marketplace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);

  const handleImageClick = (nft) => {
    setSelectedNft(nft);
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

        <div className="text-xl mt-5 mb-5 mt-2 ml-2 font-bold text-navy-700 dark:text-white">
          Para Você
        </div>

        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
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
      </div>

      {/* Modal com imagens adicionais */}
      {
        isModalOpen && selectedNft && (
          <ImageModal
            imageUrl={selectedNft.image}
            additionalImages={selectedNft.additionalImages}
            onClose={closeModal}
          />
        )
      }
    </div >
  );
};

export default Marketplace;
