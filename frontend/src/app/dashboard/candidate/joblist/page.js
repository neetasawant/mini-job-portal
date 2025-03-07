"use client";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/Navbar";

const JobList = () => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [uploading, setUploading] = useState({});
  const [expandedJobs, setExpandedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs");
        const jobsData = jobsRes.data;

        if (user) {
          const applicationsRes = await axios.get(
            "http://localhost:5000/api/applications/fetchCandidateApplications",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const appliedJobIds = new Set(
            applicationsRes.data.map((app) =>
              typeof app.jobId === "object" ? app.jobId._id : app.jobId
            )
          );

          setAppliedJobs(appliedJobIds);
          setJobs(jobsData.map(job => ({ ...job, isApplied: appliedJobIds.has(job._id) })));
        } else {
          setJobs(jobsData);
        }
      } catch (error) {
        console.error("Error fetching jobs or applications:", error);
      }
    };

    fetchJobsAndApplications();
  }, [user, token]);

  const handleFileSelect = async (event, jobId) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [jobId]: true }));

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);

    try {
      //upload resume
      await axios.post("http://localhost:5000/api/applications", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setAppliedJobs((prev) => new Set([...prev, jobId]));
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, isApplied: true } : job)));

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6">
        {jobs.length > 0 ? (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="flex items-center bg-white/60 backdrop-blur-lg border border-gray-300 p-6 rounded-2xl shadow-xl">
                
                {/* Job Details */}
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
                <input
                  id={`file-upload-${job._id}`}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, job._id)}
                />

                <button
                  onClick={() => document.getElementById(`file-upload-${job._id}`).click()}
                  className={`ml-4 px-5 py-2 rounded-lg font-medium text-white transition duration-300 ${
                    appliedJobs.has(job._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={uploading[job._id] || appliedJobs.has(job._id)}
                >
                  {appliedJobs.has(job._id)
                    ? "Applied"
                    : uploading[job._id]
                    ? "Uploading..."
                    : "Apply Now"}
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
