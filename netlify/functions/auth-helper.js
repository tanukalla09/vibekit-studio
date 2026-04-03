const jwt = require('jsonwebtoken');
function verifyToken(event) {
  const auth = event.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.slice(7), process.env.JWT_SECRET); }
  catch { return null; }
}
module.exports = { verifyToken };