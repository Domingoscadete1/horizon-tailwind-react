import Card from "components/card";
import React, { useState, useEffect } from "react";
import { MdModeEditOutline, MdCheck, MdClose } from "react-icons/md";

const General = () => {
  const [funcionarioId, setFuncionarioId] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('userData');
    if (token) {
      const userData = JSON.parse(token);
      setFuncionarioId(userData);
    }
  }, []);

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field) => {
    setFuncionarioId(prev => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const renderEditableField = (field, value, label) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex-grow p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button 
            onClick={() => handleSave(field)}
            className="text-green-500 hover:text-green-700"
            title="Salvar"
          >
            <MdCheck />
          </button>
          <button 
            onClick={handleCancel}
            className="text-red-500 hover:text-red-700"
            title="Cancelar"
          >
            <MdClose />
          </button>
        </div>
      );
    }
    return (
      <p className="text-base font-medium text-navy-700 dark:text-white">
        {value || '---'}
      </p>
    );
  };

  return (
    <Card extra={"w-full h-full p-3"}>
      <div className="mt-2 mb-8 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Informação Geral
        </h4>
        <p className="mt-2 px-2 text-base text-gray-600">
          À medida que vivemos, nossos corpos se tornam mais frios. Porque dor é o que sentimos
          à medida que envelhecemos. Somos insultados pelos outros, perdemos a confiança
          nesses outros. Somos apunhalados pelas costas por amigos. Torna-se mais difícil para nós
          dar uma mão aos outros. Temos o coração partido por pessoas que amamos, mesmo
          que damos tudo a elas...
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" 
            title="Editar"
            onClick={() => handleEditClick('username', funcionarioId.username)}
          >
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Nome</p>
          {renderEditableField('username', funcionarioId.username)}
        </div>

        <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" 
            title="Editar"
            onClick={() => handleEditClick('email', funcionarioId.email)}
          >
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Email</p>
          {renderEditableField('email', funcionarioId.email)}
        </div>

        <div className="relative flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" 
            title="Editar"
            onClick={() => handleEditClick('role', 'Admin')}
          >
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Cargo</p>
          {renderEditableField('role', 'Admin')}
        </div>

        <div className="relative flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" 
            title="Editar"
            onClick={() => handleEditClick('created_at', funcionarioId.created_at)}
          >
            <MdModeEditOutline />
          </button>
          <p className="text-sm text-gray-600">Data de adesão</p>
          {renderEditableField('created_at', funcionarioId.created_at)}
        </div>
      </div>
    </Card>
  );
};

export default General;