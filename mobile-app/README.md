# MentEducation Mobile App

This is the isolated React Native + Expo mobile client for MentEducation. It lives on the `mobile-app-build` branch so website launch stabilization on `main` is not affected.

## Current screens
- Mentee Home
- Discover Mentors
- Mentor Profile
- Select Date & Time
- Booking Confirmation
- Sessions
- Messages
- Profile

## Run locally
1. `cd mobile-app`
2. `npm install`
3. `npx expo start`
4. Scan the QR code with Expo Go during early development, or create an Expo development build for native testing.

## Next build phase
- Supabase authentication and persistent session
- Real mentor directory/profile data
- Availability and booking RPC integration
- Stripe mobile checkout flow
- Live messages and session data
- Mentor-side mobile experience
