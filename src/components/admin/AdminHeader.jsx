import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const navigate = useNavigate();

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem("x-admin-key");
    navigate("/admin/login");
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* Dashboard Title */}
      <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-primary hover:text-gray-900 transition-all duration-200"
        aria-label="Logout"
      >
        <FaSignOutAlt className="text-sm" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
};

export default AdminHeader;