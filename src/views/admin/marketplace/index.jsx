import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importação necessária
import Card from "components/card";
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';
// Fix para ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const personIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // URL da imagem do ícone
  iconSize: [32, 32], // Tamanho do ícone
  iconAnchor: [16, 32], // Ponto de ancoragem do ícone
  popupAnchor: [0, -32], // Ponto de ancoragem do popup
});
const criarIconeUsuario = (fotoUrl) => {
  return new L.Icon({
    iconUrl: fotoUrl || 'https://via.placeholder.com/150', // URL da foto ou imagem padrão
    iconSize: [32, 32], // Tamanho do ícone
    iconAnchor: [16, 32], // Ponto de ancoragem do ícone
    popupAnchor: [0, -32], // Ponto de ancoragem do popup
    className: 'icone-usuario', // Classe CSS personalizada (opcional)
  });
};

const API_BASE_URL = Config.getApiUrl();

const Marketplace = () => {
  const navigate = useNavigate(); // Hook de navegação

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtosMapa, setProdutosMapa] = useState([]);

  const [categoria, setCategorias] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(null); // Estado para a categoria selecionada

  const nfts = [
    { title: "Computador", author: "Esthera Jackson", price: "0.91", image: NFt3, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
    { title: "Telefone", author: "Nick Wilson", price: "0.7", image: NFt2, additionalImages: [NFt3, NFt4, NFt5, NFt6] },
    { title: "Carro", author: "Will Smith", price: "2.91", image: NFt4, additionalImages: [NFt2, NFt3, NFt5, NFt6] },
    { title: "Teclado", author: "Esthera Jackson", price: "0.91", image: NFt5, additionalImages: [NFt2, NFt4, NFt5, NFt6] },
  ];
  const handleUsuarioClick = (usuarioId) => {
    navigate(`/admin/perfiluser/${usuarioId}`); // Redireciona para o perfil da empresa
  };
  const handleEmpresaClick = (empresaId) => {
    navigate(`/admin/perfilempresa/${empresaId}`); // Redireciona para o perfil da empresa
  };
  const handleProdutoClick = (produtoId) => {
    navigate(`/admin/detalhes/${produtoId}`); // Redireciona para o perfil da empresa
  };

  const fetchProdutos = async (page = 1) => {
    try {
      const url = `api/produtos/?page=${page}`;
      const response = await fetchWithToken(url, {
        method:'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Produtos carregados:", data);

      const produtosList = Array.isArray(data.results) ? data.results : [];
      setProdutos(produtosList);
      setFilteredProdutos(produtosList);
      setTotalPages(Math.ceil(data.count / data.results.length));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };
  const fetchProdutosMapa = async () => {
    try {
      const url = `api/produtos/`;
      const response = await fetchWithToken(url, {
        method:'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      const produtosList = Array.isArray(data.results) ? data.results : [];
      setProdutosMapa(produtosList);
      
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };
  const fetchCategorias = async () => {
    try {
      const url = `api/categorias/`;
      const response = await fetchWithToken(url, {
        method:'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("categorias:", data);

      
      setCategorias(data);
      
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchProdutos(currentPage);
    fetchProdutosMapa();
    fetchCategorias();
  }, [currentPage]);

  useEffect(() => {
    // Filtra os produtos com base no termo de busca e na categoria selecionada
    const filtered = produtos.filter((produto) => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = selectedCategoria ? produto.categoria.id === selectedCategoria.id : true;
      return matchesSearch && matchesCategoria;
    });
    setFilteredProdutos(filtered);
  }, [searchTerm, produtos, selectedCategoria]);


  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };
  const handleCategoriaClick = (categoria) => {
    setSelectedCategoria(categoria); // Atualiza a categoria selecionada
  };

  const handleImageClick = (produto) => {
    setSelectedNft(produto);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNft(null);
  };
  const ProductMap = ({ produtos }) => {
    // Função para extrair latitude e longitude do campo endereco
    const extrairCoordenadas = (localizacao) => {
      if (!localizacao) return null;
  
      // Divide o endereco em partes usando a vírgula como separador
      const partes = localizacao.split(',');
  
      // Verifica se há exatamente duas partes (latitude e longitude)
      if (partes.length === 2) {
        const latitude = parseFloat(partes[0].trim());
        const longitude = parseFloat(partes[1].trim());
  
        // Verifica se os valores são números válidos
        if (!isNaN(latitude) && !isNaN(longitude)) {
          return { latitude, longitude };
        }
      }
  
      // Retorna null se as coordenadas não forem válidas
      return null;
    };
  
    // Filtra usuários com coordenadas válidas
    const produtosComCoordenadas = produtos
      .map((produto) => {
        const coordenadas = extrairCoordenadas(produto.localizacao);
        return coordenadas ? { ...produto, ...coordenadas } : null;
      })
      .filter((produto) => produto !== null); // Remove usuários sem coordenadas válidas
  
    return (
      <MapContainer center={[-8.8383, 13.2344]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {produtosComCoordenadas.map((produto) => (
          <Marker key={produto.id} position={[produto.latitude, produto.longitude]}  icon={criarIconeUsuario(produto?.imagens[0]?.imagem)}>
            <Popup  >
            <p className="text-sm text-navy-700 dark:text-white" onClick={() => handleProdutoClick(produto.id)}>{produto.nome}</p> <br /> {produto.localizacao}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
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
          {categoria.map((categoria) => (
              <li key={categoria.id}>
                <a
                  className={`text-base font-medium ${
                    selectedCategoria?.id === categoria.id
                      ? "text-brand-500"
                      : "text-gray-500 hover:text-brand-500"
                  } dark:text-white`}
                  href="#!"
                  onClick={() => handleCategoriaClick(categoria)}
                >
                  {categoria.nome}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* NFTs Grid */}
        {/* <div className="z-20 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
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
        </div> */}

        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl mt-5 mb-5 ml-2 font-bold text-navy-700 dark:text-white">
            Para Você
          </div>
          <input
            type="text"
            placeholder="Pesquise aqui..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>

        {/* Grid de produtos filtrados */}
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
          {filteredProdutos.map((produto) => {
            const imageUrl =
              produto?.imagens && produto?.imagens?.length > 0
                ? produto?.imagens?.[0]?.imagem
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
                onImageClick={() =>handleProdutoClick(produto.id)}
                onNameClick={ () =>handleProdutoClick(produto.id)}
                onUserClick={
                  produto.usuario
                    ? () => handleUsuarioClick(produto.usuario.id)
                    : () =>handleEmpresaClick(produto.empresa.id)
                }
              />
            );
          })}
        </div>

        {/* Modal com imagens adicionais */}
        {isModalOpen && selectedNft && (
          <ImageModal
            imageUrl={selectedNft.imagens?.[0]?.imagem || "https://via.placeholder.com/150"}
            additionalImages={selectedNft.imagens.map((img) => img.imagem) || []}
            onClose={closeModal}
          />
        )}
        <Card extra={"w-full h-full sm:overflow-auto px-6 mt-6 mb-6"}>
            <div className="text-xl font-bold text-navy-700 dark:text-white mb-4 mt-5">Mapa de Produtos</div>
            <ProductMap produtos={produtosMapa} />
          </Card>
        

        {/* Paginação */}
        <div className="flex justify-center mt-10 mb-4">
          <div className="flex items-center space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              <FaArrowLeft />
            </button>
            <span className="text-sm text-gray-600 dark:text-white">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className={`px-4 py-2 text-sm font-medium text-white bg-brand-900 rounded-[20px] hover:bg-brand-800 flex items-center justify-center ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange("next")}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
