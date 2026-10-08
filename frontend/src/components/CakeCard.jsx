import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

export default function CakeCard({ cake, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState('halfKg');
  const [customText, setCustomText] = useState('');
  const [added, setAdded] = useState(false);

  // Dynamic price resolver with DB fallback & default fallbacks
  const getPrice = () => {
    if (!cake) return 0;

    // 1. Agar size select kiya ho uske multiple DB keys check karo
    if (selectedSize === 'pastry') {
      const price = cake.pricePastry || cake.price_pastry || cake.pastryPrice;
      if (price && Number(price) > 0) return Number(price);
    }

    if (selectedSize === 'halfKg') {
      const price = cake.priceHalfKg || cake.price_half_kg || cake.price_500g || cake.halfKgPrice;
      if (price && Number(price) > 0) return Number(price);
    }

    if (selectedSize === 'oneKg') {
      const price = cake.priceOneKg || cake.price_1kg || cake.price_one_kg || cake.oneKgPrice;
      if (price && Number(price) > 0) return Number(price);
    }

    // 2. Direct cake.price column check
    if (cake.price && Number(cake.price) > 0) return Number(cake.price);

    // 3. Last Fallback (Taaki zero na dikhe client ke samne)
    const defaultPrices = { pastry: 80, halfKg: 350, oneKg: 650 };
    return defaultPrices[selectedSize] || 350;
  };

  const currentPrice = getPrice();

  const handleAdd = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (cake.isOutOfStock) return;

    const cartItemPayload = {
      id: `${cake.id}-${selectedSize}`,
      cakeId: cake.id,
      name: cake.name,
      selectedSize: selectedSize,
      price: currentPrice,
      customText: customText ? customText.trim() : '',
      image: cake.image
    };

    if (typeof onAddToCart === 'function') {
      onAddToCart(cartItemPayload);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`bg-[#22120C] border rounded-3xl p-4 shadow-2xl flex flex-col justify-between transition duration-300 relative group overflow-hidden ${
      cake.isOutOfStock ? 'border-red-900/40 opacity-60' : 'border-amber-900/50 hover:border-amber-500/50'
    }`}>
      
      {/* Visual Cake Container with Image & Name Overlay */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-stone-900 flex items-center justify-center border border-amber-900/30">
        
        <img 
          src={cake.image} 
          alt={cake.name}
          className={`w-full h-full object-cover transition duration-500 ${cake.isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-2 right-2 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold backdrop-blur-md">
          {cake.category || 'Special'}
        </span>

        {/* Out of Stock Badge */}
        {cake.isOutOfStock && (
          <span className="absolute top-2 left-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black uppercase backdrop-blur-md">
            Out of Stock
          </span>
        )}

        <div className="absolute bottom-3 inset-x-2 text-center px-2 py-1.5 bg-black/70 backdrop-blur-md rounded-xl border border-amber-500/40 shadow-lg">
          <span className="text-[9px] text-amber-400 uppercase font-extrabold block tracking-wider">
            Writing on Cake:
          </span>
          <p className="text-xs font-black text-amber-200 font-serif tracking-wide truncate">
            {customText.trim() ? `"${customText}"` : "(Your Name Here)"}
          </p>
        </div>
      </div>

      {/* Cake Details */}
      <div>
        <h3 className="text-lg font-bold font-serif text-amber-100 mb-2 truncate">{cake.name}</h3>

        <div className="grid grid-cols-3 gap-1 my-2 bg-[#120805] p-1 rounded-xl border border-amber-900/40 text-center">
          <button
            type="button"
            onClick={() => setSelectedSize('pastry')}
            disabled={cake.isOutOfStock}
            className={`py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              selectedSize === 'pastry' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            Pastry
          </button>
          <button
            type="button"
            onClick={() => setSelectedSize('halfKg')}
            disabled={cake.isOutOfStock}
            className={`py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              selectedSize === 'halfKg' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            1/2 kg
          </button>
          <button
            type="button"
            onClick={() => setSelectedSize('oneKg')}
            disabled={cake.isOutOfStock}
            className={`py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
              selectedSize === 'oneKg' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            1 kg
          </button>
        </div>

        <div className="my-3">
          <label className="block text-[10px] font-semibold text-amber-200/60 mb-1">
            ✍️ Custom Name on Cake
          </label>
          <input
            type="text"
            placeholder="Type name here..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            disabled={cake.isOutOfStock}
            className="w-full px-3 py-2 bg-[#120805] border border-amber-900/60 rounded-xl text-xs text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="flex items-center justify-between pt-2 border-t border-amber-900/40 mt-1">
        <div>
          <span className="text-[10px] text-amber-200/50 uppercase block font-semibold">Price</span>
          <span className="text-xl font-extrabold text-amber-400">₹{currentPrice}</span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={cake.isOutOfStock}
          className={`font-extrabold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 text-xs transition ${
            cake.isOutOfStock
              ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
              : added 
                ? 'bg-emerald-500 text-stone-950 cursor-pointer' 
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 cursor-pointer'
          }`}
        >
          {cake.isOutOfStock ? (
            'Unavailable'
          ) : added ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>

    </div>
  );
}