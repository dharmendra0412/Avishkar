
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardStat } from '../types';

// Mock Data
const adoptionData = [
  { name: 'Jan', users: 400, literacy: 240 },
  { name: 'Feb', users: 600, literacy: 320 },
  { name: 'Mar', users: 900, literacy: 450 },
  { name: 'Apr', users: 1200, literacy: 600 },
  { name: 'May', users: 1500, literacy: 800 },
  { name: 'Jun', users: 2100, literacy: 1100 },
];

const serviceUsage = [
  { name: 'Agri-Loans', value: 400 },
  { name: 'Tele-Health', value: 300 },
  { name: 'Education', value: 300 },
  { name: 'Payments', value: 200 },
];

const ageData = [
  { name: '18-25', users: 400 },
  { name: '26-40', users: 550 },
  { name: '41-60', users: 300 },
  { name: '60+', users: 150 },
];

const genderData = [
  { name: 'Male', value: 55 },
  { name: 'Female', value: 45 },
];

const upcomingEvents = [
  { title: "UPI Payment Training", date: "24 Oct", place: "Rampur Hall", type: "Workshop" },
  { title: "Kisan Drone Demo", date: "26 Oct", place: "Farm Center", type: "Demo" },
  { title: "Women's Cyber Safety", date: "28 Oct", place: "Girls School", type: "Seminar" },
  { title: "Tele-Law Camp", date: "02 Nov", place: "Panchayat", type: "Camp" },
];

const COLORS = ['#059669', '#0d9488', '#0891b2', '#0284c7'];
const GENDER_COLORS = ['#3b82f6', '#ec4899'];

const StatCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
      <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {stat.trend === 'up' ? '↑' : '↓'} {stat.change}%
      </span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const stats: DashboardStat[] = [
    { label: 'Active Users', value: '2,100', change: 12, trend: 'up' },
    { label: 'Services Accessed', value: '4,350', change: 8, trend: 'up' },
    { label: 'Literacy Certified', value: '850', change: 15, trend: 'up' },
    { label: 'Villages Connected', value: '14', change: 2, trend: 'neutral' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Community Progress Dashboard</h2>
          <p className="text-slate-500">Real-time insights on rural digital adoption.</p>
        </div>
        <div className="text-sm bg-amber-50 text-amber-800 px-4 py-2 rounded-lg border border-amber-200 flex items-center gap-2 shadow-sm">
           <span className="animate-pulse">⚠️</span> 2 Villages reported intermittent connectivity today.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
      </div>

      {/* Main Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Digital Adoption Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adoptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Active Users" />
                <Line type="monotone" dataKey="literacy" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} name="Digital Literacy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Service Category Usage</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demographics & Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Age Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">User Age Distribution</h3>
              <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                          <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Gender Split */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Gender Participation</h3>
              <div className="h-60 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={genderData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {genderData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-slate-800">45%</span>
                      <span className="text-xs text-slate-500 font-medium">Female</span>
                  </div>
              </div>
              <div className="flex justify-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div> Male (55%)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div> Female (45%)
                    </div>
              </div>
          </div>

          {/* Events List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Upcoming Camps</h3>
                  <button className="text-indigo-600 text-xs font-bold hover:underline uppercase tracking-wide">View All</button>
              </div>
              <div className="space-y-4">
                  {upcomingEvents.map((event, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                          <div className="bg-indigo-100 text-indigo-700 w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold uppercase">{event.date.split(' ')[1]}</span>
                              <span className="text-lg font-bold leading-none">{event.date.split(' ')[0]}</span>
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">📍 {event.place}</p>
                              <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {event.type}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      
      {/* Village Connectivity Status Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Village Connectivity Status</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-semibold uppercase">
                    <tr>
                        <th className="px-6 py-4">Village Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Internet Speed</th>
                        <th className="px-6 py-4">Community Center</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="px-6 py-4">Rampur</td>
                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Online</span></td>
                        <td className="px-6 py-4">4G (Strong)</td>
                        <td className="px-6 py-4">Active</td>
                    </tr>
                     <tr>
                        <td className="px-6 py-4">Kishanpur</td>
                        <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Intermittent</span></td>
                        <td className="px-6 py-4">3G</td>
                        <td className="px-6 py-4">Setup in Progress</td>
                    </tr>
                     <tr>
                        <td className="px-6 py-4">Belagavi East</td>
                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Online</span></td>
                        <td className="px-6 py-4">Fiber</td>
                        <td className="px-6 py-4">Active</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
