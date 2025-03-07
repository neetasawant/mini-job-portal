"use client";
import Link from "next/link";

const RecruiterDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/recruiter/jobs" className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                    Manage Jobs
                </Link>
                <Link href="/dashboard/recruiter/applications" className="p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                    View Applications
                </Link>
                <Link href="/dashboard/recruiter/createjob" className="p-4 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600">
                    Post a Job
                </Link>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
