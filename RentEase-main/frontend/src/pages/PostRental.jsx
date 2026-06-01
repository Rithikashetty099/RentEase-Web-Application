import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import { createListing } from "../service/apiListings";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CATEGORY_OPTIONS } from "../constants/categories";

const PostRental = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    location: "",
    image: null,
    availability_status: "available",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = CATEGORY_OPTIONS;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "image" ? (files?.[0] || null) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to create a listing");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("price", Number(formData.price));
      payload.append("location", formData.location);
      payload.append("category", formData.category);
      payload.append("availability_status", formData.availability_status);
      if (formData.image) {
        payload.append("image", formData.image);
      }
      await createListing(payload);
      toast.success("Listing created successfully");
      navigate("/my-rentals");
    } catch (error) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rentease-dark">
      <NavBar />
      {/* Header */}
      <section className="bg-rentease-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-rentease-yellow mb-6 font-space-grotesk">
              List Your Item
            </h1>
            <p className="text-xl text-rentease-light font-inter max-w-2xl mx-auto">
              Turn your unused items into income by renting them out to others
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-rentease-gray border border-rentease-yellow/20 p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional Camera Kit, Mountain Bike, Tesla Model 3"
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light focus:outline-none focus:border-rentease-yellow font-inter"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-rentease-dark">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Connaught Place, Delhi"
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Price *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-rentease-yellow/30 bg-rentease-dark text-rentease-light font-inter">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="flex-1 px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Describe your item in detail. Include condition, features, any special instructions, etc."
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter resize-none"
                  required
                />
              </div>


              <div className="md:col-span-2">
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Listing Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light placeholder-rentease-light/60 focus:outline-none focus:border-rentease-yellow font-inter"
                />
              </div>

              <div>
                <label className="block text-rentease-yellow font-medium font-inter mb-2">
                  Availability Status
                </label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-rentease-dark border border-rentease-yellow/30 text-rentease-light focus:outline-none focus:border-rentease-yellow font-inter"
                >
                  <option value="available">Available</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Terms */}
              <div className="md:col-span-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-rentease-yellow bg-rentease-dark border-rentease-yellow/30 focus:ring-rentease-yellow"
                  />
                  <span className="text-rentease-light font-inter text-sm">
                    I agree to RentEase&apos;s{" "}
                    <a href="#" className="text-rentease-yellow hover:text-rentease-yellow/80 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-rentease-yellow hover:text-rentease-yellow/80 transition-colors">
                      Privacy Policy
                    </a>
                    . I confirm that I own this item and have the right to rent it out.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-rentease-yellow text-rentease-dark font-inter font-medium hover:bg-rentease-yellow/90 transition-colors"
                >
                  {isSubmitting ? "Publishing..." : "Publish Listing"}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default PostRental;
