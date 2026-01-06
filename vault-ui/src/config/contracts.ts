// Deployed contract addresses on Base Mainnet
export const CONTRACTS = {
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  LOCK_OPTIONS: "0xF5001102F458595129695a6536Db7c69065209CF",   // V2
  VAULT_TREASURY: "0x23f9E461d6Be928d5F2B7d25229396E854310aF3", // V3
  TIMELOCK_VAULT: "0x84D6355Bde20f93ac259EF2E852D1d55132231B9", // V3
  VAULT_ROUTER: "0xe6573bafd46701Fe98D7E62961D90200A56312eB",   // V2 (compatible)
} as const;

// Base Mainnet chain config
export const BASE_MAINNET = {
  chainId: 8453,
  chainIdHex: "0x2105",
  name: "Base",
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

// Lock duration options (in seconds)
export const LOCK_DURATIONS = [
  { label: "3 Days", value: 259200 },
  { label: "7 Days", value: 604800 },
  { label: "14 Days", value: 1209600 },
  { label: "30 Days", value: 2592000 },
];

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Minimum deposit: 0.1 USDC = 100000 (6 decimals)
export const MIN_DEPOSIT = 0.1;
