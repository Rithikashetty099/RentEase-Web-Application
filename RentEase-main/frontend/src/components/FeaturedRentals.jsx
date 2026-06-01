import { motion } from 'framer-motion'
import { MapPin, Zap } from 'lucide-react'
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchListings } from "../service/apiListings";

const FeaturedRentals = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: () => fetchListings(),
  });
  const featuredItems = (Array.isArray(data) ? data : data?.results || []).slice(0, 6);

  return (
    <section className="bg-rentease-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-white mb-4">
            Featured <span className="text-rentease-yellow">Rentals</span>
          </h2>
          <p className="text-lg text-gray-300 font-inter max-w-2xl mx-auto">
            Discover popular items available for rent in your area. From everyday tools to luxury experiences.
          </p>
        </motion.div>

        {/* Rentals Grid */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-rentease animate-pulse">
                <div className="w-full h-48 bg-rentease-lightgray mb-6" />
                <div className="space-y-3">
                  <div className="h-6 bg-rentease-lightgray" />
                  <div className="h-4 bg-rentease-lightgray w-2/3" />
                  <div className="h-10 bg-rentease-lightgray mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isError && featuredItems.length === 0 && (
          <p className="text-center text-gray-300">No featured rentals available right now.</p>
        )}
        {isError && (
          <p className="text-center text-red-300">Unable to load featured rentals.</p>
        )}
        {!isLoading && !isError && featuredItems.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="card-rentease group cursor-pointer"
            >
              {/* Image/Icon */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-rentease-lightgray flex items-center justify-center text-6xl border border-rentease-gray">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    "📦"
                  )}
                </div>
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.quickRent && (
                    <span className="bg-rentease-yellow text-rentease-black px-2 py-1 text-xs font-bold font-mono flex items-center gap-1">
                      <Zap size={12} />
                      QUICK RENT
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-bold font-mono ${
                    item.availability_status === "available"
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {item.availability_display || "Unavailable"}
                  </span>
                </div>

                {/* Category */}
                <div className="absolute top-3 right-3">
                  <span className="bg-rentease-black/80 text-rentease-yellow px-2 py-1 text-xs font-mono">
                    {(item.category_display || item.category || "Other").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white font-space group-hover:text-rentease-yellow transition-colors">
                    <Link to={`/listings/${item.id}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-300">
                    <MapPin size={14} />
                    <span className="text-sm font-inter">{item.location}</span>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rentease-yellow rounded-full flex items-center justify-center">
                    <span className="text-rentease-black font-bold text-sm">
                      {(item.owner_name || "U").charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-300 font-inter">by {item.owner_name || item.owner_email}</span>
                </div>

                {/* Price & Action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-rentease-lightgray">
                  <div>
                    <span className="text-2xl font-bold text-rentease-yellow font-mono">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <Link
                      to={`/listings/${item.id}`}
                      className="btn-secondary px-4 py-2 text-sm inline-block text-center"
                    >
                      View details
                    </Link>

                  {item.availability_status === "available" ? (
                    <motion.button
                      className="btn-primary px-4 py-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/post-request?listing=${item.id}`)}
                    >
                      Request Rent Now
                    </motion.button>
                  ) : (
                    <button className="btn-secondary px-4 py-2 text-sm opacity-50 cursor-not-allowed">
                      Unavailable
                    </button>
                  )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            className="btn-secondary px-8 py-4 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/browse")}
          >
            View All Rentals
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedRentals
