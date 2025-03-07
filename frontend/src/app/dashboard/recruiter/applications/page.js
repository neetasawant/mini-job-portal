"use client";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import axios from "axios";
import Navbar from "@/app/components/Navbar";

const RecruiterApplications = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/recruiterApplications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (user) fetchApplications();
  }, [user, token]);

  // update status 
  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setMessage(""); 
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications(applications.map(app => 
        app._id === id ? { ...app, status } : app
      ));

      setMessage(`Status updated to "${status}" successfully!`); 
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); 
    }
  };

  const statusColors = {
    pending: "text-gray-600 bg-gray-200",
    interview: "text-blue-700 bg-blue-100",
    reviewed: "text-yellow-700 bg-yellow-100",
    hired: "text-green-700 bg-green-100",
    rejected: "text-red-700 bg-red-100",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Navbar />
      <div className="max-w-full mx-auto bg-white shadow-2xl p-10">
        {message && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded text-center font-medium">
            {message}
          </div>
        )}

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md overflow-hidden">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                <tr className="text-left">
                  <th className="p-6 border text-lg">Job Title</th>
                  <th className="p-6 border text-lg">Candidate</th>
                  <th className="p-6 border text-lg">Email</th>
                  <th className="p-6 border text-lg">Phone</th>
                  <th className="p-6 border text-lg">Skills</th>
                  <th className="p-6 border text-lg">Status</th>
                  <th className="p-6 border text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr 
                    key={app._id} 
                    className={`border ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-all duration-300`}
                  >
                    <td className="p-6 border font-medium">{app.jobId.title}</td>
                    <td className="p-6 border">{app.parsedDetails.name}</td>
                    <td className="p-6 border">{app.parsedDetails.email}</td>
                    <td className="p-6 border">{app.parsedDetails.phone || "N/A"}</td>
                    <td className="p-6 border text-sm text-gray-600">
                      {app.parsedDetails.skills?.join(", ") || "N/A"}
                    </td>
                    <td className="p-6 border">
                      <span 
                        className={`px-6 py-3 rounded-full text-sm font-semibold shadow ${statusColors[app.status || "pending"]}`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-6 flex flex-wrap gap-1 justify-start">
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "interview")} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mx-1"
                        disabled={loading}
                      >
                        Interview
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "reviewed")} 
                        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105 mx-1"
                        disabled={loading}
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "hired")} 
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 mx-1"
                        disabled={loading}
                      >
                        Shortlist
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "rejected")} 
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 mx-1"
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10 text-lg">No applications found.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplications;
