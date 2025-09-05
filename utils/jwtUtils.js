import { decode as atob } from 'base-64';

// Helper function to decode base64url
export function base64UrlDecode(str) {
  // Replace non-url compatible chars with base64 standard chars
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with trailing '='
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}
