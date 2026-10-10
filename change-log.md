# Quick Testing Guide for Safari/iOS PiP Fix

## 🧪 Step-by-Step Testing

### 1️⃣ Test on Chrome/Edge (Desktop) - Should Still Work

```
✅ Open app in Chrome/Edge
✅ Start eye tracking
✅ Click PiP button
✅ Verify: Custom PiP window opens with video
✅ Verify: Can see tracking overlay (if enabled)
✅ Minimize browser
✅ Verify: Auto-PiP activates (if enabled)
✅ Close PiP window
✅ Verify: Returns to normal mode
```

### 2️⃣ Test on Safari (macOS)

```
✅ Open app in Safari
✅ Start eye tracking
✅ Open browser console (Cmd+Option+C)
✅ Look for: "🍎 Safari/iOS detected - using native video PiP only"
✅ Click PiP button
✅ Verify: Native Safari PiP window opens (looks like standard video PiP)
✅ Verify: Video continues playing
✅ Note: NO custom overlay (this is expected on Safari)
✅ Close PiP by clicking X button
✅ Verify: Returns to normal mode
```

### 3️⃣ Test on iOS (iPhone/iPad)

```
✅ Open app in Safari on iOS device
✅ Start eye tracking
✅ Tap PiP button
✅ Verify: Native iOS PiP window appears
✅ Verify: Video plays smoothly
✅ Press home button
✅ Verify: PiP continues over home screen
✅ Tap PiP window to restore app
✅ Verify: App resumes normally
```

## 🐛 What to Check in Console

### Expected Console Messages

#### On Chrome/Edge:

```
PiP Support: {
  supported: true,
  documentPiP: true,
  safari: false,
  iOS: false
}
🎬 Initializing Document PiP...
✅ PiP Window created
```

#### On Safari (macOS):

```
🍎 Safari/iOS detected - using native video PiP only
PiP Support: {
  supported: true,
  documentPiP: false,
  safari: true,
  iOS: false
}
🍎 Using Safari/iOS native PiP
✅ Safari/iOS PiP activated
```

#### On iOS:

```
🍎 Safari/iOS detected - using native video PiP only
PiP Support: {
  supported: true,
  documentPiP: false,
  safari: true,
  iOS: true
}
⚠️ Auto-PiP disabled on iOS (requires user gesture)
🍎 Using Safari/iOS native PiP
✅ Safari/iOS PiP activated
```

## 🚫 Common Errors & What They Mean

### "NotAllowedError"

```
Cause: User gesture required (especially on iOS)
Fix: Make sure PiP is triggered by button click, not automatically
```

### "NotSupportedError"

```
Cause: Browser doesn't support PiP API
Fix: Check browser version, ensure not in private/incognito mode
```

### "InvalidStateError"

```
Cause: Video not ready or no media stream
Fix: Wait for video to load, check camera permissions
```

## 📱 iOS-Specific Gotchas

1. **First Tap Might Not Work**
    - iOS sometimes requires video to be "touched" first
    - Solution: Ensure video is playing before requesting PiP

2. **Auto-PiP Won't Work**
    - iOS blocks non-user-initiated PiP
    - This is expected behavior, not a bug

3. **Low Power Mode**
    - PiP might be restricted in low power mode
    - Ask user to disable low power mode if issues occur

4. **Safari Settings**
    - PiP can be disabled in Safari settings
    - Settings > Safari > Camera & Microphone Access

## ✅ Success Criteria

### Minimum Requirements (All Platforms):

- ✅ PiP button visible and clickable
- ✅ Clicking button opens PiP (native or custom)
- ✅ Video continues playing in PiP
- ✅ Can close PiP and return to app
- ✅ No console errors during PiP lifecycle

### Platform-Specific:

- **Chrome/Edge**: Custom PiP window with controls
- **Safari macOS**: Native video PiP
- **iOS**: Native video PiP with home screen overlay

## 🔍 Debug Mode

Add this to your code for detailed debugging:

```typescript
// In enterPiPMode function
console.log('🔍 Debug Info:', {
	browser: navigator.userAgent,
	isSafari: isSafariRef.current,
	isIOS: isIOSRef.current,
	pipSupported: isPiPSupportedRef.current,
	documentPiP: isDocumentPiPRef.current,
	videoReady: videoRef.current?.readyState,
	hasMediaStream: !!mediaStreamRef.current,
	documentPiPEnabled: document.pictureInPictureEnabled,
});
```

## 🎯 Quick Fix Verification

After deploying the fix, test this sequence on each platform:

```bash
1. Open app
2. Start tracking
3. Click PiP button
4. Check: Did PiP open? ✅/❌
5. Check: Is video playing? ✅/❌
6. Check: Any console errors? ✅/❌
```

If all three are ✅, the fix is working!

## 📞 Still Having Issues?

### Safari Not Working?

1. Check Safari version (needs 13.1+)
2. Verify not in Private Browsing mode
3. Check video element has `playsInline` attribute
4. Ensure video is actually playing before PiP

### iOS Not Working?

1. Test on physical device (simulator is unreliable)
2. Verify iOS version (needs 13.4+)
3. Check Safari settings for PiP permission
4. Ensure camera permissions granted
5. Try restarting the app

### Video Not Showing in PiP?

1. Check media stream is active
2. Verify video tracks are enabled
3. Look for "srcObject" assignment in console
4. Check video dimensions are valid (> 0)

## 🎨 Visual Differences

### Chrome/Edge PiP:

- Custom window with your styles
- Canvas overlay visible
- Custom controls
- Matches your app design

### Safari/iOS PiP:

- Standard system PiP window
- Simple video player
- System controls only
- Clean, minimal design

Both are correct! Safari just uses native implementation.
