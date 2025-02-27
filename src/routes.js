import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import Transacao from "views/admin/transacao";
import PerfilUsuario from "views/admin/usuario/perfil.jsx";
import Relatorio from "views/admin/relatorio";
import Marketing from "views/admin/marketing";
import ModeracaoConteudo from "views/admin/moderacao";
import SuporteCliente from "views/admin/suporte";
import ConfiguracaoPlataforma from "views/admin/configuracao";
import Seguranca from "views/admin/seguranca";
import GerenciamentoUsuarios from "views/admin/usuario";
import GerenciamentoEmpresas from "views/admin/empresa";
import PerfilEmpresa from "views/admin/empresa/perfil.jsx";
import SignIn from "views/auth/SignIn";
import GerenciamentoPostos from "views/admin/posto";
import PerfilFuncionario from "views/admin/empresa/perfil-funcionario";
import PerfilFuncionario2 from "views/admin/posto/perfil-funcionario";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
  MdArchive,
  MdLock,
} from "react-icons/md";
import { FaHeadset, FaShieldAlt,  FaCog, FaUsers, FaBullhorn, FaExclamationTriangle, FaAccusoft, FaTachometerAlt, FaLocationArrow, FaLaugh, FaLongArrowAltUp, FaMapMarkerAlt } from 'react-icons/fa';

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Produtos Divulgados",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Gerenciar Usuários",
    layout: "/admin",
    path: "usuario",
    icon: <FaUsers className="h-6 w-6" />,
    component: <GerenciamentoUsuarios />,
  },
  {
    name: "Gerenciar Empresas",
    layout: "/admin",
    path: "gerenciaremp",
    icon: <FaAccusoft className="h-6 w-6" />,
    component: <GerenciamentoEmpresas />,
  },
  {
    name: "Gerenciar Postos",
    layout: "/admin",
    path: "postos",
    icon: <FaMapMarkerAlt  className="h-6 w-6" />,
    component: <GerenciamentoPostos />,
  },
  // {
  //   name: "Tabelas",
  //   layout: "/admin",
  //   icon: <FaTable className="inline-block h-5 w-5" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },
  // {
  //   name: "Relatórios",
  //   layout: "/admin",
  //   path: "relatorio",
  //   icon: <MdArchive className="h-6 w-6" />,
  //   component: <Relatorio />,
  // }, GerenciamentoUsuarios
  {
    name: "Promoções e Marketing",
    layout: "/admin",
    path: "marketing",
    icon: <FaBullhorn className="inline-block h-6 w-6" />,
    component: <Marketing />,
  },
  {
    name: "Transação e Pagamentos",
    layout: "/admin",
    path: "transacao",
    icon: <MdArchive className="h-6 w-6" />,
    component: <Transacao />,
  },
  {
    name: "Moderação de Conteúdo",
    layout: "/admin",
    path: "moderacao",
    icon: <FaExclamationTriangle className="inline-block h-6 w-6" />,
    component: <ModeracaoConteudo />,
  },
  {
    name: "Suporte ao Cliente",
    layout: "/admin",
    path: "suporte",
    icon: <FaHeadset className="inline-block h-6 w-6" />,
    component: <SuporteCliente />,
  },
  {
    name: "Configurações Gerais",
    layout: "/admin",
    path: "configuracoes",
    icon: <FaCog className="h-6 w-6" />,
    component: <ConfiguracaoPlataforma />,
  },
  {
    name: "Segurança",
    layout: "/admin",
    path: "seguranca",
    icon: <FaShieldAlt className="h-6 w-6" />,
    component: <Seguranca />,
  },
  {
    name: "Perfil",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Perfil Usuário",
    layout: "/admin",
    path: "perfiluser/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilUsuario />,
  },
  {
    name: "Perfil Funcionário",
    layout: "/admin",
    path: "funcionario/:id",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilFuncionario />,
  },
  {
    name: "Perfil Funcionário do Posto",
    layout: "/admin",
    path: "ddd",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilFuncionario2 />,
  },
  {
    name: "Perfil Empresa",
    layout: "/admin",
    path: "perfilempresa/:id", // Adiciona o ID como parâmetro dinâmico
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilEmpresa />,
  },
  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "sign-in",
  //   icon: <MdLock className="h-6 w-6" />,
  //   component: <SignIn />,
  // },
  
  
];
export default routes;
