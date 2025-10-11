;(async () => {
  // Cek apakah user sudah login
  if (!window.Auth?.isLoggedIn()) {
    location.href = "login.html"
    return
  }

  // Show loading state
  const showLoading = (show) => {
    const elements = ["userEmail", "userCreated"]
    elements.forEach((id) => {
      const el = document.getElementById(id)
      if (el) el.textContent = show ? "Memuat..." : "-"
    })
  }

  showLoading(true)

  const API = window.API
  if (!API) {
    console.error("API belum dimuat. Pastikan config.js dan api.js dimuat sebelum profile.js")
    alert("Konfigurasi API belum dimuat. Muat ulang halaman.")
    throw new Error("API not loaded")
  }

  try {
    // Fetch profile data dari backend
    const data = await API.fetchJSON("/profile")

    // Update user info
    const email = data?.user?.email || window.Auth.getUser()?.email || "-"
    const created = data?.user?.created_at || window.Auth.getUser()?.created_at || "-"

    document.getElementById("userEmail").textContent = email

    // Format tanggal dengan lebih baik
    try {
      const createdDate = new Date(created)
      document.getElementById("userCreated").textContent = createdDate.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      document.getElementById("userCreated").textContent = created
    }

    // Helper function untuk render list
    function renderList(elementId, items, mapper) {
      const ul = document.getElementById(elementId)
      if (!ul) return

      ul.innerHTML = ""

      if (!items || items.length === 0) {
        const li = document.createElement("li")
        li.textContent = "Belum ada data"
        li.style.color = "#999"
        li.style.fontStyle = "italic"
        ul.appendChild(li)
        return
      }

      items.forEach((item) => {
        const li = document.createElement("li")
        const mapped = mapper(item)

        if (mapped instanceof Node) {
          li.appendChild(mapped)
        } else {
          li.textContent = String(mapped)
        }

        li.style.marginBottom = "0.5rem"
        ul.appendChild(li)
      })
    }

    // Render learning progress
    renderList("learningProgress", data.learning || [], (item) => {
      const date = new Date(item.at).toLocaleString("id-ID")
      return `${item.module} • ${item.action} • ${date}`
    })

    // Render flashcard progress - ambil progress terbaru per modul
    const flashcardsByModule = {}
    ;(data.flashcards || []).forEach((item) => {
      const module = item.module || "Modul"
      const timestamp = new Date(item.at).getTime()
      
      // Simpan hanya yang terbaru per modul
      if (!flashcardsByModule[module] || 
          new Date(flashcardsByModule[module].at).getTime() < timestamp) {
        flashcardsByModule[module] = item
      }
    })

    const latestFlashcards = Object.values(flashcardsByModule)
    
    renderList("flashcardProgress", latestFlashcards, (item) => {
      const current = Number(item.current || 0)
      const total = Math.max(1, Number(item.total || 0))
      const pct = Math.max(0, Math.min(100, Math.round((current / total) * 100)))

      const wrapper = document.createElement("div")
      wrapper.style.display = "flex"
      wrapper.style.flexDirection = "column"
      wrapper.style.gap = "0.25rem"

      const header = document.createElement("div")
      header.style.display = "flex"
      header.style.justifyContent = "space-between"
      header.style.alignItems = "center"

      const title = document.createElement("span")
      title.textContent = item.module || "Modul"

      const percent = document.createElement("span")
      percent.textContent = pct + "%"
      percent.style.fontWeight = "600"
      percent.style.color = pct === 100 ? "#10b981" : "#6b7280"

      header.appendChild(title)
      header.appendChild(percent)

      const bar = document.createElement("div")
      bar.setAttribute("role", "progressbar")
      bar.setAttribute("aria-valuemin", "0")
      bar.setAttribute("aria-valuemax", "100")
      bar.setAttribute("aria-valuenow", String(pct))
      bar.style.width = "100%"
      bar.style.height = "8px"
      bar.style.background = "#e5e7eb"
      bar.style.borderRadius = "9999px"
      bar.style.overflow = "hidden"

      const fill = document.createElement("div")
      fill.style.width = pct + "%"
      fill.style.height = "100%"
      fill.style.background = pct === 100 ? "#10b981" : "#3b82f6"
      fill.style.borderRadius = "9999px"
      fill.style.transition = "width 0.3s ease"

      bar.appendChild(fill)

      const sub = document.createElement("span")
      sub.textContent = `${current}/${total} kartu`
      sub.style.fontSize = "12px"
      sub.style.color = "#6b7280"

      wrapper.appendChild(header)
      wrapper.appendChild(bar)
      wrapper.appendChild(sub)
      return wrapper
    })

    // Render quiz results
    renderList("quizResults", data.quizzes || [], (item) => {
      const score = Number(item.score || 0)
      const total = Math.max(1, Number(item.total || 0))
      const percentage = Math.round((score / total) * 100)
      return `${item.module || "Kuis"} — ${score}/${total} (${percentage}%)`
    })

    // Render game stats
    ;(() => {
      const games = data.games || []
      const completedByGame = games
        .filter((g) => (g.metric || "").toLowerCase() === "completed")
        .reduce((acc, g) => {
          const key = (g.game || "game").toLowerCase()
          const val = Number(g.value || 0)
          acc[key] = (acc[key] || 0) + (isNaN(val) ? 0 : val)
          return acc
        }, {})

      // Mapping nama ramah pengguna
      const pretty = (key) => {
        if (key === "acid-base-mixer") return "Acid-Base Mixer"
        if (key === "periodic-table") return "Periodic Table"
        return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      }

      const summaryItems = Object.keys(completedByGame).map((k) => ({
        label: `${pretty(k)} — ${completedByGame[k]}x selesai`,
      }))

      const elementId = "gameStats"
      const ul = document.getElementById(elementId)
      if (!ul) return

      ul.innerHTML = ""

      if (summaryItems.length === 0) {
        const li = document.createElement("li")
        li.textContent = "Belum ada data"
        li.style.color = "#999"
        li.style.fontStyle = "italic"
        ul.appendChild(li)
      } else {
        summaryItems.forEach(({ label }) => {
          const li = document.createElement("li")
          li.textContent = label
          li.style.marginBottom = "0.5rem"
          ul.appendChild(li)
        })
      }
    })()

    console.log("✅ Profile loaded successfully:", data)
  } catch (error) {
    console.error("❌ Error loading profile:", error)

    showLoading(false)

    // Tampilkan pesan error yang lebih informatif
    let errorMessage = "Gagal memuat profil. "

    if (error.message.includes("Failed to fetch")) {
      errorMessage += "Backend tidak dapat dijangkau. Pastikan backend berjalan di http://localhost:8000"
    } else if (error.message.includes("Unauthorized") || error.message.includes("401")) {
      errorMessage += "Sesi Anda telah berakhir. Silakan login kembali."
    } else {
      errorMessage += error.message || "Silakan muat ulang halaman."
    }

    alert(errorMessage)

    // Jika error unauthorized, redirect ke login
    if (error.message.includes("Unauthorized") || error.message.includes("401")) {
      setTimeout(() => {
        location.href = "login.html"
      }, 1000)
    }
  }
})()