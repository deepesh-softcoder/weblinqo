import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import { getPollAnalytics } from "../../../services/polesAPI";
import CustomDropdown from "../../shared/custom-dropdown";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useLoaderStore from "../../../stores/loaderStore";

const AnalyticsTab = () => {
  const [overview, setOverview] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [topLinks, setTopLinks] = useState([]);
  const [selectedDays, setSelectedDays] = useState(7);
  const { showLoader, hideLoader, loading } = useLoaderStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [pollAnalytics, setPollAnalytics] = useState(null);

  // Fetch overview, daily stats, and top links from API
  const fetchAnalytics = async (days) => {
    showLoader(); // Show loading spinner
    try {
      const [overviewRes, statsRes, topLinksRes] = await Promise.all([
        api.get(`/api/v1/analytics/overview?days=${days}`),
        api.get(`/api/v1/analytics/daily-stats?days=${days}`),
        api.get(`/api/v1/analytics/top-links?limit=5`),
      ]);

      setOverview(overviewRes.data.data);
      setDailyStats(statsRes.data.data);
      setTopLinks(topLinksRes.data.data);
    } catch (error) {
      toast.error("Failed to load analytics");
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  // Fetch poll analytics specifically
  const fetchPollAnalytics = async () => {
    showLoader();
    try {
      const data = await getPollAnalytics();
      setPollAnalytics(data);
    } catch (error) {
      console.error("Failed to load poll analytics:", error);
    } finally {
      hideLoader();
    }
  };

  // Export analytics or poll analytics to CSV
  const exportToCSV = () => {
    if (activeTab === "poles") {
      // Export poll analytics data
      if (!pollAnalytics) {
        toast.error("No poll data available to export");
        return;
      }
      
      try {
        // Create CSV content for poll analytics
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add poll overview section
        csvContent += "Poll Analytics Export\n";
        csvContent += `Question,${pollAnalytics.question}\n`;
        csvContent += `Total Votes,${pollAnalytics.totalVotes}\n`;
        csvContent += `Engagement Rate,${pollAnalytics.engagementRate.toFixed(1)}%\n`;
        csvContent += `Number of Options,${pollAnalytics.options.length}\n\n`;
        
        // Add poll results section
        csvContent += "Poll Results\n";
        csvContent += "Option,Votes,Percentage\n";
        pollAnalytics.options.forEach(option => {
          csvContent += `${option.text},${option.voteCount},${option.percentage.toFixed(1)}%\n`;
        });
        
        // Add winning option if available
        if (pollAnalytics.winningOption) {
          csvContent += `\nWinning Option,${pollAnalytics.winningOption.text},${pollAnalytics.winningOption.percentage.toFixed(1)}%\n`;
        }
        
        // Create timestamp for filename
        const now = new Date();
        const timestamp = now.toISOString()
          .replace(/[:.]/g, '-')  // Replace colons and periods with hyphens
          .replace('T', '_')      // Replace T with underscore
          .slice(0, 19);          // Remove timezone information
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `poll_analytics_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Poll analytics export successful");
      } catch (error) {
        toast.error("Failed to export poll data");
        console.error(error);
      }
    } else {
      // Export overview analytics data (existing logic)
      if (!overview || !dailyStats || !topLinks) {
        toast.error("No data available to export");
        return;
      }
    
      try {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add overview section
        csvContent += "Analytics Overview\n";
        csvContent += "Metric,Value\n";
        csvContent += `Total Link Clicks,${overview.totalClicks}\n`;
        csvContent += `Total Profile Views,${overview.totalViews}\n`;
        csvContent += `Click-to-View Rate,${overview.conversionRate.toFixed(1)}%\n`;
        csvContent += `Active Links,${overview.activeLinks}\n\n`;
        
        // Add daily stats section
        csvContent += "Daily Stats\n";
        csvContent += "Date,Link Clicks,Profile Views\n";
        dailyStats.forEach(stat => {
          csvContent += `${stat.day},${stat.clicks},${stat.views}\n`;
        });
        csvContent += "\n";
        
        // Add top links section
        csvContent += "Top Performing Links\n";
        csvContent += "Link,Clicks,Click/View %\n";
        topLinks.forEach(link => {
          csvContent += `${link.link},${link.clicks},${link.conversion.toFixed(1)}%\n`;
        });
        
        // Create timestamp for filename
        const now = new Date();
        const timestamp = now.toISOString()
          .replace(/[:.]/g, '-')  // Replace colons and periods with hyphens
          .replace('T', '_')      // Replace T with underscore
          .slice(0, 19);          // Remove timezone information
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Export successful");
      } catch (error) {
        toast.error("Failed to export data");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedDays);
  }, [selectedDays]);

  useEffect(() => {
    if (activeTab === "poles") {
      fetchPollAnalytics();
    }
  }, [activeTab]);

  return (
    <div className="w-full lg:px-4 md:px-4 px-0 py-6 ml-[-0.5rem] lg:ml-0 md:ml-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Analytics
          </h2>
          <p className="text-gray-600">
            Track your link performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="flex bg-gray-50 items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
          >
            {activeTab === "poles" ? "Export Poll Data" : "Export"}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* Date range dropdown (only for overview) */}
          {activeTab === "overview" && <CustomDropdown
            options={[
              { value: 7, label: "Last 7 Days" },
              { value: 30, label: "Last 30 Days" },
              { value: 90, label: "Last 90 Days" }
            ]}
            containerClassName="py-2"
            value={selectedDays}
            onChange={(value) => setSelectedDays(Number(value))}
          />}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("poles")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "poles"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Poles Results
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <OverviewTab 
          overview={overview}
          dailyStats={dailyStats}
          topLinks={topLinks}
        />
      ) : (
        <PolesResultsTab 
          pollAnalytics={pollAnalytics}
          pollLoading={loading}
        />
      )}
    </div>
  );
};

// Overview tab content
const OverviewTab = ({ overview, dailyStats, topLinks }) => {
  return (
    <>
          {/* Metrics */}
          {overview && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Link Click"
                value={overview.totalClicks}
                color="blue"
              />
              <MetricCard
                title="Profile View"
                value={overview.totalViews}
                color="lightBlue"
              />
              <MetricCard
                title="Click View Rate"
                value={`${overview.conversionRate.toFixed(1)}%`}
                color="orange"
              />
              <MetricCard
                title="Active Links"
                value={overview.activeLinks}
                color="green"
              />
            </div>
          )}

          {/* Chart */}
          <div className="bg-offWhite p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all mb-8">
            <h3 className="text-size-18 font-semibold text-gray-900 mb-6">
              Sale History
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyStats}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    name="Link Clicks"
                    stroke="#c4ff4d"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    name="Profile Views"
                    stroke="#ffa726"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Links */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-size-18 font-semibold text-gray-900 mb-3">
              Top Performing Links
            </h3>
            <p className="text-size-14 text-gray-600 mb-4">
              Based on link clicks divided by total profile views.
            </p>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <TableHeader title="Link" />
                    <TableHeader title="Link Clicks" />
                    <TableHeader title="Click/View %" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topLinks.map((link, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {link.link}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {link.conversion.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </>
  );
};

// Polls Results tab content
const PolesResultsTab = ({ pollAnalytics, pollLoading }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Poll Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <h3 className="text-size-18 font-semibold text-gray-900 mb-3">
          Poll Overview
        </h3>
        <p className="text-size-14 text-gray-600 mb-6">
          View the results of your polls and surveys.
        </p>
        
        {pollLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pollAnalytics ? (
          <div className="space-y-6">
            {/* Poll Question */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Question:</h4>
              <p className="text-gray-700">{pollAnalytics.question}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{pollAnalytics.totalVotes}</div>
                <div className="text-sm text-blue-600">Total Votes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{pollAnalytics.engagementRate.toFixed(1)}%</div>
                <div className="text-sm text-green-600">Engagement Rate</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{pollAnalytics.options.length}</div>
                <div className="text-sm text-purple-600">Options</div>
              </div>
            </div>

            {/* Results Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4 text-center">Vote Distribution</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pollAnalytics.options}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="text" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="voteCount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4 text-center">Vote Percentages</h5>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pollAnalytics.options}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ text, percentage }) => `${text}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="voteCount"
                      >
                        {pollAnalytics.options.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Options Table */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="text-lg font-medium text-gray-900 mb-4">Detailed Results</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">Option</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">Votes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pollAnalytics.options.map((option, index) => (
                      <tr key={option.optionId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {option.text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {option.voteCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {option.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Winning Option */}
            {pollAnalytics.winningOption && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="text-lg font-medium text-yellow-800 mb-2">🏆 Winning Option</h5>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-800 font-medium">{pollAnalytics.winningOption.text}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-800">{pollAnalytics.winningOption.voteCount} votes</div>
                    <div className="text-sm text-yellow-600">{pollAnalytics.winningOption.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h4>
            <p className="text-gray-500">Create your first poll to see results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Table header component
const TableHeader = ({ title }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 tracking-wider">
    {title}
  </th>
);

export default AnalyticsTab;