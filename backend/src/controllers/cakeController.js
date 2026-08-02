const supabase = require('../config/supabase');

// Get all available cakes (shaped to match frontend's expected format)
const getAllCakes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cakes')
      .select(`
        id,
        name,
        description,
        image_urls,
        is_available,
        categories (name),
        cake_sizes (weight_label, price)
      `);
      // Note: no .eq('is_available', true) filter anymore — we show all cakes now

    if (error) throw error;

    const shaped = data.map((cake) => {
      const pastry = cake.cake_sizes.find((s) => s.weight_label === 'Pastry');
      const halfKg = cake.cake_sizes.find((s) => s.weight_label === '0.5kg');
      const oneKg = cake.cake_sizes.find((s) => s.weight_label === '1kg');

      return {
        id: cake.id,
        name: cake.name,
        category: cake.categories?.name || 'Uncategorized',
        image: cake.image_urls?.[0] || '',
        description: cake.description,
        pricePastry: pastry?.price || 0,
        priceHalfKg: halfKg?.price || 0,
        priceOneKg: oneKg?.price || 0,
        isOutOfStock: !cake.is_available,
      };
    });

    res.json({ success: true, data: shaped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single cake by ID
const getCakeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cakes')
      .select(`
        *,
        categories (name, slug),
        cake_sizes (*),
        cake_flavors (*),
        customization_options (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllCakes, getCakeById };