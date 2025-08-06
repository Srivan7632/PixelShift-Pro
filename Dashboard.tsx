import { useEffect, useState } from "react";
import { useUserGuardContext } from "app/auth";
import brain from "brain";
import {
  DashboardOverviewResponse,
  ProcessingJobResponse,
  UserAnalyticsResponse,
  UserFavoriteResponse,
} from "types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FileImage,
  Download,
  Star,
  TrendingUp,
  Database,
  Clock,
  Zap,
  Target,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useUserGuardContext();
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await brain.get_dashboard_overview();
      const data = await response.json();
      
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(1)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatTime = (timeInMs: number) => {
    if (timeInMs < 1000) {
      return `${timeInMs}ms`;
    }
    return `${(timeInMs / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatBreakdownData = (analytics: UserAnalyticsResponse) => {
    return [
      { name: "JPEG", value: analytics.jpeg_count, color: "#00ff88" },
      { name: "PNG", value: analytics.png_count, color: "#0088ff" },
      { name: "WebP", value: analytics.webp_count, color: "#ff0088" },
    ].filter(item => item.value > 0);
  };

  const strategyBreakdownData = (analytics: UserAnalyticsResponse) => {
    return [
      { name: "Auto", value: analytics.auto_strategy_count },
      { name: "Lossy", value: analytics.lossy_strategy_count },
      { name: "Lossless", value: analytics.lossless_strategy_count },
      { name: "Hybrid", value: analytics.hybrid_strategy_count },
    ].filter(item => item.value > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-black/40 border-cyan-500/30">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-6 flex items-center justify-center">
        <Card className="bg-black/40 border-red-500/30 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 text-lg mb-4">⚠️ Dashboard Error</div>
            <p className="text-gray-400 mb-6">{error || "Unable to load dashboard data"}</p>
            <Button 
              onClick={loadDashboardData}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { analytics, recent_jobs, favorites, total_jobs } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.displayName || user?.primaryEmail?.split('@')[0] || 'User'}
            </p>
          </div>
          <Button 
            onClick={loadDashboardData}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Images Processed</p>
                  <p className="text-2xl font-bold text-cyan-400">{analytics.total_images_processed}</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl hover:border-green-400/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Space Saved</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatFileSize(analytics.total_space_saved_mb)}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Processing Time</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {formatTime(analytics.total_processing_time_ms)}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Compression Ratio</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {analytics.total_original_size_mb > 0 
                      ? `${((analytics.total_space_saved_mb / analytics.total_original_size_mb) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Breakdown */}
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Format Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formatBreakdownData(analytics).length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={formatBreakdownData(analytics)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {formatBreakdownData(analytics).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strategy Breakdown */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Compression Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strategyBreakdownData(analytics).length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={strategyBreakdownData(analytics)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9ca3af' }}
                      axisLine={{ stroke: 'rgba(156, 163, 175, 0.3)' }}
                    />
                    <YAxis 
                      tick={{ fill: '#9ca3af' }}
                      axisLine={{ stroke: 'rgba(156, 163, 175, 0.3)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                    />
                    <Bar dataKey="value" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs and Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Processing Jobs */}
          <Card className="lg:col-span-2 bg-black/40 border-green-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Recent Processing Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recent_jobs.length > 0 ? (
                <div className="space-y-4">
                  {recent_jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-200 truncate max-w-[200px]">
                            {job.original_filename}
                          </h4>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>{job.output_format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{formatFileSize(job.target_size_mb)} target</span>
                          {job.size_reduction_percentage && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">
                                {job.size_reduction_percentage.toFixed(1)}% saved
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {job.can_redownload && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {total_jobs > 5 && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        View All {total_jobs} Jobs
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No processing jobs yet</p>
                  <p className="text-sm mt-1">Start by uploading an image to compress</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorite Settings */}
          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Favorite Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.slice(0, 4).map((favorite) => (
                    <div key={favorite.id} className="p-3 bg-black/30 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-200 text-sm">
                          {favorite.name}
                        </h4>
                        <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                          {favorite.usage_count} uses
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>{formatFileSize(favorite.target_size_mb)} • {favorite.output_format.toUpperCase()}</div>
                        <div>{favorite.compression_strategy} strategy</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 w-full"
                    >
                      Manage Favorites
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No favorite settings yet</p>
                  <p className="text-xs mt-1">Create presets for your common compression needs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
