import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import { deleteListing, getListingById } from "../service/apiListings";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteListing(id),
    onSuccess: () => {
      toast.success("Listing deleted");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      navigate("/browse", { replace: true });
    },
    onError: (error) => toast.error(error.message || "Could not delete listing"),
  });

  const isOwner =
    user && listing && Number(listing.owner) === Number(user.id);

  const handleDelete = () => {
    if (window.confirm("Delete this listing permanently?")) {
      deleteMutation.mutate();
    }
  };

  const loginState =
    listing && !user ? { from: `/post-request?listing=${listing.id}` } : undefined;

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      <section className="bg-rentease-gray py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-rentease-light hover:text-rentease-yellow font-inter text-sm mb-6"
          >
            ← Back
          </button>

          {isLoading && (
            <div className="animate-pulse space-y-6">
              <div className="h-72 bg-rentease-dark border border-rentease-yellow/20" />
              <div className="h-8 bg-rentease-dark w-2/3 border border-rentease-yellow/20" />
              <div className="h-24 bg-rentease-dark border border-rentease-yellow/20" />
            </div>
          )}

          {isError && (
            <p className="text-red-400 font-inter">
              Could not load this listing. It may have been removed.
            </p>
          )}

          {!isLoading && listing && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="grid lg:grid-cols-2 gap-10 items-start"
            >
              <div className="border border-rentease-yellow/20 bg-rentease-dark overflow-hidden">
                {listing.image_url ? (
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-72 object-cover border-b border-rentease-yellow/20"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-5xl bg-rentease-gray border-b border-rentease-yellow/20">
                    📦
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono text-rentease-light/70 mb-1">
                      {listing.category_display}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-rentease-yellow font-space-grotesk">
                      {listing.title}
                    </h1>
                    <p className="text-rentease-light font-inter mt-2 capitalize">
                      {listing.location}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 font-mono uppercase ${
                      listing.availability_status === "available"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {listing.availability_display || "Unavailable"}
                  </span>
                </div>

                <div className="text-3xl font-bold text-rentease-yellow font-mono">
                  ₹{listing.price}
                  <span className="text-sm font-inter text-rentease-light font-normal ml-2">
                    per rental period
                  </span>
                </div>

                <div className="bg-rentease-gray border border-rentease-yellow/20 p-5 space-y-2">
                  <h2 className="text-rentease-yellow font-semibold font-space-grotesk">
                    Listed by
                  </h2>
                  <p className="text-white font-inter">{listing.owner_name}</p>
                  <p className="text-rentease-light text-sm font-inter">{listing.owner_email}</p>
                </div>

                <div className="border border-rentease-lightgray/40 p-5">
                  <h2 className="text-rentease-yellow font-semibold font-space-grotesk mb-2">
                    Description
                  </h2>
                  <p className="text-rentease-light font-inter whitespace-pre-wrap leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isOwner ? (
                    <>
                      <Link
                        to="/my-rentals"
                        className="btn-primary px-5 py-3 text-sm inline-block text-center"
                      >
                        Edit in My Listings
                      </Link>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="btn-secondary px-5 py-3 text-sm border-red-400 text-red-300 hover:bg-red-500/10"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete listing"}
                      </button>
                    </>
                  ) : (
                    <>
                      {listing.availability_status === "available" && user && (
                        <Link
                          to={`/post-request?listing=${listing.id}`}
                          className="btn-primary px-6 py-3 text-sm inline-block text-center"
                        >
                          Request to rent
                        </Link>
                      )}
                      {listing.availability_status !== "available" && !isOwner && (
                        <span className="text-rentease-light text-sm font-inter">
                          This item is not available to request right now.
                        </span>
                      )}
                      {!user && listing.availability_status === "available" && (
                        <Link
                          to="/login"
                          state={loginState}
                          className="btn-primary px-6 py-3 text-sm inline-block text-center"
                        >
                          Log in to request
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ListingDetail;
