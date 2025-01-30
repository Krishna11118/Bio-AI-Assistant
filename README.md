# AI Assistant with Node.js, and React

An intelligent AI assistant application built using Gemini apabilities, Node.js for the backend server, and React + Vite for the frontend interface.

## 🚀 Features

- Real-time AI conversations
- Modern responsive UI built with React
- Fast development environment with Vite
- RESTful API backend with Node.js

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Krishna11118/AI_Assistant_LangChain_Gemini
cd AI_Assistant_LangChain_Gemini
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:
Create a `.env` file in the server directory with the following:
```
GEMINI_API_KEY=your_api_key_here
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd server
npm run server
```

2. Add server url on ```bash client/src/config: ```

3. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration
- Port: 3000 (default)
- Environment: Configure through `.env` file

### Frontend Configuration
- Development port: 5173 (Vite default)
- API URL: Configure in `client/src/config.js`


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)

