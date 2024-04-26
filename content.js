// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message) {
  if (message.type === 'getTrackAndAlbumNames') {
    // Get the track details from the DOM
    const url = message.url
    const { trackName, albumName, artistName } = getTrackAndAlbumNames()

    // Send the track and album names to the background script
    browser.runtime.sendMessage({
      type: 'trackDetails',
      details: { trackName, albumName, artistName, url },
    })
  }
})

function getTrackAndAlbumNames() {
  const nameSection = document.querySelector('#name-section')

  if (nameSection) {
    const trackElement = nameSection.querySelector('.trackTitle')
    const albumElement = nameSection.querySelector('.albumTitle')

    const trackName = trackElement ? trackElement.innerText.trim() : ''
    const fromAlbumByArtist = albumElement ? albumElement.innerText.trim() : ''

    const { albumName, artistName } = parseArtistAlbum(fromAlbumByArtist)

    return { trackName, albumName, artistName }
  } else {
    return { trackName: '', albumName: '', artistName: '' }
  }
}

function parseArtistAlbum(fromAlbumByArtist) {
  if (fromAlbumByArtist.startsWith('from ')) {
    fromAlbumByArtist = fromAlbumByArtist.substring(5)
  }

  const parts = fromAlbumByArtist.split(' by ')
  const albumName = parts[0]
  const artistName = parts.slice(1).join(' by ')

  return {
    albumName,
    artistName,
  }
}
