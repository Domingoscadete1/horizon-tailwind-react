import React, { useState, useEffect } from 'react';
import axios from 'axios';
import yh from "assets/img/auth/yh.webp";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import Footer from 'components/footer/Footer';
import Config from "../../Config";

export default function Auth() {
  const navigate = useNavigate();
  const baseUrl = Config.getApiUrl();

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  

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
        { headers: { 'Content-Type': 'application/json',"ngrok-skip-browser-warning": "true" } }
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
        window.location.reload();
        //navigate('/admin/default');
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
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!resetEmail) {
      setResetError('Por favor, insira seu e-mail');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}api/password-reset/`,
        { email: resetEmail },
        { headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true" } }
      );

      if (response.status === 200) {
        setResetMessage('E-mail de redefinição enviado. Verifique sua caixa de entrada.');
        setShowResetForm(false);
      }
    } catch (error) {
      console.error("Erro ao solicitar redefinição:", error);
      setResetError(error.response?.data?.error || 'Erro ao solicitar redefinição de senha');
    }
  };

  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <FixedPlugin />
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%]  lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">

                <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
                  <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                    {!showResetForm ? (
                      <>
                        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                          Login
                        </h4>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                          Insira seus dados nos respectivos campos!
                        </p>

                        <form onSubmit={onSubmit}>
                          <label className="block text-gray-700 text-sm font-bold mb-2">NOME</label>
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            type="text"
                            name="username"
                            placeholder="Digite seu nome..."
                            value={formData.username}
                            onChange={handleInputChange}
                          />

                          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">SENHA</label>
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Digite sua senha..."
                            value={formData.password}
                            onChange={handleInputChange}
                          />

                          {error && <p className="text-red-500 mt-5">Preencha os campos devidamente...</p>}

                          <button
                            type="submit"
                            className="mt-4 w-full bg-brand-500 py-2 text-white rounded-lg"
                            disabled={isPending}
                          >
                            {isPending ? 'Logando...' : 'Login'}
                          </button>

                          <button
                            type="button"
                            className="mt-4 text-sm text-brand-500 hover:underline"
                            onClick={() => setShowResetForm(true)}
                          >
                            Esqueceu sua senha?
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                          Redefinir Senha
                        </h4>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                          Insira seu e-mail para receber o link de redefinição
                        </p>

                        <form onSubmit={handleResetPassword}>
                          <label className="block text-gray-700 text-sm font-bold mb-2">E-mail*</label>
                          <input
                            className="w-full px-3 py-2 border rounded-lg"
                            type="email"
                            placeholder="Digite seu e-mail cadastrado..."
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />

                          {resetError && <p className="text-red-500 mt-2">{resetError}</p>}
                          {resetMessage && <p className="text-green-500 mt-2">{resetMessage}</p>}

                          <div className="mt-4 flex gap-2">
                            <button
                              type="submit"
                              className="flex-1 bg-brand-500 py-2 text-white rounded-lg"
                            >
                              Enviar Link
                            </button>
                            <button
                              type="button"
                              className="flex-1 bg-gray-300 py-2 text-gray-700 rounded-lg"
                              onClick={() => setShowResetForm(false)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>

                <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                  <div
                    className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
                    style={{ backgroundImage: `url(${yh})` }}
                  />
                </div>
              </div>
              {/* <Footer /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}