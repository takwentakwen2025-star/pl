const { supabase } = require('./_supabase');
const { sanitize } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) return res.status(500).json({ error: 'DB error' });
    return res.status(200).json({ companies: data });
  }

  if (req.method === 'POST') {
    const { name, email, phone, sector, location, about, logo_url } = req.body || {};
    const payload = {
      name: sanitize(name,140),
      email: sanitize(email,180),
      phone: sanitize(phone,40),
      sector: sanitize(sector,80),
      location: sanitize(location,120),
      about: sanitize(about,1000),
      logo_url: sanitize(logo_url,300),
      status: 'pending'
    };
    const { error } = await supabase.from('companies').insert(payload);
    if (error) return res.status(500).json({ error: 'insert failed' });
    return res.status(200).json({ message: 'تم تسجيل الشركة، بانتظار الموافقة' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
