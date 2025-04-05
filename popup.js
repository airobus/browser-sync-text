document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("textContent")
  const uploadBtn = document.getElementById("uploadBtn")
  const downloadBtn = document.getElementById("downloadBtn")
  const statusElement = document.getElementById("status")
  const settingsLink = document.getElementById("settingsLink")

  // Check if settings are configured
  checkSettings()

  // Event listeners
  uploadBtn.addEventListener("click", uploadText)
  downloadBtn.addEventListener("click", downloadText)
  settingsLink.addEventListener("click", openSettings)

  function checkSettings() {
    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      const isConfigured = items.gistToken && items.gistId && items.gistFilename

      uploadBtn.disabled = !isConfigured
      downloadBtn.disabled = !isConfigured

      if (!isConfigured) {
        setStatus("Please configure your settings first")
      } else {
        setStatus("")
      }
    })
  }

  function uploadText() {
    const text = textArea.value
    if (!text) {
      setStatus("Please enter some text to upload", 'error')
      return
    }

    setStatus("Uploading...")

    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      const { gistToken, gistId, gistFilename } = items

      updateGist(gistToken, gistId, gistFilename, text)
        .then(() => {
          setStatus("Text uploaded successfully!", 'success')
        })
        .catch((error) => {
          setStatus(`Error: ${error.message}`, 'error')
          console.error("Upload error:", error)
        })
    })
  }

  function downloadText() {
    setStatus("Downloading...")

    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      const { gistToken, gistId, gistFilename } = items

      fetchGist(gistToken, gistId, gistFilename)
        .then((content) => {
          textArea.value = content
          setStatus("Text downloaded successfully!", 'success')
        })
        .catch((error) => {
          setStatus(`Error: ${error.message}`, 'error')
          console.error("Download error:", error)
        })
    })
  }

  function updateGist(token, gistId, filename, content) {
    return fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          [filename]: {
            content: content,
          },
        },
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }
      return response.json()
    })
  }

  function fetchGist(token, gistId, filename) {
    return fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (!data.files || !data.files[filename]) {
          throw new Error(`File "${filename}" not found in the Gist`)
        }
        return data.files[filename].content
      })
  }

  function openSettings() {
    // Use optional chaining in case chrome.runtime is not available (e.g., in a test environment)
    chrome?.runtime?.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("settings.html"))
  }

  function setStatus(message, type = 'default') {
    statusElement.textContent = message
    
    // Reset all classes
    statusElement.classList.remove('success', 'error')
    
    // Add appropriate class based on message type
    if (type === 'success') {
      statusElement.classList.add('success')
    } else if (type === 'error') {
      statusElement.classList.add('error')
    }
  }
})

