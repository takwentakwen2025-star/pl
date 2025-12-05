const { supabase } = require('./_supabase');
const { sanitize, requireRole } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) return res.status(500).json({ error: 'DB error' });
    return res.status(200).json({ jobs: data });
  }

  if (req.method === 'POST') {
    const user = await requireRole(req, ['admin','company']);
    if (!user) return res.status(403).json({ error: 'not authorized' });

    const { company_id, title, location, contract_type, description } = req.body || {};
    const payload = {
      company_id,
      title: sanitize(title,140),
      location: sanitize(location,120),
      contract_type: sanitize(contract_type,80),
      description: sanitize(description,2000),
      status: 'active'
    };
    const { error } = await supabase.from('jobs').insert(payload);
    if (error) return res.status(500).json({ error: 'insert failed' });
    return res.status(200).json({ message: 'تم نشر الوظيفة بنجاح' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
