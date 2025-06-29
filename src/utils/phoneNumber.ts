import { type CountryCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js'

export interface Country {
  code: CountryCode
  name: string
  dialCode: string
  flag: string
}

// Base URL for flag images
const FLAG_BASE_URL = 'https://flagcdn.com/w20'

// Popular countries list
export const countries: Country[] = [
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: `${FLAG_BASE_URL}/ae.png` },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: `${FLAG_BASE_URL}/ar.png` },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: `${FLAG_BASE_URL}/at.png` },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: `${FLAG_BASE_URL}/au.png` },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: `${FLAG_BASE_URL}/be.png` },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: `${FLAG_BASE_URL}/br.png` },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: `${FLAG_BASE_URL}/ca.png` },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: `${FLAG_BASE_URL}/ch.png` },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: `${FLAG_BASE_URL}/cl.png` },
  { code: 'CN', name: 'China', dialCode: '+86', flag: `${FLAG_BASE_URL}/cn.png` },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: `${FLAG_BASE_URL}/co.png` },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: `${FLAG_BASE_URL}/cz.png` },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: `${FLAG_BASE_URL}/de.png` },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: `${FLAG_BASE_URL}/dk.png` },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: `${FLAG_BASE_URL}/eg.png` },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: `${FLAG_BASE_URL}/es.png` },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: `${FLAG_BASE_URL}/fi.png` },
  { code: 'FR', name: 'France', dialCode: '+33', flag: `${FLAG_BASE_URL}/fr.png` },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: `${FLAG_BASE_URL}/gb.png` },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: `${FLAG_BASE_URL}/gr.png` },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: `${FLAG_BASE_URL}/hu.png` },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: `${FLAG_BASE_URL}/id.png` },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: `${FLAG_BASE_URL}/ie.png` },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: `${FLAG_BASE_URL}/il.png` },
  { code: 'IN', name: 'India', dialCode: '+91', flag: `${FLAG_BASE_URL}/in.png` },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: `${FLAG_BASE_URL}/it.png` },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: `${FLAG_BASE_URL}/jp.png` },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: `${FLAG_BASE_URL}/ke.png` },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: `${FLAG_BASE_URL}/kr.png` },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: `${FLAG_BASE_URL}/lu.png` },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: `${FLAG_BASE_URL}/mx.png` },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: `${FLAG_BASE_URL}/my.png` },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: `${FLAG_BASE_URL}/ng.png` },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: `${FLAG_BASE_URL}/nl.png` },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: `${FLAG_BASE_URL}/no.png` },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: `${FLAG_BASE_URL}/nz.png` },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: `${FLAG_BASE_URL}/pe.png` },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: `${FLAG_BASE_URL}/ph.png` },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: `${FLAG_BASE_URL}/pl.png` },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: `${FLAG_BASE_URL}/pt.png` },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: `${FLAG_BASE_URL}/ro.png` },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: `${FLAG_BASE_URL}/ru.png` },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: `${FLAG_BASE_URL}/sa.png` },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: `${FLAG_BASE_URL}/se.png` },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: `${FLAG_BASE_URL}/sg.png` },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: `${FLAG_BASE_URL}/th.png` },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: `${FLAG_BASE_URL}/tr.png` },
  { code: 'US', name: 'United States', dialCode: '+1', flag: `${FLAG_BASE_URL}/us.png` },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: `${FLAG_BASE_URL}/vn.png` },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: `${FLAG_BASE_URL}/za.png` },
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
