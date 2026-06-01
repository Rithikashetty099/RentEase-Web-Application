import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_OPTIONS } from '../constants/categories'

const CategoriesSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get("category");
  const categories = CATEGORY_OPTIONS.map((item, index) => ({
    ...item,
    description: `Explore premium ${item.name.toLowerCase()} rentals near you.`,
    popular: index < 3,
  }));

  return (
    <section className="bg-rentease-dark py-20">
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
            Browse by <span className="text-rentease-yellow">Category</span>
          </h2>
          <p className="text-lg text-gray-300 font-inter max-w-2xl mx-auto">
            Find exactly what you need from our diverse range of rental categories.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/browse?category=${category.id}`)}
              className={`relative w-full text-left bg-rentease-gray border p-6 cursor-pointer group overflow-hidden transition-all duration-300 ${
                activeCategory === category.id
                  ? "border-rentease-yellow shadow-[0_0_0_1px_rgba(255,214,0,0.35)]"
                  : "border-rentease-lightgray"
              }`}
            >
              {/* Popular Badge */}
              {category.popular && (
                <div className="absolute top-3 right-3">
                  <span className="bg-rentease-yellow text-rentease-black px-2 py-1 text-xs font-bold font-mono">
                    POPULAR
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white font-space group-hover:text-rentease-yellow transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-gray-300 text-sm font-inter leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-rentease-lightgray">
                  <span className="text-rentease-yellow font-mono text-sm font-bold">Browse</span>
                  
                  <motion.div
                    className="flex items-center gap-1 text-white group-hover:text-rentease-yellow transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-inter">Browse</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </div>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-rentease-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-rentease-gray border border-rentease-lightgray"
        >
          <h3 className="text-2xl font-semibold text-white font-space mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-300 font-inter mb-6 max-w-md mx-auto">
            Post a request and let the community know what you need. Someone nearby might have it!
          </p>
          <motion.button
            className="btn-primary px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/post-request')}
          >
            Post a Request
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default CategoriesSection
