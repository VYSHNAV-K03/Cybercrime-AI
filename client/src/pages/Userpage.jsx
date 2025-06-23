import React from "react";
import { FaUserShield, FaChartBar, FaBell, FaLock } from "react-icons/fa";

const UserPage = () => {
  const userName = "Jane Doe";
  const role = "Cybercrime Analyst";
  const recentActivities = [
    { id: 1, activity: "Logged in from IP 192.168.1.1", time: "2 hours ago" },
    { id: 2, activity: "Reviewed 5 flagged reports", time: "3 hours ago" },
    { id: 3, activity: "Updated password", time: "1 day ago" },
  ];

  const stats = [
    { label: "Cases Reviewed", value: 120 },
    { label: "Active Alerts", value: 15 },
    { label: "Reports Flagged", value: 50 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center">
          <FaUserShield size={50} className="mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <p className="text-sm opacity-80">{role}</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistics Section */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg flex items-center"
          >
            <div className="flex-shrink-0">
              <FaChartBar size={30} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}

        {/* Recent Activities Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-2 flex justify-between">
                <span>{activity.activity}</span>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FaBell className="mr-2 text-blue-600" />
            Notifications
          </h2>
          <p>No new notifications at this time.</p>
        </div>

        {/* Security Tips Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <FaLock className="mr-2 text-blue-600" />
            Security Tips
          </h2>
          <ul className="list-disc pl-6 text-sm text-gray-600">
            <li>Update your password regularly.</li>
            <li>Avoid logging in from public networks.</li>
            <li>Verify flagged reports promptly.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
