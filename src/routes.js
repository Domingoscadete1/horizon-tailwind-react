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
import GerenciamentoEmpresas from "views/empresa";
import PerfilEmpresa from "views/empresa/perfil";


// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
  MdArchive,
  MdStorage,
} from "react-icons/md";
import { FaHeadset, FaShieldAlt,  FaCog, FaUsers, FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';

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
    path: "empresa",
    icon: <FaUsers className="h-6 w-6" />,
    component: <GerenciamentoEmpresas />,
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
    path: "perfilusuario",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilUsuario />,
  },
  {
    name: "Perfil Empresa",
    layout: "/admin",
    path: "perfilempresa",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PerfilEmpresa />,
  },
  
  
];
export default routes;
