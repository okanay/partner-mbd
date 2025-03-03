import {
  phoneCodesTR,
  phoneCodesEN,
  phoneCodesAR,
} from '../../constants/phone-code.js'
import PhoneCodeSearch from '../packages/phone-code-search.js'

document.addEventListener('DOMContentLoaded', () => {
  new PhoneCodeSearch({
    elements: {
      container: 'phone-container',
      select: 'country-code',
      flag: 'country-flag',
      prefix: 'country-prefix',
      phoneInput: 'phone-input',
      searchInput: 'phone-search-input',
      suggestions: 'phone-suggestions',
      searchModal: 'phone-search-modal',
      clearButton: 'phone-clear-button',
      afterFocusElement: 'phone-input',
    },
    languages: [
      {
        id: 'TR',
        data: phoneCodesTR,
      },
      {
        id: 'EN',
        data: phoneCodesEN,
      },
      {
        id: 'AR',
        data: phoneCodesAR,
      },
    ],
    defaultLanguage: 'EN',
  })
})
