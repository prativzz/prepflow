import dns from 'dns';

/**
 * Validates if an email domain has valid MX records.
 * Returns true if the domain can receive emails, false otherwise.
 * 
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
export const isRealEmail = async (email) => {
  if (!email || !email.includes('@')) return false;

  const domain = email.split('@')[1];

  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    // If the domain doesn't exist or doesn't have MX records, it will throw an error
    return false;
  }
};
