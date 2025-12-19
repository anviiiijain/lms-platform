// JWT token management
export const AuthService = {
    // Save JWT token to localStorage
    saveToken: (token: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', token);
      }
    },
  
    // Get JWT token from localStorage
    getToken: (): string | null => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('jwt');
      }
      return null;
    },
  
    // Remove JWT token
    removeToken: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
      }
    },
  
    // Check if user is authenticated
    isAuthenticated: (): boolean => {
      return !!AuthService.getToken();
    },
  
    // Save user ID
    saveUserId: (userId: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', userId);
      }
    },
  
    // Get current user ID
    getUserId: (): string | null => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('userId');
      }
      return null;
    },
  
    // Decode JWT to get user info (basic decode, not verification)
    decodeToken: (token: string): any => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    },
  
    // Get current user info from token
    getCurrentUser: (): { id: string; email: string } | null => {
      const token = AuthService.getToken();
      if (!token) return null;
      
      const decoded = AuthService.decodeToken(token);
      return decoded ? { id: decoded.sub, email: decoded.email } : null;
    },
  };