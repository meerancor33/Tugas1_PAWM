// Function to navigate to simulation links
function navigateToSimulation(topic) {
  const simulationUrls = {
    atom: "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html",
    ikatan: "https://phet.colorado.edu/sims/html/molecule-polarity/latest/molecule-polarity_en.html",
    stoikiometri:
      "https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_en.html",
    larutan: "https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html",
    termokimia: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html",
    elektrokimia:
      "https://phet.colorado.edu/sims/html/battery-resistor-circuit/latest/battery-resistor-circuit_en.html",
    laju: "https://phet.colorado.edu/sims/html/reactions-and-rates/latest/reactions-and-rates_en.html",
    kesetimbangan: "https://phet.colorado.edu/sims/html/reversible-reactions/latest/reversible-reactions_en.html",
    organik: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
    analitik: "https://phet.colorado.edu/sims/html/ph-scale/latest/ph-scale_en.html",
    lingkungan: "https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_en.html",
  }

  const url = simulationUrls[topic] || "https://phet.colorado.edu/in/simulations/filter?subjects=chemistry&type=html"
  window.open(url, "_blank")
}

// Function to navigate to video links
function navigateToVideo(topic) {
  const videoUrls = {
    atom: "https://www.youtube.com/watch?v=example-atom-video",
    ikatan: "https://www.youtube.com/watch?v=example-ikatan-video",
    stoikiometri: "https://www.youtube.com/watch?v=example-stoikiometri-video",
    larutan: "https://www.youtube.com/watch?v=example-larutan-video",
    termokimia: "https://www.youtube.com/watch?v=example-termokimia-video",
    elektrokimia: "https://www.youtube.com/watch?v=example-elektrokimia-video",
    laju: "https://www.youtube.com/watch?v=example-laju-video",
    kesetimbangan: "https://www.youtube.com/watch?v=example-kesetimbangan-video",
    organik: "https://www.youtube.com/watch?v=example-organik-video",
    analitik: "https://www.youtube.com/watch?v=example-analitik-video",
    lingkungan: "https://www.youtube.com/watch?v=example-lingkungan-video",
  }

  const url = videoUrls[topic] || "https://www.youtube.com/results?search_query=kimia+" + topic
  window.open(url, "_blank")
}

// Function to navigate to PDF links
function navigateToPDF(topic) {
  const pdfUrls = {
    atom: "https://example.com/pdf/modul-struktur-atom.pdf",
    ikatan: "https://example.com/pdf/modul-ikatan-kimia.pdf",
    stoikiometri: "https://example.com/pdf/modul-stoikiometri.pdf",
    larutan: "https://example.com/pdf/modul-larutan.pdf",
    termokimia: "https://example.com/pdf/modul-termokimia.pdf",
    elektrokimia: "https://example.com/pdf/modul-elektrokimia.pdf",
    laju: "https://example.com/pdf/modul-laju-reaksi.pdf",
    kesetimbangan: "https://example.com/pdf/modul-kesetimbangan-kimia.pdf",
    organik: "https://example.com/pdf/modul-kimia-organik.pdf",
    analitik: "https://example.com/pdf/modul-kimia-analitik.pdf",
    lingkungan: "https://example.com/pdf/modul-kimia-lingkungan.pdf",
  }

  const url = pdfUrls[topic] || "https://example.com/pdf/modul-kimia-" + topic + ".pdf"
  window.open(url, "_blank")
}

// General function to navigate to any link
function navigateToLink(url) {
  window.open(url, "_blank")
}

document.addEventListener("DOMContentLoaded", () => {
  // Get all module cards
  const moduleCards = document.querySelectorAll(".module-card")

  moduleCards.forEach((card, index) => {
    const topics = [
      "atom",
      "ikatan",
      "stoikiometri",
      "larutan",
      "termokimia",
      "elektrokimia",
      "laju",
      "kesetimbangan",
      "organik",
      "analitik",
      "lingkungan",
    ]
    const currentTopic = topics[index]

    // Get buttons within this card
    const buttons = card.querySelectorAll(".btn-option")

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault() // Prevent default link behavior

        const buttonText = button.textContent.trim()

        if (buttonText === "Simulasi") {
          navigateToSimulation(currentTopic)
        } else if (buttonText === "Video") {
          navigateToVideo(currentTopic)
        } else if (buttonText === "PDF") {
          navigateToPDF(currentTopic)
        }
      })
    })
  })
})
