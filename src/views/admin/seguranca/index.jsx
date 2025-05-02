import React, { useState } from 'react';
import { FaShieldAlt, FaDatabase, FaSync, FaBan, FaClock } from 'react-icons/fa';
import Card from 'components/card'; // Componente de card personalizado

const Seguranca = () => {
    const [logs, setLogs] = useState([
        { id: 1, descricao: 'Tentativa de login falha - IP: 192.168.1.1', data: '2023-10-01 14:30' },
        { id: 2, descricao: 'Acesso não autorizado detectado - IP: 192.168.1.2', data: '2023-10-02 09:15' },
    ]);

    const [backups, setBackups] = useState([
        { id: 1, data: '2025-05-01 00:00', status: 'Sucesso' },
        { id: 2, data: '2025-05-01 00:00', status: 'Sucesso' },
    ]);

    const [atualizacoes, setAtualizacoes] = useState([
        { id: 1, versao: 'v1.2.3', data: '2025-05-10', status: 'Pendente' },
        { id: 2, versao: 'v1.2.4', data: '2025-05-12', status: 'Instalada' },
    ]);

    const bloquearAtividade = (id) => {
        setLogs(logs.filter(log => log.id !== id));
        alert(`Atividade suspeita bloqueada: ID ${id}`);
    };

    const agendarBackup = () => {
        const novoBackup = {
            id: backups.length + 1,
            data: new Date().toLocaleString(),
            status: 'Agendado',
        };
        setBackups([...backups, novoBackup]);
        alert('Backup agendado com sucesso!');
    };

    const aplicarAtualizacao = (id) => {
        setAtualizacoes(atualizacoes.map(atualizacao =>
            atualizacao.id === id ? { ...atualizacao, status: 'Instalada' } : atualizacao
        ));
        alert(`Atualização aplicada: ${atualizacoes.find(a => a.id === id).versao}`);
    };

    return (
        <div className="p-6">

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaBan className="inline-block mr-2" />
                        Monitorar Atividades Suspeitas
                    </div>
                </header>

                <div className="mt-5">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Descrição
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Data
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {log.descricao}
                                    </td>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {log.data}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => bloquearAtividade(log.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Bloquear"
                                        >
                                            <FaBan />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaDatabase className="inline-block mr-2" />
                        Gerenciar Backups
                    </div>
                </header>

                <div className="mt-5">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Data
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {backups.map((backup) => (
                                <tr key={backup.id}>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {backup.data}
                                    </td>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {backup.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={agendarBackup}
                        className="bg-blue-500 mt-4 mb-5 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <FaClock className="mr-2" />
                        Agendar Backup
                    </button>
                </div>
            </Card>

            <Card extra={"w-full h-full sm:overflow-auto px-6 mt-2 mb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        <FaSync className="inline-block mr-2" />
                        Atualizar o Sistema
                    </div>
                </header>

                <div className="mt-5">
                    <table className="w-full">
                        <thead>
                            <tr className="!border-px !border-gray-400">
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Versão
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Data
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Status
                                </th>
                                <th className="text-start text-sm font-bold text-gray-600 dark:text-white p-2">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {atualizacoes.map((atualizacao) => (
                                <tr key={atualizacao.id}>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {atualizacao.versao}
                                    </td>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {atualizacao.data}
                                    </td>
                                    <td className="p-2 text-sm text-navy-700 dark:text-white">
                                        {atualizacao.status}
                                    </td>
                                    <td className="p-2">
                                        {atualizacao.status === 'Pendente' && (
                                            <button
                                                onClick={() => aplicarAtualizacao(atualizacao.id)}
                                                className="text-green-500 hover:text-green-700"
                                                title="Aplicar Atualização"
                                            >
                                                <FaSync />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Seguranca;