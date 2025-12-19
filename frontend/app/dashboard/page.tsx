'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Package, TrendingUp, TrendingDown, AlertTriangle, IndianRupee } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalSKUs: number;
  activeSKUs: number;
  lowStockSKUs: number;
  totalStockValue: number;
}

interface DailyMovement {
  _id: string;
  count: number;
  inward: number;
  outward: number;
  damage: number;
}

// main dashboard component
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [movements, setMovements] = useState<DailyMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, movementsRes] = await Promise.all([
        api.get('/skus/stats'),
        api.get('/stock-movements/stats?days=30'),
      ]);
      
      setStats(statsRes.data);
      setMovements(movementsRes.data.dailyMovements || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total SKUs',
      value: stats?.activeSKUs || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Stock Value',
      value: formatCurrency(stats?.totalStockValue || 0),
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockSKUs || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Stock Movements',
      value: movements.reduce((sum, m) => sum + m.count, 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600',
      trend: '+15%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-blue-100 mt-2 text-lg">Welcome back! Here's your inventory overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {stat.trendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Movement Chart */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-bold text-gray-800">Stock Movement Trend</CardTitle>
            <CardDescription className="text-gray-600">Daily inward and outward movements (Last 30 Days)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movements}>
                <defs>
                  <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="inward" 
                  stroke="#3b82f6" 
                  fill="url(#colorInward)"
                  name="Inward"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="outward" 
                  stroke="#8b5cf6" 
                  fill="url(#colorOutward)"
                  name="Outward"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="damage" 
                  stroke="#ef4444" 
                  name="Damage"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 3 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Total movements by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="Total Movements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/inventory"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold">Add New SKU</p>
                <p className="text-sm text-gray-500">Create a new product</p>
              </div>
            </a>
            <a
              href="/dashboard/stock"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold">Record Movement</p>
                <p className="text-sm text-gray-500">Update stock levels</p>
              </div>
            </a>
            <a
              href="/dashboard/insights"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">View Insights</p>
                <p className="text-sm text-gray-500">Smart recommendations</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
