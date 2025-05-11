import { HR, Tooltip } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { AiOutlineDashboard, AiOutlineTransaction } from "react-icons/ai";
import {
  BsActivity,
  BsBank,
  BsCartCheck,
  BsGear,
  BsJournal,
  BsPeople,
  BsShop,
} from "react-icons/bs";
import { GoTasklist } from "react-icons/go";
import {
  HiChartPie,
  HiOutlineChartPie,
  HiOutlineReceiptPercent,
} from "react-icons/hi2";
import { LuContact2, LuPowerOff, LuWarehouse } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { TbAsset, TbFileInvoice, TbReportAnalytics } from "react-icons/tb";
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
import { useTranslation } from "react-i18next";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const { t, i18n } = useTranslation();
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
    }
  }, [mounted]);

  const handleNavigation =
    (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      nav(path);
    };

  const checkPermission = (permission: string) => {
    if ((profile?.roles ?? []).length == 0) return false;
    if (profile?.roles![0].permission_names) {
      return profile?.roles![0].permission_names.includes(permission);
    }
    return false;
  };
  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col border-r z-50">
      <Logo collapsed={collapsed} />
      <div className="mb-4"></div>
      <ul className="space-y-2 font-medium flex-1 h-[calc(100vh-100px)] overflow-y-auto">
        <>
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/")}
            >
              <Tooltip content={t('dashboard')}>
                <AiOutlineDashboard />
              </Tooltip>
              {!collapsed && <span className="ms-3">{t('dashboard')}</span>}
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
              {t("feature")}
            </li>
          </>
        )}
        {checkPermission("finance:account:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/account")}
            >
              <Tooltip content={t('account')}>
                <GoTasklist />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('account')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:transaction:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/transaction")}
            >
              <Tooltip content={t('transaction')}>
                <AiOutlineTransaction />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {t('transaction')}
                </span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:asset:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/asset")}
            >
              <Tooltip content={t('asset')}>
                <TbAsset />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('asset')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:journal:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/journal")}
            >
              <Tooltip content={t('journal')}>
                <BsJournal />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('journal')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("order:sales:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/sales")}
            >
              <Tooltip content={t('sales')}>
                <TbFileInvoice />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('sales')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("order:merchant:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/merchant")}
            >
              <Tooltip content={t('merchant')}>
                <BsShop />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('merchant')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("inventory:purchase:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/purchase")}
            >
              <Tooltip content={t('purchase')}>
                <BsCartCheck />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('purchase')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("finance:report:menu") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/report")}
            >
              <Tooltip content={t('report')}>
                <TbReportAnalytics />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('report')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("menu:admin:inventory") && (
          <>
            <HR />
            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              {t('inventory')}
            </li>
          </>
        )}
        {checkPermission("inventory:product:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/product")}
            >
              <Tooltip content={t('product')}>
                <RiShoppingBagLine />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('product')}</span>
              )}
            </span>
          </li>
        )}
        {checkPermission("inventory:warehouse:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/warehouse")}
            >
              <Tooltip content={t('warehouse')}>
                <LuWarehouse />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">{t('warehouse')}</span>
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
              {t('cooperative')}
            </li>
            {member && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/activities")}
                >
                  <Tooltip content={t('my_activities')}>
                    <BsActivity />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('my_activities')}
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:cooperative_member:invite") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/member")}
                >
                  <Tooltip content={t('member')}>
                    <BsPeople />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('member')}
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:loan_application:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/loan")}
                >
                  <Tooltip content={t('loan')}>
                    <BsBank />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">{t('loan')}</span>
                  )}
                </span>
              </li>
            )}

            {checkPermission("cooperative:saving:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/saving")}
                >
                  <Tooltip content={t('saving')}>
                    <MdOutlineSavings />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('saving')}
                    </span>
                  )}
                </span>
              </li>
            )}

            {checkPermission("cooperative:net_surplus:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/net-surplus")}
                >
                  <Tooltip content={t('net_surplus')}>
                    <HiOutlineChartPie />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('net_surplus')}
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
              {t('preferences')}
            </li>
            {checkPermission("finance:tax:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/tax")}
                >
                  <Tooltip content={t('tax')}>
                    <HiOutlineReceiptPercent />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">{t('tax')}</span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("contact:all:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/contact")}
                >
                  <Tooltip content={t('contact')}>
                    <LuContact2 />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('contact')}
                    </span>
                  )}
                </span>
              </li>
            )}
            {profile?.roles && profile?.roles[0].is_super_admin && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/setting")}
                >
                  <Tooltip content={t('setting')}>
                    <BsGear />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {t('setting')}
                    </span>
                  )}
                </span>
              </li>
            )}
          </>
        )}

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
