document.addEventListener("DOMContentLoaded", () => {
  const quizQuestions = [
    {
      question: "Apa simbol kimia untuk Emas?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
    },
    {
      question: "Berapa nomor atom Karbon?",
      options: ["4", "6", "8", "12"],
      correct: 1,
    },
    {
      question: "Unsur apa yang memiliki simbol 'Fe'?",
      options: ["Fluorin", "Besi", "Fransium", "Fermium"],
      correct: 1,
    },
    {
      question: "Apa unsur paling melimpah di alam semesta?",
      options: ["Oksigen", "Karbon", "Hidrogen", "Helium"],
      correct: 2,
    },
    {
      question: "Manakah yang termasuk gas mulia?",
      options: ["Nitrogen", "Oksigen", "Neon", "Natrium"],
      correct: 2,
    },
  ]

  let currentQuestion = 0
  let score = 0
  let selectedAnswer = null

  const startBtn = document.getElementById("startBtn")
  const restartBtn = document.getElementById("restartBtn")
  const nextBtn = document.getElementById("nextBtn")

  const quizStart = document.getElementById("quiz-start")
  const quizQuestion = document.getElementById("quiz-question")
  const quizResult = document.getElementById("quiz-result")

  function startQuiz() {
    quizStart.classList.add("hidden")
    quizQuestion.classList.remove("hidden")
    currentQuestion = 0
    score = 0
    showQuestion()
  }

  function showQuestion() {
    const question = quizQuestions[currentQuestion]
    document.getElementById("questionText").textContent = question.question
    document.getElementById("currentQuestion").textContent = currentQuestion + 1
    document.getElementById("totalQuestions").textContent = quizQuestions.length

    // Update progress bar
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
    document.getElementById("progressBar").style.width = progress + "%"

    // Create answer options
    const optionsContainer = document.getElementById("answerOptions")
    optionsContainer.innerHTML = ""

    question.options.forEach((option, index) => {
      const optionElement = document.createElement("div")
      optionElement.className = "answer-option"
      optionElement.textContent = option
      optionElement.addEventListener("click", () => selectAnswer(index, optionElement))
      optionsContainer.appendChild(optionElement)
    })

    selectedAnswer = null
    nextBtn.classList.add("hidden")
  }

  function selectAnswer(answerIndex, optionElement) {
    // Remove previous selection
    document.querySelectorAll(".answer-option").forEach((option) => {
      option.classList.remove("selected")
    })

    // Mark current selection
    optionElement.classList.add("selected")
    selectedAnswer = answerIndex

    // Show correct/incorrect after a delay
    setTimeout(() => {
      showAnswerResult()
    }, 500)
  }

  function showAnswerResult() {
    const question = quizQuestions[currentQuestion]
    const options = document.querySelectorAll(".answer-option")

    options.forEach((option, index) => {
      if (index === question.correct) {
        option.classList.add("correct")
      } else if (index === selectedAnswer && index !== question.correct) {
        option.classList.add("incorrect")
      }
      // Disable further clicks
      option.style.pointerEvents = "none"
    })

    if (selectedAnswer === question.correct) {
      score++
    }

    // Show next button
    nextBtn.classList.remove("hidden")
  }

  function nextQuestion() {
    currentQuestion++
    if (currentQuestion < quizQuestions.length) {
      showQuestion()
    } else {
      showResults()
    }
  }

  function showResults() {
    quizQuestion.classList.add("hidden")
    quizResult.classList.remove("hidden")

    document.getElementById("finalScore").textContent = score

    let message = ""
    const percentage = (score / quizQuestions.length) * 100

    if (percentage >= 80) {
      message = "Luar biasa! Anda memiliki pemahaman kimia yang sangat baik!"
    } else if (percentage >= 60) {
      message = "Bagus! Terus belajar untuk meningkatkan pengetahuan Anda."
    } else {
      message = "Terus berlatih! Kimia membutuhkan waktu untuk dikuasai."
    }

    document.getElementById("resultMessage").textContent = message
  }

  function restartQuiz() {
    quizResult.classList.add("hidden")
    quizStart.classList.remove("hidden")
    document.getElementById("progressBar").style.width = "0%"
  }

  // Event listeners
  startBtn.addEventListener("click", startQuiz)
  restartBtn.addEventListener("click", restartQuiz)
  nextBtn.addEventListener("click", nextQuestion)
})
