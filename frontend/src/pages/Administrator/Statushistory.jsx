import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../Components/DashboardLayout";
import axios from "axios";

const StatusHistory = () => {
  const { logId } = useParams();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch history from backend
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/logs/${logId}/history/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);
      setFilteredHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [logId]);

  // Search functionality
  useEffect(() => {
    const filtered = history.filter((item) =>
      item.changed_by_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredHistory(filtered);
  }, [search, history]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: history.length,
      approved: history.filter(
        (item) => item.new_status.toLowerCase() === "approved"
      ).length,
      rejected: history.filter(
        (item) => item.new_status.toLowerCase() === "rejected"
      ).length,
    };
  }, [history]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-400 border border-green-500/30";

      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";

      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";

      default:
        return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
    }
  };

  return (
    <DashboardLayout title="Status History">
      <div className="min-h-screen bg-indigo-300 rounded-2xl border border-indigo-700 text-indigo p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Status History Logs
            </h1>

            <p className="text-indigo-500 mt-1">
              Monitor all project log status changes.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-xl font-medium text-white shadow-lg shadow-indigo-900/40"
          >
            Refresh Logs
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-100 text-sm">
              Total Changes
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-200 text-sm">
              Approved Logs
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {stats.approved}
            </h2>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-200 text-sm">
              Rejected Logs
            </p>

            <h2 className="text-3xl font-bold text-red-400 mt-2">
              {stats.rejected}
            </h2>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-indigo-600 rounded-2xl border border-indigo-700 shadow-xl overflow-hidden">
          
          {/* Top */}
          <div className="p-5 border-b border-indigo-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-100">
              Activity Timeline
            </h2>

            <input
              type="text"
              placeholder="Search by user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0f172a] border border-indigo-600 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Content */}
          <div className="divide-y divide-indigo-700">
            
            {loading ? (
              <div className="p-10 text-center text-indigo-300">
                Loading history...
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-10 text-center text-indigo-100">
                No history found.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-indigo-800/30 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            item.old_status
                          )}`}
                        >
                          {item.old_status}
                        </span>

                        <span className="text-indigo-500 text-lg">
                          →
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            item.new_status
                          )}`}
                        >
                          {item.new_status}
                        </span>
                      </div>

                      <p className="text-indigo-300 mt-3 text-sm">
                        Changed by{" "}
                        <span className="text-white font-medium">
                          {item.changed_by_name || "Unknown User"}
                        </span>
                      </p>
                    </div>

                    <div className="text-indigo-400 text-sm">
                      {item.changed_at}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatusHistory;