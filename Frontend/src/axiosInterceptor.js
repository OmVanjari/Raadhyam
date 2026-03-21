import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "Another device logged in, session expired"
    ) {

      // Clear token from localStorage
      localStorage.removeItem("authToken");

      // Clear cookies
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
