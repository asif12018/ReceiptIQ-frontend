"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Users, Activity, CreditCard, TrendingUp, Cpu, 
  ShieldAlert, Settings, Download, Trash2, Search,
  ChevronLeft, ChevronRight, FileSpreadsheet,
  ToggleLeft, ToggleRight, Sparkles
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { useAdminStats, useAdminUsers, useUpdateUserRole, useDeleteUser, useAdminSystemInfo, useUpdateSystemSettings } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();
  const { data: users, isLoading: isUsersLoading } = useAdminUsers();
  const { data: systemInfo, isLoading: isSystemLoading } = useAdminSystemInfo();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateSettings } = useUpdateSystemSettings();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // User Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Settings State
  const [settings, setSettings] = useState({
    newRegistrations: true,
    maintenanceMode: false,
    systemPrompt: "You are a highly intelligent financial assistant for ReceiptIQ..."
  });

  useEffect(() => {
    if (systemInfo?.settings) {
      setSettings(systemInfo.settings);
    }
  }, [systemInfo]);

  const handleSaveSettings = () => {
    updateSettings(settings, {
      onSuccess: () => toast.success("System settings updated successfully!"),
      onError: (err) => toast.error(err.message || "Failed to update settings")
    });
  };

  const handleRoleChange = (userId: string, newRole: "USER" | "ADMIN") => {
    setUpdatingId(userId);
    updateRole(
      { targetUserId: userId, role: newRole },
      {
        onSuccess: () => {
          toast.success("User role updated successfully");
          setUpdatingId(null);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update user role");
          setUpdatingId(null);
        },
      }
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user and all their data?")) return;
    setDeletingId(userId);
    deleteUser(userId, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setDeletingId(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete user");
        setDeletingId(null);
      }
    });
  };

  const exportToCSV = () => {
    if (!users) return;
    const headers = ["ID", "Name", "Email", "Role", "Joined Date"];
    const csvContent = [
      headers.join(","),
      ...users.map(u => `"${u.id}","${u.name || ''}","${u.email}","${u.role}","${new Date(u.createdAt).toISOString()}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `receiptiq_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported users to CSV");
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const TABS = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: "User Management", icon: Users },
    { id: "ai", label: "AI System Logs", icon: Cpu },
    { id: "reports", label: "Export & Reports", icon: FileSpreadsheet },
    { id: "settings", label: "Global Settings", icon: Settings },
  ];

  return (
    <div className="p-8 pb-32 max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-indigo-500" />
          Admin Command Center
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Platform-wide overview, access controls, and system settings.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-indigo-600 text-zinc-900 dark:text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-white dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Registered Users</h3>
                </div>
                {isStatsLoading ? (
                  <div className="h-9 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stats?.totalUsers?.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Receipts Scanned</h3>
                </div>
                {isStatsLoading ? (
                  <div className="h-9 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stats?.totalReceipts?.toLocaleString() || 0}</p>
                )}
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Active Goals</h3>
                </div>
                {isStatsLoading ? (
                  <div className="h-9 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stats?.totalGoals?.toLocaleString() || 0}</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-6">User Growth (Last 30 Days)</h3>
              <div className="h-[300px] w-full">
                {isStatsLoading ? (
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-lg" />
                ) : stats?.usersOverTime && stats.usersOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.usersOverTime}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">Not enough data to display growth</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Registered Users</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search by email or name..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
                <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {isUsersLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" /></td></tr>
                    ))
                  ) : paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-zinc-100 dark:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-zinc-900 dark:text-zinc-200">{user.name || "Unnamed"}</div>
                          <div className="text-xs text-zinc-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            disabled={updatingId === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as "USER" | "ADMIN")}
                            className={`text-xs px-2 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                              user.role === "ADMIN" 
                                ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20" 
                                : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50`}
                          >
                            <option value="USER" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">USER</option>
                            <option value="ADMIN" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingId === user.id}
                            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete User"
                          >
                            {deletingId === user.id ? (
                              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                        No users found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-950/30">
                <span className="text-sm text-zinc-500">
                  Showing <span className="font-medium text-zinc-300">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span className="font-medium text-zinc-300">{filteredUsers.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-700 hover:text-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-700 hover:text-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. AI SYSTEM LOGS TAB */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> AI API Quota Monitoring
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Track your platform's usage of the Google Gemini API to prevent overages.</p>
              
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-300 font-medium">Daily API Requests (Free Tier)</span>
                {isSystemLoading ? (
                  <div className="h-5 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                ) : (
                  <span className="text-indigo-400 font-bold">{systemInfo?.dailyQuota || 0} / 1,500 requests</span>
                )}
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-500 transition-all duration-1000" 
                  style={{ width: `${Math.min(((systemInfo?.dailyQuota || 0) / 1500) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2 text-right">
                ~{((systemInfo?.dailyQuota || 0) / 15).toFixed(1)}% of daily limit used
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-6">Recent Agent Actions (Live Feed)</h3>
              <div className="space-y-4">
                {isSystemLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-lg" />
                  ))
                ) : systemInfo?.aiLogs && systemInfo.aiLogs.length > 0 ? (
                  systemInfo.aiLogs.map(log => {
                    const date = new Date(log.createdAt);
                    const isToday = new Date().toDateString() === date.toDateString();
                    return (
                      <div key={log.id} className="flex items-start justify-between p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{log.action}</span>
                          <span className="text-xs text-zinc-500">
                            {isToday ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                            {log.tokens} tokens
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-zinc-500">No AI usage logs found for today.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. EXPORT & REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center py-16">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Download className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Platform Data Extraction</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Download complete raw data of all registered users on the ReceiptIQ platform for external analysis or CRM integration.
            </p>
            <button 
              onClick={exportToCSV}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-indigo-500/20"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export Users to CSV
            </button>
          </div>
        )}

        {/* 5. GLOBAL SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">Platform Configuration</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Allow New Registrations</h4>
                    <p className="text-xs text-zinc-500 mt-1">Enable or disable new user signups.</p>
                  </div>
                  <button 
                    onClick={() => setSettings(s => ({ ...s, newRegistrations: !s.newRegistrations }))}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-400 transition-colors"
                  >
                    {settings.newRegistrations ? <ToggleRight className="w-10 h-10 text-indigo-500" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Maintenance Mode</h4>
                    <p className="text-xs text-zinc-500 mt-1">Show maintenance page to all non-admin users.</p>
                  </div>
                  <button 
                    onClick={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    {settings.maintenanceMode ? <ToggleRight className="w-10 h-10 text-rose-500" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2">Global System Prompt</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Modify the core personality and instructions for the Gemini Agentic Chat across the entire platform.</p>
              
              <textarea
                value={settings.systemPrompt}
                onChange={(e) => setSettings(s => ({ ...s, systemPrompt: e.target.value }))}
                className="w-full h-32 bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar mb-4"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
