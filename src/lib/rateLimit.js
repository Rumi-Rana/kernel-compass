const rateLimitMap = new Map();

export default function rateLimit(limit = 10, windowMs = 60000) {
  return (req) => {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
    const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
    if (timestamps.length >= limit) {
      return { limited: true };
    }
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    return { limited: false };
  };
}