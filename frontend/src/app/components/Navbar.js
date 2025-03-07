"use client";
import { useContext } from "react";
import Link from "next/link";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <nav className="bg-violet-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Job Board</h1>

      <div className="flex space-x-4">
        {user?.role === "candidate" && (
          <>
            <Link
              href="/dashboard/candidate/joblist"
              className="hover:underline"
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/candidate/applications"
              className="hover:underline"
            >
              My Applications
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link href="/dashboard/recruiter/jobs" className="hover:underline">
              Manage Jobs
            </Link>
            <Link
              href="/dashboard/recruiter/applications"
              className="hover:underline"
            >
              Applications
            </Link>
            <Link
              href="/dashboard/recruiter/createjob"
              className="hover:underline"
            >
              Post a job
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && (
          <button
            className="bg-white px-3 text-black py-1 rounded hover:bg-yellow-400"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
