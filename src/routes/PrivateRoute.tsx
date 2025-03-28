import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ProjectDetail from "../pages/ProjectDetail";
import ProjectPage from "../pages/ProjectPage";
import TaskPage from "../pages/TaskPage";
import MemberPage from "../pages/MemberPage";
import InboxPage from "../pages/Inbox";
import ChatPage from "../pages/ChatPage";
import ProfilePage from "../pages/ProfilePage";
import FormPage from "../pages/FormPage";
import FormTempateDetail from "../pages/FormTempateDetail";
import FormDetail from "../pages/FormDetail";
import FormPublicPage from "../pages/FormPublicPage";
import ContactPage from "../pages/ContactPage";
import SettingPage from "../pages/SettingPage";
import GeminiAgentPage from "../pages/GeminiAgentPage";
import GeminiAgentDetail from "../pages/GeminiAgentDetail";
import TaskAttributePage from "../pages/TaskAttributePage";
import TaskAttributeDetail from "../pages/TaskAttributeDetail";
import ConnectionPage from "../pages/ConnectionPage";
import ConnectionDetail from "../pages/ConnectionDetail";
import WhatsappPage from "../pages/WhatsappPage";
import CreateCompanyPage from "../pages/CreateCompanyPage";
import AccountPage from "../pages/AccountPage";
import TransactionPage from "../pages/TransactionPage";
import AccountReport from "../pages/AccountReport";

interface PrivateRouteProps {}

const PrivateRoute: FC<PrivateRouteProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create/company/:companyType" element={<CreateCompanyPage />} />
      <Route path="/company/:companyId" element={<ConnectionDetail />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/:accountId/report" element={<AccountReport />} />
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/setting" element={<SettingPage />} />
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
      <Route path="/contact" element={<ContactPage />} />
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
