// listen for getArtistAndAlbum messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'getTracks') {
    // get the artist and album name from the page title
    const title = document.title
    const parts = title.split(' | ')
    const artistName = parts[0]
    const albumName = parts[1]

    // TODO: get the album artwork

    const track_table = document.querySelector('#track_table')
    const rows = track_table.querySelectorAll('tr')
    const tracks = []

    for (const row of rows) {
      const track = row.querySelectorAll('td')
      const trackDetails = { artistName, albumName }
      for (const cell of track) {
        switch (cell.className) {
          case 'play-col':
            const playLink = cell.querySelector('.play_status')
            trackDetails.click = () => playLink.click()
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
      tracks.push(trackDetails)
    }

    for (const track of tracks) {
      setTimeout(() => {
        browser.runtime
          .sendMessage({
            type: 'addDownloadListener',
            trackDetails: {
              trackNumber: track.trackNumber,
              trackTitle: track.trackTitle,
              artistName: track.artistName,
              albumName: track.albumName,
            },
          })
          .then((response) => {
            console.log('Received response from background script:', response)
            track.click()
          })
          .catch((error) => {
            console.error('Error sending message:', error)
          })
          .finally(() => {
            console.log('Done.', track.trackNumber, track.trackTitle)
          })
      }, 500 * track.trackNumber - 1)
    }
  }
})
