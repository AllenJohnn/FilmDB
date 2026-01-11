# Quick Setup Guide 🚀

Follow these steps to get your Movie Discovery Website up and running in minutes!

## Step 1: Get Your TMDB API Key

1. Visit [TMDB](https://www.themoviedb.org/)
2. Sign up for a free account
3. Go to **Settings** → **API**
4. Click **Request an API Key**
5. Choose **Developer** and fill out the form
6. Copy your **API Key (v3 auth)**

## Step 2: Configure Your Environment

1. Open the `.env` file in the project root
2. Replace `your_api_key_here` with your actual API key:

```env
VITE_TMDB_API_KEY=abc123yourapikey456
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**⚠️ Important**: Don't share your API key publicly!

## Step 3: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React & React DOM
- React Router DOM
- Axios
- Vite and dev tools

## Step 4: Start the Application

```bash
npm run dev
```

You should see output like:
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 5: Open in Browser

Click the local URL (usually `http://localhost:5173`) or open it in your browser.

You should see:
- ✅ Navbar with MovieDiscover logo
- ✅ Grid of popular movies
- ✅ Search bar and filters

## Troubleshooting

### "Failed to fetch movies" Error
- Double-check your API key in the `.env` file
- Make sure there are no extra spaces
- Restart the dev server after changing `.env`

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Movies Not Showing
- Check browser console (F12) for errors
- Verify internet connection
- Try visiting TMDB.org to ensure it's accessible

## Next Steps

- 🔍 **Search**: Try searching for your favorite movies
- 🎛️ **Filter**: Click the Filters button and try different combinations
- 🎬 **Explore**: Click on any movie card to see detailed information

## Need Help?

Check the main [README.md](README.md) for:
- Full documentation
- Component details
- API configuration
- Build instructions

---

**You're all set! Enjoy discovering movies! 🎬🍿**
