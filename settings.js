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
  gistTokenInput.addEventListener("input", updateFilenameOptions)
  gistIdInput.addEventListener("input", updateFilenameOptions)
  gistFilenameInput.addEventListener("change", handleFilenameChange)

  function loadSettings() {
    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      gistTokenInput.value = items.gistToken || ""
      gistIdInput.value = items.gistId || ""
      gistFilenameInput.value = items.gistFilename || ""
      
      // If we have token and gistId, load the filename options
      if (items.gistToken && items.gistId) {
        updateFilenameOptions()
      }
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
  
  function fetchGistFiles(token, gistId) {
    if (!token || !gistId) return Promise.resolve([])
    
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
        if (!data.files) {
          return []
        }
        // Extract filenames from the Gist data
        return Object.keys(data.files)
      })
      .catch((error) => {
        console.error("Error fetching Gist files:", error)
        return []
      })
  }
  
  function updateFilenameOptions() {
    const token = gistTokenInput.value.trim()
    const gistId = gistIdInput.value.trim()
    
    // Clear existing options
    filenameOptions.innerHTML = ""
    
    if (token && gistId) {
      // Show loading indicator in the input
      gistFilenameInput.placeholder = "Loading filenames..."
      
      // Add a visual indicator to show loading state
      const originalBorderColor = gistFilenameInput.style.borderColor
      gistFilenameInput.style.borderColor = 'var(--border-color)'
      gistFilenameInput.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2386868b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83\' stroke-dasharray=\'32\' stroke-dashoffset=\'32\' style=\'animation: dash 1s linear infinite\' /%3E%3Cstyle%3E@keyframes dash{to{stroke-dashoffset:0}}%3C/style%3E%3C/svg%3E")';
      gistFilenameInput.style.backgroundRepeat = 'no-repeat';
      gistFilenameInput.style.backgroundPosition = 'right 16px center';
      gistFilenameInput.style.backgroundSize = '16px';
      
      fetchGistFiles(token, gistId)
        .then(filenames => {
          // Add each filename as an option
          filenames.forEach(filename => {
            const option = document.createElement("option")
            option.value = filename
            filenameOptions.appendChild(option)
          })
          
          // Reset placeholder and styling
          gistFilenameInput.placeholder = "Select or enter a filename"
          gistFilenameInput.style.borderColor = originalBorderColor
          gistFilenameInput.style.backgroundImage = ''
          
          // If we have a current filename that's not in the list, add it
          const currentFilename = gistFilenameInput.value.trim()
          if (currentFilename && !filenames.includes(currentFilename)) {
            const option = document.createElement("option")
            option.value = currentFilename
            filenameOptions.appendChild(option)
          }
          
          // Show a tooltip or visual indicator that dropdown is available
          if (filenames.length > 0) {
            // Brief visual feedback to indicate options are available
            gistFilenameInput.style.borderColor = 'var(--primary-color)'
            setTimeout(() => {
              gistFilenameInput.style.borderColor = originalBorderColor
            }, 300)
          }
        })
        .catch(error => {
          console.error("Error loading filenames:", error)
          gistFilenameInput.placeholder = "Enter the filename in your Gist"
          gistFilenameInput.style.borderColor = originalBorderColor
          gistFilenameInput.style.backgroundImage = ''
        })
    }
  }

  function goBack() {
    window.location.href = "popup.html"
  }

  function handleFilenameChange() {
    // When user selects a filename from the dropdown, provide visual feedback
    const selectedFilename = gistFilenameInput.value.trim()
    if (selectedFilename) {
      // Brief visual feedback
      const originalBorderColor = gistFilenameInput.style.borderColor
      gistFilenameInput.style.borderColor = 'var(--primary-color)'
      setTimeout(() => {
        gistFilenameInput.style.borderColor = originalBorderColor
      }, 300)
    }
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

