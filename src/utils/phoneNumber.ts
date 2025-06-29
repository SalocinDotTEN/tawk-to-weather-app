import { type CountryCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'

export interface Country {
  code: CountryCode
  name: string
  dialCode: string
  flag: string
}

// Popular countries list
export const countries: Country[] = [
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
]

/**
 * Validates a phone number and returns it in E.164 format
 */
export function validateAndFormatPhoneNumber (
  phoneNumber: string,
  countryCode: CountryCode,
): { isValid: boolean, formatted: string, error?: string } {
  try {
    // Clean the phone number by removing non-digits except the leading +
    let cleanNumber = phoneNumber.trim()

    // If it starts with the country's dial code, remove it
    const country = getCountryByCode(countryCode)
    if (country && cleanNumber.startsWith(country.dialCode)) {
      cleanNumber = cleanNumber.slice(country.dialCode.length)
    }

    // Remove any remaining formatting characters but keep digits
    cleanNumber = cleanNumber.replace(/[^\d]/g, '')

    // Skip validation if empty
    if (!cleanNumber) {
      return {
        isValid: false,
        formatted: phoneNumber,
        error: 'Phone number is required',
      }
    }

    // Parse the phone number with the country code
    const parsed = parsePhoneNumber(cleanNumber, countryCode)

    if (!parsed || !parsed.isValid()) {
      return {
        isValid: false,
        formatted: phoneNumber,
        error: 'Invalid phone number format',
      }
    }

    return {
      isValid: true,
      formatted: parsed.format('E.164'),
    }
  } catch (error) {
    console.error('Phone validation error:', error)
    return {
      isValid: false,
      formatted: phoneNumber,
      error: 'Invalid phone number',
    }
  }
}

/**
 * Formats a phone number for display (national format)
 */
export function formatPhoneNumberForDisplay (
  phoneNumber: string,
  countryCode: CountryCode,
): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    if (parsed && parsed.isValid()) {
      return parsed.formatNational()
    }
    return phoneNumber
  } catch {
    return phoneNumber
  }
}

/**
 * Validates if a phone number is valid for a given country
 */
export function isValidPhoneForCountry (
  phoneNumber: string,
  countryCode: CountryCode,
): boolean {
  try {
    return isValidPhoneNumber(phoneNumber, countryCode)
  } catch {
    return false
  }
}

/**
 * Gets country by code
 */
export function getCountryByCode (code: CountryCode): Country | undefined {
  return countries.find(country => country.code === code)
}

/**
 * Formats E.164 number for display
 */
export function formatE164ForDisplay (e164Number: string): string {
  try {
    const parsed = parsePhoneNumber(e164Number)
    if (parsed && parsed.isValid()) {
      return parsed.formatInternational()
    }
    return e164Number
  } catch {
    return e164Number
  }
}
