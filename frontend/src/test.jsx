// AdminPortal.jsx
import React, { useState, useEffect, useRef } from 'react';
import './admin.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Dummy data
const dummyData = {
  users: [
    { id: 1, name: 'Priya Sharma', email: 'priya.s@example.com', status: 'Active', joinDate: '2025-08-15', confidence: 0.75, avatar: 'https://placehold.co/100x100/f87171/ffffff?text=P', journal: [{mood: 5, note: "Felt great after the exam!"}, {mood: 3, note: "A bit stressed today."}], moodHistory: [4,3,5,4,2,3,4] },
    { id: 2, name: 'Arjun Verma', email: 'arjun.v@example.com', status: 'Active', joinDate: '2025-08-20', confidence: -0.21, avatar: 'https://placehold.co/100x100/60a5fa/ffffff?text=A', journal: [{mood: 2, note: "Feeling very homesick."}, {mood: 1, note: "Struggling with coursework."}], moodHistory: [3,2,2,1,3,2,1] },
    { id: 3, name: 'Sneha Patel', email: 'sneha.p@example.com', status: 'Muted', joinDate: '2025-08-22', confidence: 0.43, avatar: 'https://placehold.co/100x100/fbbf24/ffffff?text=S', journal: [{mood: 4, note: "Had a nice chat with a friend."}], moodHistory: [5,4,5,4,4,5,4] },
    { id: 4, name: 'Rohan Joshi', email: 'rohan.j@example.com', status: 'Banned', joinDate: '2025-08-18', confidence: -0.89, avatar: 'https://placehold.co/100x100/a78bfa/ffffff?text=R', journal: [], moodHistory: [2,1,1,2,1,1,1] }
  ],
  moderationRequests: [
    { id: 1, userName: 'Vikram Singh', group: 'Academic Stress Support', date: '2025-09-08' },
    { id: 2, userName: 'Meera Iyer', group: 'Anxiety & Mindfulness', date: '2025-09-09' }
  ],
};

// Custom hook for toast notifications
const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return { toast, showToast };
};

