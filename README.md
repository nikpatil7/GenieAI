# GenieAI Text Summarizer

GenieAI is a web application designed to provide efficient AI-powered text summarization services.

## Features

- AI-powered text summarization
- User authentication
- Responsive design

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Use Cases

- **Content Creation**: Generate summaries for articles and reports.
- **Education**: Summarize academic papers and lecture notes.
- **Research**: Condense large volumes of information.
- **Business**: Summarize meeting notes and business reports.
- **Personal Use**: Summarize news articles and blogs.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nikpatil7/GenieAI.git
   ```

2. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory with the following:

   ```plaintext
   PORT=8080
   DEV_MODE=development
   MONGO_URI=your_mongodb_uri
   JWT_ACCESS_SECRET=your_jwt_secret
   JWT_ACCESS_EXPIREIN=15min
   JWT_REFRESH_TOKEN=your_refresh_token_secret
   JWT_REFRESH_EXPIREIN=7d
   ```

4. **Start the Application**:
   ```bash
   # Start backend
   npm start

   # Start frontend (in another terminal)
   cd client
   npm run dev
   ```

5. **Access the Application**: Open your browser and go to `http://localhost:5173`

