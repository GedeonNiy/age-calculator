/**
 * EmailJS Configuration
 * 
 * To set up EmailJS:
 * 1. Go to https://www.emailjs.com/ and sign up (free account)
 * 2. Add an Email Service (Gmail) and copy the Service ID
 * 3. Create an Email Template and copy the Template ID
 * 4. Get your Public Key from Account → General
 * 5. Replace the values below with your credentials
 */

import { EMAILS } from './config/emails'

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: '1ccTjMutC_8UE9xE6',
  SERVICE_ID: 'service_2ytg8qi',
  TEMPLATE_ID: 'template_udd37ai',
  TO_EMAIL: EMAILS.contact, // Contact email address
};

// Check if EmailJS is configured
export function isEmailJSConfigured(): boolean {
  return (
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE' &&
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID_HERE' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID_HERE' &&
    EMAILJS_CONFIG.PUBLIC_KEY.length > 0 &&
    EMAILJS_CONFIG.SERVICE_ID.length > 0 &&
    EMAILJS_CONFIG.TEMPLATE_ID.length > 0
  );
}

