import { useEffect, useState } from "react";
import DashboardLayout from "../../Components/DashboardLayout";
import api from "../../api/api";

const Opportunities = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/opportunities/")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout title="Internship Opportunities">
      <div>
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Opportunity Listings
      </h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="border-b py-3">
              <p className="font-semibold">{report.title}</p>
              <p className="text-gray-600">{report.summary}</p>
              <p className="text-sm text-gray-400">
                Date: {report.created_at}
              </p>
            </div>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </div>
    </div>
    </DashboardLayout>
    
  );
};

export default Opportunities;
