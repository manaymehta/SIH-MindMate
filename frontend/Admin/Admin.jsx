import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Using 'chart.js/auto' for tree-shaking
import axiosInstance from '../utils/axiosInstance';

// --- Global Styles Component ---
const GlobalStyles = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            body {
                font-family: 'Inter', sans-serif;
            }

            /* Custom scrollbar for a cleaner look */
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            ::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);
        // Cleanup function to remove the style when the component unmounts
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null; // This component does not render anything itself
};


// --- Chart Component ---
const SentimentChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [
                    {
                        label: 'Sentiment',
                        data: data.map(d => d.sentiment),
                        borderColor: 'rgb(79, 70, 229)',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgb(79, 70, 229)',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                    {
                        label: 'Confidence',
                        data: data.map(d => d.confidence),
                        borderColor: 'rgb(22, 163, 74)',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: 'rgb(22, 163, 74)',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: -1.1,
                        max: 1.1,
                        grid: { color: '#e5e7eb' },
                        ticks: { stepSize: 0.2 },
                    },
                    x: {
                        grid: { display: false },
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 14 } },
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => `${context.dataset.label || ''}: ${context.parsed.y.toFixed(2)}`,
                        },
                    },
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            },
        });

        // Cleanup function to destroy chart on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

const ConfidenceChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, index) => `Entry ${index + 1}`),
                datasets: [
                    {
                        label: 'Confidence',
                        data: data,
                        borderColor: 'rgb(22, 163, 74)',
                        backgroundColor: 'rgba(22, 163, 74, 0.5)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};


// --- Main App Component ---
function Admin() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confidenceData, setConfidenceData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get('/auth/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        try {
            const { data } = await axiosInstance.get(`/auth/users/${user._id}/confidence`);
            setConfidenceData(data);
        } catch (error) {
            console.error('Error fetching confidence data:', error);
            setConfidenceData([]);
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="flex h-screen bg-gray-100 text-gray-800">
                {/* Sidebar for User List */}
                <aside className="w-1/4 max-w-sm bg-white shadow-lg flex flex-col">
                    <header className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Wellness Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Select a user to view their analysis</p>
                    </header>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {users.map(user => (
                            <button
                                key={user._id}
                                onClick={() => handleUserSelect(user)}
                                className={`w-full text-left p-4 rounded-lg transition-colors duration-200 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    selectedUser?._id === user._id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                                }`}
                            >
                                <img src={`https://placehold.co/128x128/d1d5db/4b5563?text=${user.fullname.charAt(0)}`} alt={user.fullname} className="w-10 h-10 rounded-full flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.fullname}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {!selectedUser ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h2 className="mt-2 text-lg font-medium text-gray-900">Select a User</h2>
                                <p className="mt-1 text-sm text-gray-500">Choose a user from the list on the left to see their sentiment analysis graph.</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* User Header */}
                            <div className="flex items-center space-x-4 mb-8">
                                <img src={`https://placehold.co/128x128/d1d5db/4b5563?text=${selectedUser.fullname.charAt(0)}`} alt="User Avatar" className="w-16 h-16 rounded-full bg-gray-200" />
                                <div>
                                    <h2 className="text-3xl font-bold">{selectedUser.fullname}</h2>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="bg-white p-6 rounded-2xl shadow-md">
                                <h3 className="text-xl font-semibold mb-4">Sentiment & Confidence Analysis</h3>
                                <div className="h-96">
                                    <SentimentChart data={selectedUser.dailySentiments || []} />
                                </div>
                            </div>

                            {/* New Confidence Chart */}
                            <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
                                <h3 className="text-xl font-semibold mb-4">Confidence Trend (from new endpoint)</h3>
                                <div className="h-96">
                                    <ConfidenceChart data={confidenceData} />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default Admin;
