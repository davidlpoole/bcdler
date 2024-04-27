let downloadedUrls = []

browser.browserAction.onClicked.addListener(downloadAlbum)

function downloadAlbum() {
  console.log('Downloading album...')
  // send message to content script to get the artist and album name from page title
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { type: 'getArtistAndAlbum' })
  })
}

browser.runtime.onMessage.addListener(function (message) {
  if (message.type === 'artistAndAlbum') {
    const { artistName, albumName } = message
    console.log('Artist:', artistName)
    console.log('Album:', albumName)
  }
})

// browser.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     if (details.url.startsWith('https://t4.bcbits.com/stream')) {
//       if (!downloadedUrls.includes(details.url)) {
//         downloadedUrls.push(details.url)

//         // Send a message to the content script to get the track and album names
//         browser.tabs.query(
//           { active: true, currentWindow: true },
//           function (tabs) {
//             browser.tabs.sendMessage(tabs[0].id, {
//               type: 'getTrackAndAlbumNames',
//               url: details.url,
//             })
//           }
//         )
//       }
//     }
//   },
//   { urls: ['<all_urls>'] },
//   ['blocking']
// )

// browser.runtime.onMessage.addListener(function (message) {
//   if (message.type === 'trackDetails') {
//     const { trackName, albumName, artistName, url } = message.details
//     let fileName

//     if (trackName && albumName && artistName) {
//       fileName = `${artistName} - ${albumName} - ${trackName}.mp3`
//     }
//     browser.downloads.download({
//       url,
//       filename: fileName || 'track.mp3',
//     })
//   }
// })
