# AI Contact Center 💬🤖
An AI-powered contact center web application designed to improve customer service by using Natural Language Processing (NLP) and real-time communication. The system supports multilingual text-based conversations, automatic responses, and live chat with human agents.

📌 Features
✅ User Signup & Login Authentication

🌐 Multilingual Chat (English & Telugu)

🤖 AI Chatbot powered by NLP and Gemini

📡 Real-time user-admin chat using Socket.IO

💡 Smart response based on user queries

📂 View chat history

🚩 Escalate issue to human agent

🛠 Admin dashboard to view and respond to users

🔐 Forgot Password functionality

🛠 Tech Stack
Frontend:

React.js

CSS

Backend:

Node.js

Express.js

Socket.IO (for real-time chat)

Database:

MongoDB (Mongoose ORM)

AI Components:

NLP.js

Gemini API (fallback for unknown queries)

🏗 Project Structure
text
/client                  # Frontend React app
  /src
    /components          # Reusable components (Chat, Header, Inputs)
    /pages               # Pages (Login, Signup, Chat, Dashboard, Admin)
    /utils               # Utility functions (API handlers, helpers)

  /public                # Static assets

/server                  # Backend application
  /controllers           # Business logic and route handlers
  /models                # MongoDB models using Mongoose
  /routes                # API routes

.env.example             # Example environment variables
README.md                # Project documentation
package.json             # Dependencies and scripts

🚀 Getting Started
Prerequisites
Node.js (v14 or above)

MongoDB (local or cloud - e.g., MongoDB Atlas)

npm or yarn

⚙ Installation
Clone the repository:

bash
git clone https://github.com/your-username/ai-contact-center.git
cd ai-contact-center
Install frontend and backend dependencies:

bash
cd client
npm install
cd ../server
npm install
Setup environment variables:

Create a .env file in the server folder based on .env.example:

text
MONGO_URI=your_mongo_url
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
Run the application:

From the root directory (optional setup with concurrently for full-stack):

bash
npm run dev
Or, start frontend and backend separately:

bash
cd client
npm start

# In another terminal
cd server
npm run dev
💻 Usage
As a User:
Sign up or log in and select your preferred language.

Use the Dashboard for navigation.

Communicate with the AI Chatbot.

Escalate to a human agent when needed.

View previous chats.

As an Admin:
Log in as an admin to access the Admin Dashboard.

View list of users and real-time chat statuses.

Interact with users who request human support.

Monitor and resolve escalated issues.

🔐 Environment Variables

Here’s a sample of the .env.example file:

text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
🧠 AI & NLP
Uses NLP.js for intent detection and pattern matching

Integrates Gemini API for fallback responses to unknown queries

Supports language switching to communicate in both English and Telugu

# future updates

Dashboard analytics(messages count,peak hours)

Sentiment Heatmaps for admin Feedback

WhatsApp and Email Integration

Voice-to-text for Faster query typing

image analysis of the issue

More Languages(Hindi, Tamil, etc.)
