const checkForButton = document.querySelector('#bcdler-download-button')
if (checkForButton) checkForButton.remove()

// inject the download button into the page
const downloadButton = document.createElement('button')
downloadButton.id = 'bcdler-download-button'
downloadButton.textContent = 'Download album'
downloadButton.style.position = 'relative'
downloadButton.style.marginTop = '10px'
downloadButton.style.zIndex = '9999'
downloadButton.addEventListener('click', getTracks)
document.querySelector('#name-section').appendChild(downloadButton)

function getTracks() {
  // get the artist and album name from the page title
  const title = document.title
  const parts = title.split(' | ')
  const albumName = parts[0]
  const artistName = parts[1]

  // TODO: get the album artwork

  const track_table = document.querySelector('#track_table')
  const rows = track_table.querySelectorAll('tr')
  const tracks = []

  // get the track details by looping over the rows
  for (const row of rows) {
    const track = row.querySelectorAll('td')
    const trackDetails = { artistName, albumName }

    for (const cell of track) {
      switch (cell.className) {
        case 'play-col': // store the play button so we can click it later
          const playLink = cell.querySelector('.play_status')
          trackDetails.click = () => playLink.click()
          break
        case 'track-number-col': // store the track number
          trackDetails.trackNumber = parseInt(cell.innerText.trim(), 10)
          break
        case 'title-col': // store the track title
          const trackTitle = cell.querySelector('.track-title')
          trackDetails.trackTitle = trackTitle.innerText.trim()
          break
      }
    }
    tracks.push(trackDetails)
  }

  // send a message to the background script to download each track
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
          track.click() // click the play button to start the network request
        })
        .catch((error) => {
          console.error('Error sending message:', error)
        })
        .finally(() => {
          track.click() // click the play again to sotp playing
          console.log('Done.', track.trackNumber, track.trackTitle)
        })
    }, 500 * track.trackNumber - 1) // TODO: optimise this number
  }
}
