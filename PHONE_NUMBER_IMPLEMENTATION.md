# Phone Number Implementation

This document describes the implementation of E.164 phone number validation and country selection in the Tawk.to Weather App.

## Features

✅ **E.164 Format Validation**: All phone numbers are validated and stored in E.164 international format
✅ **Country Selection**: Users can select from 50+ popular countries
✅ **International Display**: Phone numbers are displayed in international format for better UX
✅ **Real-time Validation**: Phone numbers are validated as the user types
✅ **Responsive Design**: Works on mobile and desktop devices

## Components

### PhoneNumberInput
Located: `src/components/atoms/PhoneNumberInput.vue`

A comprehensive phone number input component that combines:
- Country selector dropdown
- Phone number input field
- Real-time E.164 validation
- Error messaging
- Helper text

**Props:**
- `modelValue` (string): E.164 formatted phone number
- `countryCode` (CountryCode): Selected country code
- `label` (string): Field label
- `placeholder` (string): Input placeholder
- `readonly` (boolean): Read-only mode
- `required` (boolean): Required field validation
- `helperText` (string): Helper text below input

**Events:**
- `update:modelValue`: Emits E.164 formatted phone number
- `update:countryCode`: Emits selected country code
- `validation`: Emits validation state (isValid, error)

### CountrySelector
Located: `src/components/atoms/CountrySelector.vue`

A dropdown component for selecting countries with:
- Flag icons
- Country names
- Dial codes
- Search functionality (built into Vuetify v-select)

## Utilities

### phoneNumber.ts
Located: `src/utils/phoneNumber.ts`

Provides utilities for phone number handling:
- `validateAndFormatPhoneNumber()`: Validates and formats to E.164
- `formatPhoneNumberForDisplay()`: Formats for display (national format)
- `formatE164ForDisplay()`: Formats E.164 for international display
- `isValidPhoneForCountry()`: Validates phone number for specific country
- `getCountryByCode()`: Gets country data by code

## Store Updates

### ProfileStore
The profile store has been updated to handle:
- E.164 phone number storage
- Country code tracking
- International phone number display

## Usage Example

```vue
<template>
  <PhoneNumberInput
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    label="Phone Number"
    helper-text="Enter your phone number in international format"
    required
    @validation="handleValidation"
  />
</template>

<script setup>
import PhoneNumberInput from '@/components/atoms/PhoneNumberInput.vue'

const phoneNumber = ref('')
const countryCode = ref('US')

const handleValidation = (isValid, error) => {
  console.log('Phone validation:', { isValid, error })
}
</script>
```

## Supported Countries

The implementation includes 50+ popular countries including:
- United States 🇺🇸 (+1)
- Canada 🇨🇦 (+1)
- United Kingdom 🇬🇧 (+44)
- Germany 🇩🇪 (+49)
- France 🇫🇷 (+33)
- Japan 🇯🇵 (+81)
- Australia 🇦🇺 (+61)
- And many more...

## Dependencies

- `libphonenumber-js`: Phone number parsing and validation
- Vuetify: UI components
- Vue 3: Reactive framework

## Migration Notes

When updating existing profiles:
1. Old phone numbers will be preserved as-is
2. New phone numbers will be stored in E.164 format
3. The display will automatically format both old and new numbers appropriately

## Testing

To test the phone number functionality:
1. Go to the Profile page
2. Click "EDIT" button
3. Try entering different phone numbers with different countries
4. Verify E.164 validation works
5. Check that the display format is correct

## E.164 Format Examples

- US: +1234567890
- UK: +447911123456
- Germany: +4930123456
- Japan: +819012345678
