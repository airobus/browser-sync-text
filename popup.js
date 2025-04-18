document.addEventListener("DOMContentLoaded", () => {
  // Main UI elements
  const textArea = document.getElementById("textContent")
  const uploadBtn = document.getElementById("uploadBtn")
  const downloadBtn = document.getElementById("downloadBtn")
  const statusElement = document.getElementById("status")
  const settingsLink = document.getElementById("settingsLink")
  
  // Settings panel elements
  const settingsPanel = document.getElementById("settingsPanel")
  const backLink = document.getElementById("backLink")
  const gistTokenInput = document.getElementById("gistToken")
  const gistIdInput = document.getElementById("gistId")
  const gistFilenameInput = document.getElementById("gistFilename")
  const saveBtn = document.getElementById("saveBtn")
  const settingsStatusElement = document.getElementById("settingsStatus")
  
  // 防抖函数，用于优化resize事件
  function debounce(func, wait) {
    let timeout
    return function() {
      const context = this
      const args = arguments
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(context, args), wait)
    }
  }

  // Check if settings are configured
  checkSettings()
  
  // Automatically load data when popup opens
  autoLoadData()

  // 优化文本框性能
  optimizeTextAreaPerformance()
  
  // 添加自动保存功能
  setupAutoSave()

  // Main UI event listeners
  uploadBtn.addEventListener("click", uploadText)
  downloadBtn.addEventListener("click", downloadText)
  settingsLink.addEventListener("click", toggleSettingsPanel)
  
  // Settings panel event listeners
  backLink.addEventListener("click", toggleSettingsPanel)
  saveBtn.addEventListener("click", saveSettings)

  function checkSettings() {
    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      const isConfigured = items.gistToken && items.gistId && items.gistFilename

      uploadBtn.disabled = !isConfigured
      downloadBtn.disabled = !isConfigured

      if (!isConfigured) {
        setStatus("Please configure your settings first")
      } else {
        setStatus("Loading data...")
      }
    })
  }
  
  function autoLoadData() {
    chrome.storage.sync.get(["gistToken", "gistId", "gistFilename"], (items) => {
      const { gistToken, gistId, gistFilename } = items
      
      if (gistToken && gistId && gistFilename) {
        // First try to load from local cache
        const cacheKey = `gist_${gistId}_${gistFilename}`
        chrome.storage.local.get([cacheKey], (result) => {
          if (result[cacheKey]) {
            textArea.value = result[cacheKey]
            setStatus("Data loaded from cache!", 'success')
            return
          }
          
          // If no cache, download from GitHub
          fetchGist(gistToken, gistId, gistFilename)
            .then((content) => {
              textArea.value = content
              // Save to local cache
              chrome.storage.local.set({ [cacheKey]: content })
              setStatus("Data loaded successfully!", 'success')
            })
            .catch((error) => {
              setStatus(`Error: ${error.message}`, 'error')
              console.error("Auto-load error:", error)
            })
        })
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
          // Update local cache
          const cacheKey = `gist_${gistId}_${gistFilename}`
          chrome.storage.local.set({ [cacheKey]: text })
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
          // Update local cache
          const cacheKey = `gist_${gistId}_${gistFilename}`
          chrome.storage.local.set({ [cacheKey]: content })
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

  function toggleSettingsPanel() {
    const isSettingsPanelActive = settingsPanel.classList.contains('active')
    
    if (isSettingsPanelActive) {
      // Hide settings panel
      settingsPanel.classList.remove('active')
    } else {
      // Show settings panel and load current settings
      settingsPanel.classList.add('active')
      loadSettings()
    }
  }
  
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
      setSettingsStatus("Please fill in all fields", 'error')
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
            setSettingsStatus("Settings saved successfully!", 'success')
            
            // Update main UI status and buttons
            setStatus("Settings updated. Ready to sync.", 'success')
            uploadBtn.disabled = false
            downloadBtn.disabled = false

            // Clear status after 2 seconds but don't automatically toggle panel
            // This prevents the bug where clicking back and then having the timeout
            // toggle the panel again
            setTimeout(() => {
              setSettingsStatus("")
            }, 2000)
            
            // Return to main panel immediately
            toggleSettingsPanel()
          },
        )
      })
      .catch((error) => {
        setSettingsStatus(`Error: ${error.message}`, 'error')
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
  
  function setSettingsStatus(message, type = 'default') {
    settingsStatusElement.textContent = message
    
    // Reset all classes
    settingsStatusElement.classList.remove('success', 'error')
    
    // Add appropriate class based on message type
    if (type === 'success') {
      settingsStatusElement.classList.add('success')
    } else if (type === 'error') {
      settingsStatusElement.classList.add('error')
    }
  }
  
  // 优化文本框性能的函数
  function optimizeTextAreaPerformance() {
    // 使用被动事件监听器减少事件处理开销
    textArea.addEventListener('scroll', () => {}, { passive: true })
    
    // 使用防抖函数处理resize事件
    const debouncedResize = debounce(() => {
      // 在resize结束后执行的操作
      // 这里可以留空，因为我们只是想减少事件触发频率
    }, 100) // 100ms的防抖延迟
    
    // 监听文本框的resize事件
    // 注意：这是通过监听mouseup来模拟resize结束事件
    textArea.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', debouncedResize)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', debouncedResize)
      }, { once: true })
    })
  }

  // 设置自动保存功能
  function setupAutoSave() {
    // 创建防抖的自动保存函数，延迟500毫秒
    const debouncedAutoSave = debounce(function() {
      const text = textArea.value
      
      // 获取当前设置的Gist信息
      chrome.storage.sync.get(["gistId", "gistFilename"], (items) => {
        const { gistId, gistFilename } = items
        
        if (gistId && gistFilename) {
          // 创建缓存键
          const cacheKey = `gist_${gistId}_${gistFilename}`
          
          // 保存到本地缓存
          chrome.storage.local.set({ [cacheKey]: text }, () => {
            console.log("文本已自动保存到缓存")
            
            // 可选：显示一个短暂的自动保存提示
            const tempStatus = document.createElement("div")
            tempStatus.className = "auto-save-indicator"
            tempStatus.textContent = "已自动保存"
            tempStatus.style.position = "absolute"
            tempStatus.style.bottom = "10px"
            tempStatus.style.right = "10px"
            tempStatus.style.padding = "5px 10px"
            tempStatus.style.borderRadius = "4px"
            tempStatus.style.backgroundColor = "rgba(0, 128, 0, 0.2)"
            tempStatus.style.color = "green"
            tempStatus.style.fontSize = "12px"
            tempStatus.style.opacity = "0"
            tempStatus.style.transition = "opacity 0.3s ease"
            
            document.body.appendChild(tempStatus)
            
            // 显示提示
            setTimeout(() => {
              tempStatus.style.opacity = "1"
            }, 10)
            
            // 2秒后隐藏提示
            setTimeout(() => {
              tempStatus.style.opacity = "0"
              
              // 完全隐藏后移除元素
              setTimeout(() => {
                document.body.removeChild(tempStatus)
              }, 300)
            }, 2000)
          })
        }
      })
    }, 500)
    
    // 添加输入事件监听器
    textArea.addEventListener("input", debouncedAutoSave)
  }
})

