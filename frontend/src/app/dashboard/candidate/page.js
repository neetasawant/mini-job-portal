"use client";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const CandidateDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== "candidate") {
            router.push("/login");
            return;
        }

        const fetchApplications = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/applications?candidateId=${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplications(res.data);
            } catch (err) {
                console.error("Error fetching applications:", err);
            }
        };

        fetchApplications();
    }, [user, token, router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-center">Candidate Dashboard</h1>
                <p className="text-center text-gray-500 mb-6">Your job applications</p>

                {applications.length === 0 ? (
                    <p className="text-center text-gray-500">No applications found.</p>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="border-b py-4">
                            <h2 className="text-xl font-semibold">{app.jobTitle}</h2>
                            <p className="text-gray-600">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                            <p className={`mt-2 font-semibold ${
                                app.status === "Accepted" ? "text-green-600" :
                                app.status === "Rejected" ? "text-red-600" :
                                "text-yellow-600"
                            }`}>
                                Status: {app.status}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CandidateDashboard;
