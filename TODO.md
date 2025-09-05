# TODO List for User Signup and Login Implementation

## Completed Tasks
- [x] Signup functionality: User details added to database via /api/signup
- [x] Login functionality: Check credentials against database, return JWT if valid
- [x] Error handling: Show "Invalid email or password" on login failure
- [x] Navigation fix: Modified App.js to always include all screens
- [x] Navigation fix: Added navigation.navigate('Dashboard') after successful login in LoginScreen.js
- [x] Backend testing: Signup API adds user to database successfully
- [x] Backend testing: Login API returns JWT token for valid credentials
- [x] Backend testing: Login API returns "Invalid email or password" for wrong password
- [x] Backend testing: Login API returns "Invalid email or password" for non-existent user
- [x] Error handling: Invalid login shows error message (backend confirmed)

## Pending Tasks
- [ ] Test the React Native app frontend on device/emulator to verify dashboard navigation
- [ ] Test logout functionality in the app

## Notes
- Backend routes /api/signup and /api/login are implemented in server.js
- User model in db/models/User.js stores name, email, mobile, password
- Authentication state managed by AuthContext.js
- Navigation restructured to include all screens always for proper state updates
