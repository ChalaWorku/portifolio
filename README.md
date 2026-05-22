# Chala Worku Portfolio Website

A premium-quality personal portfolio website built with HTML5, CSS3, and vanilla JavaScript. This site includes Firebase integration for Authentication, Firestore, Storage support, and Hosting configuration.

## Project Overview

This portfolio showcases:
- Modern responsive landing page and page templates
- Animated hero section, typing headline, and smooth scroll interactions
- Glassmorphism visuals, dark/light theme, and floating particles
- Skills, projects, services, testimonials, resume timeline, and contact form
- Firebase Authentication for secure admin access
- Firestore storage for messages, projects, and testimonials
- Admin dashboard to manage content, projects, and messages

## Folder Structure

```
/portfolio
├── index.html
├── about.html
├── projects.html
├── skills.html
├── contact.html
├── admin.html
├── /css
│   ├── style.css
│   ├── responsive.css
│   ├── animations.css
├── /js
│   ├── app.js
│   ├── firebase.js
│   ├── auth.js
│   ├── projects.js
│   ├── contact.js
│   ├── admin.js
├── /assets
│   ├── /images
│   ├── /icons
│   ├── /videos
├── /data
├── firebase.json
├── .firebaserc
├── README.md
```

## Installation

1. Clone or copy the project files into your workspace.
2. Open the folder in VS Code.
3. Replace Firebase configuration values in `js/firebase.js` with your own project credentials.
4. Add an actual CV file named `assets/data/CV-Chala-Worku.pdf` or update the download link in the HTML files.

## Firebase Setup Guide

### 1. Create a Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Enter a project name and follow the setup steps.
4. Enable Google Analytics if desired.

### 2. Enable Firestore

1. In the Firebase Console, open **Firestore Database**.
2. Click **Create database**.
3. Start in production mode if ready, or test mode for development.
4. Choose a location and finish setup.

### 3. Enable Authentication

1. Open **Authentication** in Firebase.
2. Click **Get started**.
3. Under **Sign-in method**, enable **Email/Password**.
4. Create an admin user in the **Users** tab.

### 4. Enable Hosting

1. Open **Hosting**.
2. Click **Get started**.
3. Follow the CLI instructions if you want to deploy.

### 5. Configure Firebase in the project

1. Open `js/firebase.js`.
2. Replace the placeholder values with your project settings:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Deployment Steps

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Initialize the project (if needed):
   ```bash
   firebase init hosting
   ```
   - Choose existing project
   - Set public directory to `.`
   - Configure as a single-page app: `No`
4. Deploy:
   ```bash
   firebase deploy
   ```

## Customization Guide

- Update content in the HTML pages for personal biography, skills, and project descriptions.
- Replace placeholder images in `assets/images` with your own photos or screenshots.
- Adjust the color palette in `css/style.css` using CSS variables.
- Add Firestore documents in `projects`, `messages`, and `testimonials` to populate dynamic data.
- Extend the admin dashboard with additional management sections or upload controls.

## Notes

- This template is purposely built without frameworks to stay fast and accessible.
- All pages share a consistent layout and theme system.
- Firebase integration uses the compatibility SDK for simple setup.
- Make sure to set up Firestore rules before deploying to production.

## Recommended Firebase Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow create;
      allow read, delete: if request.auth != null;
    }
    match /projects/{projectId} {
      allow read;
      allow write, update, delete: if request.auth != null;
    }
    match /testimonials/{testimonialId} {
      allow read;
      allow write, update, delete: if request.auth != null;
    }
  }
}
```

## Final Notes

This portfolio is ready for customization and deployment. Once Firebase is configured, the admin dashboard can manage projects and contact submissions immediately.
