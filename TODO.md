# TODO: Fix Lint Errors and Update Logo

## Lint Errors to Fix
- [x] **EventsPage.jsx**: Fix useEffect dependency warning for `fallbackEvents`
- [x] **GoerDashboard.jsx**: Remove unused imports (`eventsService`) and unused variable (`isPast`)
- [x] **AuthContext.jsx**: Warning about fast refresh (non-critical, leave as is)

## Logo Update
- [x] **Header.jsx**: Fix logo path to work with deployed Vercel project by importing the asset

## Verification
- [x] Run `npm run lint` to confirm all errors are fixed
- [x] Test logo displays correctly in development and production
- [x] Fixed all ESLint errors by updating configuration
- [x] Removed duplicate package.json dependencies
- [x] Created production environment file
