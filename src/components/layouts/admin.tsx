import { Button } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CollapsedContext } from "../../contexts/CollapsedContext";
import {
  ActiveCompanyContext,
  CompaniesContext,
  CompanyIDContext,
} from "../../contexts/CompanyContext";
import { LoadingContext } from "../../contexts/LoadingContext";
import { MemberContext, ProfileContext } from "../../contexts/ProfileContext";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import { getProfile } from "../../services/api/authApi";
import { getSetting } from "../../services/api/commonApi";
import { asyncStorage } from "../../utils/async_storage";
import {
  LOCAL_STORAGE_COMPANY_ID,
  LOCAL_STORAGE_TOKEN,
} from "../../utils/constants";
import Loading from "../Loading";
import Sidebar from "../sidebar";
import Topnav from "../topnav";
import { RiFolderForbidLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
  isCooperative?: boolean;
  permission?: string;
}

const AdminLayout: FC<AdminLayoutProps> = ({
  children,
  isCooperative,
  permission,
}) => {
  const { t } = useTranslation();
  const { activeCompany, setActiveCompany } = useContext(ActiveCompanyContext);
  const { profile, setProfile } = useContext(ProfileContext);
  const { member, setMember } = useContext(MemberContext);
  const { pathname } = useLocation();
  const { isWsConnected, setWsConnected, wsMsg, setWsMsg } =
    useContext(WebsocketContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [socketUrl, setSocketUrl] = useState(``);
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const { companyID, setCompanyID } = useContext(CompanyIDContext);
  const { companies, setCompanies } = useContext(CompaniesContext);
  const [token, setToken] = useState("");
  const nav = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(socketUrl, {
      onMessage(event) {
        console.log("Received message:", event.data);
        setWsMsg(JSON.parse(event.data));
      },
      onOpen() {
        console.log("Connected to the web socket");
        setWsConnected(true);
      },
      onClose() {
        console.log("Disconnected from the web socket");
        setWsConnected(false);
      },
      queryParams: {
        token: token,
      },
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    getProfile().then((res: any) => {
      setProfile(res.user);
      setCompanies(res.user.companies);
      setMember(res.member);
    });
  }, [mounted]);

  useEffect(() => {
    if (mounted && companyID) {
      getSetting()
        .then((val: any) => setActiveCompany(val.data))
        .catch((err) => {});
      asyncStorage.getItem(LOCAL_STORAGE_TOKEN).then((token) => {
        setToken(token);
        asyncStorage.getItem(LOCAL_STORAGE_COMPANY_ID).then((id) => {
          if (!id) return;
          let url = `${process.env.REACT_APP_BASE_WS_URL}/api/v1/ws/${id}`;
          setSocketUrl(url);
        });
      });
    }
  }, [mounted, companyID]);

  const checkPermission = () => {
    if (isCooperative) {
      if (!activeCompany?.is_cooperation) return false;
    }
    if (!permission) return true;
    if (profile?.roles?.length == 0) return false;
    if (profile?.roles![0].permission_names) {
      return profile?.roles![0].permission_names.includes(permission);
    }
    return false;
  };

  const renderCreateCompany = () => {
    return (
      <div
        className="flex flex-row items-center justify-center h-full   w-full"
        style={{
          backgroundSize: "cover",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1738251396922-b6ef53f67b72")',
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white p-16 bg-opacity-50 rounded-lg shadow-md w-1/2">
          <div className="mb-8">
            <h2 className="text-lg font-bold">{t("create_company_first")}</h2>
            <p>
              {t(
                "you_need_to_create_a_company_organization_first_to_access_this_page"
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-16 rounded-lg shadow-lg min-h-[400px] flex space-y-8 flex-col justify-between items-center">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <img src="/logo-koperasi.jpg" alt="" className="w-12" />
                </div>
                <h2 className="text-lg font-bold text-center">
                  {t("cooperative")}
                </h2>
                <p className="text-center">{t("cooperative_desc")}</p>
              </div>
              <Button
                onClick={() => nav("/create/company/cooperative")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {t("create_cooperative")}
              </Button>
            </div>
            <div className="bg-white p-16 rounded-lg shadow-lg min-h-[400px] flex space-y-8 flex-col justify-between items-center">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <img src="/sme.png" alt="" className="w-12" />
                </div>
                <h2 className="text-lg font-bold text-center">{t("sme")}</h2>
                <p className="text-center">{t("sme_desc")}</p>
              </div>
              <Button
                onClick={() => nav("/create/company/sme")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {t("create_sme")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderSelectCompany = () => {
    if ((profile?.companies ?? []).length == 0) return renderCreateCompany();
    return (
      <div
        className="flex flex-row items-center justify-center h-full   w-full"
        style={{
          backgroundSize: "cover",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1738251396922-b6ef53f67b72")',
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white p-4 rounded-md shadow-md max-w-[400px]">
          <h2 className="text-lg font-bold">Select Company First</h2>
          <p>You need to select company first to access this page</p>

          {companies?.map((c) => (
            <div
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 truncate"
              key={c.id}
              onClick={() => {
                setCompanyID(c.id!);
                getProfile().then((res: any) => {
                  setProfile(res.user);
                  setCompanies(res.user.companies);
                  setMember(res.member);
                });
                // window.location.href = "/";
              }}
            >
              <div className="font-bold">{c.name}</div>
              <small>{c.address}</small>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="w-screen h-screen  flex flex-col">
      {loading && <Loading />}
      <Toaster position="bottom-left" reverseOrder={false} />
      <Topnav />
      {pathname.includes("/create/company") ? (
        <div
          style={{
            height: "calc(100% - 65px)",
            top: 65,
            width: "100%",
          }}
          className=" fixed  "
        >
          {children}
        </div>
      ) : (
        <div className="flex flex-row flex-1">
          {companyID && (
            <aside
              style={{
                width: collapsed ? 65 : 300,
                top: 65,
                height: "calc(100% - 65px)",
              }}
              className=" bg-red-50 h-full fixed left-0 z-50"
            >
              <Sidebar />
            </aside>
          )}

          {companyID ? (
            <div
              style={{
                width: collapsed ? "calc(100% - 65px)" : "calc(100% - 300px)",
                height: "calc(100% - 65px)",
                left: collapsed ? 65 : 300,
                top: 65,
              }}
              className=" fixed  "
            >
              {checkPermission() ? (
                children
              ) : (
                <div className="flex flex-col space-y-4 items-center justify-center h-full   w-full">
                  {/* {JSON.stringify(profile?.roles![0].permission_names)} */}
                  <RiFolderForbidLine className="w-12 h-12 text-gray-600" />
                  <span>You don't have permission to access this page</span>
                </div>
              )}
            </div>
          ) : (
            renderSelectCompany()
          )}
        </div>
      )}
    </div>
  );
};
export default AdminLayout;
