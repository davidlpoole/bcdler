let downloadedUrls = []

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.startsWith('https://t4.bcbits.com/stream')) {
      if (!downloadedUrls.includes(details.url)) {
        downloadedUrls.push(details.url)
        browser.downloads.download({
          url: details.url,
          filename: `test.mp3`,
        })
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)
