import { createIcons, icons } from 'lucide'

function callIcons() {
  createIcons({ icons: { ...icons } })
}

// Global'e ekleyelim
declare global {
  interface Window {
    callIcons: () => void
  }
}

window.callIcons = callIcons

document.addEventListener('DOMContentLoaded', () => {
  window.callIcons()
})

export { createIcons, icons, callIcons }
