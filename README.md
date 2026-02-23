# CPSC5260_RefactoringBOT

# Refactor BOT

Refactor BOT is an AI-powered refactoring engine designed to help software engineer clean, optiomize and modernize their code. Built with a focus on both functionality and a personlaized elegant aethestic

# What does it actually do?

**Code Smell Detection:** It analyzes the messy code (Java, C, C++, or Python) to find those "code smells".

**Automated Refactoring:** Once a smell is found, it uses the Gemini API to refactor the code into something clean, readable, and efficient.

**Live Edit Mode:** If you want to tweak the original code while looking at the AI's suggestions, you can click the "Edit Original" button. It gives a live textarea on the left and keeps the clean refactored code on the right so you can compare.

**Side-by-Side Diff view:** A professional-grade diff viewer that highlights exactly what was added or removed in red and green.

**File Management:** You can upload the actual source files and download the refactored version instantly.

**Refactoring Justification:** It doesn't just change the code and leave you guessing; it actually explains which code smells were found and justifies why it made those specific changes.

# How to set up the Gemini API
Since this uses Google’s AI, you need the own secret key to make it work.

Get the Key: Go to Google AI Studio(https://aistudio.google.com/) and sign in.

Create it: Click "Get API key" on the left side bar and then click "Create API key" on the right top corner.

Save it: Once it is created, copy that long string of letters and numbers.

Hide it: Create a file named prod.env in the project folder. Add this line:
```
GEMINI_API_KEY=<<your_key_here>>
```

# Running it on your machine

**Server (Node.js)**
Navigate to the server directory.

Install the base dependencies:
```
npm install
```

Install required middleware for API security and functionality:
```
npm install express cors dotenv
```

Install development tools to allow the server to auto-restart when you update code:
```
npm install --save-dev nodemon
```

Start the backend service:
```
npx nodemon index.js
```

Note: The backend will start up on port 5006.

**Client (React)**
Navigate to the client directory.

Install dependencies using the legacy flag to ensure compatibility with React 19:
```
npm install --legacy-peer-deps
```

Why this flag? It tells NPM to ignore "peer dependency" conflicts between React 19 and older plugins like react-diff-viewer.

Install the icon library:
```
npm install lucide-react --legacy-peer-deps
```

Launch the UI:
```
npm start
```

Note: Your browser should automatically open to localhost:3000.

# Tech I Used

Frontend: React.js (v19.2.4)

Backend: Node.js & Express (v24.13.0)

AI Engine: Google Gemini API (Model - Gemini-2.5-flash)

Icons: Lucide-React (v0.575.0)

Styling: Custom CSS with Google Fonts
