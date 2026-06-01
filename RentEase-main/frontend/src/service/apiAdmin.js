import apiCall from "./api";

export const fetchAdminStats = () => apiCall("/admin/stats/");
export const fetchAdminUsers = () => apiCall("/admin/users/");
export const fetchAdminListings = () => apiCall("/admin/listings/");
export const fetchAdminRequests = () => apiCall("/admin/requests/");
export const fetchAdminSubscribers = () => apiCall("/admin/subscribers/");
