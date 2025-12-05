const { supabase } = require('./_supabase');
const { sanitize } = require('./_helpers');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { job_id, fullname, email, resume_url } = req.body || {};
    const payload = {
      job_id,
      fullname: sanitize(fullname,120),
      email: sanitize(email,180),
      resume_url: sanitize(resume_url,300),
      status: 'received'
    };
    const { error } = await supabase.from('applications').insert(payload);
    if (error) return res.status(500).json({ error: 'insert failed' });
    return res.status(200).json({ message: 'تم تقديم الطلب بنجاح' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
