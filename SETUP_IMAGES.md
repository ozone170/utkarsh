# 🖼️ Adding Logo and Card Background Images

## Required Images

You need to add two images to make the system fully functional:

### 1. **Logo Image** (`logo.jpg`)
- **Location:** `frontend/public/logo.jpg`
- **Purpose:** Displayed in navbar and on ID cards
- **Recommended Size:** 200x200px or similar square/rectangular logo
- **Format:** JPG, PNG, or SVG
- **Usage:**
  - Navbar (top of all pages)
  - Top-left corner of ID cards

### 2. **Card Background** (`card.jpg`)
- **Location:** `frontend/public/card.jpg`
- **Purpose:** Background image for student ID cards
- **Recommended Size:** 800x500px (landscape orientation)
- **Format:** JPG or PNG
- **Usage:**
  - Background of generated ID cards
  - Visible in downloaded PNG files

---

## 📁 File Structure

```
frontend/
└── public/
    ├── logo.jpg     ← Add your logo here
    └── card.jpg     ← Add your card background here
```

---

## 🚀 How to Add Images

### Option 1: Manual Copy
1. Prepare your images (logo.jpg and card.jpg)
2. Copy them to `frontend/public/` folder
3. Restart the frontend dev server if running

### Option 2: Using Command Line
```bash
# From project root
cd frontend/public

# Copy your images here
# Windows:
copy "C:\path\to\your\logo.jpg" logo.jpg
copy "C:\path\to\your\card.jpg" card.jpg

# Mac/Linux:
cp /path/to/your/logo.jpg logo.jpg
cp /path/to/your/card.jpg card.jpg
```

---

## ✅ Verification

After adding the images:

1. **Check Navbar:**
   - Visit http://localhost:5173
   - Logo should appear in the top-left corner

2. **Check ID Card:**
   - Register a test student
   - ID card should show:
     - Logo in top-left corner
     - Card background image
     - All text should be readable over the background

3. **Check Downloaded Card:**
   - Download the ID card as PNG
   - Open the downloaded file
   - Verify logo and background are included

---

## 🎨 Image Recommendations

### Logo (`logo.jpg`)
- **Style:** Clean, professional logo
- **Background:** Transparent PNG preferred (or solid color)
- **Colors:** Should work well on dark navbar background
- **Text:** Avoid small text in logo (may not be readable when scaled)

### Card Background (`card.jpg`)
- **Style:** Professional, not too busy
- **Colors:** Gradient or solid colors work best
- **Contrast:** Ensure white text will be readable
- **Branding:** Can include subtle patterns or institutional branding

---

## 🔧 Troubleshooting

### Logo Not Showing
- Check file name is exactly `logo.jpg` (case-sensitive on some systems)
- Check file is in `frontend/public/` folder
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

### Card Background Not Showing
- Check file name is exactly `card.jpg`
- Check file is in `frontend/public/` folder
- Try registering a new student to see updated card
- Check if image file size is reasonable (< 2MB recommended)

### Images Not in Downloaded Card
- The system uses html2canvas to capture the card
- Ensure images are loaded before downloading
- Wait a moment after registration before downloading
- Check browser console for CORS or loading errors

---

## 📝 Notes

- Images are served from the `public` folder and accessible at `/logo.jpg` and `/card.jpg`
- The system has fallbacks if images are missing (text-only display)
- For production, optimize images for web (compress, resize appropriately)
- Consider using WebP format for better compression (rename to .jpg extension)

---

## 🎯 Current Status

- ✅ Navbar component created with logo support
- ✅ ID card updated with logo and background image support
- ✅ Fallback handling if images are missing
- ⏳ **Action Required:** Add `logo.jpg` and `card.jpg` to `frontend/public/`
