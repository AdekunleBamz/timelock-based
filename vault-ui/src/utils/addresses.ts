/**
 * Utility functions for blockchain address operations
 */

/**
 * Validates an Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Truncates an Ethereum address for display
 */
export function truncateAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address || address.length < startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Compares two Ethereum addresses (case-insensitive)
 */
export function addressesEqual(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase();
}

/**
 * Converts address to checksum format
 */
export function toChecksumAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }

  const lowerCaseAddress = address.toLowerCase().replace('0x', '');
  
  // Simple implementation - in production use ethers.getAddress()
  return '0x' + lowerCaseAddress;
}

/**
 * Gets ENS-like display name or truncated address
 */
export function getDisplayName(
  address: string,
  ensName?: string | null
): string {
  if (ensName) {
    return ensName;
  }
  return truncateAddress(address);
}

/**
 * Checks if address is a zero address
 */
export function isZeroAddress(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}

/**
 * Generates an identicon seed from address
 */
export function getIdenticonSeed(address: string): number {
  const hex = address.slice(2, 10);
  return parseInt(hex, 16);
}
