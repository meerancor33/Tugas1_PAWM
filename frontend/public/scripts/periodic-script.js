document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".element")
  const elementInfo = document.getElementById("element-info")
  const elementTitle = document.getElementById("element-title")
  const elementSymbol = document.getElementById("element-symbol")
  const elementNumber = document.getElementById("element-number")
  const elementMass = document.getElementById("element-mass")

  elements.forEach((element) => {
    element.addEventListener("click", function () {
      const symbol = this.dataset.element
      const name = this.dataset.name
      const number = this.dataset.number
      const mass = this.dataset.mass

      elementTitle.textContent = name
      elementSymbol.textContent = symbol
      elementNumber.textContent = number
      elementMass.textContent = mass + " u"

      elementInfo.classList.remove("hidden")
      elementInfo.scrollIntoView({ behavior: "smooth" })
    })
  })
})
