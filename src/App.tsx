import React, { useState, useMemo } from 'react';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  RefreshCw,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  generateSyntheticData, 
  getMonthlyTrends, 
  getCategoryDistribution, 
  calculateInsights,
  type Transaction,
  type Category
} from './lib/analysis';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function App() {
  const [data, setData] = useState<Transaction[]>(() => generateSyntheticData(180));
  const [searchQuery, setSearchQuery] = useState('');

  const monthlyTrends = useMemo(() => getMonthlyTrends(data), [data]);
  const categoryDist = useMemo(() => getCategoryDistribution(data), [data]);
  const insights = useMemo(() => calculateInsights(data), [data]);

  const totalIncome = useMemo(() => data.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0), [data]);
  const totalExpense = useMemo(() => data.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0), [data]);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = useMemo(() => {
    return data.filter(t => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 50);
  }, [data, searchQuery]);

  const handleRefresh = () => {
    setData(generateSyntheticData(180));
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChartIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FinSight</span>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
            <SidebarItem icon={<PieChartIcon className="w-5 h-5" />} label="Analytics" />
            <SidebarItem icon={<TrendingUp className="w-5 h-5" />} label="Budgeting" />
            <SidebarItem icon={<FileText className="w-5 h-5" />} label="Reports" />
            <SidebarItem icon={<ShieldCheck className="w-5 h-5" />} label="Integrations" />
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-100 italic text-xs text-gray-400">
          Data Science Portfolio Project v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">Financial Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
              Simulate New Data
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200">
              Download CSV
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Available Balance" 
              value={`₹${balance.toLocaleString('en-IN')}`} 
              icon={<TrendingUp className="text-blue-600" />}
              trend="+2.5% from last month"
            />
            <StatCard 
              label="Monthly Income" 
              value={`₹${(totalIncome / 6).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
              icon={<ArrowUpRight className="text-emerald-500" />}
              subLabel="Avg. Monthly"
            />
            <StatCard 
              label="Monthly Expense" 
              value={`₹${(totalExpense / 6).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
              icon={<ArrowDownRight className="text-rose-500" />}
              subLabel="Avg. Monthly"
            />
            <StatCard 
              label="Savings Ratio" 
              value={`${((balance / totalIncome) * 100).toFixed(1)}%`} 
              icon={<PieChartIcon className="text-amber-500" />}
              status={balance / totalIncome > 0.2 ? "Healthy" : "Low"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trend Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  Spending & Income Pipeline
                  <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded">6 Month View</span>
                </h3>
                <div className="flex gap-2">
                  <ChartDot label="Income" color="#3b82f6" />
                  <ChartDot label="Expense" color="#f87171" />
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="Income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="font-semibold text-gray-800 mb-6">Category Distribution</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm">
                    <span className="text-gray-500 font-medium">{insight.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{insight.value}</span>
                      {insight.change !== 0 && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                          insight.type === 'positive' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {insight.change > 0 ? '+' : ''}{insight.change}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions Tablet */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                <p className="text-sm text-gray-500">A detailed log of financial activities</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search expenses..." 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            tx.type === 'Income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {tx.type === 'Income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                            <p className="text-xs text-gray-500">{tx.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {tx.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 border border-gray-200">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        <span className={tx.type === 'Income' ? 'text-emerald-600' : 'text-gray-900'}>
                          {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-gray-600">Settled</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 animate-pulse">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        active 
          ? "bg-blue-50 text-blue-600" 
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      )}
    >
      {icon}
      {label}
    </a>
  );
}

function StatCard({ label, value, icon, trend, subLabel, status }: { label: string, value: string, icon: React.ReactNode, trend?: string, subLabel?: string, status?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      {(trend || subLabel || status) && (
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium">
          {trend && <span className="text-emerald-600 flex items-center gap-1">{trend}</span>}
          {subLabel && <span className="text-gray-400">{subLabel}</span>}
          {status && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
              status === 'Healthy' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ChartDot({ label, color }: { label: string, color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}

