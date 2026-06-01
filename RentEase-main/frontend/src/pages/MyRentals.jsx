import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, fetchListings, updateListing } from "../service/apiListings";
import { toast } from "sonner";
import { CATEGORY_OPTIONS } from "../constants/categories";

const MyRentals = () => {
  const queryClient = useQueryClient();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    category: "electronics",
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => fetchListings({ owner: user.id }),
    enabled: Boolean(user?.id),
  });

  const myListings = useMemo(() => {
    const list = Array.isArray(listings) ? listings : listings.results || [];
    return list;
  }, [listings]);

  const deleteMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      toast.success("Listing deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Delete failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateListing(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      setEditingId(null);
      toast.success("Listing updated");
    },
    onError: (error) => {
      toast.error(error.message || "Update failed");
    },
  });

  const startEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      price: listing.price,
      category: listing.category,
    });
  };

  const submitEdit = (id) => {
    updateMutation.mutate({
      id,
      payload: {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        price: Number(editForm.price),
        category: editForm.category,
      },
    });
  };

  const renderMyListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rentease-yellow font-space-grotesk">My Listings</h2>
      </div>

      <div className="grid gap-6">
        {myListings.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-rentease-gray border border-rentease-yellow/20 p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <span className="text-xs text-rentease-light/60">#{item.id}</span>
                <div>
                  <h3 className="text-xl font-bold text-rentease-yellow font-space-grotesk">{item.title}</h3>
                  <p className="text-rentease-light/80 font-inter">{item.category_display}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-rentease-yellow font-bold">₹{item.price}</span>
                    <span className="px-2 py-1 text-xs font-mono bg-rentease-yellow/20 text-rentease-yellow">
                      {(item.availability_display || item.availability_status || "").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4 pt-4 border-t border-rentease-yellow/20">
              <button
                onClick={() => startEdit(item)}
                className="bg-rentease-yellow text-rentease-dark px-4 py-2 font-inter text-sm hover:bg-rentease-yellow/90 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                className="border border-red-500/30 text-red-400 px-4 py-2 font-inter text-sm hover:border-red-500/50 transition-colors"
              >
                Delete
              </button>
            </div>

            {editingId === item.id && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-rentease-yellow/20 pt-4">
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="px-3 py-2 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
                  placeholder="Title"
                />
                <input
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="px-3 py-2 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
                  placeholder="Location"
                />
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="px-3 py-2 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
                  placeholder="Price"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="px-3 py-2 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="md:col-span-2 px-3 py-2 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light"
                  rows={3}
                  placeholder="Description"
                />
                <div className="md:col-span-2 flex gap-2">
                  <button
                    onClick={() => submitEdit(item.id)}
                    className="bg-rentease-yellow text-rentease-dark px-4 py-2 text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="border border-rentease-yellow/30 text-rentease-light px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {isLoading && <p className="text-rentease-light">Loading your listings...</p>}
      {!isLoading && myListings.length === 0 && (
        <p className="text-rentease-light">No listings found for your account.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      {/* Header */}
      <section className="bg-rentease-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-rentease-yellow mb-6 font-space-grotesk">
              My Dashboard
            </h1>
            <p className="text-xl text-rentease-light font-inter max-w-2xl mx-auto">
              Manage your rentals and track your earnings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderMyListings()}
        </div>
      </section>
    </div>
  );
};

export default MyRentals;
