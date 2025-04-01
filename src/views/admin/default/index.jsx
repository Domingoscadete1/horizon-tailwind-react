import { useEffect,useState } from "react";
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
import Config from "../../../Config";
import { fetchWithToken } from '../../../authService';




const API_BASE_URL = Config.getApiUrl();

const Dashboard = () => {
  const[dados,setDados]=useState();
  const [loading, setLoading] = useState(true); // Para indicar carregamento
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
          method:'GET',
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        }); // URL da API
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
        setLoading(false); // Finaliza o carregamento
    }
};

useEffect(() => {
    fetchDados();
}, []);
  
  return (
    <div>
      {/* Card widget */}

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

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
