import apiCall from "./api";

export const createRentalRequest = (payload) =>
  apiCall("/requests/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchMyRequests = () => apiCall("/requests/my/");

export const fetchRequestsForMyListings = () => apiCall("/requests/for-my-listings/");

export const updateRentalRequestStatus = (id, request_status) =>
  apiCall(`/requests/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ request_status }),
  });
