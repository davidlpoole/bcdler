let downloadedUrls = []

browser.browserAction.onClicked.addListener(downloadAlbum)

function downloadAlbum() {
  // send message to content script to get the artist and album name from page title
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { type: 'getTracks' })
  })
}

// Listen for messages from the content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'addDownloadListener') {
    const { trackDetails } = message
    console.log('Adding a download listener for:', trackDetails.trackTitle)

    const listener = addDownloadListener(trackDetails)

    browser.webRequest.onBeforeRequest.addListener(
      listener,
      { urls: ['<all_urls>'] },
      ['blocking']
    )

    sendResponse({ response: 'added the listener!' })
  }
})

function addDownloadListener(trackDetails) {
  let onBeforeRequestListener = (details) => {
    console.log('downloading')
    let fileName = `${trackDetails.artistName} - ${trackDetails.albumName} - ${trackDetails.trackTitle}.mp3`
    if (details.url.startsWith('https://t4.bcbits.com/stream')) {
      if (!downloadedUrls.includes(details.url)) {
        downloadedUrls.push(details.url)

        browser.downloads.download({
          url: details.url,
          filename: fileName || 'track.mp3',
        })

        // Remove the listener after the download has started.
        browser.webRequest.onBeforeRequest.removeListener(
          onBeforeRequestListener
        )
      }
    }
  }
  return onBeforeRequestListener
}
