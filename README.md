# 🌟 GenieAI Text Summarizer

Welcome to **GenieAI**, your go-to web application for AI-powered text summarization. Transform lengthy documents into concise summaries with ease and efficiency.



## 🚀 Features

- **AI-Powered Summarization**: Leverage advanced AI algorithms to generate accurate and concise summaries.
- **User Authentication**: Secure your data with robust JWT-based authentication.
- **Responsive Design**: Enjoy a seamless experience across all devices.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Material-UI](https://mui.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [JWT](https://jwt.io/)

## 🎯 Use Cases

- **Content Creation**: Quickly generate summaries for articles, reports, or any lengthy documents to save time and enhance productivity.
- **Education**: Assist students and educators in summarizing academic papers, textbooks, and lecture notes.
- **Research**: Help researchers condense large volumes of information into concise summaries for easier analysis.
- **Business**: Enable professionals to summarize meeting notes, emails, and business reports for efficient communication.
- **Personal Use**: Summarize news articles, blogs, or any online content for personal knowledge and quick understanding.



## 🔧 Setup Instructions

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


