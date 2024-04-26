let downloadedUrls = []

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.startsWith('https://t4.bcbits.com/stream')) {
      if (!downloadedUrls.includes(details.url)) {
        downloadedUrls.push(details.url)

        // Send a message to the content script to get the track and album names
        browser.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
              type: 'getTrackAndAlbumNames',
              url: details.url,
            })
          }
        )
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
)

browser.runtime.onMessage.addListener(function (message) {
  if (message.type === 'trackDetails') {
    const [trackName, albumName, artistName, url] = message.details
    let fileName

    if (trackName && albumName && artistName) {
      fileName = `${trackName} ${albumName}.mp3`
    }
    browser.downloads.download({
      url,
      filename: fileName || 'track.mp3',
    })
  }
})
