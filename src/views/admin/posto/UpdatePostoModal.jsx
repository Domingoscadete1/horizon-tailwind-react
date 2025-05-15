import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { FaPlus, FaEdit, FaTrash, FaEye, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
// Importa os estilos do Leaflet corretamente
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { Icon } from "leaflet";
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';
const API_BASE_URL = Config.getApiUrl();
const customIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMarker = ({ position }) => {
    return position ? (
        <Marker position={position} icon={customIcon}>
            <Popup>Localização Selecionada</Popup>
        </Marker>
    ) : null;
};

const UpdatePostoModal = ({ postoParaEditar, atualizarPostoNaAPI, onClose }) => {
    const [posto, setPosto] = useState(postoParaEditar || {});
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [openMapModal, setOpenMapModal] = useState(false);
    const MapWithInvalidate = ({ location }) => {
        const map = useMap();

        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }, [map]);

        return null;
    };

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            },
        });

        return location ? (
            <Marker position={[location.lat, location.lng]} icon={L.icon({
                iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            })} />
        ) : null;
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        }
    }, []);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setPosto((prev) => ({ ...prev, localizacao: `${latitude}, ${longitude}` }));
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        } else {
            alert('Geolocalização não é suportada pelo seu navegador.');
        }
    };
    const handleOpenMapModal = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setOpenMapModal(true);
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                    setOpenMapModal(true);
                }
            );
        } else {
            setOpenMapModal(true);
        }
    };
    const handleConfirmLocation = () => {
        setPosto((prev) => ({
            ...prev,
            localizacao: `${location.lat}, ${location.lng}`,
        }));
        setOpenMapModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPosto({ ...posto, [name]: value });
    };

    const atualizarPosto = async () => {
        try {
            const response = await fetchWithToken(`api/posto/${posto.id}/atualizar/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    id: posto.id,
                    nome: posto.nome,
                    localizacao: posto.localizacao,
                    imagem: posto.imagem,
                    horario: posto.horario,
                    responsavel: posto.responsavel,
                    telefone: posto.telefone,
                    email: posto.email,
                    capacidade: posto.capacidade,
                    imagem: posto.imagem,
                    status: posto.status,
                    created_at: posto.created_at,
                    updated_at: posto.updated_at,
                    deleted: posto.deleted
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Posto atualizado com sucesso!");
                atualizarPostoNaAPI();
                onClose();
            } else {
                alert(data.detail || "Erro ao atualizar o posto.");
            }
        } catch (error) {
            console.error("Erro ao atualizar posto:", error);
        }
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
            {openMapModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="bg-white shadow-lg p-4 rounded-md w-[600px] h-[500px] flex flex-col relative"
                    >
                        <header className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-navy-700">Escolha a Localização</h2>

                            <button
                                onClick={() => setOpenMapModal(false)}
                                className="text-navy-700 hover:text-blue-700"
                                title="Fechar"
                            >
                                <FaTimes />
                            </button>
                        </header>

                        {/* Contêiner fixo para o mapa */}
                        <div className="flex-grow relative overflow-hidden rounded-md">
                            <MapContainer
                                center={location}
                                zoom={13}
                                className="w-full h-full"
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker position={location} />
                                <MapWithInvalidate />
                            </MapContainer>
                        </div>

                        <button
                            onClick={handleConfirmLocation}
                            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                        >
                            Confirmar Localização
                        </button>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-navy-700">Atualizar Posto</h2>
                    <button
                        onClick={onClose} 
                        className="text-navy-700 hover:text-blue-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </header>

                <div className="mt-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome do Posto</label>
                        <input
                            type="text"
                            name="nome"
                            value={posto.nome || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Horário</label>
                        <input
                            type="text"
                            name="horario"
                            value={posto.horario || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Responsável</label>
                        <input
                            type="text"
                            name="responsavel"
                            value={posto.responsavel || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Localização
                        </label>
                        {/* <input
                            type="text"
                            name="nome"
                            value={posto.localizacao}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            disabled
                        /> */}

                        <button
                            onClick={handleGetCurrentLocation}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Localização atual
                        </button>
                        <button
                            onClick={handleOpenMapModal}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Escolher no mapa
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input
                            type="number"
                            name="telefone"
                            value={posto.telefone || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={posto.email || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Capacidade</label>
                        <input
                            type="number"
                            name="capacidade"
                            value={posto.capacidade || ""}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose} // Usa a função onClose para fechar o modal
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={atualizarPosto}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Atualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePostoModal;