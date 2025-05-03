import { useEffect, useState } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdCarCrash, MdDashboard, MdInbox, MdMoney, MdOutbox } from "react-icons/md";
import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { FaAccusoft, FaBox, FaMapMarkerAlt, FaMoneyCheckAlt, FaUserAlt, FaUserAltSlash, FaUsers, FaUsersCog, FaUserShield } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';
import Card from "components/card";

const ethicalBusiness1 = "https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=YTQ2vuRMv9e4uzwUSw/Tvj1FESJMZ56NDXKHcJSaEDhuurffAr8x0NGYaQTHQDzuRIEm7cxdQ1L4nZkTqJ9nu/594NEE6W5T1SadZQvDCSBj43E=";
const ethicalBusiness2 = "https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=YTQ2vuRMv9e4uzwUSw/Tvj1FESJMZ56NDXKHcJSaEDhuurffAr8x0NGYaQTHQDzuRIEm7cxdQ1L4nZkTqJ9nu/594NEE6W5T1SadZQvDCSBj43E=";
const ethicalBusiness3 = "https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=YTQ2vuRMv9e4uzwUSw/Tvj1FESJMZ56NDXKHcJSaEDhuurffAr8x0NGYaQTHQDzuRIEm7cxdQ1L4nZkTqJ9nu/594NEE6W5T1SadZQvDCSBj43E=";

const API_BASE_URL = Config.getApiUrl();

const Dashboard = () => {
  const [dados, setDados] = useState();
  const [loading, setLoading] = useState(true);
  const obterDataAtual = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };
  const dataAtual = obterDataAtual();

  const fetchDados = async () => {
    try {
      const response = await fetchWithToken(`api/admin-analise?data=${dataAtual}`, {
        method: 'GET',
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar postos");
      }
      const data = await response.json();
      console.log(data);
      setDados(data);
    } catch (error) {
      console.error("Erro ao buscar postos:", error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const ecommerceTips = [
    {
      title: "Otimize sua Experiência Mobile",
      content: "Mais de 70% das compras online são feitas por dispositivos móveis. Garanta que seu site seja totalmente responsivo.",
      icon: <MdDashboard className="h-6 w-6" />
    },
    {
      title: "Simplifique o Checkout",
      content: "Reduza o número de etapas no processo de checkout para diminuir o abandono de carrinho.",
      icon: <MdMoney className="h-6 w-6" />
    },
    {
      title: "Invista em SEO",
      content: "Melhore seu posicionamento nos motores de busca com palavras-chave relevantes e conteúdo de qualidade.",
      icon: <MdBarChart className="h-6 w-6" />
    },
    {
      title: "Atendimento ao Cliente",
      content: "Ofereça múltiplos canais de atendimento e responda rapidamente às consultas dos clientes.",
      icon: <FaUserAlt className="h-6 w-6" />
    },
    {
      title: "Análise de Dados",
      content: "Acompanhe métricas chave como taxa de conversão, valor médio do pedido e taxa de rejeição.",
      icon: <MdOutbox className="h-6 w-6" />
    }
  ];

  const ethicalMessages = [
    {
      title: "Integridade nos Negócios",
      content: "Mantenha transparência em todas as transações. Negócios honestos constroem confiança e reputação duradoura.",
      image: ethicalBusiness1,
      icon: <FaUserShield className="h-6 w-6" />
    },
    {
      title: "Denuncie Práticas Ilegais",
      content: "Se identificar qualquer tipo de fraude ou burla, denuncie imediatamente às autoridades competentes.",
      image: ethicalBusiness2,
      icon: <FaUserAltSlash className="h-6 w-6" />
    },
    {
      title: "Consequências das Fraudes",
      content: "Fraudes eletrônicas são crimes com penas severas. Além de danos financeiros, há perda de credibilidade irreparável.",
      image: ethicalBusiness3,
      icon: <MdCarCrash className="h-6 w-6" />
    },
    {
      title: "Proteja seus Dados",
      content: "Nunca compartilhe senhas ou dados financeiros. Empresas sérias nunca pedem essas informações por e-mail ou telefone.",
      image: ethicalBusiness1,
      icon: <IoDocuments className="h-6 w-6" />
    },
    {
      title: "Ética Digital",
      content: "Respeite os direitos dos consumidores e a privacidade de dados. Cumpra rigorosamente a LGPD e outras regulamentações.",
      image: ethicalBusiness2,
      icon: <FaUsersCog className="h-6 w-6" />
    }
  ];

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaMoneyCheckAlt className="h-7 w-7" />}
          title={"Saldo Total"}
          subtitle={`${dados?.saldo} AOA`}
        />
        <Widget
          icon={<FaUsersCog className="h-6 w-6" />}
          title={"Funcionários"}
          subtitle={`${dados?.funcionarios_total}`}
        />
        <Widget
          icon={<FaBox className="h-7 w-7" />}
          title={"Produtos"}
          subtitle={`${dados?.produtos_total}`}
        />
        <Widget
          icon={<FaAccusoft className="h-6 w-6" />}
          title={"Empresas"}
          subtitle={`${dados?.empresas_total}`}
        />
        <Widget
          icon={<FaUsers className="h-7 w-7" />}
          title={"Usuários"}
          subtitle={`${dados?.usuarios_total}`}
        />
        <Widget
          icon={<FaMapMarkerAlt className="h-6 w-6" />}
          title={"Postos"}
          subtitle={`${dados?.postos_total}`}
        />
      </div>

      <div className="mt-5">
        <Card extra="w-full p-6">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
            Ética Digital - Diga Não às Fraudess
          </h2>
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            interval={4000}
            className="ethical-carousel"
          >
            {ethicalMessages.map((message, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center p-4">
                <div className="md:w-1/3 mb-2 md:mb-0 md:mr-6">
                  <img
                    src={message.image}
                    alt={message.title}
                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                  />
                </div>
                <div className="md:w-2/3 ">
                  <div className="flex items-center mb-3">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-navy-700 mr-3">
                      {message.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                      {message.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      </div>

      <div className="mt-5">
        <Card extra="w-full p-6">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
            Dicas para Boa Gestão de E-commerce
          </h2>
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            interval={4000}
            className="ecommerce-tips-carousel"
          >
            {ecommerceTips.map((tip, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-full bg-brand-100 dark:bg-navy-700 mr-3">
                    {tip.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
                    {tip.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-5 dark:text-gray-300 pl-16">
                  {tip.content}
                </p>
              </div>
            ))}
          </Carousel>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;