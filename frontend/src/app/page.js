"use client";
import { useEffect, useState, useContext } from "react";
import AuthContext from "./context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "./components/Navbar";

const JobList = () => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [resume, setResume] = useState({});
  const [uploading, setUploading] = useState({});
  const [expandedJobs, setExpandedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs"); // Public jobs API
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserApplications = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/applications/fetchCandidateApplications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const appliedJobIds = new Set(res.data.map((app) => (app.jobId._id ? app.jobId._id : app.jobId)));
          setAppliedJobs(appliedJobIds);
          setJobs((prevJobs) => prevJobs.map((job) => ({ ...job, isApplied: appliedJobIds.has(job._id) })));
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
      };

      fetchUserApplications();
    }
  }, [user, token]);

  const handleApply = async (jobId) => {
    if (!user) {
      router.push("/login"); // Redirect if not logged in
      return;
    }

    if (!resume[jobId]) {
      alert("Please upload your resume before applying.");
      return;
    }

    setUploading((prev) => ({ ...prev, [jobId]: true }));

    const formData = new FormData();
    formData.append("resume", resume[jobId]);
    formData.append("jobId", jobId);

    try {
      await axios.post("http://localhost:5000/api/applications", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setAppliedJobs((prev) => new Set([...prev, jobId]));
      setJobs((prevJobs) => prevJobs.map((job) => (job._id === jobId ? { ...job, isApplied: true } : job)));

      alert("Application submitted successfully!");
      setResume((prev) => ({ ...prev, [jobId]: null }));
      document.getElementById(`resume-upload-${jobId}`).value = "";
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      newSet.has(jobId) ? newSet.delete(jobId) : newSet.add(jobId);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Latest Job Openings</h1>
        {jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="flex items-center bg-white/60 backdrop-blur-lg border border-gray-300 p-6 rounded-2xl shadow-xl">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                  <p className="text-gray-700 mt-1">
                    {expandedJobs.has(job._id)
                      ? job.description
                      : job.description.length > 100
                      ? `${job.description.slice(0, 100)}...`
                      : job.description}
                  </p>
                  {job.description.length > 100 && (
                    <button
                      onClick={() => toggleDescription(job._id)}
                      className="text-blue-600 hover:underline mt-1 text-sm font-medium"
                    >
                      {expandedJobs.has(job._id) ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>

                {/* Resume Upload */}
                {user && (
                  <div className="flex flex-col items-center mx-4">
                    <label className="block text-sm font-medium text-gray-800">Upload Resume</label>
                    <input
                      id={`resume-upload-${job._id}`}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume({ ...resume, [job._id]: e.target.files[0] })}
                      className="mt-1 w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-none file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                      disabled={appliedJobs.has(job._id)}
                    />
                  </div>
                )}
                <button
                  onClick={() => handleApply(job._id)}
                  className={`ml-4 px-5 py-2 rounded-lg font-medium text-white transition duration-300 ${
                    appliedJobs.has(job._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={uploading[job._id] || appliedJobs.has(job._id)}
                >
                  {appliedJobs.has(job._id) ? "Applied" : uploading[job._id] ? "Uploading..." : "Apply Now"}
                </button>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
