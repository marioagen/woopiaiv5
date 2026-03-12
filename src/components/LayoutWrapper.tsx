import React from 'react';
import { Layout } from './Layout';
import { useNavigation } from '../hooks/useNavigation';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { currentPage, navigate } = useNavigation();

  return (
    <Layout currentPage={currentPage} onNavigate={navigate}>
      {children}
    </Layout>
  );
}