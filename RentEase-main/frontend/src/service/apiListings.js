import apiCall from "./api";

export const fetchListings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.minPrice) {
    params.append("min_price", filters.minPrice);
  }
  if (filters.maxPrice) {
    params.append("max_price", filters.maxPrice);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.location) {
    params.append("location", filters.location);
  }
  if (filters.owner) {
    params.append("owner", filters.owner);
  }

  const query = params.toString();
  const endpoint = query ? `/listings/?${query}` : "/listings/";
  return apiCall(endpoint);
};

export const createListing = async (listingData) =>
  apiCall("/listings/", {
    method: "POST",
    body: listingData instanceof FormData ? listingData : JSON.stringify(listingData),
  });

export const updateListing = async (id, listingData) =>
  apiCall(`/listings/${id}/`, {
    method: "PATCH",
    body: listingData instanceof FormData ? listingData : JSON.stringify(listingData),
  });

export const deleteListing = async (id) =>
  apiCall(`/listings/${id}/`, {
    method: "DELETE",
  });

export const getListingById = async (id) => apiCall(`/listings/${id}/`);
