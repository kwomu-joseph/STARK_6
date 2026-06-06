import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import { useLogs } from "../../context/LogContext";

const StudentGrades = () => {
  const { logs, loading, error } = useLogs();

  const [filteredGrades, setFilteredGrades] = useState([]);
  const [search, setSearch] = useState("");

  // Only logs with evaluation scores
  useEffect(() => {
    if (logs) {
      const gradedLogs = logs.filter(
        (log) =>
          log.evaluation_score !== null &&
          log.evaluation_score !== undefined
      );

      setFilteredGrades(gradedLogs);
    }
  }, [logs]);

  // Search functionality
  useEffect(() => {
    if (logs) {
      const gradedLogs = logs.filter(
        (log) =>
          log.evaluation_score !== null &&
          log.evaluation_score !== undefined
      );

      const filtered = gradedLogs.filter((log) =>
        log.status?.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredGrades(filtered);
    }
  }, [search, logs]);

  // Statistics
  const stats = useMemo(() => {
    const scores = filteredGrades.map((log) =>
      Number(log.evaluation_score)
    );

    return {
      total: filteredGrades.length,

      average:
        scores.length > 0
          ? (
              scores.reduce((a, b) => a + b, 0) /
              scores.length
            ).toFixed(1)
          : 0,

      highest:
        scores.length > 0
          ? Math.max(...scores)
          : 0,
    };
  }, [filteredGrades]);

  // Grade logic
  const calculateGrade = (score) => {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  // Grade colors
  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "bg-green-500/20 text-green-400 border border-green-500/30";

      case "B":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";

      case "C":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";

      case "D":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";

      default:
        return "bg-red-500/20 text-red-400 border border-red-500/30";
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Grades">
        <div className="text-center text-indigo-500 py-10">
          Loading student grades...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Grades">
      <div className="min-h-screen bg-blue-200 rounded-2xl border border-indigo-700 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              Student Grading Dashboard
            </h1>

            <p className="text-indigo-500 mt-1">
              Supervisor evaluation results from weekly logs.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-xl font-medium text-white shadow-lg shadow-indigo-900/40"
          >
            Refresh Grades
          </button>
        </div>

        {/* Error */}
        {error ? (
          <div className="mb-6 rounded-xl bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-100 text-sm">
              Total Evaluated Logs
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-100 text-sm">
              Average Score
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {stats.average}%
            </h2>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-700 shadow-lg">
            <p className="text-indigo-100 text-sm">
              Highest Score
            </p>

            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              {stats.highest}%
            </h2>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-indigo-600 rounded-2xl border border-indigo-700 shadow-xl overflow-hidden">

          {/* Top */}
          <div className="p-5 border-b border-indigo-700 flex items-center justify-between">

            <h2 className="text-xl font-semibold text-indigo-300">
              Supervisor Reviews & Scores
            </h2>

            <input
              type="text"
              placeholder="Search by status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0f172a] border border-indigo-600 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            {filteredGrades.length === 0 ? (
              <div className="p-10 text-center text-indigo-300">
                No evaluation scores available yet.
              </div>
            ) : (
              <table className="w-full text-left">

                <thead className="bg-[#0f172a] text-indigo-300 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Week</th>
                    <th className="px-6 py-4">Supervisor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Comment</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-indigo-700">

                  {filteredGrades.map((log) => {
                    const grade = calculateGrade(
                      Number(log.evaluation_score)
                    );

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-indigo-800/20 transition"
                      >
                        <td className="px-6 py-5 text-white">
                          Week {log.week_number}
                        </td>

                        <td className="px-6 py-5 text-indigo-200">
                          {log.supervisor_name || "N/A"}
                        </td>

                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {log.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-cyan-400 font-bold">
                          {log.evaluation_score}%
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                              grade
                            )}`}
                          >
                            {grade}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-indigo-100 max-w-xs">
                          {log.supervisor_comment || "No comment"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;