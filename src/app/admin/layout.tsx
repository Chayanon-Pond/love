import React from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = false;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="admin-layout">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
