document.addEventListener("DOMContentLoaded", () => {
  const acidInput = document.getElementById("acid-input")
  const baseInput = document.getElementById("base-input")
  const mixButton = document.getElementById("mix-button")
  const resetButton = document.getElementById("reset-button")
  const liquidAcid = document.getElementById("liquid-acid")
  const liquidBase = document.getElementById("liquid-base")
  const liquidResult = document.getElementById("liquid-result")
  const beakerResult = document.getElementById("beaker-result")
  const resultInfo = document.getElementById("result-info")

  const phColors = {
    acid: "#f08080",
    neutral: "#90ee90",
    base: "#87cefa",
  }

  // Helper: HTML-safe subscript numbers
  function sub(formula) {
    return formula
      .replace(/0/g, "₀")
      .replace(/1/g, "₁")
      .replace(/2/g, "₂")
      .replace(/3/g, "₃")
      .replace(/4/g, "₄")
      .replace(/5/g, "₅")
      .replace(/6/g, "₆")
      .replace(/7/g, "₇")
      .replace(/8/g, "₈")
      .replace(/9/g, "₉")
  }

  const R = {
    // Strong acid + strong base → pH ~7
    HCl_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `HCl + NaOH → NaCl + H${sub("2")}O`,
      desc: "Asam kuat dan basa kuat menetralkan menjadi garam dan air (pH netral).",
    },
    HCl_KOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `HCl + KOH → KCl + H${sub("2")}O`,
      desc: "Reaksi netralisasi sempurna.",
    },
    HBr_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `HBr + NaOH → NaBr + H${sub("2")}O`,
      desc: "Reaksi netralisasi menghasilkan NaBr dan air.",
    },
    HNO3_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `HNO${sub("3")} + NaOH → NaNO${sub("3")} + H${sub("2")}O`,
      desc: "Nitrat natrium terbentuk dalam larutan.",
    },
    HNO3_KOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `HNO${sub("3")} + KOH → KNO${sub("3")} + H${sub("2")}O`,
      desc: "Kalium nitrat dan air.",
    },

    // Strong acid + dihydroxide strong base
    "HCl_Ca(OH)2": {
      ph: 7,
      color: phColors.neutral,
      eq: `2 HCl + Ca(OH)${sub("2")} → CaCl${sub("2")} + 2 H${sub("2")}O`,
      desc: "Perlu 2 mol HCl untuk 1 mol Ca(OH)₂.",
    },
    "HCl_Ba(OH)2": {
      ph: 7,
      color: phColors.neutral,
      eq: `2 HCl + Ba(OH)${sub("2")} → BaCl${sub("2")} + 2 H${sub("2")}O`,
      desc: "Perlu 2:1 untuk menetralkan.",
    },

    // Polyprotic acid neutralization
    H2SO4_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("2")}SO${sub("4")} + 2 NaOH → Na${sub("2")}SO${sub("4")} + 2 H${sub("2")}O`,
      desc: "Asam diprotik perlu 2 mol NaOH.",
    },
    H2SO4_KOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("2")}SO${sub("4")} + 2 KOH → K${sub("2")}SO${sub("4")} + 2 H${sub("2")}O`,
      desc: "Garam sulfat terbentuk.",
    },
    "H2SO4_Ca(OH)2": {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("2")}SO${sub("4")} + Ca(OH)${sub("2")} → CaSO${sub("4")} + 2 H${sub("2")}O`,
      desc: "Perbandingan 1:1 karena 2 OH⁻ netralisasi 2 H⁺.",
    },

    H3PO4_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("3")}PO${sub("4")} + 3 NaOH → Na${sub("3")}PO${sub("4")} + 3 H${sub("2")}O`,
      desc: "Asam triprotik memerlukan 3 mol NaOH untuk netralisasi penuh.",
    },
    H3PO4_KOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("3")}PO${sub("4")} + 3 KOH → K${sub("3")}PO${sub("4")} + 3 H${sub("2")}O`,
      desc: "Fosfat kalium dan air.",
    },

    // Weak acid + strong base → pH > 7 (sedikit basa)
    CH3COOH_NaOH: {
      ph: 8.5,
      color: "#add8e6",
      eq: `CH${sub("3")}COOH + NaOH → CH${sub("3")}COONa + H${sub("2")}O`,
      desc: "Larutan buffer basa lemah cenderung pH > 7.",
    },
    CH3COOH_KOH: {
      ph: 9.0,
      color: "#b0e0e6",
      eq: `CH${sub("3")}COOH + KOH → CH${sub("3")}COOK + H${sub("2")}O`,
      desc: "Sedikit basa setelah reaksi.",
    },
    HF_NaOH: {
      ph: 8.5,
      color: "#add8e6",
      eq: `HF + NaOH → NaF + H${sub("2")}O`,
      desc: "Asam lemah dinetralkan basis kuat.",
    },

    // Strong acid + weak base (NH3) → pH < 7 (sedikit asam)
    HCl_NH3: {
      ph: 5.5,
      color: "#ffb6c1",
      eq: `HCl + NH${sub("3")} → NH${sub("4")}Cl`,
      desc: "Terbentuk garam amonium klorida, larutan sedikit asam.",
    },
    H2SO4_NH3: {
      ph: 5.0,
      color: "#ffc0cb",
      eq: `H${sub("2")}SO${sub("4")} + 2 NH${sub("3")} → (NH${sub("4")})${sub("2")}SO${sub("4")}`,
      desc: "Amonium sulfat terbentuk.",
    },
    HNO3_NH3: {
      ph: 5.5,
      color: "#ffb6c1",
      eq: `HNO${sub("3")} + NH${sub("3")} → NH${sub("4")}NO${sub("3")}`,
      desc: "Amonium nitrat, larutan sedikit asam.",
    },

    // Carbonic acid / carbonate interactions
    H2CO3_NaOH: {
      ph: 7,
      color: phColors.neutral,
      eq: `H${sub("2")}CO${sub("3")} + 2 NaOH → Na${sub("2")}CO${sub("3")} + 2 H${sub("2")}O`,
      desc: "Netralisasi penuh menghasilkan karbonat.",
    },
    HCl_Na2CO3: {
      ph: 6,
      color: "#ffb6c1",
      eq: `2 HCl + Na${sub("2")}CO${sub("3")} → 2 NaCl + H${sub("2")}O + CO${sub("2")}`,
      desc: "Terjadi pelepasan gas CO₂.",
    },
  }

  function resetBeakers() {
    liquidAcid.style.backgroundColor = phColors.acid
    liquidBase.style.backgroundColor = phColors.base
    liquidResult.style.height = "0"
    liquidResult.style.backgroundColor = "#ccc"
    beakerResult.classList.remove("mixed")
    resultInfo.innerHTML = "<p>Mix an acid and a base to see the reaction!</p>"
  }

  mixButton.addEventListener("click", () => {
    const a = acidInput.value
    const b = baseInput.value
    const key = `${a}_${b}`
    const rxn = R[key]

    if (!rxn) {
      resultInfo.innerHTML = `<p style="color:#ff8a80">Kombinasi belum didukung atau tidak ada reaksi netralisasi sederhana. Silakan pilih pasangan lain.</p>`
      resetBeakers()
      return
    }

    // Visual mix
    liquidResult.style.height = "0"
    beakerResult.classList.remove("mixed")

    setTimeout(() => {
      liquidResult.style.backgroundColor = rxn.color
      liquidResult.style.height = "80%"
      beakerResult.classList.add("mixed")

      const acidityTag =
        rxn.ph < 7
          ? `<span class="tag">Sedikit Asam</span>`
          : rxn.ph > 7
            ? `<span class="tag">Sedikit Basa</span>`
            : `<span class="tag">Netral</span>`

      resultInfo.innerHTML = `
        <p><strong>pH hasil:</strong> ${rxn.ph} ${acidityTag}</p>
        <div class="equation">${rxn.eq}</div>
        <p style="margin-top:.5rem">${rxn.desc}</p>
      `
    }, 400)
  })

  resetButton.addEventListener("click", resetBeakers)
  resetBeakers()
})
