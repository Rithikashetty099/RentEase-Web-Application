import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/NavBar";
import { fetchDashboardStats } from "../service/apiUser";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-rentease-yellow mb-8">Dashboard</h1>
        {isLoading && <p className="text-rentease-light">Loading dashboard...</p>}
        {isError && <p className="text-red-400">Could not load dashboard stats.</p>}
        {data && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Listings", value: data.total_listings },
              { label: "Active Rentals", value: data.active_rentals },
              { label: "Requests Received", value: data.requests_received },
              { label: "Requests Sent", value: data.requests_sent },
            ].map((item) => (
              <div key={item.label} className="bg-rentease-gray border border-rentease-yellow/20 p-6">
                <p className="text-rentease-light text-sm">{item.label}</p>
                <p className="text-rentease-yellow text-3xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/my-rentals" className="bg-rentease-gray border border-rentease-yellow/20 p-5 text-rentease-light hover:border-rentease-yellow">
              My Listings
            </Link>
            <Link to="/my-requests" className="bg-rentease-gray border border-rentease-yellow/20 p-5 text-rentease-light hover:border-rentease-yellow">
              My Requests
            </Link>
            <Link to="/profile" className="bg-rentease-gray border border-rentease-yellow/20 p-5 text-rentease-light hover:border-rentease-yellow">
              Edit Profile
            </Link>
          </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
