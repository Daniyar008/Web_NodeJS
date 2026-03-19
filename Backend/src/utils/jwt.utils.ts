import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key';

const ACCESS_EXPIRES_IN = '15m'; // 15 минут
const REFRESH_EXPIRES_IN = '7d';  // 7 дней

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
