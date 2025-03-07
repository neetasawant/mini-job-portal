"use client";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import axios from "axios";
import Navbar from "@/app/components/Navbar";

const CandidateApplications = () => {
  const { user, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // candidate fetch applications
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/fetchCandidateApplications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6">
        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="flex items-center bg-white/60 backdrop-blur-lg border border-gray-300 p-6 rounded-2xl shadow-xl"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {app.jobId?.title || "Unknown Job"}
                  </h2>
                  <p className="text-gray-700 mt-1">
                    {app.jobId?.description || "No description available."}
                  </p>
                </div>
                <div className="mx-4">
                  <span
                    className={`px-4 py-1 border border-gray-300 rounded-full text-lg font-medium ${
                      app.status === "Accepted"
                        ? "bg-green-200 text-green-700"
                        : app.status === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-black"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No applications found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;
