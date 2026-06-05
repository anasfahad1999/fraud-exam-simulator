const config = {
  disableContextMenu: true,
  blockDevtoolsKeys: true,
  disableTextSelection: false,
  disableCopy: false,
  disableImageDrag: true,
}

export function installClientFriction(): void {
  if (typeof document === 'undefined') return

  if (config.disableContextMenu) {
    document.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  if (config.disableCopy) {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('copy', block)
    document.addEventListener('cut', block)
  }

  if (config.disableTextSelection) {
    const style = document.createElement('style')
    style.textContent = '*{-webkit-user-select:none;-ms-user-select:none;user-select:none}'
    document.head.appendChild(style)
  }

  if (config.disableImageDrag) {
    document.addEventListener('dragstart', (e) => {
      if ((e.target as HTMLElement)?.tagName === 'IMG') e.preventDefault()
    })
  }

  if (config.blockDevtoolsKeys) {
    document.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase()
      const isBlocked =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.ctrlKey && k === 'u')
      if (isBlocked) e.preventDefault()
    })
  }
}
