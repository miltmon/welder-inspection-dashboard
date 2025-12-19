import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Calendar, Filter } from 'lucide-react';
import type { DashboardWelderInfo } from './WelderDashboard';

interface PerformanceData {
  month: string;
  inspectionsPassed: number;
  inspectionsFailed: number;
  defectsLogged: number;
  wpsActive: number;
}

interface PerformanceDashboardProps {
  welderInfo: DashboardWelderInfo | null;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ welderInfo }) => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  // Generate mock performance data
  useEffect(() => {
    const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12;
    const data: PerformanceData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      // Generate realistic random data with trends
      const basePass = 15 + Math.floor(Math.random() * 10);
      const baseFail = 2 + Math.floor(Math.random() * 3);
      const baseDefects = 1 + Math.floor(Math.random() * 4);
      const baseWPS = 3 + Math.floor(Math.random() * 2);

      data.push({
        month,
        inspectionsPassed: basePass,
        inspectionsFailed: baseFail,
        defectsLogged: baseDefects,
        wpsActive: baseWPS
      });
    }

    setPerformanceData(data);
  }, [timeRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!performanceData.length) return null;

    const totalPassed = performanceData.reduce((sum, d) => sum + d.inspectionsPassed, 0);
    const totalFailed = performanceData.reduce((sum, d) => sum + d.inspectionsFailed, 0);
    const totalDefects = performanceData.reduce((sum, d) => sum + d.defectsLogged, 0);
    const totalInspections = totalPassed + totalFailed;

    const passRate = totalInspections > 0 ? (totalPassed / totalInspections) * 100 : 0;
    const defectRate = totalInspections > 0 ? (totalDefects / totalInspections) * 100 : 0;

    // Calculate trends (current month vs previous month)
    const current = performanceData[performanceData.length - 1];
    const previous = performanceData[performanceData.length - 2];

    const passRateTrend = previous ?
      ((current.inspectionsPassed / (current.inspectionsPassed + current.inspectionsFailed)) -
       (previous.inspectionsPassed / (previous.inspectionsPassed + previous.inspectionsFailed))) * 100 : 0;

    const defectTrend = previous ? current.defectsLogged - previous.defectsLogged : 0;

    return {
      totalInspections,
      totalPassed,
      totalFailed,
      totalDefects,
      passRate,
      defectRate,
      passRateTrend,
      defectTrend,
      avgInspectionsPerMonth: totalInspections / performanceData.length
    };
  }, [performanceData]);

  // Data for pie chart
  const pieData = metrics ? [
    { name: 'Passed', value: metrics.totalPassed, color: '#10B981' },
    { name: 'Failed', value: metrics.totalFailed, color: '#EF4444' }
  ] : [];

  // Data for defect types (mock data)
  const defectTypeData = [
    { type: 'Undercut', count: 8, percentage: 32 },
    { type: 'Porosity', count: 6, percentage: 24 },
    { type: 'Cracks', count: 5, percentage: 20 },
    { type: 'Overlap', count: 3, percentage: 12 },
    { type: 'Other', count: 3, percentage: 12 }
  ];

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  if (!metrics) return <div>Loading performance data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
          <p className="text-slate-300">Track your welding performance and improvement trends</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 text-sm">Time Range:</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '3m' | '6m' | '12m')}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          >
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-300 text-sm font-medium">Pass Rate</h3>
            {getTrendIcon(metrics.passRateTrend)}
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-green-400">{formatPercentage(metrics.passRate)}</p>
            <p className={`text-sm ${getTrendColor(metrics.passRateTrend)}`}>
              {metrics.passRateTrend > 0 ? '+' : ''}{formatPercentage(metrics.passRateTrend)}
            </p>
          </div>
          <p className="text-slate-400 text-xs mt-1">vs last month</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-300 text-sm font-medium">Total Inspections</h3>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-white">{metrics.totalInspections}</p>
            <p className="text-slate-400 text-sm">total</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">{metrics.avgInspectionsPerMonth.toFixed(1)} avg/month</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-300 text-sm font-medium">Defect Rate</h3>
            {getTrendIcon(-metrics.defectTrend)}
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-yellow-400">{formatPercentage(metrics.defectRate)}</p>
            <p className={`text-sm ${getTrendColor(-metrics.defectTrend)}`}>
              {metrics.defectTrend > 0 ? '+' : ''}{metrics.defectTrend}
            </p>
          </div>
          <p className="text-slate-400 text-xs mt-1">defects this period</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-300 text-sm font-medium">Quality Score</h3>
            <Award className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-orange-400">
              {Math.max(0, Math.min(100, 100 - metrics.defectRate * 2)).toFixed(0)}
            </p>
            <p className="text-slate-400 text-sm">/100</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">overall quality</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trend */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={12}
              />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Line
                type="monotone"
                dataKey="inspectionsPassed"
                stroke="#10B981"
                strokeWidth={2}
                name="Passed"
              />
              <Line
                type="monotone"
                dataKey="inspectionsFailed"
                stroke="#EF4444"
                strokeWidth={2}
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail Ratio */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Pass/Fail Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Passed ({metrics.totalPassed})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-slate-300 text-sm">Failed ({metrics.totalFailed})</span>
            </div>
          </div>
        </div>

        {/* Defects by Type */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Common Defect Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={defectTypeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94A3B8" fontSize={12} />
              <YAxis
                dataKey="type"
                type="category"
                stroke="#94A3B8"
                fontSize={12}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Defects Trend */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Defects Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={12}
              />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9'
                }}
              />
              <Bar dataKey="defectsLogged" fill="#EF4444" name="Defects Logged" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="text-slate-300 font-medium">Strengths</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              {metrics.passRate >= 90 && <li>• Excellent pass rate ({formatPercentage(metrics.passRate)})</li>}
              {metrics.passRateTrend > 0 && <li>• Improving trend in quality</li>}
              {metrics.defectRate < 10 && <li>• Low defect rate</li>}
              <li>• Consistent inspection volume</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-300 font-medium">Areas for Improvement</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              {metrics.passRate < 85 && <li>• Focus on improving pass rate</li>}
              {metrics.defectRate > 15 && <li>• Reduce defect frequency</li>}
              {metrics.defectTrend > 0 && <li>• Address increasing defect trend</li>}
              <li>• Review common defect patterns</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-300 font-medium">Recommendations</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Review WPS procedures regularly</li>
              <li>• Focus on undercut prevention</li>
              <li>• Document best practices</li>
              <li>• Schedule refresher training</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Export & Reports</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Export to PDF
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
