// Get the app URL with proper fallback logic
// In production, this should NEVER be localhost
const getAppUrl = (): string => {
  // Priority 1: NEXT_PUBLIC_APP_URL (should be set in production)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Priority 2: Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    // In production, use the production domain
    return 'https://cumi.dev';
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

export const APP_URL = getAppUrl();

export const TINYMCE_KEY = `jmee0ymvhn8xuoj51dz5vzj032x5887fw5aa4yojvi9pu68z`;

export const BASE_URL = `/api`;

