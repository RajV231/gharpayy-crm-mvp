import { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import { fetchDashboardStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_leads_received: 0,
    visits_scheduled: 0,
    bookings_confirmed: 0,
    leads_by_stage: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const activePipeline = stats.total_leads_received - 
    ((stats.leads_by_stage['Booked'] || 0) + (stats.leads_by_stage['Lost'] || 0));

  const displayStats = [
    {
      title: 'Total Leads',
      value: stats.total_leads_received,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Active Pipeline',
      value: activePipeline,
      icon: TrendingUp,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      title: 'Scheduled Visits',
      value: stats.visits_scheduled,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.bookings_confirmed,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your lead management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}