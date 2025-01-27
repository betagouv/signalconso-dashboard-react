// https://tally.so/help/developer-resources#85b0ab91621742cdb600183f9c261fae
export const initTally = () => {
  const widgetScriptSrc = 'https://tally.so/widgets/embed.js'

  const load = () => {
    // Load Tally embeds
    if (typeof (window as any).Tally !== 'undefined') {
      ;(window as any).Tally.loadEmbeds()
      return
    }

    // Fallback if window.Tally is not available
    document
      .querySelectorAll('iframe[data-tally-src]:not([src])')
      .forEach((iframeEl: any) => {
        iframeEl.src = iframeEl.dataset.tallySrc
      })
  }

  // If Tally is already loaded, load the embeds
  if (typeof (window as any).Tally !== 'undefined') {
    load()
    return
  }

  // If the Tally widget script is not loaded yet, load it
  if (document.querySelector(`script[src="${widgetScriptSrc}"]`) === null) {
    const script = document.createElement('script')
    script.src = widgetScriptSrc
    script.onload = load
    script.onerror = load
    document.body.appendChild(script)
    return
  }
}
