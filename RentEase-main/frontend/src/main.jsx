import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store/store";
import { Provider } from "react-redux";
const queryClient = new QueryClient();

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import PageNotFound from "./pages/PageNotFound";
import { GlobalWrapper } from "./pages/GlobalWrapper";

// Import new RentEase pages
import RentEaseHomePage from "./pages/RentEaseHomePage";
import BrowseRentals from "./pages/BrowseRentals";
import MyRentals from "./pages/MyRentals";
import PostRental from "./pages/PostRental";
import PostRequest from "./pages/PostRequest";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import ListingDetail from "./pages/ListingDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalWrapper />,
    children: [
      {
        path: "/",
        element: <RentEaseHomePage />,
      },
      {
        path: "/browse",
        element: <BrowseRentals />,
      },
      {
        path: "/listings/:id",
        element: <ListingDetail />,
      },
      {
        path: "/my-rentals",
        element: (
          <ProtectedRoute>
            <MyRentals />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-rental",
        element: (
          <ProtectedRoute>
            <PostRental />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-request",
        element: (
          <ProtectedRoute>
            <PostRequest />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-requests",
        element: (
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
