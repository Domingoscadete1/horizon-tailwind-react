import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Config from "../../Config";
//import { fetchWithToken } from '../../../authService';
export default function SignIn() {
  const navigate = useNavigate();
  const baseUrl = Config.getApiUrl();

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Erro ao recuperar dados:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name}, Novo valor: ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    console.log("Enviando os seguintes dados para API:", formData);

    try {
      const response = await axios.post(
        `${baseUrl}api/token/`,
        formData, // Envia diretamente o objeto `formData`
        { headers: { 'Content-Type': 'application/json' ,"ngrok-skip-browser-warning": "true",
        } }
      );

      console.log("Resposta da API:", response);

      if (response.status !== 200) {
        setError('Erro no login. Verifique suas credenciais.');
        return;
      }

      const data = response.data;
      const decodedToken = jwtDecode(data.access);

      if (decodedToken.is_admin) {
        await fetchUserData(data.access);
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('custom-auth-token', data.access);
        navigate('/admin/principal');
      } else {
        setError('Usuário não autorizado.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsPending(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}api/user/`, {
        headers: { 'Authorization': `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
      });
      if (response.status === 200 && response.data) {
        setUserData(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[4vh] w-full max-w-md flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={onSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2">Username*</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">Password*</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleInputChange}
          />

          <button
            type="submit"
            className="mt-4 w-full bg-brand-500 py-2 text-white rounded-lg"
            disabled={isPending}
          >
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
