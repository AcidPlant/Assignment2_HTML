🎮 Souls-Like Games Library

An interactive website dedicated to Souls-like games. Users can search, discover, rate, and add games to their library. Built as a final project for a Web Development course, featuring responsive design, light/dark modes, advanced JS functionality, and integration with the RAWG API.

👥 Team Hollows

Mukhidinov Nursultan – Lead Developer & Souls-like Expert

Baltin Bakhtiyar – Content Creator & Game Analyst

🌟 Features
✅ Core Features

Responsive Design

Fully responsive for desktop, tablet, and mobile devices

Mobile-first design using Bootstrap 5

Adaptive typography and layout

Light & Dark Themes

Toggle between light and dark modes

User theme preference saved in localStorage

Smooth transitions with CSS variables

Consistent across all pages

User Authentication

Sign up and login functionality

Email validation and password complexity enforcement

Profile page showing account details (name, email)

LocalStorage-based authentication system

Game Discovery via RAWG API

Search and browse real-time game data

Display game ratings, release date, and platforms

Links to detailed RAWG pages for each game

Adult content filtering: NSFW, Hentai, Nudity, Sexual Content, LGBT, Yuri, Yaoi

Advanced Search & Filtering

Category-based filtering (e.g., Anime, Metroidvania, Action)

Real-time search with results highlighting

"No results" handling and results count display

Interactive Features

5-star rating system with persistent storage in localStorage

Add games to a personal library

Sound effects on buttons and interactions

Clear search and reload functions

All buttons functional, no placeholders

📚 Pages

Home (index.html)

Hero section with call-to-action buttons

API-powered Souls-like games section

Popular games showcase

Library (library.html)

Personal collection of games

Search and category filtering

Ratings display and RAWG links

About (about.html)

Overview of Souls-like genre

FAQ section with interactive accordions

Team member profiles

Contact (contact.html)

Multi-step contact form with validation

Newsletter subscription popup

Authentication (auth.html)

Login and signup forms with validation

User profile page with logout functionality

LocalStorage persistence for users and ratings

🛠️ Technologies Used

HTML5 & CSS3 – Semantic markup and custom styling

Bootstrap 5 – Responsive grid and components

JavaScript (ES6+) & jQuery – Interactivity, DOM manipulation

RAWG API – Game information and search

LocalStorage & SessionStorage – Authentication, ratings, theme, and preferences

📋 Form Validation

All forms validate:

Email: proper format

Password: min 8 characters, uppercase, lowercase, number

Name: min 2 characters

Message: min 10 characters

Phone: proper format (if applicable)

🎨 Design Highlights

Color Scheme: Dark mode with red accent (#dc3545), readable light mode

Typography: Segoe UI, responsive font sizing

Animations: Hover effects, fade-ins, rating star animations

Accessibility: Focus indicators, keyboard navigation, contrast compliance

🚀 Getting Started
Prerequisites

Modern web browser (Chrome, Firefox, Safari, Edge)

Internet connection for API calls

📱 Browser Compatibility

✅ Chrome, Firefox, Safari, Edge (latest versions)

✅ Mobile browsers (iOS Safari, Chrome Mobile)

🔒 Security Notes

Authentication and ratings stored in localStorage (educational/demo purposes)

For production:

Use backend authentication with hashed passwords

HTTPS for API calls

Input sanitization and CSRF protection

📊 Future Improvements

Backend for authentication and database storage

Expand game library and user collections

Social features: comments, reviews, comparisons

Advanced filtering and community forum

📄 License

Educational project for Web Development course.

🙏 Acknowledgments

RAWG.io
 – Games Database API

Bootstrap
 – Responsive framework

jQuery
 – DOM manipulation

FromSoftware – Souls-like genre inspiration

📞 Contact

Email: info@soulslikegames.com

Discord: SoulsLikeHQ

Built with ❤️ by Team Hollows

"Every death is a lesson, every victory is earned."
