# TODO List for Testing Signup, Login, and Dashboard Pages

## Backend Setup
- [ ] Start the backend server: Run `node server.js` in the project directory
- [ ] Verify server is running on port 3000 (check console output)
- [ ] Ensure MongoDB is connected (check console for connection message)

## Frontend Setup
- [ ] Install dependencies: Run `npm install` in the project directory
- [ ] Start the Expo app: Run `npm start` or `expo start`
- [ ] Open the app in an emulator or on a device

## Testing Signup Page
- [ ] Navigate to Signup screen
- [ ] Enter valid name, email, mobile, password, confirm password
- [ ] Submit signup form
- [ ] Verify user is created (check server logs or database)
- [ ] Verify navigation to Login screen after successful signup

## Testing Login Page
- [ ] Navigate to Login screen
- [ ] Enter email and password of the created user
- [ ] Submit login form
- [ ] Verify JWT token is received and stored
- [ ] Verify navigation to Dashboard screen after successful login

## Testing Dashboard Page
- [ ] Verify user is authenticated and Dashboard screen is displayed
- [ ] Check if user stats are fetched and displayed in the right sidebar
- [ ] Verify map is loaded (may show mock on web)
- [ ] Test Emergency Alert button (may require SMS permissions)
- [ ] Test Help Me button (may require SMS permissions)
- [ ] Test Logout button: Verify navigation back to Login screen

## Additional Checks
- [ ] Check console logs for any errors during signup, login, or dashboard load
- [ ] Verify API_BASE_URL in config.js matches the server IP/port
- [ ] Test error handling: Invalid credentials, duplicate email, etc.
