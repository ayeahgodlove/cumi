/**
 * Auth0 Password Reset Utility
 * Handles password reset functionality using Auth0's password reset API
 */

interface PasswordResetOptions {
  email: string;
  connection?: string;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Send password reset email using Auth0's password reset API
 * @param options - Password reset options
 * @returns Promise<PasswordResetResponse>
 */
export const sendPasswordResetEmail = async (options: PasswordResetOptions): Promise<PasswordResetResponse> => {
  try {
    const { email, connection = 'Username-Password-Authentication' } = options;
    
    // Get Auth0 configuration from environment variables
    const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    
    if (!auth0Domain || !clientId) {
      throw new Error('Auth0 configuration is missing. Please check your environment variables.');
    }

    // Construct Auth0 password reset URL
    const resetUrl = `https://${auth0Domain}/dbconnections/change_password`;
    
    // Create form data for Auth0 password reset
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('email', email);
    formData.append('connection', connection);
    
    // Send password reset request to Auth0
    const response = await fetch(resetUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Password reset email sent successfully. Please check your email for instructions.',
      };
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.error_description || errorData.error || 'Failed to send password reset email';
      
      return {
        success: false,
        message: 'Failed to send password reset email',
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('Password reset error:', error);
    
    return {
      success: false,
      message: 'An error occurred while sending the password reset email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Alternative method using Auth0's Universal Login
 * This method redirects users to Auth0's hosted password reset page
 * @param email - User's email address (optional)
 * @returns void
 */
export const redirectToAuth0PasswordReset = (email?: string): void => {
  try {
    const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
    
    if (!auth0Domain || !clientId) {
      throw new Error('Auth0 configuration is missing');
    }

    // Construct Auth0 password reset URL
    const resetUrl = new URL(`https://${auth0Domain}/v2/password_reset`);
    resetUrl.searchParams.append('client_id', clientId);
    
    if (email) {
      resetUrl.searchParams.append('email', email);
    }
    
    // Redirect to Auth0 password reset page
    window.location.href = resetUrl.toString();
  } catch (error) {
    console.error('Error redirecting to Auth0 password reset:', error);
    throw error;
  }
};

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get Auth0 configuration status
 * @returns object with configuration status
 */
export const getAuth0ConfigStatus = () => {
  const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '');
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  
  return {
    isConfigured: !!(auth0Domain && clientId),
    hasDomain: !!auth0Domain,
    hasClientId: !!clientId,
    domain: auth0Domain || 'Not configured',
    clientId: clientId ? 'Configured' : 'Not configured',
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  sendPasswordResetEmail,
  redirectToAuth0PasswordReset,
  isValidEmail,
  getAuth0ConfigStatus,
};
