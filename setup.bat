@echo off
echo === Think41 Customer Management System Setup ===
echo.
echo Installing backend dependencies...
call npm install

echo.
echo Installing frontend dependencies...
call npm run install-frontend

echo.
echo =======================================
echo Setup complete! You can now run:
echo.
echo npm run dev         - Start the backend API server
echo npm run frontend    - Start the frontend application
echo npm run dev-all     - Run both backend and frontend
echo =======================================
