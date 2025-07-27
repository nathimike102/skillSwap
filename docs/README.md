# SkillSwap Pro

## Overview

SkillSwap Pro is a comprehensive platform designed to facilitate skill exchange, mentorship, and career development. The platform connects learners with mentors and peers, providing tools for collaborative learning and professional growth through AI-powered career assistance and job platform integration.

## Features

- **User Portfolio System**: Skill badges (offered & acquired), project showcases, resume upload, and auto-generated skill cards
- **Job Platform Integration**: LinkedIn, Naukri, Internshala APIs with skill-tag-based job redirection and smart apply links
- **Career Guidelines Hub**: Roadmaps & tutorials, resume tips, interview prep, and AI career assistant
- **Smart Match + Tracker**: Peer-to-peer skill exchange, skill goal setting, and progress dashboard
- **Peer-to-Peer Classes**: Direct skill exchange between users with real-time chat & feedback
- **One-to-Many Mentorship**: Mentors can host topic-based classes with session scheduling and AI reminders

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (version 14 or higher) - for development
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nathimike102/skillSwap.git
   cd SkillSwap
   ```

2. Run the setup script (optional for development)
   ```bash
   ./scripts/setup.sh
   ```

3. Start development server (if using Node.js)
   ```bash
   npm run dev
   ```

4. Or simply open `src/index.html` in your browser

## Project Structure

```
SkillSwap/
├── src/                    # Source code
│   ├── index.html         # Main landing page
│   ├── pages/             # HTML pages
│   │   ├── about.html
│   │   ├── auth.html
│   │   ├── discover.html
│   │   ├── roadmaps.html
│   │   ├── portfolio.html
│   │   ├── jobs.html
│   │   ├── peer-to-peer.html
│   │   ├── one-to-many.html
│   │   ├── smartmatch-tracker.html
│   │   ├── career-guidelines.html
│   │   └── 404.html
│   ├── styles/            # CSS stylesheets
│   │   └── style.css
│   ├── scripts/           # JavaScript files
│   │   ├── main.js
│   │   └── utils.js
│   └── components/        # Reusable components (future use)
├── public/                # Static assets
│   └── assets/
│       ├── images/        # Images and logos
│       │   ├── skillswap-logo.png
│       │   ├── infi-logo.png
│       │   └── profiles/  # Profile images
│       └── icons/         # Icon files
├── docs/                  # Documentation
│   ├── README.md
│   ├── DOCUMENTATION.md
│   ├── PATH-REFERENCE.md
│   ├── PATH-VERIFICATION-REPORT.md
│   └── LICENSE
├── config/               # Configuration files
│   └── app.config.js
├── scripts/              # Build and utility scripts
│   ├── setup.sh
│   └── fix-paths.sh
├── package.json          # Node.js project configuration
└── README.md            # Main project documentation
```

## Usage

1. **Main Page**: Open `src/index.html` to access the landing page
2. **Authentication**: Navigate to Sign In to access user features
3. **Discover**: Browse available courses and mentors
4. **Portfolio**: Create and manage your skill portfolio
5. **Smart Match**: Find peers for skill exchange
6. **Mentorship**: Join or host learning sessions

## Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5
- **JavaScript**: Vanilla ES6+
- **Icons**: Bootstrap Icons
- **Build Tools**: npm scripts, live-server
- **Version Control**: Git

## API Documentation

### External Integrations
- **LinkedIn API**: Job listings and professional networking
- **Naukri API**: Indian job market integration
- **Internshala API**: Internship and entry-level opportunities

### Planned Endpoints
- Authentication and user management
- Skill matching and recommendation system
- Session scheduling and management
- Progress tracking and analytics

## Testing

### Manual Testing
1. Open `src/index.html` in different browsers
2. Navigate through all pages to verify links
3. Test responsive design on various devices
4. Verify all images and assets load correctly

### Automated Testing (Future)
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run code linting
- `./scripts/setup.sh` - Setup development environment

### Code Style
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes
- Use ES6+ JavaScript features
- Maintain consistent indentation (2 spaces)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Project Team**: Aditya College CSE Department
- **Project Repository**: [https://github.com/nathimike102/skillSwap](https://github.com/nathimike102/skillSwap)
- **Location**: Andhra Pradesh, India

## Team Members

- SRI GANESH MENNI - Full Stack Developer
- Eathakottu Sanjay - Frontend Developer  
- YASWANTH AMJURI - Backend Developer
- SINGIRI SIVAJI - UI/UX Designer
- SANA CHANDRA VAMSI - Project Manager
- SIBANDA NKOSINATHI MICHAEL - Systems Architect

## Changelog

### [Version 1.0.0] - July 27, 2025
- ✅ Initial project setup with professional folder structure
- ✅ Complete responsive landing page
- ✅ User authentication system (frontend)
- ✅ About page with team information
- ✅ Course discovery interface
- ✅ Portfolio creation system
- ✅ Skill exchange matching
- ✅ Mentorship session management
- ✅ Career guidelines hub
- ✅ Job platform integration interface
- ✅ All HTML files with corrected paths
- ✅ Bootstrap 5 and modern CSS styling
- ✅ Professional documentation

### [Upcoming Features]
- Backend API development
- Real-time chat system
- Video call integration
- AI-powered career recommendations
- Payment system integration
- Mobile app development

---

**Last Updated:** July 27, 2025  
**Project Status:** Active Development  
**Version:** 1.0.0