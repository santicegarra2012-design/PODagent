const res = await fetch('https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest');
const html = await res.text();
const re = /<[^>]*?(?:generateContent|prompt|instances|message)[^>]*?>/gi;
let m;
while ((m = re.exec(html)) !== null) {
  const start = Math.max(0, m.index - 200);
  const end = Math.min(html.length, m.index + 200);
  console.log(html.slice(start, end).replace(/\n/g, ' '));
  console.log('---');
}