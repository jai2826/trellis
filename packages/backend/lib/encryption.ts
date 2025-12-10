// //use node;

// import {
//   createCipheriv,
//   createDecipheriv,
//   randomBytes,
//   scryptSync,
// } from "crypto";

// // --- Configuration ---
// const ALGORITHM = "aes-256-cbc";
// const KEY_LENGTH = 32; // 256 bits
// const IV_LENGTH = 16; // 128 bits

// /**
//  * Derives a secure, 32-byte key from a human-readable password string.
//  * This is crucial for security.
//  * @param {string} password - The secret password/key string.
//  * @returns {Buffer} The derived 32-byte key.
//  */
// function deriveKey(password: string) {
//   // Use a hardcoded salt in a real app (load from environment variable),
//   // or a unique salt per user (stored with their encrypted data).
//   // For this example, we use a simple static buffer.
//   const salt = Buffer.from(
//     "a_static_salt_for_example",
//     "utf8"
//   );
//   return scryptSync(password, salt, KEY_LENGTH);
// }

// /**
//  * Encrypts a string.
//  * @param {string} text - The string to encrypt.
//  * @param {string} secretKey - The secret key/password string.
//  * @returns {{iv: string, content: string}} The IV and encrypted data as hex strings.
//  */
// export function encrypt(text: string, secretKey: string) {
//   const key = deriveKey(secretKey);
//   const iv = randomBytes(IV_LENGTH);
//   const cipher = createCipheriv(ALGORITHM, key, iv);

//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");

//   return {
//     iv: iv.toString("hex"),
//     content: encrypted,
//   };
// }

// /**
//  * Decrypts data.
//  * @param {{iv: string, content: string}} hash - The encrypted hash object.
//  * @param {string} secretKey - The secret key/password string used for encryption.
//  * @returns {string} The decrypted string.
//  */
// export function decrypt(
//   hash: { iv: string; content: string },
//   secretKey: string
// ) {
//   const key = deriveKey(secretKey);
//   const iv = Buffer.from(hash.iv, "hex");

//   const decipher = createDecipheriv(ALGORITHM, key, iv);

//   let decrypted = decipher.update(
//     hash.content,
//     "hex",
//     "utf8"
//   );
//   decrypted += decipher.final("utf8");

//   return decrypted;
// }


