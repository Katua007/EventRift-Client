#  EventRift Client

> **Connecting people through unforgettable experiences across Kenya**

EventRift is a modern, full-featured event discovery and management platform built with React and Vite. This frontend application provides a seamless experience for event-goers, organizers, and vendors to discover, create, and manage amazing events.

## What Makes EventRift Special

EventRift isn't just another event platform—it's a carefully crafted experience that brings the vibrant event culture of Kenya to your fingertips. From music festivals in Nairobi to tech conferences in Mombasa, we're building the go-to platform for discovering and managing events across the country.

## Live Demo

- **Production:** [https://event-rift-client.vercel.app/](https://event-rift-client.vercel.app/)
- **Repository:** [https://github.com/Katua007/EventRift-Client](https://github.com/Katua007/EventRift-Client)

## Key Features

###  User Experience First**
- **Pixel-Perfect Design**: Meticulously crafted UI matching Figma specifications
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Accessibility**: Built with accessibility best practices in mind

### Smart Authentication System**
- **Role-Based Access**: Three distinct user types (Event Goers, Organizers, Vendors)
- **Secure Login/Signup**: Form validation with React Hook Form
- **Protected Routes**: Client-side role-based access control
- **Persistent Sessions**: localStorage-based session management

### Beautiful UI Components**
- **Modern Design System**: Custom EventRift color palette and typography
- **Glass-morphism Effects**: Contemporary UI with backdrop blur effects
- **Interactive Gallery**: Modal-based photo gallery with navigation
- **Dynamic Navigation**: Active section highlighting and smooth scrolling

### Core Sections**
- **Hero Section**: Compelling landing with clear call-to-action
- **Event Discovery**: Featured events with filtering capabilities
- **Photo Gallery**: Showcase of past events with modal viewing
- **About Section**: Company story and mission
- **Contact Integration**: Newsletter signup and social links

##  Tech Stack

### **Frontend Framework**
- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.14** - Lightning-fast build tool with HMR
- **React Router DOM 6.28.0** - Client-side routing

### **Styling & UI**
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **Custom Design System** - EventRift brand colors and components
- **Lucide React** - Beautiful, customizable icons
- **Google Fonts** - Poppins & Inter typography

### **Form Management**
- **React Hook Form 7.65.0** - Performant forms with easy validation
- **Custom Validation** - Email, password, and role validation

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **Rolldown** - Advanced bundling with Vite

##  Design System

### **Color Palette**
```css
/* Primary Colors */
--er-primary: #FF6B9D    /* Vibrant Pink */
--er-secondary: #4ECDC4  /* Turquoise */
--er-accent: #FFD93D     /* Golden Yellow */

/* Neutral Colors */
--er-dark: #0A0A0A       /* Deep Black */
--er-gray: #1A1A1A       /* Dark Gray */
--er-light: #FFFFFF      /* Pure White */
--er-text: #E5E5E5       /* Light Gray Text */
```

### **Typography**
- **Headings**: Poppins (600-900 weight)
- **Body Text**: Inter (300-700 weight)
- **Responsive Scaling**: Mobile-first approach

### **Components**
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glass-morphism with subtle borders
- **Forms**: Clean inputs with focus states
- **Navigation**: Active states with gradient underlines

##  Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── figma/           # Figma-specific components
│   │   └── ImageWithFallback.jsx
│   ├── AboutUs.jsx      # About section
│   ├── Footer.jsx       # Site footer
│   ├── Hero.jsx         # Landing hero section
│   ├── HomePage.jsx     # Main homepage layout
│   ├── Navbar.jsx       # Navigation component
│   ├── PhotoGallery.jsx # Interactive gallery
│   ├── StayConnected.jsx # Newsletter signup
│   ├── WhatsGoingOn.jsx # Events section
│   └── [Role]Dashboard.jsx # User dashboards
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login form
│   └── SignupPage.jsx  # Registration form
├── services/           # API and external services
│   └── authService.js  # Authentication logic
├── assets/             # Static assets
│   └── images/         # Image files
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

##  Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Katua007/EventRift-Client.git
   cd EventRift-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5176
   ```

### **Available Scripts**

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

##  Authentication System

### **Demo Credentials**
For testing purposes, use these demo accounts:

```
Event Goer:
Email: goer@test.com
Password: password

Event Organizer:
Email: organizer@test.com  
Password: password

Vendor:
Email: vendor@test.com
Password: password
```

### **User Roles**

- ** Event Goers**: Browse and book events
- ** Organizers**: Create and manage events
- ** Vendors**: Provide event services

## Key Components Deep Dive

### **Hero Section**
The landing hero creates an immediate impact with:
- Full-screen background with overlay gradients
- Animated floating elements
- Clear value proposition
- Strong call-to-action button

### **Navigation System**
Smart navigation that adapts to user context:
- Active section highlighting
- Smooth scroll to sections
- Mobile-responsive hamburger menu
- User authentication states

### **Photo Gallery**
Interactive gallery showcasing event moments:
- Modal-based image viewing
- Keyboard navigation support
- Image fallback system
- Responsive grid layout

### **Authentication Flow**
Comprehensive auth system:
- Form validation with real-time feedback
- Role-based signup process
- Protected route handling
- Session persistence

##  Figma Implementation

This project was built from detailed Figma designs with:
- **Pixel-perfect accuracy** to design specifications
- **Component-based architecture** matching Figma components
- **Responsive breakpoints** as defined in designs
- **Color system** extracted directly from Figma
- **Typography scales** matching design tokens

##  Deployment

### **Vercel Deployment**
The app is automatically deployed to Vercel:

1. **Connected to GitHub** - Auto-deploys on push to main
2. **Build Configuration** - Optimized for Vite builds
3. **Environment Variables** - Configured for production
4. **Custom Domain** - Available at event-rift-client.vercel.app

### **Build Optimization**
- **Code Splitting** - Automatic route-based splitting
- **Asset Optimization** - Images and CSS optimization
- **Bundle Analysis** - Optimized bundle sizes
- **Caching Strategy** - Efficient browser caching

##  Development Workflow

### **Git Workflow**
- **Main Branch** - Production-ready code
- **Feature Branches** - Individual feature development
- **Commit Messages** - Conventional commit format
- **Pull Requests** - Code review process

### **Code Quality**
- **ESLint Configuration** - Consistent code style
- **Component Structure** - Reusable, maintainable components
- **Performance Optimization** - Lazy loading and memoization
- **Accessibility** - WCAG compliance

## Future Enhancements

### **Planned Features**
- **Real-time Notifications** - WebSocket integration
- **Advanced Search** - Filters and sorting
- **Payment Integration** - Secure checkout flow
- **Social Features** - User profiles and reviews
- **Mobile App** - React Native companion

### **Technical Improvements**
- **TypeScript Migration** - Type safety
- **Testing Suite** - Unit and integration tests
- **Performance Monitoring** - Analytics integration
- **SEO Optimization** - Meta tags and structured data

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Team

Built by the EventRift team:
Cyril Katua
Collins Opiayo
Muzna Mohamed
Abubakar Sheikh

## Contact

- **Email**: info@eventrift.co.ke
- **Phone**: +254 700 123 456
- **Location**: Nairobi, Kenya

---

**EventRift** - *Where every event tells a story, and every story becomes a memory* 