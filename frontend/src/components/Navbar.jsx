import React, { useState, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { useCart } from '../context/CartContext'; // Cart Context import

const Navbar = ({ onOpenCart, onOpenAuth }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Tera context se direct exact variables destructure kar rahe hain!
  const { cartCount, cartItems } = useCart();

  // Load user state & sync across app
  const checkUserAuth = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse user from storage');
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserAuth();

    const handleAuthChange = () => checkUserAuth();
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleOpenModal = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#120805]/90 backdrop-blur-md border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section with CB Signature Image */}
           {/* Logo Section with CB Signature Image */}
<div className="flex items-center gap-3 cursor-pointer"> 
  <img
  src="/logo.png"
  alt="CakeBakers Logo"
  className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
  />
  <span className="text-xl font-black font-serif text-amber-100 tracking-tight">
    Cake<span className="text-amber-400">Bakers</span>
  </span>
</div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Cart Button with EXERT EXACT cartCount Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-xl bg-[#22120C] border border-amber-900/40 text-amber-200 hover:text-amber-100 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                
                {/* Number tabhi dikhega jab cartCount > 0 ho */}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#120805] animate-bounce shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Login / Profile Section */}
              {isLoggedIn && user ? (
                <div className="flex items-center gap-2.5 bg-[#22120C] px-3 py-1.5 rounded-2xl border border-amber-900/50">
                  <div className="w-7 h-7 bg-amber-500 text-stone-950 rounded-xl flex items-center justify-center font-black text-xs uppercase shadow">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-bold text-amber-100 max-w-[110px] truncate">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1 text-amber-400/60 hover:text-red-400 transition ml-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login / Signup</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        setUser={(u) => {
          setUser(u);
          setIsLoggedIn(true);
          window.dispatchEvent(new Event('auth-change'));
        }}
        setIsLoggedIn={setIsLoggedIn}
      />
    </>
  );
};

export default Navbar;