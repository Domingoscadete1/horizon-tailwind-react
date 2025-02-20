import React, { useState } from 'react';
import { FaCog, FaMapMarkerAlt, FaSave, FaEdit } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const ConfiguracaoPlataforma = () => {
    // Estados para configurações gerais
    const [politicas, setPoliticas] = useState('');
    const [termosUso, setTermosUso] = useState('');
    const [privacidade, setPrivacidade] = useState('');
    const [funcionalidadesUsuarios, setFuncionalidadesUsuarios] = useState('');
    const [funcionalidadesEmpresas, setFuncionalidadesEmpresas] = useState('');

    // Estados para gerenciamento de geolocalização
    const [pontosColeta, setPontosColeta] = useState('');
    const [localizacao, setLocalizacao] = useState('');

    // Função para salvar configurações gerais
    const salvarConfiguracoesGerais = () => {
        if (!politicas || !termosUso || !privacidade || !funcionalidadesUsuarios || !funcionalidadesEmpresas) {
            alert('Preencha todos os campos das configurações gerais.');
            return;
        }
        alert('Configurações gerais salvas com sucesso!');
    };

    // Função para salvar configurações de geolocalização
    const salvarGeolocalizacao = () => {
        if (!pontosColeta || !localizacao) {
            alert('Preencha todos os campos de geolocalização.');
            return;
        }
        alert('Configurações de geolocalização salvas com sucesso!');
    };

    return (
        <div className="p-6">

            {/* Seção de Configurações Gerais */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaCog className="inline-block mr-2" />
                        Configurações Gerais
                    </div>
                </header>

                <div className="mt-5">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Políticas da Plataforma
                        </label>
                        <textarea
                            value={politicas}
                            onChange={(e) => setPoliticas(e.target.value)}
                            placeholder="Digite as políticas da plataforma..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Termos de Uso
                        </label>
                        <textarea
                            value={termosUso}
                            onChange={(e) => setTermosUso(e.target.value)}
                            placeholder="Digite os termos de uso..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Política de Privacidade
                        </label>
                        <textarea
                            value={privacidade}
                            onChange={(e) => setPrivacidade(e.target.value)}
                            placeholder="Digite a política de privacidade..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Funcionalidades para Usuários
                        </label>
                        <textarea
                            value={funcionalidadesUsuarios}
                            onChange={(e) => setFuncionalidadesUsuarios(e.target.value)}
                            placeholder="Descreva as funcionalidades disponíveis para usuários..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Funcionalidades para Empresas
                        </label>
                        <textarea
                            value={funcionalidadesEmpresas}
                            onChange={(e) => setFuncionalidadesEmpresas(e.target.value)}
                            placeholder="Descreva as funcionalidades disponíveis para empresas..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <button
                        onClick={salvarConfiguracoesGerais}
                        className="bg-blue-500 mb-6 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <FaSave className="mr-2" />
                        Salvar Configurações Gerais
                    </button>
                </div>
            </Card>

            {/* Seção de Gerenciamento de Geolocalização e Mapas */}
            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaMapMarkerAlt className="inline-block mr-2" />
                        Gerenciamento de Geolocalização e Mapas
                    </div>
                </header>

                <div className="mt-5">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Pontos de Coleta
                        </label>
                        <textarea
                            value={pontosColeta}
                            onChange={(e) => setPontosColeta(e.target.value)}
                            placeholder="Descreva os pontos de coleta..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Informações de Localização
                        </label>
                        <textarea
                            value={localizacao}
                            onChange={(e) => setLocalizacao(e.target.value)}
                            placeholder="Descreva as informações de localização..."
                            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={4}
                        />
                    </div>

                    <button
                        onClick={salvarGeolocalizacao}
                        className="bg-green-500 mb-6 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <FaSave className="mr-2" />
                        Salvar Configurações de Geolocalização
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default ConfiguracaoPlataforma;