const supabase = require('../config/supabase');

// Get ALL cakes (including unavailable ones) — for admin view
const getAllCakesAdmin = async (req, res) => {
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
      `)
      .order('name', { ascending: true });

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

// Update price for all 3 sizes at once
const updateCakePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePastry, priceHalfKg, priceOneKg } = req.body;

    if ([pricePastry, priceHalfKg, priceOneKg].some((p) => p === undefined || isNaN(p))) {
      return res.status(400).json({ success: false, message: 'All 3 prices required' });
    }

    // Update base_price (reference) on the cake itself
    const { error: cakeError } = await supabase
      .from('cakes')
      .update({ base_price: priceHalfKg })
      .eq('id', id);

    if (cakeError) throw cakeError;

    // Update each size row
    const updates = [
      { label: 'Pastry', price: pricePastry },
      { label: '0.5kg', price: priceHalfKg },
      { label: '1kg', price: priceOneKg },
    ];

    for (const u of updates) {
      const { error: sizeError } = await supabase
        .from('cake_sizes')
        .update({ price: u.price })
        .eq('cake_id', id)
        .eq('weight_label', u.label);

      if (sizeError) throw sizeError;
    }

    res.json({ success: true, message: 'Prices updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle stock availability
const toggleCakeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const { error } = await supabase
      .from('cakes')
      .update({ is_available: isAvailable })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Stock status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllCakesAdmin, updateCakePrice, toggleCakeStock };