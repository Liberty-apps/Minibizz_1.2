import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DevisFactures from './pages/DevisFactures';
import Clients from './pages/Clients';
import Planning from './pages/Planning';
import Missions from './pages/Missions';
import ActualitesEmplois from './pages/ActualitesEmplois';
import Aide from './pages/Aide';
import Legal from './pages/Legal';
import Parametres from './pages/Parametres';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Gestion du bouton retour sur Android
    const handleBackButton = () => {
      // Vérifier si on est dans un environnement Capacitor
      if ((window as any).Capacitor) {
        const { App: CapApp } = (window as any).Capacitor;
        CapApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            // Demander confirmation avant de quitter l'app
            if (confirm('Voulez-vous quitter l\'application ?')) {
              CapApp.exitApp();
            }
          }
        });
        
        return () => {
          CapApp.removeAllListeners();
        };
      }
    };

    handleBackButton();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="devis" element={<DevisFactures />} />
            <Route path="clients" element={<Clients />} />
            <Route path="planning" element={<Planning />} />
            <Route path="missions" element={<Missions />} />
            <Route path="actualites-emplois" element={<ActualitesEmplois />} />
            <Route path="aide" element={<Aide />} />
            <Route path="legal" element={<Legal />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;