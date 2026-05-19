// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key] = val.join('=').trim();
  return acc;
}, {});
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

async function checkSchema() {
  const res = await fetch(`${url}/rest/v1/projects?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  console.log('Sample Data:', data);
  
  // Try to use pgrest to get headers that describe columns
  const optionsRes = await fetch(`${url}/rest/v1/projects`, {
    method: 'OPTIONS',
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const headers = optionsRes.headers;
  // eslint-disable-next-line no-console
  console.log('OPTIONS status:', optionsRes.status, 'Headers:', headers.get('content-type'));
}
checkSchema().catch(console.error);
