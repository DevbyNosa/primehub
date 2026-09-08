// client/src/pages/Admin/AdminReports.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaMoneyBillWave, 
  FaShoppingBag, 
  FaUsers, 
  FaBox,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaCalendar
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
)

export default function AdminReports() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    fetchReports()
  }, [period])

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/admin/reports?period=${period}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setReportData(data.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!reportData) return

    const headers = ['Date', 'Orders', 'Revenue', 'Customers']
    const csvData = [headers.join(',')]
    
    reportData.dailyData.forEach(day => {
      csvData.push(`${day.date},${day.orders},${day.revenue},${day.customers}`)
    })
    
    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${period}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Chart Data
  const chartData = {
    labels: reportData?.dailyData?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: reportData?.dailyData?.map(d => Number(d.revenue) || 0) || [],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#000000',
      },
      {
        label: 'Orders',
        data: reportData?.dailyData?.map(d => Number(d.orders) || 0) || [],
        borderColor: '#666666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#666666',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // ✅ Format number to avoid NaN
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0'
    }
    return value.toLocaleString()
  }

  // ✅ Check if value is positive for trends
  const isPositive = (value) => {
    if (value === null || value === undefined || isNaN(value)) return false
    return value > 0
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sales analytics and insights
            </p>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <FaDownload size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                period === 'week' 
                  ? 'bg-black text-white' 
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                period === 'month' 
                  ? 'bg-black text-white' 
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                period === 'year' 
                  ? 'bg-black text-white' 
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              This Year
            </button>
          </div>
        </div>

        {/* Stats Cards - Fixed NaN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₦{formatNumber(reportData?.totals?.revenue)}
            </p>
            <p className={`text-xs mt-1 ${isPositive(reportData?.trends?.revenue) ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive(reportData?.trends?.revenue) ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
              {Math.abs(reportData?.trends?.revenue || 0)}% from previous period
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(reportData?.totals?.orders)}
            </p>
            <p className={`text-xs mt-1 ${isPositive(reportData?.trends?.orders) ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive(reportData?.trends?.orders) ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
              {Math.abs(reportData?.trends?.orders || 0)}% from previous period
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">New Customers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatNumber(reportData?.totals?.customers)}
            </p>
            <p className={`text-xs mt-1 ${isPositive(reportData?.trends?.customers) ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive(reportData?.trends?.customers) ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
              {Math.abs(reportData?.trends?.customers || 0)}% from previous period
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₦{formatNumber(reportData?.totals?.averageOrderValue)}
            </p>
            <p className={`text-xs mt-1 ${isPositive(reportData?.trends?.averageOrderValue) ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive(reportData?.trends?.averageOrderValue) ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
              {Math.abs(reportData?.trends?.averageOrderValue || 0)}% from previous period
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-80">
            {reportData?.dailyData?.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FaCalendar className="text-4xl mx-auto mb-2" />
                  <p>No sales data available for this period</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions - Fixed NaN */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Transactions</h2>
          {reportData?.recentSales?.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.recentSales?.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{sale.order_number}</td>
                      <td className="py-3 px-4">{sale.customer_name || 'Guest'}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(sale.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ₦{formatNumber(sale.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          sale.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {sale.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}