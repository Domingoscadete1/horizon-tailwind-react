import React, { useState } from 'react';
import { FaUser, FaEdit, FaLock, FaSave, FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado
import Project from "../perfil/components/Project";
import banner from "assets/img/profile/banner.png";

const PerfilUsuario = () => {
    // Estado para gerenciar informações do usuário
    const [usuario, setUsuario] = useState({
        nome: 'João Silva',
        email: 'delciodomingos@gmail.com',
        telefone: '+244 923 456 789',
        aniversario: '05 Abril 2006',
        morada: 'Bairro Paraíso, Viana',
        foto: 'https://bonnierpublications.com/app/uploads/2022/05/digitalfoto.jpg',
    });

    const [formData, setFormData] = useState({
        status: 'Ativa',
    });

    const handleStatusConta = (novoStatus) => {
        setFormData((prev) => ({ ...prev, status: novoStatus }));
        alert(`Conta da empresa ${novoStatus === 'Ativa' ? 'ativada' : 'suspensa'}.`);
    };

    // Estado para controlar o modo de edição
    const [editando, setEditando] = useState(false);

    // Função para salvar as alterações do perfil
    const salvarPerfil = () => {
        alert('Perfil atualizado com sucesso!');
        setEditando(false);
    };

    // Função para cancelar a edição
    const cancelarEdicao = () => {
        setEditando(false);
    };

    return (
        <div>
            <div className=' mb-10 grid h-full grid-cols-1 gap-5 md:grid-cols-2'>
                <Card extra={"items-center w-full h-full p-[16px] mt-3 bg-cover"}>
                    {/* Background and Foto */}

                    <div
                        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                        style={{ backgroundImage: `url(${banner})` }}
                    >
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-white dark:!border-navy-700">
                            <img
                                src={usuario.foto}
                                alt="Foto de Perfil"
                                className="w-full h-full rounded-full object-cover"
                            />
                            {editando && (
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setUsuario({ ...usuario, foto: URL.createObjectURL(file) });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <FaEdit />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Nome e Email */}
                    <div className="mt-16 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                            Bernardo Valdir
                        </h4>
                        <p className="text-base font-normal text-gray-600">tesedanilo@gmail.com</p>
                    </div>

                    {/* Contadores */}
                    <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
                            <p className="text-sm font-normal text-gray-600">Posts</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                9
                            </p>
                            <p className="text-sm font-normal text-gray-600">Produtos Vendidos</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                8
                            </p>
                            <p className="text-sm font-normal text-gray-600">Disponíveis</p>
                        </div>
                    </div>
                </Card>

                <Card extra={"w-full h-full sm:overflow-auto px-6 mt-3 mb-6"}>
                    <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
                        <header className="relative flex mb-8 mt-4 items-center justify-between pt-4">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">
                                Informações do Perfil
                            </div>
                            {!editando ? (
                                <button
                                    onClick={() => setEditando(true)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <FaEdit className="mr-2" />
                                    Editar Perfil
                                </button>
                            ) : (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={salvarPerfil}
                                        className="text-green-500 hover:text-green-700 flex items-center"
                                    >
                                        <FaSave className="mr-2" />
                                        Salvar
                                    </button>
                                    <button
                                        onClick={cancelarEdicao}
                                        className="text-red-500 hover:text-red-700 flex items-center"
                                    >
                                        <FaTimes className="mr-2" />
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </header>
                        
                        {/* Cards */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                            {/* Nome */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Nome</p>
                                {editando ? (
                                    <input
                                        type="text"
                                        value={usuario.nome}
                                        onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-white">
                                        {usuario.nome}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Email</p>
                                {editando ? (
                                    <input
                                        type="email"
                                        value={usuario.email}
                                        onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.email}
                                    </p>
                                )}

                            </div>

                            {/* Department */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Department</p>
                                <p className="text-base font-medium text-navy-700 dark:text-white">
                                    Product Design
                                </p>
                            </div>

                            {/* Número de Telefone */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Número de Telefone</p>
                                {editando ? (
                                    <input
                                        type="text"
                                        value={usuario.telefone}
                                        onChange={(e) => setUsuario({ ...usuario, telefone: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-white">
                                        {usuario.telefone}
                                    </p>
                                )}
                            </div>

                            {/* Morada */}
                            <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Morada</p>
                                {editando ? (
                                    <input
                                        type="morada"
                                        value={usuario.morada}
                                        onChange={(e) => setUsuario({ ...usuario, morada: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.morada}
                                    </p>
                                )}
                            </div>

                            {/* Data de Nascimento */}
                            <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">

                                <p className="text-sm text-gray-600">Data de Nascimento</p>
                                {editando ? (
                                    <input
                                        type="aniversario"
                                        value={usuario.aniversario}
                                        onChange={(e) => setUsuario({ ...usuario, aniversario: e.target.value })}
                                        className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-navy-700 dark:text-whitee">
                                        {usuario.aniversario}
                                    </p>
                                )}

                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-1">
                <Project />

                <Card extra="w-full p-4 h-full">
                    <header className="relative flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">Status da Conta</div>
                    </header>
                    <div className="mt-5">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">Status atual: {formData.status}</p>
                        <div className="flex space-x-2 mt-4">
                            {formData.status === 'Ativa' ? (
                                <button onClick={() => handleStatusConta('Suspensa')} className="bg-red-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                                    <FaTimes className="mr-2" /> Suspender Conta
                                </button>
                            ) : (
                                <button onClick={() => handleStatusConta('Ativa')} className="bg-green-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                                    <FaCheck className="mr-2" /> Ativar Conta
                                </button>
                            )}
                            <button onClick={() => alert('Conta excluída com sucesso.')} className="bg-gray-500 mb-5 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
                                <FaTrash className="mr-2" /> Excluir Conta
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PerfilUsuario;