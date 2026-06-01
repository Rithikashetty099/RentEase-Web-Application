import apiCall from "./api";

export const fetchProfile = () => apiCall("/profile/");

export const updateProfile = (payload) =>
  apiCall("/profile/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const fetchDashboardStats = () => apiCall("/dashboard/stats/");
