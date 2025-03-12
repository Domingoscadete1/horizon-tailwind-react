import { useState, useEffect } from "react";

const useEnderecoFromCoordenadas = (coordenadas) => {
    const [endereco, setEndereco] = useState("Carregando...");

    useEffect(() => {
        const fetchEndereco = async () => {
            try {
                if (!coordenadas || typeof coordenadas !== "string" || !coordenadas.includes(",")) {
                    setEndereco("Localização inválida");
                    return;
                }

                const [lat, lon] = coordenadas.split(',').map(coord => parseFloat(coord.trim()));

                if (isNaN(lat) || isNaN(lon)) {
                    setEndereco("Localização inválida");
                    return;
                }

                const response = await fetch(
                    `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                    {
                        headers: {
                            "User-Agent": "PostoManager/1.0 (contato@postomanager.com)",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar endereço");
                }

                const data = await response.json();
                setEndereco(data.display_name || "Localização desconhecida");
            } catch (error) {
                console.error("Erro ao buscar endereço:", error);
                setEndereco("Erro ao carregar localização");
            }
        };

        fetchEndereco();
    }, [coordenadas]);

    return endereco;
};

export default useEnderecoFromCoordenadas;