// Toast Component
const Toast = ({ toast }) => {
  return (
    <div className={`toast ${toast.show ? 'visible' : ''}`}>
      {toast.message}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button className="text-gray-400 hover:text-gray-800" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Login Component
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@mindmate.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-container space-y-8">
        <div className="text-center">
          <div className="h-20 w-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-12 w-12 text-blue-600" viewBox="0 0 100 100">
              <path d="M50,5 C74.85,5 95,25.15 95,50 C95,74.85 74.85,95 50,95 C25.15,95 5,74.85 5,50 C5,33.4 16.8,19.3 31.8,15.7 C30.6,18.4 30,21.6 30,25 C30,41.57 43.43,55 60,55 C67.5,55 74.2,52.2 79.1,48.1 C88.5,55.9 95,66.9 95,79 C95,81.21 94.79,83.35 94.4,85.4 C88.2,91.5 80,95 71,95 C54.43,95 40,81.57 40,65 C40,61.9 40.4,59 41.2,56.3 C30.7,56.1 22,47.3 22,37 C22,34.8 22.3,32.7 22.9,30.7 C14.3,34.9 8.5,43.3 8.5,53 C8.5,59.9 12.3,66 18,69.1" fill="#8BC34A" fillOpacity="0.6"/>
              <circle cx="60" cy="35" r="20" fill="#ADD8E6" fillOpacity="0.7"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-800">Admin Portal Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activePage, setActivePage, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-极速飞艇3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'users', label: 'User Management', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 极速飞艇21a6 6 0 00-9-5.197" />
      </svg>
    )},
    { id: 'moderation', label: 'Group Moderation', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )}
  ];

  return (
    <aside className="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600" viewBox="0 0 100 100">
              <path d="M50,5 C74.85,5 95,25.15 95,50 C95,74.85 74.85,95 50,95 C25.15,95 5,74.85 5,50 C5,33.4 16.8,19.3 31.8,15.7 C30.6,18.4 30,21.6 30,25 C30,41.57 43.43,55 60,55 C67.5,55 74.2,52.2 79.1,48.1 C88.5,55.9 95,66.9 95,79 C95,81.21 94.79,83.35 94.4,85.4 C88.2,91.5 80,95 71,95 C54.43,95 40,81.57 40,65 C40,61.9 40.4,59 41.2,56.3 C30.7,56.极速飞艇1 22,47.3 22,37 C22,34.8 22.3,32.7 22.9,30.极速飞艇7 C14.3,34.9 8.5,43.3 8.5,53 C8.5,59.9 12.3,66 18,69.1" fill="#8BC34A" fillOpacity="0.6"/>
              <circle cx="60" cy="35" r="20" fill="#ADD8E6" fillOpacity="0.7"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-800">Admin Panel</span>
        </div>
      </div>
      <nav className="mt-6 flex-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            {item.icon}
            <span className="mx-4">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-6">
        <button
          className="sidebar-link"
          onClick={onLogout}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="mx-4">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// Dashboard Component
const Dashboard = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Average Mood',
            data: [3.2, 3.5, 3.1, 3.8, 4.1, 4.0, 3.7],
            backgroundColor: 'rgba(43, 108, 176, 0.2)',
            borderColor: '#2B6CB0',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 1,
              max: 5
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="dashboard-card">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
            <p className="text-3xl font-bold text-gray-800">{data.users.filter(u => u.status !== 'Banned').length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3极速飞艇v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
            </svg>
          </div>
        </div>
        <div className="dashboard-card">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
            <p className="text-3xl font-bold text-red-600">{data.moderationRequests.length}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 极速飞艇0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.极速飞艇042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div className="dashboard-card">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Counselors</h3>
            <p className="text-3xl font-bold text-gray-800">4</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div className="dashboard-card">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Flagged Messages</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4.5A1.5 1.5 0 014.5 15h15a1.5 1.5 0 011.5 1.5V21M4 11V9a4 4 0 014-4h8a4 4 0 014 4v2" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Overall Mood Trends (Last 7 Days)</h3>
        <div className="h-80">
          <canvas ref={chartRef} id="mainMoodChart"></canvas>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = ({ data, onViewUser, onMuteUser, onBanUser }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="data-table">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-5 py-3 table-header text-left">User</th>
              <th className="px-5 py-3 table-header text-left">Status</th>
              <th className="px-5 py-3 table-header text-left">Join Date</th>
              <th className="px-5 py-3 table-header text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.users.map(user => (
              <tr key={user.id} className="table-row">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`status-badge ${
                    user.status === 'Active' ? 'status-active' : 
                    user.status === 'Muted' ? 'status-muted' : 
                    'status-banned'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewUser(user)}
                    className="text-blue-700 hover:text-blue-800 mr-3"
                  >
                    View Profile
                  </button>
                  {user.status === 'Active' && (
                    <button
                      onClick={() => onMuteUser(user)}
                      className="text-yellow-600 hover:text-yellow-800 mr-3"
                    >
                      Mute
                    </button>
                  )}
                  {user.status !== 'Banned' ? (
                    <button
                      onClick={() => onBanUser(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => onBanUser(user, false)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Unban
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, isOpen, onClose, onMute, onBan }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (isOpen && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Day 1', '2', '3', '4', '5', '6', '7'],
          datasets: [{
            data: user.moodHistory,
            borderColor: '#8BC34A',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              min: 1,
              max: 5
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isOpen, user]);

  if (!user) return null;

  const confidenceColor = user.confidence > 0.5 ? 'text-green-600' : (user.confidence < 0 ? 'text-red-600' : 'text-yellow-600');
  const journalHtml = user.journal.length > 0 ? user.journal.map((j, index) => (
    <div key={index} className="p-3 bg-gray-50 rounded-md border-l-4" style={{ borderLeftColor: `var(--mood-${j.mood})` }}>
      <p className="font-semibold">Mood: {j.mood}/5</p>
      <p className="text-sm mt-1">{j.note}</p>
    </div>
  )) : <p className="text-gray-500">No journal entries found.</p>;

  return (
    <Modal isOpen={isOpen} title={`User Profile: ${user.name}`} on极速飞艇Close={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 text-center">
          <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg" alt={user.name} />
          <p className="font-bold text-lg">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Confidence Rating</p>
            <p className={`text-2xl font-bold ${confidenceColor}`}>{user.confidence.toFixed(2)}</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => onMute(user)}
              className="w-full bg-yellow-400 text-yellow-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500"
            >
              {user.status === 'Muted' ? 'Unmute User' : 'Mute User'}
            </button>
            <button
              onClick={() => onBan(user)}
              className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600"
            >
              {user.status === 'Banned' ? 'Unban User' : 'Ban User'}
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Mood History (Last 7 Days)</h4>
            <div className="h-48">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recent Journal Entries</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {journalHtml}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Moderation Component
const Moderation = ({ data, onApprove, onDeny }) => {
  if (data.moderationRequests.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
          <p className="text-gray-500">There are no pending requests to join support groups.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="data-table">
        <h3 className="text-xl font-semibold p-5">Pending Join Requests</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-5 py-3 table-header text-left">User</th>
              <th className="px-5 py-3 table-header text-left">Group</th>
              <th className="px-5 py-3 table-header text-left">Date</th>
              <th className="px-5 py-3 table-header text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.moderationRequests.map(req => (
              <tr key={req.id} className="table-row">
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.userName}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{req.group}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onApprove(req.id)}
                    className="bg-green-100 text-green-800 font-semibold py-1 px-3 rounded-full hover:bg-green-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onDeny(req.id)}
                    className="bg-red-100 text-red-800 font-semibold py-1 px-3 rounded-full hover:bg-red-200 ml-4"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Admin Panel Component
const AdminPanel = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [data, setData] = useState(dummyData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { toast, showToast } = useToast();

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleMuteUser = (user) => {
    const newStatus = user.status === 'Muted' ? 'Active' : 'Muted';
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    }));
    showToast(`${user.name} has been ${newStatus === 'Muted' ? 'muted' : 'unmuted'}`);
    setIsUserModalOpen(false);
  };

  const handleBanUser = (user, ban = true) => {
    const newStatus = ban ? 'Banned' : 'Active';
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    }));
    showToast(`${user.name} has been ${ban ? 'banned' : 'unbanned'}`);
    setIsUserModalOpen(false);
  };

  const handleApproveRequest = (id) => {
    setData(prev => ({
      ...prev,
      moderationRequests: prev.moderationRequests.filter(req => req.id !== id)
    }));
    showToast(`Request #${id} has been approved.`);
  };

  const handleDenyRequest = (id) => {
    setData(prev => ({
      ...prev,
      moderationRequests: prev.moderationRequests.filter(req => req.id !== id)
    }));
    showToast(`Request #${id} has been denied.`);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'users':
        return (
          <UserManagement
            data={data}
            onViewUser={handleViewUser}
            onMuteUser={handleMuteUser}
            onBanUser={handleBanUser}
          />
        );
      case 'moderation':
        return (
          <Moderation
            data={data}
            onApprove={handleApproveRequest}
            onDeny={handleDenyRequest}
          />
        );
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <div className="admin-container">
      <div className="flex h-screen">
        <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-6 bg-white border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {activePage === 'dashboard' && 'Dashboard'}
              {activePage === 'users' && 'User Management'}
              {activePage === 'moderation' && 'Support Group Moderation'}
            </h2>
            <p className="text-sm text-gray-500">Welcome, Admin!</p>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>

      <UserDetailModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onMute={handleMuteUser}
        onBan={handleBanUser}
      />

      <Toast toast={toast} />
    </div>
  );
};

// Main App Component
const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AdminPortal;