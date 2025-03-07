"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import AuthContext from "../../../context/AuthContext";

const Jobs = () => {
    const { user, token } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "" });
    const [expandedJobs, setExpandedJobs] = useState(new Set());

    useEffect(() => {
        if (!user || !token) return;

        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/jobs/recruiter/jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobs(res.data);
            } catch (err) {
                setError("Failed to fetch jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [user, token]);

    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobs.filter((job) => job._id !== jobId));
        } catch (err) {
            setError("Failed to delete job.");
        }
    };

    const startEditing = (job) => {
        setEditingJob(job._id);
        setEditForm({ title: job.title, description: job.description });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const submitEdit = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/jobs/${editingJob}`, editForm, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setJobs(jobs.map((job) => (job._id === editingJob ? res.data : job)));
            setEditingJob(null);
        } catch (err) {
            setError("Failed to update job.");
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
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : jobs.length === 0 ? (
                    <p className="text-gray-500 text-center">No jobs posted yet.</p>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
                                {editingJob === job._id ? (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleEditChange}
                                            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={submitEdit} 
                                                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingJob(null)} 
                                                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                        <p className="text-gray-600 mt-1">
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
                                )}
                                {!editingJob && (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => startEditing(job)} 
                                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteJob(job._id)} 
                                            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
