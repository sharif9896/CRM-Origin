import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import WorkspaceTools from '../components/workspace/workspaceTools';
import { useLayout } from "../hooks/useLayout";
import AccessProvider from '../context/accessContext';
import RequirePermission from '../routes/requirePermission';

const PublicLayoutContent = () => {
  const { mobileSidebar, closeMobileSidebar } = useLayout();

  return (
    <div className={`main-wrapper ${mobileSidebar ? "slide-nav" : ""}`}>
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <main>
          <RequirePermission><WorkspaceTools /><Outlet /></RequirePermission>
        </main>
        <Footer />
      </div>
      <div
        className={`sidebar-overlay ${mobileSidebar ? "opened" : ""}`}
        onClick={closeMobileSidebar}
      />
    </div>
  );
};

const PublicLayout = () => <AccessProvider><PublicLayoutContent /></AccessProvider>;

export default PublicLayout;
