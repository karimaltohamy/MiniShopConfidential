import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { supabase } from './supabase';

/**
 * Deep Link Handler for Supabase Auth Flows
 * Handles password reset and other authentication deep links
 */
export class DeepLinkHandler {
  private static instance: DeepLinkHandler;
  private isProcessing = false;

  private constructor() {}

  static getInstance(): DeepLinkHandler {
    if (!DeepLinkHandler.instance) {
      DeepLinkHandler.instance = new DeepLinkHandler();
    }
    return DeepLinkHandler.instance;
  }

  /**
   * Initialize deep link listeners
   * Call this in your root layout
   */
  initialize() {
    // Handle cold start - app opened via deep link
    this.handleInitialUrl();

    // Handle warm start - app already running
    const subscription = Linking.addEventListener('url', this.handleUrl);

    return () => {
      subscription.remove();
    };
  }

  /**
   * Handle the initial URL when app is opened via deep link (cold start)
   */
  private async handleInitialUrl() {
    try {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('Initial URL (cold start):', initialUrl);
        await this.processUrl(initialUrl);
      }
    } catch (error) {
      console.error('Error handling initial URL:', error);
    }
  }

  /**
   * Handle URL events when app is already running (warm start)
   */
  private handleUrl = async (event: { url: string }) => {
    console.log('URL event (warm start):', event.url);
    await this.processUrl(event.url);
  };

  /**
   * Process the deep link URL
   * Extracts route and handles Supabase session restoration
   */
  private async processUrl(url: string) {
    // Prevent concurrent processing
    if (this.isProcessing) {
      console.log('Already processing a URL, skipping...');
      return;
    }

    this.isProcessing = true;

    try {
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('Parsed URL:', { hostname, path, queryParams });

      // Check if this is a Supabase auth URL (contains access_token or error in hash)
      if (this.isSupabaseAuthUrl(url)) {
        await this.handleSupabaseAuth(url);
      } else {
        // Handle other deep link routes
        this.handleRoute(path, queryParams);
      }
    } catch (error) {
      console.error('Error processing deep link:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Check if URL is a Supabase authentication URL
   * Supabase sends tokens in URL hash (#access_token=...)
   */
  private isSupabaseAuthUrl(url: string): boolean {
    // Supabase auth URLs contain access_token or error in the hash
    return url.includes('#access_token=') || url.includes('#error=');
  }

  /**
   * Handle Supabase authentication URLs (password reset, email verification)
   * Manually extracts tokens from URL hash and restores session
   */
  private async handleSupabaseAuth(url: string) {
    try {
      console.log('Handling Supabase auth URL:', url);

      // Extract hash fragment from URL (Supabase tokens are in the hash)
      const hashIndex = url.indexOf('#');
      if (hashIndex === -1) {
        console.error('No hash fragment found in URL');
        this.handleAuthError('Invalid authentication link');
        return;
      }

      const hashFragment = url.substring(hashIndex + 1);
      const params = new URLSearchParams(hashFragment);

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const error_description = params.get('error_description');
      const error_code = params.get('error');

      // Handle error case
      if (error_code || error_description) {
        console.error('Auth error from URL:', error_description || error_code);
        this.handleAuthError(error_description || 'Authentication failed');
        return;
      }

      // Handle success case
      if (access_token && refresh_token) {
        console.log('Setting session from tokens...');

        // Set the session using the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error('Error setting session:', error);
          this.handleAuthError(error.message);
          return;
        }

        if (data.session) {
          console.log('Session restored successfully');

          // Parse URL path using Expo Linking (works with custom schemes)
          const { path } = Linking.parse(url);

          // Navigate to appropriate screen based on the URL path
          if (path?.includes('reset-password') || url.includes('reset-password')) {
            console.log('Navigating to reset password screen...');
            router.replace('/(auth)/reset-password');
          } else {
            // Default: navigate to app home after successful auth
            console.log('Navigating to home screen...');
            router.replace('/(tabs)');
          }
        }
      } else {
        console.warn('No tokens found in URL');
        this.handleAuthError('Invalid authentication link');
      }
    } catch (error) {
      console.error('Error handling Supabase auth:', error);
      this.handleAuthError('Failed to process authentication link');
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(message: string) {
    console.error('Auth error:', message);
    // You could navigate to an error screen or show an alert
    // For now, just navigate to login
    router.replace('/(auth)/login');
  }

  /**
   * Handle custom deep link routes (non-auth)
   */
  private handleRoute(path: string | null, queryParams: Record<string, any>) {
    if (!path) return;

    console.log('Handling custom route:', path, queryParams);

    // Handle custom routes based on path
    switch (path) {
      case '/product':
        if (queryParams.id) {
          router.push(`/product/${queryParams.id}`);
        }
        break;

      case '/cart':
        router.push('/(tabs)/cart');
        break;

      case '/orders':
        router.push('/(tabs)/orders');
        break;

      case '/profile':
        router.push('/(tabs)/profile');
        break;

      default:
        console.log('Unknown route:', path);
        break;
    }
  }
}

/**
 * Convenience function to initialize deep linking
 */
export const initializeDeepLinking = () => {
  return DeepLinkHandler.getInstance().initialize();
};
