// Listen for messages from the background script
browser.runtime.onMessage.addListener(function (message) {
  if (message.type === 'getTrackAndAlbumNames') {
    // Get the track details from the DOM
    const url = message.url
    const [trackName, albumName, artistName] = getTrackAndAlbumNames()

    // Send the track and album names to the background script
    browser.runtime.sendMessage({
      type: 'trackDetails',
      details: [trackName, albumName, artistName, url],
    })
  }
})

function getTrackAndAlbumNames() {
  const nameSection = document.querySelector('#name-section')
  console.log(nameSection)
  if (nameSection) {
    const trackElement = nameSection.querySelector('.trackTitle')
    const albumElement = nameSection.querySelector('.albumTitle')

    const trackName = trackElement ? trackElement.innerText.trim() : ''
    const albumName = albumElement ? albumElement.innerText.trim() : ''
    const artistName = albumElement
      ? albumElement.querySelectorAll('span')[1].textContent.trim()
      : ''

    return [trackName, albumName, artistName]
  }

  return ['', '', '']
}
