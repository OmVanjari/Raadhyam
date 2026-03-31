import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardPage from './DashboardPage';
import SongsPage from './pages/SongsPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistsPage from './pages/ArtistsPage';
import PlaylistsPage from './pages/PlaylistsPage';
import UsersPage from './pages/UsersPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

const MainDashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':     return <DashboardPage />;
      case 'songs':         return <SongsPage />;
      case 'albums':        return <AlbumsPage />;
      case 'artists':       return <ArtistsPage />;
      case 'playlists':     return <PlaylistsPage />;
      case 'students':
      case 'users':         return <UsersPage />;
      case 'subscriptions': return <SubscriptionsPage />;
      case 'analytics':     return <AnalyticsPage />;
      case 'settings':      return <SettingsPage />;
      default:              return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default MainDashboardAdmin;
