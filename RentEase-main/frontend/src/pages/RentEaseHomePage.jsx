import { motion } from 'framer-motion'
// import NavBar from '../components/NavBar'
import NavBar from '../components/NavBar'
import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import FeaturedRentals from '../components/FeaturedRentals'
import RentEaseFooter from '../components/RentEaseFooter'
import RecentListings from '../components/RecentListings'
import NewsletterSection from '../components/NewsletterSection'

const RentEaseHomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-rentease-dark"
    >
      {/* Navigation */}
      <NavBar />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Categories */}
        <CategoriesSection />
        
        {/* Featured Rentals */}
        <FeaturedRentals />
        
        <RecentListings />

        <NewsletterSection />
      </main>
      
      {/* Footer */}
      <RentEaseFooter />
    </motion.div>
  )
}

export default RentEaseHomePage
