import { useQuery } from "@tanstack/react-query";
import NavBar from "../components/NavBar";
import {
  fetchAdminListings,
  fetchAdminRequests,
  fetchAdminStats,
  fetchAdminSubscribers,
  fetchAdminUsers,
} from "../service/apiAdmin";

const AdminDashboard = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const { data: stats } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchAdminStats });
  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: fetchAdminUsers });
  const { data: listings = [] } = useQuery({ queryKey: ["admin-listings"], queryFn: fetchAdminListings });
  const { data: requests = [] } = useQuery({ queryKey: ["admin-requests"], queryFn: fetchAdminRequests });
  const { data: subscribers = [] } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: fetchAdminSubscribers,
  });

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      {!user?.is_staff ? (
        <section className="max-w-3xl mx-auto px-4 py-14">
          <p className="text-red-300">Admin access is required for this page.</p>
        </section>
      ) : (
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-rentease-yellow">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            ["Users", stats?.users || 0],
            ["Listings", stats?.listings || 0],
            ["Requests", stats?.requests || 0],
            ["Subscribers", stats?.subscribers || 0],
          ].map(([label, value]) => (
            <div key={label} className="bg-rentease-gray border border-rentease-yellow/20 p-4">
              <p className="text-rentease-light">{label}</p>
              <p className="text-rentease-yellow text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h2 className="text-rentease-yellow mb-2 font-semibold">Users</h2>
            <p className="text-rentease-light text-sm">Total records: {users.length}</p>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h2 className="text-rentease-yellow mb-2 font-semibold">Subscribers</h2>
            <p className="text-rentease-light text-sm">Total records: {subscribers.length}</p>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h2 className="text-rentease-yellow mb-2 font-semibold">Listings</h2>
            <p className="text-rentease-light text-sm">Total records: {listings.length}</p>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h2 className="text-rentease-yellow mb-2 font-semibold">Requests</h2>
            <p className="text-rentease-light text-sm">Total records: {requests.length}</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h3 className="text-rentease-yellow font-semibold mb-3">Manage Users</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {users.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-sm border-b border-rentease-lightgray pb-2">
                  <span className="text-rentease-light truncate">{record.email}</span>
                  <span className="text-rentease-yellow">{record.first_name || "User"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h3 className="text-rentease-yellow font-semibold mb-3">Manage Listings</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {listings.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-sm border-b border-rentease-lightgray pb-2">
                  <span className="text-rentease-light truncate">{record.title}</span>
                  <span className="text-rentease-yellow">{record.availability_display || "Status"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h3 className="text-rentease-yellow font-semibold mb-3">Manage Requests</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {requests.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-sm border-b border-rentease-lightgray pb-2">
                  <span className="text-rentease-light truncate">{record.listing_title}</span>
                  <span className="text-rentease-yellow">{record.request_status_display}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-rentease-gray border border-rentease-yellow/20 p-4">
            <h3 className="text-rentease-yellow font-semibold mb-3">Manage Subscribers</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {subscribers.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-sm border-b border-rentease-lightgray pb-2">
                  <span className="text-rentease-light truncate">{record.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default AdminDashboard;
