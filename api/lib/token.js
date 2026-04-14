const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function generateToken(user_id) {
  const SEVEN_DAYS_IN_SECS = 60;
  const issuedAtTime = Math.floor(Date.now() / 1000);
  const expiryTime = issuedAtTime + SEVEN_DAYS_IN_SECS;

  const claims = {
    sub: user_id,
    iat: issuedAtTime,
    exp: expiryTime,
  };

  return JWT.sign(claims, secret);
}

function decodeToken(token) {
  return JWT.decode(token, secret);
}

module.exports = { generateToken, decodeToken };
