// listen for getArtistAndAlbum messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'getTracks') {
    // get the artist and album name from the page title
    const title = document.title
    const parts = title.split(' | ')
    const artistName = parts[0]
    const albumName = parts[1]

    console.log('Artist:', artistName)
    console.log('Album:', albumName)

    const track_table = document.querySelector('#track_table')
    const rows = track_table.querySelectorAll('tr')
    console.log(rows)

    for (const row of rows) {
      const track = row.querySelectorAll('td')
      const trackDetails = { artistName, albumName }
      for (const cell of track) {
        switch (cell.className) {
          case 'play-col':
            console.log(cell)
            break
          case 'track-number-col':
            trackDetails.trackNumber = parseInt(cell.innerText.trim(), 10)
            break
          case 'title-col':
            const trackTitle = cell.querySelector('.track-title')
            trackDetails.trackTitle = trackTitle.innerText.trim()
            break
        }
      }
      console.log(trackDetails)
    }

    // browser.runtime.sendMessage({
    //   type: 'artistAndAlbum',
    //   artistName,
    //   albumName,
    // })
  }
})

// // Listen for messages from the background script
// browser.runtime.onMessage.addListener(function (message) {
//   if (message.type === 'getTrackAndAlbumNames') {
//     // Get the track details from the DOM
//     const url = message.url
//     const { trackName, albumName, artistName } = getTrackAndAlbumNames()

//     // Send the track and album names to the background script
//     browser.runtime.sendMessage({
//       type: 'trackDetails',
//       details: { trackName, albumName, artistName, url },
//     })
//   }
// })

// function getTrackAndAlbumNames() {
//   const nameSection = document.querySelector('#name-section')

//   if (nameSection) {
//     const trackElement = nameSection.querySelector('.trackTitle')
//     const albumElement = nameSection.querySelector('.albumTitle')

//     const trackName = trackElement ? trackElement.innerText.trim() : ''
//     const fromAlbumByArtist = albumElement ? albumElement.innerText.trim() : ''

//     const { albumName, artistName } = parseArtistAlbum(fromAlbumByArtist)

//     return { trackName, albumName, artistName }
//   } else {
//     return { trackName: '', albumName: '', artistName: '' }
//   }
// }

// function parseArtistAlbum(fromAlbumByArtist) {
//   if (fromAlbumByArtist.startsWith('from ')) {
//     fromAlbumByArtist = fromAlbumByArtist.substring(5)
//   }

//   const parts = fromAlbumByArtist.split(' by ')
//   const albumName = parts[0]
//   const artistName = parts.slice(1).join(' by ')

//   return {
//     albumName,
//     artistName,
//   }
// }
