import React from 'react';
import { LandSafeProvider, useLandSafe } from './context/LandSafeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FlowBreadcrumb } from './components/FlowBreadcrumb';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { AiPredictionPage } from './pages/AiPredictionPage';
import { SensorsPage } from './pages/SensorsPage';
import { EarlyWarningSystemPage } from './pages/EarlyWarningSystemPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LocationDetailsPage } from './pages/LocationDetailsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

const AppContent: React.FC = () => {
  const { user, activePage } = useLandSafe();

  // If user is not logged in or on the login page, show Login View
  if (!user || activePage === 'login') {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'map':
      case 'live-map':
        return <LiveMapPage />;
      case 'ai-prediction':
        return <AiPredictionPage />;
      case 'sensors':
        return <SensorsPage />;
      case 'early-warning':
        return <EarlyWarningSystemPage />;
      case 'alerts':
        return <AlertCenterPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'locations':
        return <LocationDetailsPage />;
      case 'admin':
        return <AdminPanelPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Container with Sidebar and Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar />

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-925 to-slate-950">
          {/* User Flow Breadcrumb Navigation */}
          <FlowBreadcrumb />

          {/* Active Page View */}
          <div className="pb-12">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Real-time Emergency Alert Modal Popup */}
      <EmergencyAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <LandSafeProvider>
      <AppContent />
    </LandSafeProvider>
  );
}
