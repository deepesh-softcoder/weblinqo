import { useState } from 'react';
import Sidebar from '../../components/common/navigation/sidebar-admin';
import AdminHeader from '../../components/admin/AdminHeader';
import AnalyticsSection from '../../components/admin/AnalyticsSection';
import UsersSection from '../../components/admin/UsersSection';
import SettingsSection from '../../components/admin/SettingsSection';
import UserModal from '../../components/admin/UserModal';

function Admin() {
  const [activeSection, setActiveSection] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

   // Function to handle when a user row/item is clicked in UsersSection
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-offWhite font-sans">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="pl-20 md:pl-64 transition-all duration-300">
        <div className="p-6">
          <AdminHeader activeSection={activeSection} />
          
          {/* Content Sections */}
          <div className="space-y-6">
            <AnalyticsSection 
              isActive={activeSection === 'analytics'} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            />
            
            <UsersSection
              isActive={activeSection === 'users'}
              onUserClick={handleUserClick}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            />
            
            <SettingsSection 
              isActive={activeSection === 'settings'} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            />
          </div>

          {/* User Modal */}
          <UserModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            userId={selectedUserId}
          />
        </div>
      </div>
    </div>
  );
}

export default Admin;