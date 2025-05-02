import Card from "components/card";
import React,{useState,useEffect} from "react";
import { MdModeEditOutline } from "react-icons/md";

const General = () => {
  const [funcionarioId, setfuncionarioId] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('userData');
    if (token) {
        const userData = JSON.parse(token);
        const postoId = userData;
        console.log(userData);
        if (postoId) {
            setfuncionarioId(postoId);
        }
    }
}, []);

  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Informação Geral
        </h4>
        <p className="mt-2 px-2 text-base text-gray-600">
          À medida que vivemos, nossos corações se tornam mais frios. Porque dor é o que sentimos
          à medida que envelhecemos. Somos insultados pelos outros, perdemos a confiança
          nesses outros. Somos apunhalados pelas costas por amigos. Torna-se mais difícil para nós
          dar uma mão aos outros. Temos o coração partido por pessoas que amamos, mesmo
          que damos tudo a elas...
        </p>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {/* Nome */}
        <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" title="Editar">
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Nome</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {funcionarioId.username || 'DDStore'}
          </p>
        </div>

        {/* Email */}
        <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" title="Editar">
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {funcionarioId.email || '@@@'}
          </p>
        </div>

        {/* Department */}
        <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" title="Editar">
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Cargo</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">
            Admin
          </p>
        </div>

       

        

        {/* Data de Nascimento */}
        <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" title="Editar">
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Data de adesão</p>
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {funcionarioId.created_at}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default General;