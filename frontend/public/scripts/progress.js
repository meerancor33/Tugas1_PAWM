;(() => {
  const API = window.API
  if (!API) return

  // Helper to format date to Indonesian format
  function formatIndonesianDate(date) {
    return new Date(date).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta"
    })
  }

  // Helper to parse integers safely
  function safeInt(str) {
    const n = Number.parseInt(String(str || "").replace(/\D+/g, ""), 10)
    return isNaN(n) ? 0 : n
  }

  // Debounce helper to prevent multiple rapid reports
  function debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Flashcard: Track progress per card navigation
  function initFlashcardProgress() {
    const pageId = location.pathname.split("/").pop()
    if (pageId !== "flashcard.html") return

    const counterEl = document.getElementById("cardCounter")
    const moduleTitleEl = document.getElementById("currentModuleTitle")
    let lastReportedProgress = ""

    const reportProgress = debounce(() => {
      if (!window.Auth?.isLoggedIn()) return
      
      const moduleTitle = moduleTitleEl?.textContent || "unknown"
      const text = counterEl?.textContent || "0 / 0"
      const parts = text.split("/").map((s) => safeInt(s))
      const current = parts[0] || 0
      const total = parts[1] || 0

      // Create unique key for this progress state
      const progressKey = `${moduleTitle}-${current}-${total}`
      
      // Only report if progress has changed and total > 0
      if (total > 0 && progressKey !== lastReportedProgress) {
        API.fetchJSON("/progress/flashcard", {
          method: "POST",
          body: {
            module: moduleTitle,
            current: current,
            total: total
          },
        })
        .then(() => {
          console.log(`✅ Flashcard progress saved: ${moduleTitle} (${current}/${total})`)
          lastReportedProgress = progressKey
        })
        .catch((err) => {
          console.warn("⚠️ Failed to save flashcard progress:", err)
        })
      }
    }, 800) // Increased debounce to reduce API calls

    // Track navigation events
    const trackElements = ["nextBtn", "prevBtn", "flashcard"]
    trackElements.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        el.addEventListener("click", () => {
          // Wait a bit for counter to update
          setTimeout(reportProgress, 100)
        })
      }
    })

    // Also track on initial load
    if (counterEl) {
      // Wait for initial render
      setTimeout(reportProgress, 500)
    }
  }

  // Quiz: Observe results and send score with Indonesian timestamp
  function initQuizProgress() {
    const pageId = location.pathname.split("/").pop()
    if (pageId !== "quiz.html") return

    const resultEl = document.getElementById("quiz-result")
    const scoreEl = document.getElementById("finalScore")
    const totalEl = document.getElementById("scoreTotal")
    let quizReported = false

    const reportQuiz = debounce(() => {
      if (!window.Auth?.isLoggedIn() || quizReported) return
      
      const style = getComputedStyle(resultEl)
      const visible = style.display !== "none" && !resultEl.classList.contains("hidden")
      
      if (visible) {
        const score = safeInt(scoreEl?.textContent)
        const total = safeInt(totalEl?.textContent)
        const subtitle = document.getElementById("quiz-subtitle")?.textContent || "Kuis Kimia"
        
        if (total > 0) {
          API.fetchJSON("/progress/quiz", {
            method: "POST",
            body: {
              module: subtitle,
              score,
              total
            },
          })
          .then(() => {
            console.log(`✅ Quiz result saved: ${subtitle} (${score}/${total})`)
            quizReported = true
          })
          .catch((err) => {
            console.warn("⚠️ Failed to save quiz result:", err)
          })
        }
      }
    }, 500)

    if (resultEl) {
      const observer = new MutationObserver(reportQuiz)
      observer.observe(resultEl, { attributes: true, attributeFilter: ["class", "style"] })
    }
  }

  // Games: Only track completions with responsive handling
  function initGamesProgress() {
    const page = location.pathname.split("/").pop()

    if (page === "acid-base-game.html") {
      let isCompleted = false
      let lastReportedTime = 0
      const REPORT_COOLDOWN = 60000 // 1 minute cooldown
      const resultEl = document.getElementById("result-info")

      if (resultEl) {
        const observer = new MutationObserver(() => {
          const txt = (resultEl.textContent || "").toLowerCase()
          if (txt.includes("pH hasil") && !txt.includes("kombinasi belum didukung")) {
            isCompleted = true
          } else if (txt.includes("kombinasi belum didukung")) {
            isCompleted = false
          }
        })
        observer.observe(resultEl, { childList: true, subtree: true })
      }

      const reportGame = debounce(() => {
        if (window.Auth?.isLoggedIn() && isCompleted) {
          const now = Date.now()
          if (now - lastReportedTime > REPORT_COOLDOWN) {
            API.fetchJSON("/progress/game", {
              method: "POST",
              body: {
                game: "acid-base-mixer",
                metric: "completed",
                value: 1
              },
            })
            .then(() => {
              console.log("✅ Game completion saved: Acid-Base Mixer")
              lastReportedTime = now
            })
            .catch((err) => {
              console.warn("⚠️ Failed to save game completion:", err)
            })
          }
        }
        isCompleted = false
      }, 500)

      document.getElementById("reset-button")?.addEventListener("click", reportGame)
    }

    if (page === "periodic-table-game.html") {
      let isCompleted = false
      let lastReportedTime = 0
      const REPORT_COOLDOWN = 60000 // 1 minute cooldown
      const fb = document.getElementById("feedback")

      if (fb) {
        const observer = new MutationObserver(() => {
          const txt = (fb.textContent || "").toLowerCase()
          if (txt.includes("congratulations") || txt.includes("selamat")) {
            isCompleted = true
          }
        })
        observer.observe(fb, { childList: true, subtree: true })
      }

      const reportGame = debounce(() => {
        if (window.Auth?.isLoggedIn() && isCompleted) {
          const now = Date.now()
          if (now - lastReportedTime > REPORT_COOLDOWN) {
            API.fetchJSON("/progress/game", {
              method: "POST",
              body: {
                game: "periodic-table",
                metric: "completed",
                value: 1
              },
            })
            .then(() => {
              console.log("✅ Game completion saved: Periodic Table")
              lastReportedTime = now
            })
            .catch((err) => {
              console.warn("⚠️ Failed to save game completion:", err)
            })
          }
        }
        isCompleted = false
      }, 500)

      document.getElementById("reset-game")?.addEventListener("click", reportGame)
    }
  }

  // Learning: Track module interactions with Indonesian timestamp
  function initLearningProgress() {
    const page = location.pathname.split("/").pop()
    if (page !== "pembelajaran.html") return
    
    document.querySelectorAll(".modules-grid .module-card a.btn-option").forEach((a) => {
      a.addEventListener("click", () => {
        if (!window.Auth?.isLoggedIn()) return
        
        const moduleTitle = a.closest(".module-card")?.querySelector("h3")?.textContent || "Modul"
        const kind = (a.textContent || "").trim().toLowerCase()
        
        API.fetchJSON("/progress/learning", {
          method: "POST",
          body: {
            module: moduleTitle,
            action: kind
          },
        })
        .then(() => {
          console.log(`✅ Learning action saved: ${moduleTitle} - ${kind}`)
        })
        .catch((err) => {
          console.warn("⚠️ Failed to save learning action:", err)
        })
      })
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    initFlashcardProgress()
    initQuizProgress()
    initGamesProgress()
    initLearningProgress()
  })
})()