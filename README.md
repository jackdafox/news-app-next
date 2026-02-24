# News App

A Next.js application that fetches, syncs, and displays full news articles. Built with React Server Components, Drizzle ORM, SQLite, and Shadcn UI.

## Features

- Dynamic news feed
- Light and Dark modes
- Admin dashboard to manually synchronize data
- Categorized articles (Business, Entertainment, General, Health, Science, Sports, Technology)
- Database persistence via SQLite

---

## 🐳 How to Run Locally using Docker (For New Users)

The easiest way to run this application on your machine without installing Node.js, npm, or worrying about dependencies is by using Docker.

### Prerequisites
1. **Docker Desktop**: Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop). Make sure it is running.
2. **NewsAPI Key**: Register for a free API key at [NewsAPI.org](https://newsapi.org/).

### Step-by-Step Guide

**Step 1. Configure your API Key**
Create a new file named `.env.local` in the root folder of this project (next to this README). Inside that file, add your NewsAPI key:
```env
NEWS_API_KEY=your_actual_key_here
```

**Step 2. Build the Docker Image**
Open your terminal (Command Prompt, PowerShell, or Terminal) in the root of the project directory and run the following command to build the Docker image. This will download everything the app needs and prepare it:
```bash
docker build -t news-app-image .
```

*Note: This step might take a few minutes the first time as it downloads the necessary base images.*

**Step 3. Run the Docker Container**
Once the image is built, start the application by running:
```bash
docker run -d -p 3000:3000 --env-file .env.local -v news_app_db_volume:/app/data --name my-news-app news-app-image
```

Here's what this command does:
- `-d`: Runs the container in the background (detached mode).
- `-p 3000:3000`: Forwards port 3000 on your machine to port 3000 inside the container.
- `--env-file .env.local`: Passes your API key into the container.
- `-v news_app_db_volume:/app/data`: Creates a persistent volume so if you restart the container, your saved news articles won't be deleted.
- `--name my-news-app`: Names your running container so it's easy to identify.

**Step 4. Open the App in your Browser**
Open your web browser and go to:
[http://localhost:3000](http://localhost:3000)

**Step 5. Sync the Latest News**
To initially populate the website with news (or fetch the latest news):
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click the **"Sync Latest News"** button.
3. Once completed, return to the homepage to read the articles!

---

### Useful Docker Commands

**Stop the application:**
```bash
docker stop my-news-app
```

**Start the application again:**
```bash
docker start my-news-app
```

**Remove the container:**
```bash
docker rm -f my-news-app
```

---

## 🛠️ How to Run Locally with Node.js (For Developers)

If you prefer to run the application directly on your machine for development without Docker:

1. Create the `.env.local` file with your `NEWS_API_KEY` as shown above.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the site at `http://localhost:3000`.
