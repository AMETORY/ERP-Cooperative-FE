import { HR, Tooltip } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { AiOutlineDashboard, AiOutlineTransaction } from "react-icons/ai";
import {
  BsBank,
  BsCartCheck,
  BsGear,
  BsJournal,
  BsPeople,
} from "react-icons/bs";
import { GoTasklist } from "react-icons/go";
import {
  HiChartPie,
  HiOutlineChartPie,
  HiOutlineReceiptPercent,
} from "react-icons/hi2";
import { LuContact2, LuPowerOff, LuWarehouse } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbFileInvoice, TbReportAnalytics } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CollapsedContext } from "../contexts/CollapsedContext";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import { MemberContext, ProfileContext } from "../contexts/ProfileContext";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_COMPANY_ID,
  LOCAL_STORAGE_TOKEN,
} from "../utils/constants";
import Logo from "./logo";
import { FaChartLine, FaWpforms } from "react-icons/fa6";
import { MdOutlineSavings, MdSavings } from "react-icons/md";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const { member } = useContext(MemberContext);
  const { profile } = useContext(ProfileContext);
  const { collapsed } = useContext(CollapsedContext);
  const [mounted, setMounted] = useState(false);
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);
  const [sentUnreadCount, setSentUnreadCount] = useState(0);
  const [indexUnreadChat, setIndexUnreadChat] = useState(0);
  const [waUnreadChat, setWaUnreadChat] = useState(0);
  const { activeCompany } = useContext(ActiveCompanyContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nav = useNavigate();

  useEffect(() => {
    if (mounted) {
      // getInboxMessagesCount()
      //   .then((resp: any) => setInboxUnreadCount(resp.data))
      //   .catch(console.error);
      // getSentMessagesCount()
      //   .then((resp: any) => setSentUnreadCount(resp.data))
      //   .catch(console.error);
    }
  }, [mounted]);

  const handleNavigation =
    (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      nav(path);
    };

  const checkPermission = (permission: string) => {
    if (profile?.roles?.length == 0) return false;
    if (profile?.roles![0].permission_names) {
      return profile?.roles![0].permission_names.includes(permission);
    }
    return false;
  };
  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col">
      <Logo collapsed={collapsed} />
      <div className="mb-4"></div>
      <ul className="space-y-2 font-medium flex-1 h-[calc(100vh-100px)] overflow-y-auto">
        <>
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/")}
            >
              <Tooltip content="Dashboard">
                <AiOutlineDashboard />
              </Tooltip>
              {!collapsed && <span className="ms-3">Dashboard</span>}
            </span>
          </li>
        </>
        {checkPermission("menu:admin:feature") && (
          <>
            <HR />
            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Feature
            </li>
          </>
        )}
        {checkPermission("finance:account:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/account")}
            >
              <Tooltip content="Account">
                <GoTasklist />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Account</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:transaction:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/transaction")}
            >
              <Tooltip content="Transaction">
                <AiOutlineTransaction />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Transaction
                </span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:journal:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/journal")}
            >
              <Tooltip content="Journal">
                <BsJournal />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Journal</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("order:sales:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/sales")}
            >
              <Tooltip content="Sales">
                <TbFileInvoice />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Sales</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("inventory:purchase:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/purchase")}
            >
              <Tooltip content="Purchase">
                <BsCartCheck />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Purchase</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:report:menu") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/report")}
            >
              <Tooltip content="Report">
                <TbReportAnalytics />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Report</span>
              )}
            </span>
          </li>
        )}
        {/* 
        {checkPermission("project_management:project:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/project")}
            >
              <Tooltip content="Project">
                <BsKanban />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Project</span>
              )}
            </span>
          </li>
        )}
        <li className="" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={handleNavigation("/inbox")}
          >
            <Tooltip content="Inbox">
              <HiOutlineInboxArrowDown />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
            )}
            {!collapsed && inboxUnreadCount + sentUnreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {inboxUnreadCount + sentUnreadCount}
              </span>
            )}
          </span>
        </li>
        <li className="" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={async () => {
              let channelID = await asyncStorage.getItem(
                LOCAL_STORAGE_DEFAULT_CHANNEL
              );
              if (channelID) {
                nav(`/chat/${channelID}`);
              } else {
                nav(`/chat`);
              }
            }}
          >
            <Tooltip content="Chat">
              <HiOutlineChat />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
            )}
            {!collapsed && indexUnreadChat > 0 && (
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {indexUnreadChat}
              </span>
            )}
          </span>
        </li>
        <HR />
        <li className="text-xs text-gray-300" style={{}}>
          Omni Channel
        </li>
        {checkPermission("customer_relationship:whatsapp:read") && (
        <li className="" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={async () => {
              let sessionID = await asyncStorage.getItem(
                LOCAL_STORAGE_DEFAULT_WHATSAPP_SESSION
              );
              if (sessionID) {
                nav(`/whatsapp/${sessionID}`);
              } else {
                nav(`/whatsapp`);
              }
            }}
          >
            <Tooltip content="Whatsapp">
              <BsWhatsapp />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">Whatsapp</span>
            )}
            {!collapsed && waUnreadChat > 0 && (
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {waUnreadChat}
              </span>
            )}
          </span>
        </li>
        )}
        */}
        {checkPermission("menu:admin:inventory") && (
          <>
            <HR />
            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Inventory
            </li>
          </>
        )}
        {checkPermission("inventory:product:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/product")}
            >
              <Tooltip content="Product">
                <RiShoppingBagLine />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Product</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("inventory:warehouse:read") && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/warehouse")}
            >
              <Tooltip content="Warehouse">
                <LuWarehouse />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Warehouse</span>
              )}
            </span>
          </li>
        )}

        {activeCompany?.is_cooperation && (
          <>
            <HR />
            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Cooperative{" "}
            </li>
            {checkPermission("cooperative:cooperative_member:invite") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/member")}
                >
                  <Tooltip content="Member">
                    <BsPeople />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Member
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:loan_application:request") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/loan/request")}
                >
                  <Tooltip content="Loan Request">
                    <FaWpforms />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Loan Request
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:loan_application:read") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/loan")}
                >
                  <Tooltip content="Loan ">
                    <BsBank />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">Loan</span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:loan_application:my") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/loan/my")}
                >
                  <Tooltip content="Loan ">
                    <BsBank />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">My Loan</span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:saving:read") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/saving")}
                >
                  <Tooltip content="Saving">
                    <MdOutlineSavings />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Saving
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:saving:my") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/saving/my")}
                >
                  <Tooltip content="Saving">
                    <MdOutlineSavings />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      My Saving
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:net_surplus:read") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/net_surplus")}
                >
                  <Tooltip content="Net Surplus">
                    <HiOutlineChartPie />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Net Surplus
                    </span>
                  )}
                </span>
              </li>
            )}
          </>
        )}
        {checkPermission("menu:admin:preferences") && (
          <>
            <HR />

            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Preferences
            </li>
            {checkPermission("finance:tax:read") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/tax")}
                >
                  <Tooltip content="Tax">
                    <HiOutlineReceiptPercent />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">Tax</span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("contact:all:read") && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/contact")}
                >
                  <Tooltip content="Contact">
                    <LuContact2 />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Contact
                    </span>
                  )}
                </span>
              </li>
            )}
            {profile?.roles && profile?.roles[0].is_super_admin && (
              <li className="" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/setting")}
                >
                  <Tooltip content="Setting">
                    <BsGear />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Setting
                    </span>
                  )}
                </span>
              </li>
            )}
          </>
        )}

        {/* 
        {checkPermission("customer_relationship:form:read") && (
        <li className="" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={handleNavigation("/form")}
          >
            <Tooltip content="Form">
              <SiGoogleforms />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">Form</span>
            )}
          </span>
        </li>
        )}
        {checkPermission("project_management:project:update") && (
        <li className="" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={handleNavigation("/task-attribute")}
          >
            <Tooltip content="Task Attribute">
              <BsAsterisk />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">
                Task Attribute
              </span>
            )}
          </span>
        </li>
        )}
        {member?.role?.is_super_admin && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/gemini-agent")}
            >
              <Tooltip content="Gemini Agent">
                <MdOutlineAssistant />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Gemini Agent
                </span>
              )}
            </span>
          </li>
        )}
      
        {/* {member?.role?.is_super_admin && (
          <li className="" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/connection")}
            >
              <Tooltip content="Connection">
                <LuLink2 />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Connection
                </span>
              )}
            </span>
          </li>
        )} */}
      </ul>
      <div
        className="flex flex-row gap-2 items-center cursor-pointer hover:font-bold px-2 mt-4"
        onClick={async () => {
          await asyncStorage.removeItem(LOCAL_STORAGE_TOKEN);
          await asyncStorage.removeItem(LOCAL_STORAGE_COMPANIES);
          await asyncStorage.removeItem(LOCAL_STORAGE_COMPANY_ID);
          window.location.reload();
        }}
      >
        <Tooltip content="Logout">
          <LuPowerOff />
        </Tooltip>
        {!collapsed && <span>Logout</span>}
      </div>
    </div>
  );
};
export default Sidebar;
