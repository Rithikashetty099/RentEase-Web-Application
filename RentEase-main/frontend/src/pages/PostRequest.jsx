import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import { fetchListings } from "../service/apiListings";
import { createRentalRequest, fetchMyRequests } from "../service/apiRequests";

const PostRequest = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedListing = searchParams.get("listing");

  const [form, setForm] = useState({
    listing: preselectedListing || "",
    message: "",
    phone_number: "",
  });

  useEffect(() => {
    const lid = searchParams.get("listing");
    if (lid) {
      setForm((prev) => ({ ...prev, listing: lid }));
    }
  }, [searchParams]);

  const { data: listings = [] } = useQuery({
    queryKey: ["request-listings"],
    queryFn: fetchListings,
  });

  const { data: myRequestsRaw = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["requests-sent"],
    queryFn: fetchMyRequests,
    refetchInterval: 20000,
  });

  const normalizedListings = useMemo(
    () => (Array.isArray(listings) ? listings : listings.results || []),
    [listings]
  );

  const myRequests = useMemo(
    () => (Array.isArray(myRequestsRaw) ? myRequestsRaw : myRequestsRaw.results || []),
    [myRequestsRaw]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: createRentalRequest,
    onSuccess: (_, variables) => {
      toast.success("Rental request sent");
      setForm((prev) => ({
        ...prev,
        message: "",
        phone_number: "",
        listing: variables.listing ? String(variables.listing) : "",
      }));
      queryClient.invalidateQueries({ queryKey: ["requests-sent"] });
      queryClient.invalidateQueries({ queryKey: ["requests-received"] });
      queryClient.invalidateQueries({ queryKey: ["listing", String(variables.listing)] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error) => toast.error(error.message || "Failed to send request"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      listing: Number(form.listing),
      message: form.message.trim(),
      phone_number: form.phone_number.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      <section className="bg-rentease-gray py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-rentease-yellow mb-4 font-space-grotesk">
            Request Rent Now
          </h1>
          <p className="text-lg text-rentease-light font-inter mb-8">
            Choose a listing, leave a short note and your phone number so the owner can respond quickly.
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-rentease-dark border border-rentease-yellow/20 rounded-none p-6 md:p-8 mb-10 text-left"
          >
            <div className="mb-4">
              <label className="block text-rentease-yellow font-medium font-inter mb-2">Listing *</label>
              <select
                name="listing"
                value={form.listing}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light"
                required
              >
                <option value="">Select listing</option>
                {normalizedListings.map((item) => (
                  <option key={item.id} value={item.id} className="bg-rentease-dark">
                    {item.title} — {item.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-rentease-yellow font-medium font-inter mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe duration needed, pickup preference, etc."
                className="w-full px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter resize-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-rentease-yellow font-medium font-inter mb-2">Phone Number *</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light"
                required
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full px-6 py-3 bg-rentease-yellow text-rentease-dark font-inter font-medium hover:bg-rentease-yellow/90 transition-colors disabled:opacity-60"
            >
              {mutation.isPending ? "Sending..." : "Send Request"}
            </button>
          </form>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-rentease-yellow mb-6 font-space-grotesk">
          My Sent Requests
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {requestsLoading && (
            <p className="text-rentease-light md:col-span-2">Loading your requests...</p>
          )}
          {!requestsLoading &&
            myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-rentease-gray border border-rentease-yellow/20 rounded-none p-6 flex items-start gap-4 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-rentease-yellow font-space-grotesk text-lg">
                      {req.listing_title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-1 font-semibold uppercase ${
                        req.request_status === "approved"
                          ? "bg-green-600 text-white"
                          : req.request_status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-rentease-yellow text-rentease-dark"
                      }`}
                    >
                      {req.request_status_display}
                    </span>
                  </div>
                  <div className="text-rentease-light font-inter mt-1 text-sm">{req.message}</div>
                </div>
              </div>
            ))}
          {!requestsLoading && myRequests.length === 0 && (
            <p className="text-rentease-light md:col-span-2">No requests sent yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostRequest;
