import apiCall from "./api";

export const subscribeNewsletter = (payload) =>
  apiCall("/subscribe/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
