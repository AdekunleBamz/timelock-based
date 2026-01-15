# Troubleshooting Guide

## Common Issues and Solutions

### Wallet Connection Issues

#### MetaMask Not Detected
**Problem:** Application can't detect MetaMask

**Solutions:**
1. Ensure MetaMask extension is installed
2. Refresh the page
3. Check browser compatibility (Chrome, Firefox, Brave)
4. Disable conflicting extensions

```typescript
// Check if MetaMask is installed
if (!window.ethereum?.isMetaMask) {
  console.error('MetaMask not detected');
}
```

#### Wrong Network
**Problem:** Connected to wrong blockchain network

**Solutions:**
1. Switch network in wallet
2. Use app's network switcher
3. Add Base network if not present

```typescript
// Add Base network
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x2105', // 8453 in hex
    chainName: 'Base',
    rpcUrls: ['https://mainnet.base.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: ['https://basescan.org']
  }]
});
```

#### Connection Rejected
**Problem:** User rejected connection request

**Solutions:**
1. Click "Connect Wallet" again
2. Check MetaMask notifications
3. Unlock MetaMask

### Transaction Failures

#### Insufficient Gas
**Problem:** Transaction fails due to low gas

**Solutions:**
1. Increase gas limit
2. Wait for lower network congestion
3. Check ETH balance for gas fees

```typescript
// Estimate gas before transaction
const gasEstimate = await contract.estimateGas.deposit(amount);
const gasLimit = gasEstimate * 120n / 100n; // 20% buffer
```

#### Transaction Reverted
**Problem:** Smart contract rejected transaction

**Common Causes:**
- Insufficient token balance
- Lock duration invalid
- Amount below minimum
- Contract paused

**Solutions:**
1. Check error message
2. Verify token allowance
3. Confirm minimum requirements
4. Check contract status

```typescript
try {
  await contract.deposit(amount, duration);
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    // Handle insufficient balance
  } else if (error.message.includes('invalid duration')) {
    // Handle invalid duration
  }
}
```

### Build Issues

#### Module Not Found
**Problem:** `Error: Cannot find module`

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### TypeScript Errors
**Problem:** Type checking fails

**Solutions:**
1. Check `tsconfig.json` settings
2. Update type definitions
3. Clear TypeScript cache

```bash
# Reinstall types
npm install -D @types/react @types/react-dom

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### Build Fails
**Problem:** `npm run build` fails

**Solutions:**
```bash
# Check for syntax errors
npm run lint

# Check TypeScript
npm run type-check

# Try clean build
rm -rf dist
npm run build
```

### Development Server Issues

#### Port Already in Use
**Problem:** `Port 3000 is already in use`

**Solutions:**
```bash
# Find process using port
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

#### Hot Module Replacement Not Working
**Problem:** Changes not reflected in browser

**Solutions:**
1. Check file watcher limits (Linux)
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. Disable browser cache
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Smart Contract Issues

#### Contract Not Deployed
**Problem:** Contract address not found

**Solutions:**
1. Verify network (mainnet/testnet)
2. Check contract address in `.env`
3. Confirm deployment on block explorer

#### Read Functions Fail
**Problem:** Can't read contract data

**Solutions:**
```typescript
// Check provider connection
const network = await provider.getNetwork();
console.log('Connected to:', network.name);

// Verify contract address
console.log('Contract address:', contractAddress);

// Test simple call
const balance = await contract.totalSupply();
```

#### Approval Issues
**Problem:** Token approval fails or insufficient

**Solutions:**
```typescript
// Check current allowance
const allowance = await usdcContract.allowance(userAddress, vaultAddress);

// Approve if needed
if (allowance < amount) {
  const tx = await usdcContract.approve(vaultAddress, amount);
  await tx.wait();
}
```

### Performance Issues

#### Slow Loading
**Problem:** Application loads slowly

**Solutions:**
1. Check network tab in DevTools
2. Enable production build
3. Use code splitting
4. Optimize images
5. Enable caching

```typescript
// Lazy load heavy components
const Chart = lazy(() => import('./components/Chart'));
```

#### High Memory Usage
**Problem:** Browser uses too much memory

**Solutions:**
1. Check for memory leaks
2. Clean up event listeners
3. Cancel pending requests

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal })
    .then(handleResponse);
  
  return () => controller.abort();
}, []);
```

### Testing Issues

#### Tests Failing
**Problem:** Tests fail unexpectedly

**Solutions:**
```bash
# Clear test cache
npm test -- --clearCache

# Run specific test
npm test -- Button.test.tsx

# Update snapshots
npm test -- -u
```

#### Timeout Errors
**Problem:** Tests timeout

**Solutions:**
```typescript
// Increase timeout
it('async test', async () => {
  // test code
}, { timeout: 10000 });

// Use waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

### Deployment Issues

#### Build Succeeds Locally But Fails on CI
**Problem:** Different behavior in CI

**Solutions:**
1. Check Node version matches
2. Verify environment variables
3. Check for OS-specific issues
4. Review CI logs

```yaml
# GitHub Actions - use same Node version
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

#### Environment Variables Not Working
**Problem:** Config values undefined

**Solutions:**
1. Prefix with `VITE_` for client-side
2. Restart dev server after changes
3. Check `.env` file location
4. Verify `.env.production` for builds

```bash
# .env
VITE_API_URL=https://api.example.com

# Access in code
const apiUrl = import.meta.env.VITE_API_URL;
```

### Browser-Specific Issues

#### Safari Issues
**Problem:** Features not working in Safari

**Solutions:**
1. Check for WebKit-specific bugs
2. Add polyfills if needed
3. Test with Safari Technology Preview

#### Mobile Issues
**Problem:** Not working on mobile devices

**Solutions:**
1. Test with real devices
2. Check viewport settings
3. Verify touch events
4. Test with MetaMask mobile

## Getting Help

### Debug Information to Collect
When asking for help, provide:
- Error messages (full stack trace)
- Browser and version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior

### Useful Commands
```bash
# System info
node --version
npm --version
git --version

# Project info
npm list
npm outdated

# Clear everything
rm -rf node_modules package-lock.json dist
npm install
```

### Log Levels
```typescript
// Enable verbose logging
localStorage.setItem('debug', '*');

// Application logs
logger.debug('Debug info');
logger.info('Info message');
logger.warn('Warning');
logger.error('Error');
```

## Still Having Issues?

1. Check [GitHub Issues](https://github.com/yourusername/timelock-based/issues)
2. Review documentation
3. Ask in community Discord/Telegram
4. Create new GitHub issue with debug info
