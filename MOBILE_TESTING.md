# Mobile Testing Guide

This guide explains how to test the Smart Tools Hub website on mobile devices.

## Method 1: Browser DevTools (Easiest - No Setup Required)

### Chrome/Edge:
1. Open your website in Chrome/Edge
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Click the **Toggle Device Toolbar** icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
4. Select a device preset (iPhone, iPad, etc.) or set custom dimensions
5. Test the mobile navigation menu

### Firefox:
1. Open your website in Firefox
2. Press `F12` or `Ctrl+Shift+I`
3. Click the **Responsive Design Mode** icon (or press `Ctrl+Shift+M`)
4. Select a device or set custom dimensions

### Safari (Mac only):
1. Enable Developer menu: Safari → Preferences → Advanced → "Show Develop menu"
2. Develop → Enter Responsive Design Mode
3. Select a device preset

**Pros:** Instant, no setup, good for quick testing
**Cons:** Not 100% accurate to real device behavior

---

## Method 2: Test on Real Mobile Device (Most Accurate)

### Step 1: Start Dev Server with Network Access
The Vite config is already set up to allow network access. Just run:
```bash
npm run dev
```

You'll see output like:
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.xxx:5173/
```

### Step 2: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" under your active network interface (e.g., 192.168.1.100)

### Step 3: Connect Your Phone
1. Make sure your phone is on the **same Wi-Fi network** as your computer
2. Open your phone's browser (Chrome, Safari, etc.)
3. Navigate to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

### Step 4: Test Mobile Navigation
- Tap the hamburger menu (☰) in the top right
- Test opening/closing the menu
- Test clicking navigation links
- Test the Tools dropdown
- Test scrolling and touch interactions

**Pros:** Most accurate, real device testing
**Cons:** Requires same Wi-Fi network

---

## Method 3: Using ngrok (Access from Anywhere)

If you want to test from a device not on your network:

### Step 1: Install ngrok
Download from: https://ngrok.com/download

### Step 2: Start Your Dev Server
```bash
npm run dev
```

### Step 3: Create Tunnel
In a new terminal:
```bash
ngrok http 5173
```

### Step 4: Use the ngrok URL
ngrok will give you a URL like: `https://abc123.ngrok.io`
Open this URL on any device (even from different networks)

**Pros:** Works from anywhere, shareable URL
**Cons:** Requires ngrok setup, free tier has limitations

---

## Method 4: Online Testing Tools

### BrowserStack (Free Trial)
1. Go to https://www.browserstack.com
2. Sign up for free trial
3. Enter your deployed URL (or use ngrok URL)
4. Test on real devices in the cloud

### Responsively App
1. Download: https://responsively.app
2. Enter your local URL: `http://localhost:5173`
3. See multiple device views side-by-side

---

## Quick Testing Checklist

When testing mobile navigation, check:

- [ ] Hamburger menu appears on screens < 768px
- [ ] Hamburger menu is hidden on screens ≥ 769px
- [ ] Menu opens when tapping hamburger
- [ ] Menu closes when tapping X button
- [ ] Menu closes when tapping outside
- [ ] Menu closes when pressing Escape key
- [ ] Menu closes when clicking a nav link
- [ ] Tools dropdown works in mobile menu
- [ ] All links are touch-friendly (48px+ height)
- [ ] Menu doesn't overlap content
- [ ] Body scroll is locked when menu is open
- [ ] Smooth animations work
- [ ] Works in portrait and landscape orientation

---

## Troubleshooting

### Can't access from phone:
- Check firewall settings (allow port 5173)
- Ensure phone and computer are on same Wi-Fi
- Try disabling VPN if active
- Check Windows Firewall: Allow Node.js through firewall

### Menu not working:
- Clear browser cache
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try different browser

### Network URL not showing:
- Check `vite.config.ts` has `host: true`
- Restart dev server after config changes
- Check if port 5173 is available

---

## Recommended Testing Devices

Test on these screen sizes:
- iPhone SE (375px) - Smallest modern phone
- iPhone 12/13/14 (390px) - Common size
- iPhone 14 Pro Max (430px) - Large phone
- iPad (768px) - Tablet/breakpoint
- Desktop (1024px+) - Desktop view

