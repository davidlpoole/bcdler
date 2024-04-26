function startDownload() {
  browser.runtime.sendMessage('startDownload')
}

function stopDownload() {
  browser.runtime.sendMessage('stopDownload')
}

// Listen for messages from the popup and start/stop downloading
browser.runtime.onMessage.addListener((message) => {
  if (message === 'startDownload') {
    startDownload()
  } else if (message === 'stopDownload') {
    stopDownload()
  }
})

// Check if the current URL matches the desired website
if (window.location.href.includes('https://merkabamusic1.bandcamp.com/')) {
  // Send a message to the popup to start downloading
  browser.runtime.sendMessage('startDownload')
}
