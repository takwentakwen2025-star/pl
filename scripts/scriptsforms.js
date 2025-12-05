async function postJSON(url, data) {
  try {
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) { return { error: 'network error' }; }
}

async function submitForm(e, url, payloadBuilder) {
  e.preventDefault();
  const payload = payloadBuilder();
  const res = await postJSON(url, payload);
  if (res.error) showToast(res.error); else showToast(res.message || 'تم الإرسال بنجاح');
  if (!res.error) e.target.reset();
}
