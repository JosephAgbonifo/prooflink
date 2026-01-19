import crypto from "crypto";

/**
 * Generates a raw API key to be shown to the user.
 * This should be shown ONCE and never stored in plain text.
 */
export const generateRawKey = (length = 32) => {
  // We use 'base64url' as it's cleaner for headers than standard hex
  return crypto.randomBytes(length).toString("base64url");
};

/**
 * Hashes a raw key for secure storage in the database.
 * This is a one-way process.
 */
export const hashKey = (rawKey) => {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};

export const generateApiKey = () => {
  const rawKey = generateRawKey();
  const hashedKey = hashKey(rawKey);
  return { rawKey, hashedKey };
};

/**
 * Securely compares a provided key against a stored hash.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export const verifyApiKey = (providedRawKey, storedHashedKey) => {
  const providedHash = hashKey(providedRawKey);

  // Convert to buffers for timingSafeEqual
  const buf1 = Buffer.from(providedHash, "hex");
  const buf2 = Buffer.from(storedHashedKey, "hex");

  // timingSafeEqual ensures the comparison takes the same amount of time
  // even if the first character is wrong, preventing hackers from "guessing"
  return crypto.timingSafeEqual(buf1, buf2);
};
