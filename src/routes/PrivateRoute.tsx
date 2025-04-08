import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountPage from "../pages/AccountPage";
import AccountReport from "../pages/AccountReport";
import BalanceSheet from "../pages/BalanceSheetReport";
import CapitalChange from "../pages/CapitalChangeReport";
import CashFlow from "../pages/CashFlow";
import CogsReport from "../pages/CogsReport";
import ConnectionDetail from "../pages/ConnectionDetail";
import ContactPage from "../pages/ContactPage";
import CooperativeMemberPage from "../pages/CooperativeMemberPage";
import CreateCompanyPage from "../pages/CreateCompanyPage";
import Home from "../pages/Home";
import JournalDetail from "../pages/JournalDetail";
import JournalPage from "../pages/JournalPage";
import ProductDetail from "../pages/ProductDetail";
import ProductPage from "../pages/ProductPage";
import ProfilePage from "../pages/ProfilePage";
import ProfitLoss from "../pages/ProfitLossReport";
import PurchaseDetail from "../pages/PurchaseDetail";
import PurchasePage from "../pages/PurchasePage";
import PurchaseReturnDetail from "../pages/PurchaseReturnDetail";
import ReportPage from "../pages/ReportPage";
import SalesDetail from "../pages/SalesDetail";
import SalesPage from "../pages/SalesPage";
import SalesReturnDetail from "../pages/SalesReturnDetail";
import SettingPage from "../pages/SettingPage";
import TaxPage from "../pages/TaxPage";
import TransactionPage from "../pages/TransactionPage";
import WarehousePage from "../pages/WarehousePage";

interface PrivateRouteProps {}

const PrivateRoute: FC<PrivateRouteProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/create/company/:companyType"
        element={<CreateCompanyPage />}
      />
      <Route path="/company/:companyId" element={<ConnectionDetail />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/:accountId/report" element={<AccountReport />} />
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/journal/:journalId" element={<JournalDetail />} />
      <Route path="/tax" element={<TaxPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/sales/:salesId" element={<SalesDetail />} />
      <Route path="/sales-return/:returnId" element={<SalesReturnDetail />} />
      <Route path="/purchase" element={<PurchasePage />} />
      <Route path="/purchase/:purchaseId" element={<PurchaseDetail />} />
      <Route path="/purchase-return/:returnId" element={<PurchaseReturnDetail />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/warehouse" element={<WarehousePage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/cogs" element={<CogsReport />} />
      <Route path="/profit-loss-statement" element={<ProfitLoss />} />
      <Route path="/balance-sheet" element={<BalanceSheet />} />
      <Route path="/cashflow-statement" element={<CashFlow />} />
      <Route path="/capital-change-statement" element={<CapitalChange />} />
      <Route path="/cooperative/member" element={<CooperativeMemberPage />} />
      {/* <Route path="/public/form/:formCode" element={<FormPublicPage />} /> */}
      {/* <Route path="/project" element={<ProjectPage />} />
      <Route path="/task" element={<TaskPage />} />
      <Route path="/member" element={<MemberPage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/chat" element={<ChatPage />} />
      
      <Route path="/form" element={<FormPage />} />
      <Route
        path="/form-template/:templateId"
        element={<FormTempateDetail />}
      />
      <Route path="/form/:formId" element={<FormDetail />} />
      <Route path="/chat/:channelId" element={<ChatPage />} />
      <Route path="/project/:projectId" element={<ProjectDetail />} />
      
      <Route path="/connection" element={<ConnectionPage />} />
      <Route path="/connection/:connectionId" element={<ConnectionDetail />} />
      <Route path="/gemini-agent" element={<GeminiAgentPage />} />
      <Route path="/task-attribute" element={<TaskAttributePage />} />
      <Route path="/whatsapp" element={<WhatsappPage />} />
      <Route path="/whatsapp/:sessionId" element={<WhatsappPage />} />
      <Route
        path="/task-attribute/:attributeId"
        element={<TaskAttributeDetail />}
      />
      <Route path="/gemini-agent/:agentId" element={<GeminiAgentDetail />} /> */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
export default PrivateRoute;
