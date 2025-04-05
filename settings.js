document.addEventListener("DOMContentLoaded", () => {
  const gistTokenInput = document.getElementById("gistToken")
  const gistIdInput = document.getElementById("gistId")
  const gistFilenameInput = document.getElementById("gistFilename")
  const saveBtn = document.getElementById("saveBtn")
  const statusElement = document.getElementById("status")
  const backLink = document.getElementById("backLink")

  // Load saved settings
  loadSettings()

  // Event listeners
  saveBtn.addEventListener("click", saveSettings)
  backLink.addEventListener("click", goBack)

  function loadSettings() {
    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      gistTokenInput.value = items.gistToken || ""
      gistIdInput.value = items.gistId || ""
      gistFilenameInput.value = items.gistFilename || ""
    })
  }

  function saveSettings() {
    const gistToken = gistTokenInput.value.trim()
    const gistId = gistIdInput.value.trim()
    const gistFilename = gistFilenameInput.value.trim()

    if (!gistToken || !gistId || !gistFilename) {
      setStatus("Please fill in all fields", 'error')
      return
    }

    // Validate token by making a test request
    validateGithubToken(gistToken)
      .then(() => {
        // Save settings
        chrome.storage.sync.set(
          {
            gistToken: gistToken,
            gistId: gistId,
            gistFilename: gistFilename,
          },
          () => {
            setStatus("Settings saved successfully!", 'success')

            // Clear status after 2 seconds
            setTimeout(() => {
              setStatus("")
            }, 2000)
          },
        )
      })
      .catch((error) => {
        setStatus(`Error: ${error.message}`, 'error')
      })
  }

  function validateGithubToken(token) {
    return fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Invalid GitHub token")
      }
      return response.json()
    })
  }

  function goBack() {
    window.location.href = "popup.html"
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

