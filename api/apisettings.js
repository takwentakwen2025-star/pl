const { supabase } = require('./_supabase');
const { sanitize, requireRole } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('site_settings').select('*').eq('id', 1).single();
    if (error) return res.status(500).json({ error: 'DB error' });
    return res.status(200).json(data || {});
  }

  if (req.method === 'POST') {
    const user = await requireRole(req, ['admin']);
    if (!user) return res.status(403).json({ error: 'غير مصرح' });

    const body = req.body || {};
    const payload = {
      brand_name: sanitize(body.brand_name, 80),
      primary_color: sanitize(body.primary_color, 20),
      secondary_color: sanitize(body.secondary_color, 20),
      accent_color: sanitize(body.accent_color, 20),
      footer_message: sanitize(body.footer_message, 300),
      team_message: sanitize(body.team_message, 600),
      team_values: body.team_values || [],
      contact_phone: sanitize(body.contact_phone, 40),
      contact_email: sanitize(body.contact_email, 180),
      social_links: body.social_links || {},
      default_lang: sanitize(body.default_lang || 'ar', 5),
      maintenance_mode: !!body.maintenance_mode
    };

    const { error } = await supabase
      .from('site_settings').update(payload).eq('id', 1);

    if (error) return res.status(500).json({ error: 'update failed' });
    return res.status(200).json({ message: 'تم تحديث إعدادات الموقع بنجاح' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
