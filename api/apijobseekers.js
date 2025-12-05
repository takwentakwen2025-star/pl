const { supabase } = require('./_supabase');
const { sanitize } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('jobseekers').select('*');
    if (error) return res.status(500).json({ error: 'DB error' });
    return res.status(200).json({ jobseekers: data });
  }

  if (req.method === 'POST') {
    const { fullname, email, phone, field, experience, resume_url } = req.body || {};
    const payload = {
      fullname: sanitize(fullname,120),
      email: sanitize(email,180),
      phone: sanitize(phone,40),
      field: sanitize(field,80),
      experience: experience || 0,
      resume_url: sanitize(resume_url,300),
      status: 'active'
    };
    const { error } = await supabase.from('jobseekers').insert(payload);
    if (error) return res.status(500).json({ error: 'insert failed' });
    return res.status(200).json({ message: 'تم تسجيل الباحث بنجاح' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
