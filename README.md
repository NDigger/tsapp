### How to run the project?

1. Clone the project
2. Check private folder for .env.example file. Create a .env file from it (you can rename .example.env to .env to make it work)
3. Open your terminal in root folder.
4. Type command "docker compose up --build" and wait when servers are loaded
5. Visit http://localhost:5173/index.html

# How to run tests?

1. Type command "docker compose up --build" and wait when servers are loaded
2. Type command "docker exec t-shirtsapp-backend-1 npm run test" in new terminal and look at test results