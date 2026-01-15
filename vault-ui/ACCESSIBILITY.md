# Accessibility Guide

## Overview

This guide covers accessibility best practices for the Timelock Vault application to ensure it's usable by everyone.

## WCAG Compliance

Target: **WCAG 2.1 Level AA compliance**

## Key Principles

### 1. Perceivable

#### Color Contrast
- Text contrast ratio: **minimum 4.5:1**
- Large text: **minimum 3:1**
- Use tools like WebAIM Contrast Checker

#### Alternative Text
```tsx
// ✅ Good
<img src="logo.png" alt="Timelock Vault Logo" />

// ❌ Bad
<img src="logo.png" />
```

#### Text Sizing
```css
/* Use relative units */
font-size: 1rem; /* 16px base */
font-size: 1.125rem; /* 18px */

/* Allow text zoom up to 200% */
```

### 2. Operable

#### Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
<button onClick={handleClick} onKeyPress={handleKeyPress}>
  Deposit
</button>

// Use tabIndex appropriately
<div tabIndex={0} role="button" onClick={handleClick}>
  Custom Button
</div>
```

#### Focus Indicators
```css
/* Visible focus styles */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Don't remove focus entirely */
*:focus {
  /* Never use: outline: none; without alternative */
}
```

#### Skip Links
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### 3. Understandable

#### Labels and Instructions
```tsx
// ✅ Good - Clear labels
<label htmlFor="amount">
  Deposit Amount (USDC)
  <Input id="amount" type="number" />
</label>

// ✅ Good - Helper text
<Input
  label="Lock Duration"
  helpText="Choose how long to lock your funds"
/>

// ❌ Bad - No label
<Input type="number" placeholder="Amount" />
```

#### Error Messages
```tsx
<Input
  label="Amount"
  error="Please enter a valid amount between 1 and 10000 USDC"
  aria-invalid={hasError}
  aria-describedby="amount-error"
/>
{hasError && (
  <span id="amount-error" role="alert">
    Please enter a valid amount between 1 and 10000 USDC
  </span>
)}
```

#### Language
```html
<html lang="en">
  <!-- Content -->
</html>
```

### 4. Robust

#### Semantic HTML
```tsx
// ✅ Good - Semantic elements
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Your Deposits</h1>
    <!-- Content -->
  </article>
</main>

// ❌ Bad - Div soup
<div>
  <div>
    <div onClick={navigate}>Dashboard</div>
  </div>
</div>
```

#### ARIA Attributes
```tsx
// Buttons
<button aria-label="Close dialog" onClick={onClose}>
  ×
</button>

// Loading states
<div role="status" aria-live="polite" aria-busy={loading}>
  {loading ? 'Loading...' : content}
</div>

// Modals
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Deposit</h2>
  <!-- Content -->
</div>

// Tabs
<div role="tablist">
  <button role="tab" aria-selected={isSelected} aria-controls="panel-1">
    Tab 1
  </button>
</div>
<div role="tabpanel" id="panel-1">
  Content
</div>
```

## Component Checklist

### Buttons
- [ ] Keyboard accessible
- [ ] Has accessible name
- [ ] Focus visible
- [ ] Disabled state clear

### Forms
- [ ] All inputs have labels
- [ ] Error messages descriptive
- [ ] Required fields marked
- [ ] Form validation clear
- [ ] Success feedback provided

### Images
- [ ] Alt text provided
- [ ] Decorative images have empty alt
- [ ] Complex images have long description

### Links
- [ ] Descriptive link text
- [ ] External links indicated
- [ ] New window opening announced

### Modals
- [ ] Focus trapped
- [ ] Escape key closes
- [ ] Focus returns on close
- [ ] Has accessible name

### Navigation
- [ ] Keyboard accessible
- [ ] Current page indicated
- [ ] Skip links present
- [ ] Breadcrumbs when needed

## Testing

### Automated Testing
```bash
# Use axe-core
npm install -D @axe-core/react

# Or use Lighthouse
lighthouse https://yoursite.com --only-categories=accessibility
```

### Manual Testing
1. **Keyboard Only:** Navigate entire site with only keyboard
2. **Screen Reader:** Test with NVDA, JAWS, or VoiceOver
3. **Zoom:** Test at 200% zoom
4. **Color Blindness:** Use color blindness simulators
5. **Dark Mode:** Ensure dark mode is accessible

### Screen Reader Testing
```tsx
// Announce dynamic content changes
<div role="status" aria-live="polite">
  {message}
</div>

// Alert urgent messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

## Common Mistakes to Avoid

1. **Missing Alt Text**
   ```tsx
   // ❌ Bad
   <img src="chart.png" />
   
   // ✅ Good
   <img src="chart.png" alt="Deposit growth chart showing 15% increase" />
   ```

2. **Poor Color Contrast**
   ```css
   /* ❌ Bad - Gray text on light background */
   color: #999;
   background: #fff;
   
   /* ✅ Good - Sufficient contrast */
   color: #595959;
   background: #fff;
   ```

3. **Inaccessible Custom Components**
   ```tsx
   // ❌ Bad
   <div onClick={handleClick}>Click me</div>
   
   // ✅ Good
   <button onClick={handleClick}>Click me</button>
   ```

4. **Missing Form Labels**
   ```tsx
   // ❌ Bad
   <input placeholder="Email" />
   
   // ✅ Good
   <label htmlFor="email">Email</label>
   <input id="email" type="email" />
   ```

5. **No Focus Indicators**
   ```css
   /* ❌ Bad */
   *:focus {
     outline: none;
   }
   
   /* ✅ Good */
   *:focus-visible {
     outline: 2px solid blue;
   }
   ```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## Tools

- **axe DevTools:** Browser extension for accessibility testing
- **WAVE:** Web accessibility evaluation tool
- **Lighthouse:** Chrome DevTools audit
- **NVDA:** Free screen reader (Windows)
- **VoiceOver:** Built-in screen reader (Mac)
- **Color Contrast Analyzer:** Desktop app for contrast checking
