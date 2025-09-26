// Function to navigate to simulation links
function navigateToSimulation(topic) {
  const simulationUrls = {
    atom: "https://www.labxchange.org/topic/chemistry-middle-the-atom",
    ikatan: "https://www.labxchange.org/library/pathway/lx-pathway:b2cd0ddb-06d8-4e98-8092-7f739ddaff9e",
    periodik: "https://www.labxchange.org/topic/chemistry-high-periodic-table",
    persamaan: "https://www.labxchange.org/topic/chemistry-middle-chemical-reactions",
    stoikiometri: "https://www.labxchange.org/library/pathway/lx-pathway:35d5f88c-b419-4229-ae5f-156defaff820?source=%2Flibrary%2Fclusters%2Flx-cluster%3AChemistryResources",
    gas: "https://www.labxchange.org/library/pathway/lx-pathway:1f255415-8ff3-426c-a8ce-67ed82e4cd6e?source=%2Flibrary%2Fclusters%2Flx-cluster%3AChemistryResources",
    material: "https://www.labxchange.org/library/pathway/lx-pathway:dcac15e7-3352-444b-be81-21c79ed90686?source=%2Flibrary%2Fclusters%2Flx-cluster%3AChemistryResources",
    termokimia: "https://www.labxchange.org/library/pathway/lx-pathway:635b966f-3e45-492a-b51f-a2836bc1889b",
    elektrokimia: "https://www.labxchange.org/library/pathway/lx-pathway:b5ead353-ffc4-4505-b899-5181e42cc52b?source=%2Flibrary%2Fclusters%2Flx-cluster%3AChemistryResources",
    termodinamika: "https://phet.colorado.edu/in/simulations/reversible-reactions",
    kesetimbangan: "https://www.labxchange.org/library/pathway/lx-pathway:0eeeecfb-60ae-4dfb-8e93-7b68725f4be9",
  }

  const url = simulationUrls[topic] || "https://phet.colorado.edu/in/simulations/filter?subjects=chemistry&type=html"
  window.open(url, "_blank")
}
// Function to navigate to video links
function navigateToVideo(topic) {
  const videoUrls = {
    atom: "https://youtu.be/HQmSM0X3U8g?si=75Eawj5JPIieqF_O",
    ikatan: "https://youtube.com/playlist?list=PLAKmNBIaTKUeo44Ez523OVmXMAbQQby62&si=SUPY5rxCkMmAbvyY",
    periodik: "https://youtu.be/yoBF5eNQlCc?si=tBhAVlypETv66Ge5",
    persamaan: "https://youtu.be/MuGG4rVmA7E?si=YMkzoJY9yj6y-Cp2",
    stoikiometri: "https://youtu.be/TCXiEtgFh5s?si=wzmjbUyjaSJwr97F",
    gas: "https://youtu.be/U_nknq-zHRI?si=DqrwHN-_1Af8NISp",
    material: "https://youtu.be/sA7DoBlEI2k?si=ucRA6fva4Q9gNmQn",
    termokimia: "https://youtube.com/playlist?list=PL2PAgVsFqpcCOUvvOV1frvPP47nxsaHtB&si=jbDGU-jpvwzzFift",
    elektrokimia: "https://youtu.be/SeJGDSPftdU?si=7naOI6vOFdTPNjZA",
    termodinamika: "https://youtu.be/m3N3uHLniic?si=Y0NXz0ZiMRvfhRvx",
    kesetimbangan: "https://youtu.be/iyxnS2UJ3JM?si=HbNj-jbBNsbzrzjv",
  }

  const url = videoUrls[topic] || "https://www.youtube.com/results?search_query=kimia+" + topic
  window.open(url, "_blank")
}

// Function to navigate to PDF links
function navigateToPDF(topic) {
  const pdfUrls = {
    atom: "/pdf/modul-kimia-atom.pdf",
    ikatan: "../pdf/modul-kimia-ikatan.pdf",
    periodik: "../pdf/modul-kimia-periodik.pdf",
    persamaan: "../pdf/modul-kimia-persamaan.pdf",
    stoikiometri: "../pdf/modul-kimia-stoikiometri.pdf",
    gas: "../pdf/modul-kimia-gas.pdf",
    material: "../pdf/modul-kimia-material.pdf",
    termokimia: "../pdf/modul-kimia-termokimia.pdf",
    elektrokimia: "../pdf/modul-kimia-elektrokimia.pdf",
    termodinamika: "../pdf/modul-kimia-termodinamika.pdf",
    kesetimbangan: "../pdf/modul-kimia-kesetimbangan.pdf",
  }

    const url = pdfUrls[topic.toLowerCase()] || `../pdf/modul-kimia-${topic.toLowerCase()}.pdf`;
  window.open(url, "_blank");
}

// General function to navigate to any link
function navigateToLink(url) {
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  // Get all module cards
  const moduleCards = document.querySelectorAll(".module-card")

  moduleCards.forEach((card, index) => {
    const topics = [
      "atom",
      "ikatan",
      "periodik",
      "persamaan",
      "stoikiometri",
      "gas",
      "material",
      "termokimia",
      "elektrokimia",
      "termodinamika",
      "kesetimbangan",
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
