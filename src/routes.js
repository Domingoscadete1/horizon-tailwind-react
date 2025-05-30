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
import DetalhesProduto from "views/admin/detalhes";
import EmpresasParaAprovar from "views/admin/empresa/aprovacao";
import UsuariosBloqueados from "views/admin/usuario/bloqueados";
import AcoesSistema from "views/admin/acoes";
import UsuariosLogados from "views/admin/usuario/usuarios_logados";
import GerenciamentoAdmins from "views/admin/admins";
import LancesList from "views/admin/lances";
import {
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
  MdArchive,
  MdLock,
  MdBlock,
  MdOutlinePendingActions,
  MdLandslide,
} from "react-icons/md";

import {
  FaHeadset,
  FaShieldAlt,
  FaCog,
  FaUsers,
  FaBullhorn,
  FaExclamationTriangle,
  FaAccusoft,
  FaMapMarkerAlt,
  FaFilter,
  FaHistory,
  FaFingerprint,
  FaKey,
} from 'react-icons/fa';

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "principal",
    admin: true,
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Produtos Divulgados",
    layout: "/admin",
    path: "produtos",
    admin: true,
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Gerenciar Usuários",
    layout: "/admin",
    admin: true,
    path: "usuario",
    icon: <FaUsers className="h-6 w-6" />,
    component: <GerenciamentoUsuarios />,
  },
  {
    name: "Users Logados",
    layout: "/admin",
    admin: true,
    path: "users-logados",
    icon: <FaFingerprint className="h-6 w-6" />,
    component: <UsuariosLogados />,
  },
  {
    name: "Categorias",
    layout: "/admin",
    admin: true,
    path: "categorias",
    icon: <FaFilter className="h-6 w-6" />,
    component: <UsuariosBloqueados />,
  },
  {
    name: "Gerenciar Empresas",
    layout: "/admin",
    admin: true,
    path: "gerenciaremp",
    icon: <FaAccusoft className="h-6 w-6" />,
    component: <GerenciamentoEmpresas />,
  },
  {
    name: "Empresas Por Aprovar",
    layout: "/admin",
    admin: true,
    path: "aprovacao",
    icon: <MdOutlinePendingActions className="h-6 w-6" />,
    component: <EmpresasParaAprovar />,
  },
  {
    name: "Gerenciar Postos",
    layout: "/admin",
    admin: true,
    path: "postos",
    icon: <FaMapMarkerAlt className="h-6 w-6" />,
    component: <GerenciamentoPostos />,
  },
  {
    name: "Promoções e Marketing",
    layout: "/admin",
    admin: true,
    path: "marketing",
    icon: <FaBullhorn className="inline-block h-6 w-6" />,
    component: <Marketing />,
  },
  {
    name: "Detalhes Produto",
    layout: "/admin",
    admin: false,
    path: "detalhes/:id",
    icon: <FaBullhorn className="inline-block h-6 w-6" />,
    component: <DetalhesProduto />,
  },
  {
    name: "Transação e Pagamentos",
    layout: "/admin",
    admin: true,
    path: "transacao",
    icon: <MdArchive className="h-6 w-6" />,
    component: <Transacao />,
  },
  {
    name: "Lances",
    layout: "/admin",
    admin: true,
    path: "lances",
    icon: <MdLandslide className="h-6 w-6" />,
    component: <LancesList />,
  },
  {
    name: "Ações",
    layout: "/admin",
    path: "acoes",
    admin: true,
    icon: <FaHistory className="h-6 w-6" />,
    component: <AcoesSistema />,
  },
  {
    name: "Moderação de Conteúdo",
    layout: "/admin",
    admin: true,
    path: "moderacao",
    icon: <FaExclamationTriangle className="inline-block h-6 w-6" />,
    component: <ModeracaoConteudo />,
  },
  {
    name: "Suporte ao Cliente",
    layout: "/admin",
    path: "suporte",
    admin: true,
    icon: <FaHeadset className="inline-block h-6 w-6" />,
    component: <SuporteCliente />,
  },
  {
    name: "Configurações Gerais",
    layout: "/admin",
    admin: false,
    path: "geral",
    icon: <FaCog className="h-6 w-6" />,
    component: <ConfiguracaoPlataforma />,
  },
  {
    name: "Segurança",
    layout: "/admin",
    admin: false,
    path: "seguranca",
    icon: <FaShieldAlt className="h-6 w-6" />,
    component: <Seguranca />,
  },
  {
    name: "Admins",
    layout: "/admin",
    icon: <FaKey className="inline-block h-5 w-5" />,
    path: "admins",
    admin: true,
    component: <GerenciamentoAdmins />,
  },
  {
    name: "Perfil",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    admin: true,
    component: <Profile />,
  },
  {
    name: "Perfil Usuário",
    layout: "/admin",
    path: "perfiluser/:id",
    icon: <MdPerson className="h-6 w-6" />,
    admin: false,
    component: <PerfilUsuario />,
  },
  {
    name: "Perfil Funcionário",
    layout: "/admin",
    path: "funcionario/:id",
    icon: <MdPerson className="h-6 w-6" />,
    admin: false,
    component: <PerfilFuncionario />,
  },
  {
    name: "Perfil Funcionário do Posto",
    layout: "/admin",
    path: "funcionario-posto/:id",
    icon: <MdPerson className="h-6 w-6" />,
    admin: false,
    component: <PerfilFuncionario2 />,
  },
  {
    name: "Perfil Empresa",
    layout: "/admin",
    path: "perfilempresa/:id",
    icon: <MdPerson className="h-6 w-6" />,
    admin: false,
    component: <PerfilEmpresa />,
  },
];

export default routes;