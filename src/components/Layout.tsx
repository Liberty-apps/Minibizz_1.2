import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar,
  Settings, 
  LogOut,
  HelpCircle,
  Scale,
  Newspaper,
  Handshake,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import FloatingMissionButton from './FloatingMissionButton';
import FloatingMenuButton from './FloatingMenuButton';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Devis & Factures', href: '/devis', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Planning', href: '/planning', icon: Calendar },
    { name: 'Partage de Missions', href: '/missions', icon: Handshake },
    { name: 'Actualités & Emplois', href: '/actualites-emplois', icon: Newspaper },
    { name: 'Aide', href: '/aide', icon: HelpCircle },
    { name: 'Légal', href: '/legal', icon: Scale },
    { name: 'Paramètres', href: '/parametres', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié - juste le logo */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobile && location.pathname !== '/' && (
            <button 
              onClick={handleBack}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MiniBizz</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-4 space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="px-4 pb-4">
                  <button
                    onClick={handleLogout}
                    className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Floating Buttons */}
          <FloatingMissionButton />
          <FloatingMenuButton navigation={navigation} onLogout={handleLogout} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;