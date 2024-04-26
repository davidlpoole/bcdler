let downloading = false
let downloadedUrls = []

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (downloading && details.url.startsWith('https://t4.bcbits.com/stream')) {
      if (!downloadedUrls.includes(details.url)) {
        downloadedUrls.push(details.url)
        browser.downloads.download({ url: details.url })
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)

browser.runtime.onMessage.addListener((message) => {
  if (message === 'startDownload') {
    downloading = true
    downloadedUrls = []
  } else if (message === 'stopDownload') {
    downloading = false
  }
})
