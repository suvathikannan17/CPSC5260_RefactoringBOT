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

Hide it: Create a file named .prod.env in the project folder. Add this line:
GEMINI_API_KEY=your_key_here

# Running it on your machine

**Server (Node.js)**

npm install

node index.js

The backend will start up on port 5005.

**Client (React)**

npm install

npm start

Browser should pop open a tab at localhost:3000 with the Refactor BOT UI.

# Tech I Used

Frontend: React.js

Backend: Node.js & Express

AI Engine: Google Gemini API

Styling: Custom CSS with Google Fonts
