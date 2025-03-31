import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountPage from "../pages/AccountPage";
import AccountReport from "../pages/AccountReport";
import ConnectionDetail from "../pages/ConnectionDetail";
import CreateCompanyPage from "../pages/CreateCompanyPage";
import Home from "../pages/Home";
import JournalDetail from "../pages/JournalDetail";
import JournalPage from "../pages/JournalPage";
import ProfilePage from "../pages/ProfilePage";
import SalesPage from "../pages/SalesPage";
import SettingPage from "../pages/SettingPage";
import TaxPage from "../pages/TaxPage";
import TransactionPage from "../pages/TransactionPage";
import ContactPage from "../pages/ContactPage";
import SalesDetail from "../pages/SalesDetail";

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
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/contact" element={<ContactPage />} />
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
