const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // you can tune this
  });
};

// helper to hash refresh token before storing
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateRefreshToken = async (user, ipAddress) => {
  const token = crypto.randomBytes(40).toString('hex'); // plain token
  const tokenHash = hashToken(token);

  const refreshToken = await RefreshToken.create({
    user: user._id,
    token: tokenHash,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdByIp: ipAddress,
  });

  // return plain token to client
  return { token, refreshToken };
};

const getRefreshTokenDoc = async (token) => {
  const tokenHash = hashToken(token);
  const refreshToken = await RefreshToken.findOne({ token: tokenHash }).populate(
    'user'
  );
  return refreshToken;
};

const revokeRefreshToken = async (refreshToken, ipAddress, replacedByToken) => {
  refreshToken.revokedAt = new Date();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = replacedByToken;
  await refreshToken.save();
};

const revokeAllTokensForUser = async (userId) => {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: { $exists: false } },
    {
      $set: {
        revokedAt: new Date(),
        revokedByIp: 'logout-all',
      },
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenDoc,
  revokeRefreshToken,
  revokeAllTokensForUser,
};
