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
        (log) => log.evaluation_score !== null && log.evaluation_score !== undefined 
      ); 
      setFilteredGrades(gradedLogs); 
    } 
  }, [logs]); 

  // Search functionality 
  useEffect(() => { 
    if (logs) { 
      const gradedLogs = logs.filter( 
        (log) => log.evaluation_score !== null && log.evaluation_score !== undefined 
      ); 
      const filtered = gradedLogs.filter((log) => 
        log.status?.toLowerCase().includes(search.toLowerCase()) 
      ); 
      setFilteredGrades(filtered); 
    } 
  }, [search, logs]); 

  // Statistics 
  const stats = useMemo(() => { 
    const scores = filteredGrades.map((log) => Number(log.evaluation_score)); 
    return { 
      total: filteredGrades.length, 
      average: scores.length > 0 ? ( 
        scores.reduce((a, b) => a + b, 0) / scores.length 
      ).toFixed(1) : 0, 
      highest: scores.length > 0 ? Math.max(...scores) : 0, 
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
      case "A": return "bg-green-100 text-green-700 border border-green-200"; 
      case "B": return "bg-blue-100 text-blue-700 border border-blue-200"; 
      case "C": return "bg-yellow-100 text-yellow-700 border border-yellow-200"; 
      case "D": return "bg-orange-100 text-orange-700 border border-orange-200"; 
      default: return "bg-red-100 text-red-700 border border-red-200"; 
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
      <div className="min-h-screen bg-blue-50 rounded-2xl border border-indigo-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Student Grading Dashboard
            </h1>
            <p className="text-indigo-600 mt-1">
              Supervisor evaluation results from weekly logs.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-xl font-medium text-white shadow-lg shadow-indigo-200/50"
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
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
            <p className="text-indigo-500 text-sm">Total Evaluated Logs</p>
            <h2 className="text-3xl font-bold text-indigo-900 mt-2">{stats.total}</h2>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
            <p className="text-indigo-500 text-sm">Average Score</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">{stats.average}%</h2>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
            <p className="text-indigo-500 text-sm">Highest Score</p>
            <h2 className="text-3xl font-bold text-indigo-600 mt-2">{stats.highest}%</h2>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          {/* Top */}
          <div className="p-5 border-b border-indigo-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-indigo-900">
              Supervisor Reviews & Scores
            </h2>
            <input 
              type="text" 
              placeholder="Search by status..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-900 outline-none focus:border-indigo-500" 
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filteredGrades.length === 0 ? (
              <div className="p-10 text-center text-indigo-400">
                No evaluation scores available yet.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-indigo-50 text-indigo-700 text-sm uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Week</th>
                    <th className="px-6 py-4">Supervisor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100">
                  {filteredGrades.map((log) => {
                    const grade = calculateGrade(Number(log.evaluation_score));
                    return (
                      <tr key={log.id} className="hover:bg-indigo-50/50 transition">
                        <td className="px-6 py-5 text-indigo-900 font-medium">
                          Week {log.week_number}
                        </td>
                        <td className="px-6 py-5 text-slate-600">
                          {log.supervisor_name || "N/A"}
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-indigo-600 font-bold">
                          {log.evaluation_score}%
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade)}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-slate-600 max-w-xs truncate">
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
