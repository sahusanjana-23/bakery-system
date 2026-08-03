import { Star, Quote, ExternalLink } from 'lucide-react';

// 📍 CLIENT KE GOOGLE MAPS SE ACTUAL REVIEWS YAHAN PASTE KARO:
const reviews = [
  {
    name: 'Jamespaul Joseph',
    rating: 5,
    text: "The cake is well made and it's very delicious and the employees are very kind and humble. Best cake ever!",
    time: '2 weeks ago',
  },
  {
    name: 'Saiarti (Cable & Internet)',
    rating: 5,
    text: 'Good taste and friendly staff.',
    time: 'a month ago',
  },
  {
    name: 'Ankita Pal',
    rating: 5,
    text: 'Best quality of cake.',
    time: '3 months ago',
  },
  // Aur reviews add karne ho toh same format me niche paste karte jao
];

export default function Testimonials() {
  // 🔗 CLIENT KE GOOGLE MAPS PROFILE / REVIEWS KA EXACT LINK YAHAN DAALO
  const googleMapsUrl = "https://maps.google.com"; // <-- Client ka GMap link paste karo

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-3">
          ⭐ 5.0 Rating — Google Reviews
        </span>
        <h2 className="text-3xl font-black font-serif text-amber-100 mb-2">
          What Our Customers Say
        </h2>
        <p className="text-xs text-amber-200/60">Verified reviews directly from our Google Business Profile</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-[#22120C] border border-amber-900/50 rounded-3xl p-6 flex flex-col justify-between gap-4 hover:border-amber-500/40 transition-all duration-300 shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Quote className="w-6 h-6 text-amber-500/40" />
                <span className="text-[10px] text-amber-400/60 font-medium">{review.time}</span>
              </div>
              
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-sm text-amber-100/80 leading-relaxed italic">
                "{review.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between">
              <p className="text-xs font-bold text-amber-400">— {review.name}</p>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-semibold">
                Google Review
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Button To View All Reviews on Google Maps */}
      <div className="text-center mt-10">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 px-5 py-2.5 rounded-full transition-all duration-200"
        >
          View All Google Reviews <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}