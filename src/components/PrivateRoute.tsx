import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!currentUser) {
      router.replace('/(auth)/login');
    }
  }, [currentUser]);
  
  return currentUser ? <>{children}</> : null;
};

export default PrivateRoute;