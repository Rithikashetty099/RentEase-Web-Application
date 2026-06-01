import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import {
  fetchMyRequests,
  fetchRequestsForMyListings,
  updateRentalRequestStatus,
} from "../service/apiRequests";

const MyRequests = () => {
  const queryClient = useQueryClient();

  const { data: sentRaw = [], isLoading: isSentLoading } = useQuery({
    queryKey: ["requests-sent"],
    queryFn: fetchMyRequests,
    refetchInterval: 20000,
  });

  const { data: receivedRaw = [], isLoading: isReceivedLoading } = useQuery({
    queryKey: ["requests-received"],
    queryFn: fetchRequestsForMyListings,
    refetchInterval: 20000,
  });

  const sent = useMemo(
    () => (Array.isArray(sentRaw) ? sentRaw : sentRaw.results || []),
    [sentRaw]
  );

  const received = useMemo(
    () => (Array.isArray(receivedRaw) ? receivedRaw : receivedRaw.results || []),
    [receivedRaw]
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateRentalRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests-received"] });
      queryClient.invalidateQueries({ queryKey: ["requests-sent"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Request status updated");
    },
    onError: (error) => toast.error(error.message || "Failed to update request"),
  });

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-rentease-yellow">My Requests</h1>
        <div>
          <h2 className="text-xl text-rentease-yellow mb-4">Requests Sent</h2>
          <div className="space-y-3">
            {isSentLoading && <p className="text-rentease-light">Loading sent requests...</p>}
            {!isSentLoading && sent.length === 0 && (
              <p className="text-rentease-light">No sent requests yet.</p>
            )}
            {!isSentLoading &&
              sent.map((req) => (
                <div key={req.id} className="bg-rentease-gray border border-rentease-yellow/20 p-4">
                  <p className="text-white font-semibold">{req.listing_title}</p>
                  <p className="text-rentease-light">{req.message}</p>
                  <span
                    className={`inline-block text-xs px-2 py-1 mt-2 font-semibold ${
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
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl text-rentease-yellow mb-4">Requests For My Listings</h2>
          <div className="space-y-3">
            {isReceivedLoading && (
              <p className="text-rentease-light">Loading incoming requests...</p>
            )}
            {!isReceivedLoading && received.length === 0 && (
              <p className="text-rentease-light">No incoming requests yet.</p>
            )}
            {!isReceivedLoading &&
              received.map((req) => (
                <div key={req.id} className="bg-rentease-gray border border-rentease-yellow/20 p-4">
                  <p className="text-white font-semibold">{req.listing_title}</p>
                  <p className="text-rentease-light">
                    {req.requester_name} — {req.phone_number}
                  </p>
                  <p className="text-rentease-light text-sm">{req.message}</p>
                  <span
                    className={`inline-block text-xs px-2 py-1 mt-2 font-semibold ${
                      req.request_status === "approved"
                        ? "bg-green-600 text-white"
                        : req.request_status === "rejected"
                        ? "bg-red-600 text-white"
                        : "bg-rentease-yellow text-rentease-dark"
                    }`}
                  >
                    {req.request_status_display}
                  </span>
                  {req.request_status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => statusMutation.mutate({ id: req.id, status: "approved" })}
                        disabled={statusMutation.isPending}
                        className="px-3 py-2 bg-rentease-yellow text-rentease-dark text-sm disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => statusMutation.mutate({ id: req.id, status: "rejected" })}
                        disabled={statusMutation.isPending}
                        className="px-3 py-2 border border-red-400 text-red-300 text-sm disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyRequests;
