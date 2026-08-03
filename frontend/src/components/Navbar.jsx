import React, { useState, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenCart, onOpenAuth }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { cartCount } = useCart();

  const checkUserAuth = () => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
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
       <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <div className="flex items-center cursor-pointer flex-shrink-0">
              <img
                src="/logo.png"
                alt="CakeBakers Logo"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
              />

              <h1 className="text-lg sm:text-2xl md:text-3xl font-black font-serif leading-none whitespace-nowrap -ml-5">
                <span className="text-amber-100">Cake</span>
                <span className="text-amber-400">Bakers</span>
              </h1>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* Cart */}
              <button
                onClick={onOpenCart}
                className="relative p-2 sm:p-2.5 rounded-xl bg-[#22120C] border border-amber-900/40 text-amber-200 hover:text-amber-100 hover:border-amber-500/40 transition"
              >
                <ShoppingBag className="w-5 h-5" />

                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#120805]">
                    {cartCount}
                  </span>
                )}
              </button>

              {isLoggedIn && user ? (
                <div className="flex items-center gap-2 bg-[#22120C] px-2 sm:px-3 py-1.5 rounded-2xl border border-amber-900/50">

                  <div className="w-7 h-7 bg-amber-500 text-stone-950 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>

                  <span className="hidden sm:block text-xs font-bold text-amber-100 max-w-[110px] truncate">
                    {user.name || user.email}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="p-1 text-amber-400 hover:text-red-400 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                </div>
              ) : (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Login / Signup</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>

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