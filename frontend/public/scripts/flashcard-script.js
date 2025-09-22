document.addEventListener("DOMContentLoaded", () => {
  const flashcards = [
    {
      question: "Apa simbol kimia untuk Emas?",
      answer: "Au (dari bahasa Latin: Aurum)",
    },
    {
      question: "Berapa nomor atom Karbon?",
      answer: "6",
    },
    {
      question: "Apa rumus kimia untuk air?",
      answer: "H₂O",
    },
    {
      question: "Gas apa yang paling banyak di atmosfer?",
      answer: "Nitrogen (N₂) - sekitar 78%",
    },
    {
      question: "Apa nama proses perubahan dari padat ke gas?",
      answer: "Sublimasi",
    },
    {
      question: "Berapa elektron maksimal di kulit K?",
      answer: "2 elektron",
    },
    {
      question: "Apa rumus kimia garam dapur?",
      answer: "NaCl (Natrium Klorida)",
    },
    {
      question: "Unsur apa yang memiliki simbol Fe?",
      answer: "Besi (dari bahasa Latin: Ferrum)",
    },
    {
      question: "Apa satuan massa atom?",
      answer: "u (unit massa atom) atau amu",
    },
    {
      question: "Gas apa yang dihasilkan fotosintesis?",
      answer: "Oksigen (O₂)",
    },
  ]

  let currentCard = 0
  const flashcard = document.getElementById("flashcard")
  const questionElement = document.getElementById("question")
  const answerElement = document.getElementById("answer")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const cardCounter = document.getElementById("cardCounter")
  const progress = document.getElementById("progress")

  function updateCard() {
    questionElement.textContent = flashcards[currentCard].question
    answerElement.textContent = flashcards[currentCard].answer
    cardCounter.textContent = `${currentCard + 1} / ${flashcards.length}`

    const progressPercent = ((currentCard + 1) / flashcards.length) * 100
    progress.style.width = progressPercent + "%"

    prevBtn.disabled = currentCard === 0
    nextBtn.disabled = currentCard === flashcards.length - 1

    flashcard.classList.remove("flipped")
  }

  flashcard.addEventListener("click", function () {
    this.classList.toggle("flipped")
  })

  prevBtn.addEventListener("click", () => {
    if (currentCard > 0) {
      currentCard--
      updateCard()
    }
  })

  nextBtn.addEventListener("click", () => {
    if (currentCard < flashcards.length - 1) {
      currentCard++
      updateCard()
    }
  })

  updateCard()
})
