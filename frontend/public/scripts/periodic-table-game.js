document.addEventListener("DOMContentLoaded", () => {
  const periodicTableGrid = document.getElementById("periodic-table-grid")
  const draggableElementsContainer = document.getElementById("draggable-elements")
  const feedbackElement = document.getElementById("feedback")
  const resetButton = document.getElementById("reset-game")

  // Simplified periodic table data (Atomic Number, Symbol, Name, Group, Period)
  const elements = [
    // Period 1
    { an: 1, symbol: "H", name: "Hydrogen", group: 1, period: 1 },
    { an: 2, symbol: "He", name: "Helium", group: 18, period: 1 },

    // Period 2
    { an: 3, symbol: "Li", name: "Lithium", group: 1, period: 2 },
    { an: 4, symbol: "Be", name: "Beryllium", group: 2, period: 2 },
    { an: 5, symbol: "B", name: "Boron", group: 13, period: 2 },
    { an: 6, symbol: "C", name: "Carbon", group: 14, period: 2 },
    { an: 7, symbol: "N", name: "Nitrogen", group: 15, period: 2 },
    { an: 8, symbol: "O", name: "Oxygen", group: 16, period: 2 },
    { an: 9, symbol: "F", name: "Fluorine", group: 17, period: 2 },
    { an: 10, symbol: "Ne", name: "Neon", group: 18, period: 2 },

    // Period 3
    { an: 11, symbol: "Na", name: "Sodium", group: 1, period: 3 },
    { an: 12, symbol: "Mg", name: "Magnesium", group: 2, period: 3 },
    { an: 13, symbol: "Al", name: "Aluminum", group: 13, period: 3 },
    { an: 14, symbol: "Si", name: "Silicon", group: 14, period: 3 },
    { an: 15, symbol: "P", name: "Phosphorus", group: 15, period: 3 },
    { an: 16, symbol: "S", name: "Sulfur", group: 16, period: 3 },
    { an: 17, symbol: "Cl", name: "Chlorine", group: 17, period: 3 },
    { an: 18, symbol: "Ar", name: "Argon", group: 18, period: 3 },

    // Period 4
    { an: 19, symbol: "K", name: "Potassium", group: 1, period: 4 },
    { an: 20, symbol: "Ca", name: "Calcium", group: 2, period: 4 },
    { an: 31, symbol: "Ga", name: "Gallium", group: 13, period: 4 },
    { an: 32, symbol: "Ge", name: "Germanium", group: 14, period: 4 },
    { an: 33, symbol: "As", name: "Arsenic", group: 15, period: 4 },
    { an: 34, symbol: "Se", name: "Selenium", group: 16, period: 4 },
    { an: 35, symbol: "Br", name: "Bromine", group: 17, period: 4 },
    { an: 36, symbol: "Kr", name: "Krypton", group: 18, period: 4 },

    // Period 5
    { an: 37, symbol: "Rb", name: "Rubidium", group: 1, period: 5 },
    { an: 38, symbol: "Sr", name: "Strontium", group: 2, period: 5 },
    { an: 49, symbol: "In", name: "Indium", group: 13, period: 5 },
    { an: 50, symbol: "Sn", name: "Tin", group: 14, period: 5 },
    { an: 51, symbol: "Sb", name: "Antimony", group: 15, period: 5 },
    { an: 52, symbol: "Te", name: "Tellurium", group: 16, period: 5 },
    { an: 53, symbol: "I", name: "Iodine", group: 17, period: 5 },
    { an: 54, symbol: "Xe", name: "Xenon", group: 18, period: 5 },

    // Period 6
    { an: 55, symbol: "Cs", name: "Cesium", group: 1, period: 6 },
    { an: 56, symbol: "Ba", name: "Barium", group: 2, period: 6 },
    { an: 81, symbol: "Tl", name: "Thallium", group: 13, period: 6 },
    { an: 82, symbol: "Pb", name: "Lead", group: 14, period: 6 },
    { an: 83, symbol: "Bi", name: "Bismuth", group: 15, period: 6 },
    { an: 84, symbol: "Po", name: "Polonium", group: 16, period: 6 },
    { an: 85, symbol: "At", name: "Astatine", group: 17, period: 6 },
    { an: 86, symbol: "Rn", name: "Radon", group: 18, period: 6 },

    // Period 7
    { an: 87, symbol: "Fr", name: "Francium", group: 1, period: 7 },
    { an: 88, symbol: "Ra", name: "Radium", group: 2, period: 7 },
  ]

  let emptySlots = []
  let draggableElements = []

  function initializeGame() {
    periodicTableGrid.innerHTML = ""
    draggableElementsContainer.innerHTML = "<h2>Elements to Drag</h2>"
    feedbackElement.textContent = ""
    emptySlots = []
    draggableElements = []

    // Create a map for easy lookup of elements by atomic number
    const elementMap = new Map(elements.map((el) => [el.an, el]))

    // Create a 2D array to represent the periodic table layout
    const tableLayout = Array(7)
      .fill(null)
      .map(() => Array(18).fill(null))

    // Populate the layout with elements
    elements.forEach((el) => {
      // Adjust for simplified layout (e.g., transition metals are skipped)
      let col = el.group - 1
      let row = el.period - 1

      // Special handling for Helium to place it correctly
      if (el.an === 2) {
        col = 17 // Group 18
        row = 0 // Period 1
      } else if (el.an >= 5 && el.an <= 10) {
        // Period 2 p-block
        col = el.group - 1
        row = 1
      } else if (el.an >= 13 && el.an <= 18) {
        // Period 3 p-block
        col = el.group - 1
        row = 2
      }

      if (row < 7 && col < 18) {
        tableLayout[row][col] = el
      }
    })

    // Determine which elements to randomize (make empty)
    const elementsToHide = []
    const availableElementsForHiding = elements.filter((el) => el.an !== 1 && el.an !== 2) // Don't hide H or He for simplicity
    while (elementsToHide.length < 5 && availableElementsForHiding.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableElementsForHiding.length)
      elementsToHide.push(availableElementsForHiding.splice(randomIndex, 1)[0])
    }

    // Render the periodic table grid
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 18; c++) {
        const cell = document.createElement("div")
        cell.classList.add("element-cell")
        cell.dataset.row = r
        cell.dataset.col = c

        const element = tableLayout[r][c]

        if (element) {
          const isHidden = elementsToHide.some((e) => e.an === element.an)
          if (isHidden) {
            cell.classList.add("empty")
            cell.dataset.correctAn = element.an // Store correct atomic number
            emptySlots.push(cell)
          } else {
            cell.classList.add("filled")
            cell.innerHTML = `
                            <div class="element-symbol">${element.symbol}</div>
                            <div class="element-name">${element.name}</div>
                        `
          }
        } else {
          // Create empty cells for gaps in the table
          cell.classList.add("gap")
          cell.style.visibility = "hidden" // Hide empty gap cells
        }
        periodicTableGrid.appendChild(cell)
      }
    }

    // Create draggable elements for the hidden ones
    elementsToHide
      .sort(() => Math.random() - 0.5)
      .forEach((el) => {
        const draggable = document.createElement("div")
        draggable.classList.add("draggable-element")
        draggable.setAttribute("draggable", "true")
        draggable.dataset.an = el.an
        draggable.innerHTML = `
                <div class="element-symbol">${el.symbol}</div>
                <div class="element-name">${el.name}</div>
            `
        draggableElementsContainer.appendChild(draggable)
        draggableElements.push(draggable)
      })

    addEventListeners()
  }

  function addEventListeners() {
    draggableElements.forEach((draggable) => {
      draggable.addEventListener("dragstart", dragStart)
    })

    emptySlots.forEach((slot) => {
      slot.addEventListener("dragover", dragOver)
      slot.addEventListener("dragleave", dragLeave)
      slot.addEventListener("drop", drop)
    })

    resetButton.addEventListener("click", initializeGame)
  }

  let draggedElement = null

  function dragStart(e) {
    draggedElement = this
    e.dataTransfer.setData("text/plain", this.dataset.an)
    setTimeout(() => this.classList.add("dragging"), 0)
  }

  function dragOver(e) {
    e.preventDefault() // Allow drop
    this.classList.add("hovered")
  }

  function dragLeave() {
    this.classList.remove("hovered")
  }

  function drop(e) {
    e.preventDefault()
    this.classList.remove("hovered")

    const droppedAn = e.dataTransfer.getData("text/plain")
    const correctAn = this.dataset.correctAn

    if (droppedAn === correctAn) {
      const elementData = elements.find((el) => el.an == droppedAn)
      this.innerHTML = `
                <div class="element-symbol">${elementData.symbol}</div>
                <div class="element-name">${elementData.name}</div>
            `
      this.classList.remove("empty")
      this.classList.add("filled", "correct")
      this.removeEventListener("drop", drop)
      this.removeEventListener("dragover", dragOver)
      this.removeEventListener("dragleave", dragLeave)

      draggedElement.remove() // Remove the draggable element from the pool
      feedbackElement.textContent = "Correct!"
      feedbackElement.style.color = "green"
    } else {
      this.classList.add("incorrect")
      feedbackElement.textContent = "Incorrect, try again!"
      feedbackElement.style.color = "red"
      setTimeout(() => this.classList.remove("incorrect"), 1000) // Remove feedback after a short delay
    }

    draggedElement = null
    checkGameCompletion()
  }

  function checkGameCompletion() {
    const remainingEmptySlots = document.querySelectorAll(".element-cell.empty").length
    if (remainingEmptySlots === 0) {
      feedbackElement.textContent = "Congratulations! You completed the periodic table!"
      feedbackElement.style.color = "white"
    }
  }

  initializeGame()
})
