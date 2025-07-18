import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children, currentPage, setCurrentPage, title, subtitle, headerActions, showSearch = true }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header 
          title={title} 
          subtitle={subtitle}
          actions={headerActions}
          showSearch={showSearch}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
