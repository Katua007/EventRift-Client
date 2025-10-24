// Assets index file for EventRift
// Import and export all assets for easy management

// Images
export { default as logo } from './images/logo.svg';

// Icons (using lucide-react for now, can be replaced with custom icons)
export {
  Calendar,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Play,
  Home,
  User,
  Menu,
  X,
  ShoppingCart,
  LogOut
} from 'lucide-react';

// Colors (matching Figma design)
export const colors = {
  primary: '#ff6b9d',
  secondary: '#4ecdc4',
  accent: '#ffd93d',
  dark: '#0a0a0a',
  gray: '#1a1a1a',
  light: '#ffffff',
  text: '#e5e5e5',
};

// Typography
export const fonts = {
  heading: 'Poppins, sans-serif',
  body: 'Inter, system-ui, sans-serif',
};