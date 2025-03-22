import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import nft1 from "assets/img/nfts/NftBanner1.png";
import nft2 from "assets/img/nfts/NftBanner1.png";
import nft3 from "assets/img/nfts/NftBanner1.png";

const API_BASE_URL = "https://fad7-154-71-159-172.ngrok-free.app";

const Banner1 = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const [anuncios, setAnuncios] = useState([]);



  const fetchAnuncios = async () => {
    try {
      const url = `${API_BASE_URL}/api/anuncios-app/`;
      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Anuncios carregados:", data);

      const produtosList = Array.isArray(data) ? data : [];
      setAnuncios(produtosList);

    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };
  const desativarAnuncio = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja desativar este anúncio?");
    if (confirmacao) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/anuncio-app/${id}/deletar/`, {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.ok) {
          alert("Anúncio desativado com sucesso!");
          // Atualiza a lista de anúncios após a desativação
          fetchAnuncios();
        } else {
          alert("Erro ao desativar o anúncio.");
        }
      } catch (error) {
        console.error("Erro ao desativar anúncio:", error);
        alert("Erro ao desativar o anúncio.");
      }
    }
  };

  useEffect(() => {
    fetchAnuncios();

  }, []);

  return (
    <Slider {...settings}>
      {anuncios.map((banner, index) => (
        <div key={index}>
          <div
            className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[44px] md:py-[76px]"
            style={{ backgroundImage: `url(${banner.imagem1})` }}
          >
            <div className="w-full">
              <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
                {banner.descricao}
              </h4>
              <p className="mb-[80px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
                {banner.desconto}
              </p>

              <div className="mt-[16px] flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
                <button onClick={() => desativarAnuncio(banner.id)} className="text-black linear rounded-xl bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 active:!bg-white/70">
                  Desactivar Publicidade
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Banner1;