import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useState } from "react";
import Card from "components/card";



const NftCard = ({ price, extra, title, author, image, onImageClick }) => {
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
<div className="h-full w-full">
      <div className="relative w-full">
        <img
          src={image}
          alt={title}
          className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full cursor-pointer"
          onClick={onImageClick}
        />
      </div>
      
      {/* Restante do conteúdo do NftCard */}

      <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <div className="flex gap-2 items-center">
              <img
                src={image}
                className="w-10 h-10 rounded-full "
                alt=""
              />
              <p className="text-lg font-bold text-navy-700 dark:text-white">
                Délcio Paiva
              </p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 md:mt-2">
              Nome: Computador
            </p>
            <p className="mt-2 text-sm font-medium text-gray-600 md:mt-2">
              Descrição: oerbsbierh erhvsdj
            </p>
            <p className="mt-2 text-sm font-medium text-gray-600 md:mt-2">
              Quantidade: 5
            </p>
            <p className="mt-2 text-sm font-medium text-gray-600 md:mt-2">
              Status: Disponível
              {/* reservado */}
              {/* esgotado */}
            </p>
            <p className="mt-2 mb-2 text-sm font-bold text-brand-500 dark:text-white">
              Preço {price} <span>Kzs</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-between">
          <div className="flex flex-row items-center gap-x-2">
            <button
              href=""
              className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
            >
              Desactivar
            </button>
          </div>

        </div>
      </div>

    </Card>
    
  );
};

export default NftCard;
