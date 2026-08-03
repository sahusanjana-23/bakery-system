import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CakeGrid from './components/CakeGrid';
import CustomizedShowcase from './components/CustomizedShowcase';
import AboutSection from './components/AboutSection';
import CustomerService from './components/CustomerService';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import { CartProvider } from './context/CartContext';
import { Search, ArrowUpDown } from 'lucide-react';
import Testimonials from './components/Testimonials';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'lowToHigh', 'highToLow'

  const [cakesData, setCakesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cakes`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setCakesData(result.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch cakes:', err);
        setLoading(false);
      });
  }, []);

  // Categories matching cakesData.js
  const categories = ['All', 'Chocolate', 'Classics', 'Fruit Cakes', 'Indian Fusion', 'Premium'];

  // Filter & Sort Logic for Search and Price Sorting
  const processedCakes = cakesData
    .filter((cake) => {
      const matchesCategory = selectedCategory === 'All' || cake.category === selectedCategory;
      const matchesSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.priceHalfKg || a.prices?.halfKg || 0;
      const priceB = b.priceHalfKg || b.prices?.halfKg || 0;

      if (sortOrder === 'lowToHigh') return priceA - priceB;
      if (sortOrder === 'highToLow') return priceB - priceA;
      return 0;
    });

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#120805] text-amber-100 font-sans selection:bg-amber-500 selection:text-stone-950">
        
        {/* Navigation Bar */}
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenAuth={() => setIsAuthOpen(true)} 
        />

        {/* Hero & Category Filter Header */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-3">
              ✨ Freshly Baked Everyday
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-serif text-amber-100 tracking-tight mb-3">
              Custom Handcrafted Cakes
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/60 leading-relaxed">
              Order fresh cakes with custom icing names delivered straight to your home.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-2/3">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
              <input
                type="text"
                placeholder="Search cakes (e.g. Nutella, Rasmalai, Black Forest)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#22120C] border border-amber-900/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-500/60 placeholder:text-amber-200/40"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-1/3 flex items-center gap-2 bg-[#22120C] border border-amber-900/40 rounded-2xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-amber-100 focus:outline-none cursor-pointer w-full text-xs font-semibold"
              >
                <option value="default" className="bg-[#22120C]">Sort by Price</option>
                <option value="lowToHigh" className="bg-[#22120C]">Price: Low to High</option>
                <option value="highToLow" className="bg-[#22120C]">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills Filter */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                    : 'bg-[#22120C] text-amber-200/70 border-amber-900/40 hover:border-amber-500/40 hover:text-amber-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Main Specialty Cake Menu */}
        <main>
          {loading ? (
            <div className="text-center py-20 text-amber-200/60">Loading cakes... 🎂</div>
          ) : (
            <CakeGrid selectedCategory="All" cakes={processedCakes} />
          )}
        </main>

        {/* 🎨 Customized Photo & Theme Showcase Section */}
        <CustomizedShowcase />
        <Testimonials />

        {/* About Section */}
        <AboutSection />

        {/* Customer Support & Contact */}
        <CustomerService />

        {/* Side Drawers & Overlays */}
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />

        <AdminDashboardModal 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />

        {/* Footer with Owner Login Link */}
        <footer className="border-t border-amber-900/30 mt-16 py-8 bg-[#0D0503] text-center text-xs text-amber-200/40 flex flex-col items-center justify-center gap-1.5">
          <p>© 2026 CakeBakers. All rights reserved.</p>
          <p className="font-semibold text-amber-400/60">Contact: 7400400725 / 7054508563</p>
          
          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[11px] text-amber-500/40 hover:text-amber-400 transition underline cursor-pointer mt-2"
          >
            🔒 Owner / Admin Login
          </button>
        </footer>

      </div>
    </CartProvider>
  );
}