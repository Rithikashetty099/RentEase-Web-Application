import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "../service/apiListings";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../constants/categories";

const BrowseRentals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = useMemo(
    () => [{ id: "all", name: "All Categories" }, ...CATEGORY_OPTIONS],
    []
  );

  const { data: listings = [], isLoading, isError } = useQuery({
    queryKey: ["listings", selectedCategory, searchTerm, locationFilter, minPrice, maxPrice],
    queryFn: () =>
      fetchListings({
        category: selectedCategory,
        search: searchTerm,
        location: locationFilter,
        minPrice,
        maxPrice,
      }),
  });

  const filteredRentals = Array.isArray(listings) ? listings : listings.results || [];

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      {/* Hero Section */}
      <section className="bg-rentease-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-rentease-yellow mb-6 font-space-grotesk">
              Browse Rentals
            </h1>
            <p className="text-xl text-rentease-light mb-8 font-inter max-w-2xl mx-auto">
              Find the perfect rental from our community of trusted renters
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-rentease-yellow/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
              />
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light focus:outline-none focus:border-rentease-yellow font-inter"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-rentease-gray">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-auto">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light"
              />
            </div>
            <div className="w-full md:w-auto">
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-rentease-gray border border-rentease-yellow/30 text-rentease-light"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-rentease-gray border border-rentease-yellow/20 animate-pulse"
                >
                  <div className="h-48 bg-rentease-dark/50 border-b border-rentease-yellow/20" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-rentease-dark/50" />
                    <div className="h-4 bg-rentease-dark/50 w-2/3" />
                    <div className="h-10 bg-rentease-dark/50 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRentals.map((rental, index) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-rentease-gray border border-rentease-yellow/20 hover:border-rentease-yellow/50 transition-all duration-300 group cursor-pointer"
              >
                {/* Image Placeholder */}
                {rental.image_url ? (
                  <img
                    src={rental.image_url}
                    alt={rental.title}
                    className="h-48 w-full object-cover border-b border-rentease-yellow/20"
                  />
                ) : (
                  <div className="h-48 bg-rentease-dark/50 flex items-center justify-center border-b border-rentease-yellow/20">
                    <span className="text-rentease-light/60 font-inter">No image</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-rentease-yellow font-space-grotesk group-hover:text-rentease-yellow/80 transition-colors">
                      <Link to={`/listings/${rental.id}`} className="hover:underline">
                        {rental.title}
                      </Link>
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-rentease-light font-inter text-xs">
                        {rental.category_display}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-1 font-mono ${
                          rental.availability_status === "available"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {(rental.availability_display || "Unavailable").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-rentease-light/80 font-inter text-sm mb-4 capitalize">
                    {rental.location}
                  </p>
                  
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="text-rentease-yellow font-bold font-space-grotesk">
                      ₹{rental.price}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/listings/${rental.id}`}
                        className="px-3 py-2 border border-rentease-yellow/40 text-rentease-yellow text-xs font-medium hover:bg-rentease-yellow/10"
                      >
                        View details
                      </Link>
                      <Link
                        to={`/post-request?listing=${rental.id}`}
                        className="px-3 py-2 bg-rentease-yellow text-rentease-dark text-xs font-medium"
                      >
                        Request rent
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-16">
              <p className="text-red-400 font-inter text-lg">Unable to load listings right now.</p>
            </div>
          )}

          {!isLoading && filteredRentals.length === 0 && (
            <div className="text-center py-16">
              <p className="text-rentease-light font-inter text-lg">No rentals found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowseRentals;
