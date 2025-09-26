document.addEventListener("DOMContentLoaded", () => {
  // All quiz questions organized by modules
  const quizModules = [
    // Modul 1: Atom dan Molekul
    [
      {
        question: "Apa yang dimaksud dengan atom?",
        options: ["Partikel terkecil dari unsur", "Gabungan dari beberapa unsur", "Molekul sederhana", "Ion bermuatan"],
        correct: 0,
      },
      {
        question: "Siapa yang pertama kali menggunakan istilah 'atom'?",
        options: ["Aristoteles", "Democritus", "Dalton", "Thomson"],
        correct: 1,
      },
      {
        question: "Apa yang dimaksud dengan molekul?",
        options: ["Atom tunggal", "Gabungan dua atau lebih atom", "Partikel bermuatan", "Inti atom"],
        correct: 1,
      },
      {
        question: "Rumus kimia air adalah?",
        options: ["H2O", "HO2", "H3O", "H2O2"],
        correct: 0,
      },
      {
        question: "Berapa jumlah atom dalam molekul metana (CH4)?",
        options: ["3", "4", "5", "6"],
        correct: 2,
      },
      {
        question: "Apa perbedaan utama antara atom dan molekul?",
        options: ["Atom lebih besar", "Molekul terdiri dari beberapa atom", "Atom bermuatan", "Molekul tidak stabil"],
        correct: 1,
      },
      {
        question: "Molekul O2 termasuk jenis molekul?",
        options: ["Molekul senyawa", "Molekul unsur", "Molekul ion", "Molekul kompleks"],
        correct: 1,
      },
      {
        question: "Berapa massa atom relatif karbon-12?",
        options: ["12", "6", "18", "24"],
        correct: 0,
      },
      {
        question: "Apa yang dimaksud dengan isotop?",
        options: [
          "Atom dengan elektron berbeda",
          "Atom dengan proton berbeda",
          "Atom dengan neutron berbeda",
          "Atom dengan massa sama",
        ],
        correct: 2,
      },
      {
        question: "Molekul CO2 memiliki berapa atom oksigen?",
        options: ["1", "2", "3", "4"],
        correct: 1,
      },
    ],

    // Modul 2: Ikatan Kimia dan Struktur
    [
      {
        question: "Apa yang dimaksud dengan ikatan kovalen?",
        options: [
          "Ikatan antara logam dan non-logam",
          "Ikatan dengan transfer elektron",
          "Ikatan dengan berbagi elektron",
          "Ikatan antar molekul",
        ],
        correct: 2,
      },
      {
        question: "Ikatan ionik terbentuk antara?",
        options: ["Logam dan logam", "Non-logam dan non-logam", "Logam dan non-logam", "Gas mulia"],
        correct: 2,
      },
      {
        question: "Senyawa NaCl memiliki ikatan?",
        options: ["Kovalen", "Ionik", "Logam", "Van der Waals"],
        correct: 1,
      },
      {
        question: "Berapa elektron yang dibagi dalam ikatan kovalen tunggal?",
        options: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        question: "Molekul H2O memiliki bentuk geometri?",
        options: ["Linear", "Trigonal", "Tetrahedral", "Bengkok"],
        correct: 3,
      },
      {
        question: "Apa yang dimaksud dengan ikatan hidrogen?",
        options: [
          "Ikatan kovalen dengan hidrogen",
          "Ikatan ionik dengan hidrogen",
          "Gaya tarik antar molekul",
          "Ikatan logam",
        ],
        correct: 2,
      },
      {
        question: "Senyawa CH4 memiliki hibridisasi?",
        options: ["sp", "sp2", "sp3", "sp3d"],
        correct: 2,
      },
      {
        question: "Ikatan rangkap dua memiliki berapa pasang elektron?",
        options: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        question: "Apa yang menentukan polaritas ikatan?",
        options: ["Ukuran atom", "Perbedaan elektronegativitas", "Jumlah elektron", "Massa atom"],
        correct: 1,
      },
      {
        question: "Molekul CO2 memiliki bentuk?",
        options: ["Linear", "Bengkok", "Trigonal", "Tetrahedral"],
        correct: 0,
      },
    ],

    // Modul 3: Struktur Atom dan Sistem Periodik
    [
      {
        question: "Berapa nomor atom hidrogen?",
        options: ["1", "2", "3", "4"],
        correct: 0,
      },
      {
        question: "Elektron berada di?",
        options: ["Inti atom", "Kulit atom", "Neutron", "Proton"],
        correct: 1,
      },
      {
        question: "Unsur dengan nomor atom 17 adalah?",
        options: ["Oksigen", "Fluorin", "Klorin", "Belerang"],
        correct: 2,
      },
      {
        question: "Berapa periode dalam tabel periodik?",
        options: ["6", "7", "8", "9"],
        correct: 1,
      },
      {
        question: "Golongan VIIIA disebut juga?",
        options: ["Logam alkali", "Halogen", "Gas mulia", "Logam transisi"],
        correct: 2,
      },
      {
        question: "Konfigurasi elektron neon adalah?",
        options: ["1s² 2s² 2p⁶", "1s² 2s² 2p⁴", "1s² 2s² 2p⁵", "1s² 2s¹"],
        correct: 0,
      },
      {
        question: "Unsur halogen memiliki elektron valensi?",
        options: ["5", "6", "7", "8"],
        correct: 2,
      },
      {
        question: "Jari-jari atom dalam satu periode dari kiri ke kanan?",
        options: ["Bertambah", "Berkurang", "Tetap", "Tidak beraturan"],
        correct: 1,
      },
      {
        question: "Energi ionisasi adalah?",
        options: [
          "Energi untuk menambah elektron",
          "Energi untuk melepas elektron",
          "Energi ikatan",
          "Energi aktivasi",
        ],
        correct: 1,
      },
      {
        question: "Unsur dengan simbol Fe adalah?",
        options: ["Fluorin", "Besi", "Fransium", "Fermium"],
        correct: 1,
      },
    ],

    // Modul 4: Molekul, Mol, dan Persamaan Kimia
    [
      {
        question: "Berapa jumlah partikel dalam 1 mol zat?",
        options: ["6.02 × 10²³", "6.02 × 10²²", "6.02 × 10²⁴", "6.02 × 10²¹"],
        correct: 0,
      },
      {
        question: "Massa molar CO2 adalah? (C=12, O=16)",
        options: ["28 g/mol", "32 g/mol", "44 g/mol", "48 g/mol"],
        correct: 2,
      },
      {
        question: "Rumus untuk menghitung mol adalah?",
        options: ["mol = massa/Mr", "mol = massa × Mr", "mol = Mr/massa", "mol = massa + Mr"],
        correct: 0,
      },
      {
        question: "Persamaan kimia yang setara untuk pembakaran metana adalah?",
        options: ["CH4 + O2 → CO2 + H2O", "CH4 + 2O2 → CO2 + 2H2O", "CH4 + O2 → CO + H2O", "2CH4 + O2 → 2CO2 + H2O"],
        correct: 1,
      },
      {
        question: "Volume 1 mol gas pada STP adalah?",
        options: ["22.4 L", "24.4 L", "20.4 L", "26.4 L"],
        correct: 0,
      },
      {
        question: "Berapa mol dalam 36 gram air? (H=1, O=16)",
        options: ["1 mol", "2 mol", "3 mol", "4 mol"],
        correct: 1,
      },
      {
        question: "Apa yang dimaksud dengan massa molekul relatif?",
        options: ["Massa satu molekul", "Jumlah massa atom dalam molekul", "Massa dalam gram", "Massa elektron"],
        correct: 1,
      },
      {
        question: "Koefisien dalam persamaan kimia menunjukkan?",
        options: ["Massa zat", "Jumlah mol", "Volume gas", "Suhu reaksi"],
        correct: 1,
      },
      {
        question: "Berapa molekul dalam 0.5 mol H2O?",
        options: ["3.01 × 10²³", "6.02 × 10²³", "1.20 × 10²⁴", "3.01 × 10²²"],
        correct: 0,
      },
      {
        question: "Hukum kekekalan massa dikemukakan oleh?",
        options: ["Dalton", "Lavoisier", "Avogadro", "Boyle"],
        correct: 1,
      },
    ],

    // Modul 5: Stoikiometri
    [
      {
        question: "Stoikiometri adalah ilmu yang mempelajari?",
        options: ["Struktur atom", "Perhitungan kimia", "Ikatan kimia", "Sifat gas"],
        correct: 1,
      },
      {
        question: "Dalam reaksi 2H2 + O2 → 2H2O, perbandingan mol H2 : O2 adalah?",
        options: ["1:1", "2:1", "1:2", "2:2"],
        correct: 1,
      },
      {
        question: "Pereaksi pembatas adalah?",
        options: [
          "Pereaksi yang paling banyak",
          "Pereaksi yang habis terlebih dahulu",
          "Pereaksi yang tidak bereaksi",
          "Produk reaksi",
        ],
        correct: 1,
      },
      {
        question: "Jika 4 mol H2 bereaksi dengan 1 mol O2, maka H2O yang terbentuk adalah?",
        options: ["2 mol", "4 mol", "1 mol", "3 mol"],
        correct: 0,
      },
      {
        question: "Rendemen reaksi adalah?",
        options: [
          "Hasil teoritis/hasil aktual × 100%",
          "Hasil aktual/hasil teoritis × 100%",
          "Massa produk",
          "Mol pereaksi",
        ],
        correct: 1,
      },
      {
        question: "Dalam reaksi N2 + 3H2 → 2NH3, berapa mol NH3 dari 6 mol H2?",
        options: ["2 mol", "4 mol", "6 mol", "3 mol"],
        correct: 1,
      },
      {
        question: "Apa yang dimaksud dengan pereaksi berlebih?",
        options: ["Pereaksi yang habis duluan", "Pereaksi yang tersisa", "Produk reaksi", "Katalis"],
        correct: 1,
      },
      {
        question: "Massa 2 mol CaCO3 adalah? (Ca=40, C=12, O=16)",
        options: ["100 g", "200 g", "150 g", "250 g"],
        correct: 1,
      },
      {
        question: "Berapa gram O2 diperlukan untuk membakar 16 g CH4? (C=12, H=1, O=16)",
        options: ["32 g", "64 g", "48 g", "16 g"],
        correct: 1,
      },
      {
        question: "Hukum perbandingan tetap dikemukakan oleh?",
        options: ["Dalton", "Proust", "Gay-Lussac", "Avogadro"],
        correct: 1,
      },
    ],

    // Modul 6: Gas
    [
      {
        question: "Hukum Boyle menyatakan hubungan antara?",
        options: ["P dan T", "V dan T", "P dan V", "n dan V"],
        correct: 2,
      },
      {
        question: "Pada suhu tetap, jika tekanan gas diperbesar 2 kali, maka volume?",
        options: ["Tetap", "Diperbesar 2 kali", "Diperkecil 2 kali", "Diperbesar 4 kali"],
        correct: 2,
      },
      {
        question: "Hukum Charles menyatakan?",
        options: ["P ∝ T", "V ∝ T", "P ∝ V", "V ∝ 1/T"],
        correct: 1,
      },
      {
        question: "Persamaan gas ideal adalah?",
        options: ["PV = nRT", "PV = RT", "P = nRT", "V = nRT"],
        correct: 0,
      },
      {
        question: "Nilai R (konstanta gas) adalah?",
        options: ["0.082 L.atm/mol.K", "8.314 J/mol.K", "Keduanya benar", "Tidak ada yang benar"],
        correct: 2,
      },
      {
        question: "STP adalah kondisi?",
        options: ["0°C, 1 atm", "25°C, 1 atm", "0°C, 2 atm", "100°C, 1 atm"],
        correct: 0,
      },
      {
        question: "Hukum Gay-Lussac menyatakan?",
        options: ["P ∝ T", "V ∝ T", "P ∝ V", "P ∝ 1/V"],
        correct: 0,
      },
      {
        question: "Tekanan parsial gas dalam campuran dinyatakan oleh hukum?",
        options: ["Boyle", "Charles", "Dalton", "Gay-Lussac"],
        correct: 2,
      },
      {
        question: "Gas yang paling mendekati gas ideal adalah?",
        options: ["CO2", "NH3", "He", "H2O"],
        correct: 2,
      },
      {
        question: "Pada tekanan tetap, gas dipanaskan dari 27°C ke 127°C. Volume gas menjadi?",
        options: ["Tetap", "2 kali", "1.33 kali", "0.5 kali"],
        correct: 2,
      },
    ],

    // Modul 7: Molekul dan Material
    [
      {
        question: "Sifat material ditentukan oleh?",
        options: ["Massa molekul", "Struktur molekul", "Warna", "Bau"],
        correct: 1,
      },
      {
        question: "Polimer adalah?",
        options: ["Molekul kecil", "Molekul besar dari unit berulang", "Logam", "Gas"],
        correct: 1,
      },
      {
        question: "Contoh polimer alami adalah?",
        options: ["Plastik", "Karet sintetis", "Selulosa", "PVC"],
        correct: 2,
      },
      {
        question: "Ikatan antar molekul yang paling lemah adalah?",
        options: ["Ikatan hidrogen", "Gaya van der Waals", "Ikatan ionik", "Ikatan kovalen"],
        correct: 1,
      },
      {
        question: "Kristal adalah material dengan struktur?",
        options: ["Acak", "Teratur", "Cair", "Gas"],
        correct: 1,
      },
      {
        question: "Sifat konduktivitas listrik paling baik dimiliki oleh?",
        options: ["Logam", "Non-logam", "Semilogam", "Gas mulia"],
        correct: 0,
      },
      {
        question: "Keramik memiliki sifat?",
        options: ["Konduktor listrik", "Isolator listrik", "Semikonduktor", "Superkonduktor"],
        correct: 1,
      },
      {
        question: "Komposit adalah material yang terdiri dari?",
        options: ["Satu komponen", "Dua atau lebih komponen", "Logam saja", "Polimer saja"],
        correct: 1,
      },
      {
        question: "Sifat elastisitas material berkaitan dengan?",
        options: ["Massa", "Ikatan antar atom", "Warna", "Bau"],
        correct: 1,
      },
      {
        question: "Nanomaterial memiliki ukuran dalam skala?",
        options: ["Mikrometer", "Nanometer", "Milimeter", "Sentimeter"],
        correct: 1,
      },
    ],

    // Modul 8: Termokimia
    [
      {
        question: "Termokimia mempelajari?",
        options: ["Struktur atom", "Perubahan energi dalam reaksi", "Ikatan kimia", "Sifat gas"],
        correct: 1,
      },
      {
        question: "Reaksi eksoterm adalah reaksi yang?",
        options: ["Menyerap kalor", "Melepas kalor", "Tidak melibatkan kalor", "Memerlukan katalis"],
        correct: 1,
      },
      {
        question: "ΔH negatif menunjukkan reaksi?",
        options: ["Endoterm", "Eksoterm", "Reversibel", "Irreversibel"],
        correct: 1,
      },
      {
        question: "Entalpi pembentukan standar adalah?",
        options: [
          "Energi untuk membentuk 1 mol senyawa",
          "Energi untuk memecah ikatan",
          "Energi aktivasi",
          "Energi ionisasi",
        ],
        correct: 0,
      },
      {
        question: "Hukum Hess menyatakan?",
        options: [
          "Energi tidak dapat diciptakan",
          "ΔH reaksi tidak bergantung pada jalur",
          "Massa kekal",
          "Volume gas ideal",
        ],
        correct: 1,
      },
      {
        question: "Kalor jenis air adalah?",
        options: ["4.18 J/g°C", "1 J/g°C", "2.09 J/g°C", "8.36 J/g°C"],
        correct: 0,
      },
      {
        question: "Entalpi pembakaran adalah?",
        options: [
          "Energi untuk membentuk senyawa",
          "Energi yang dilepas saat pembakaran",
          "Energi aktivasi",
          "Energi ikatan",
        ],
        correct: 1,
      },
      {
        question: "Kalorimeter digunakan untuk mengukur?",
        options: ["Suhu", "Tekanan", "Kalor reaksi", "Volume"],
        correct: 2,
      },
      {
        question: "Reaksi fotosintesis termasuk reaksi?",
        options: ["Eksoterm", "Endoterm", "Spontan", "Katalitik"],
        correct: 1,
      },
      {
        question: "Energi ikatan adalah?",
        options: ["Energi untuk membentuk ikatan", "Energi untuk memutus ikatan", "Energi aktivasi", "Energi kinetik"],
        correct: 1,
      },
    ],

    // Modul 9: Elektrokimia
    [
      {
        question: "Elektrokimia mempelajari hubungan antara?",
        options: ["Listrik dan kimia", "Panas dan kimia", "Cahaya dan kimia", "Suara dan kimia"],
        correct: 0,
      },
      {
        question: "Reaksi redoks adalah reaksi yang melibatkan?",
        options: ["Transfer proton", "Transfer elektron", "Transfer neutron", "Transfer atom"],
        correct: 1,
      },
      {
        question: "Oksidasi adalah?",
        options: [
          "Penurunan bilangan oksidasi",
          "Peningkatan bilangan oksidasi",
          "Penambahan oksigen",
          "Pengurangan hidrogen",
        ],
        correct: 1,
      },
      {
        question: "Katoda adalah elektroda tempat terjadinya?",
        options: ["Oksidasi", "Reduksi", "Ionisasi", "Netralisasi"],
        correct: 1,
      },
      {
        question: "Anoda adalah elektroda tempat terjadinya?",
        options: ["Oksidasi", "Reduksi", "Ionisasi", "Netralisasi"],
        correct: 0,
      },
      {
        question: "Sel galvani mengubah energi?",
        options: ["Kimia menjadi listrik", "Listrik menjadi kimia", "Panas menjadi listrik", "Listrik menjadi panas"],
        correct: 0,
      },
      {
        question: "Elektrolisis adalah proses?",
        options: ["Spontan", "Non-spontan", "Reversibel", "Irreversibel"],
        correct: 1,
      },
      {
        question: "Potensial sel standar dinyatakan dalam?",
        options: ["Ampere", "Volt", "Ohm", "Watt"],
        correct: 1,
      },
      {
        question: "Hukum Faraday berkaitan dengan?",
        options: ["Elektrolisis", "Induksi elektromagnetik", "Keduanya benar", "Tidak ada yang benar"],
        correct: 2,
      },
      {
        question: "Korosi adalah contoh reaksi?",
        options: ["Reduksi", "Oksidasi", "Netralisasi", "Substitusi"],
        correct: 1,
      },
    ],

    // Modul 10: Termodinamika
    [
      {
        question: "Hukum pertama termodinamika menyatakan?",
        options: ["Energi kekal", "Entropi selalu naik", "Suhu absolut nol", "Tekanan tetap"],
        correct: 0,
      },
      {
        question: "Entropi adalah ukuran?",
        options: ["Energi", "Ketidakteraturan", "Suhu", "Tekanan"],
        correct: 1,
      },
      {
        question: "Proses spontan memiliki ΔG?",
        options: ["Positif", "Negatif", "Nol", "Tidak terdefinisi"],
        correct: 1,
      },
      {
        question: "Energi bebas Gibbs dinyatakan dengan?",
        options: ["ΔG = ΔH - TΔS", "ΔG = ΔH + TΔS", "ΔG = ΔH × TΔS", "ΔG = ΔH / TΔS"],
        correct: 0,
      },
      {
        question: "Hukum kedua termodinamika berkaitan dengan?",
        options: ["Energi", "Entropi", "Entalpi", "Volume"],
        correct: 1,
      },
      {
        question: "Suhu absolut nol adalah?",
        options: ["0°C", "-273°C", "100°C", "-100°C"],
        correct: 1,
      },
      {
        question: "Proses adiabatik adalah proses?",
        options: ["Suhu tetap", "Tekanan tetap", "Volume tetap", "Tidak ada pertukaran kalor"],
        correct: 3,
      },
      {
        question: "Proses isotermal adalah proses?",
        options: ["Suhu tetap", "Tekanan tetap", "Volume tetap", "Entropi tetap"],
        correct: 0,
      },
      {
        question: "Efisiensi mesin Carnot bergantung pada?",
        options: ["Tekanan", "Volume", "Suhu reservoir", "Massa"],
        correct: 2,
      },
      {
        question: "Hukum ketiga termodinamika menyatakan?",
        options: ["Energi kekal", "Entropi kristal sempurna pada 0 K = 0", "ΔG < 0", "PV = nRT"],
        correct: 1,
      },
    ],

    // Modul 11: Kesetimbangan Kimia
    [
      {
        question: "Kesetimbangan kimia tercapai ketika?",
        options: ["Reaktan habis", "Produk maksimal", "Laju reaksi maju = laju reaksi balik", "Suhu maksimal"],
        correct: 2,
      },
      {
        question: "Konstanta kesetimbangan Kc bergantung pada?",
        options: ["Konsentrasi", "Tekanan", "Suhu", "Volume"],
        correct: 2,
      },
      {
        question: "Jika Kc > 1, maka?",
        options: ["Reaktan lebih banyak", "Produk lebih banyak", "Setimbang", "Tidak dapat ditentukan"],
        correct: 1,
      },
      {
        question: "Asas Le Chatelier menyatakan?",
        options: [
          "Kesetimbangan bergeser melawan gangguan",
          "Kesetimbangan tidak berubah",
          "Laju reaksi tetap",
          "Suhu selalu naik",
        ],
        correct: 0,
      },
      {
        question: "Jika suhu dinaikkan pada reaksi eksoterm, kesetimbangan bergeser ke?",
        options: ["Kanan", "Kiri", "Tidak bergeser", "Tidak dapat ditentukan"],
        correct: 1,
      },
      {
        question: "Penambahan katalis pada sistem setimbang akan?",
        options: ["Menggeser ke kanan", "Menggeser ke kiri", "Tidak menggeser posisi", "Menghentikan reaksi"],
        correct: 2,
      },
      {
        question: "Untuk reaksi gas, Kp berhubungan dengan Kc melalui?",
        options: ["Kp = Kc", "Kp = Kc(RT)^Δn", "Kp = Kc/RT", "Kp = Kc × T"],
        correct: 1,
      },
      {
        question: "Kesetimbangan heterogen melibatkan?",
        options: ["Satu fase", "Dua fase atau lebih", "Gas saja", "Larutan saja"],
        correct: 1,
      },
      {
        question: "Derajat disosiasi (α) adalah?",
        options: [
          "Jumlah mol yang terdisosiasi/jumlah mol mula-mula",
          "Konsentrasi produk",
          "Konstanta kesetimbangan",
          "Laju reaksi",
        ],
        correct: 0,
      },
      {
        question: "Kesetimbangan dinamis berarti?",
        options: ["Reaksi berhenti", "Konsentrasi berubah", "Laju maju = laju balik", "Suhu berubah"],
        correct: 2,
      },
    ],
  ]

  const moduleNames = [
    "Atom dan Molekul",
    "Ikatan Kimia dan Struktur",
    "Struktur Atom dan Sistem Periodik",
    "Molekul, Mol, dan Persamaan Kimia",
    "Stoikiometri",
    "Gas",
    "Molekul dan Material",
    "Termokimia",
    "Elektrokimia",
    "Termodinamika",
    "Kesetimbangan Kimia",
  ]

  let currentModule = null
  let currentQuestions = []
  let currentQuestion = 0
  let score = 0
  let selectedAnswer = null

  // DOM elements
  const moduleSelection = document.getElementById("module-selection")
  const quizStart = document.getElementById("quiz-start")
  const quizQuestion = document.getElementById("quiz-question")
  const quizResult = document.getElementById("quiz-result")

  const startBtn = document.getElementById("startBtn")
  const restartBtn = document.getElementById("restartBtn")
  const nextBtn = document.getElementById("nextBtn")
  const backToModules = document.getElementById("backToModules")
  const backToModulesFromResult = document.getElementById("backToModulesFromResult")
  const allModulesBtn = document.getElementById("allModulesBtn")

  // Module selection
  document.querySelectorAll(".module-option").forEach((option, index) => {
    option.addEventListener("click", () => selectModule(index))
  })

  allModulesBtn.addEventListener("click", () => selectAllModules())

  function selectModule(moduleIndex) {
    currentModule = moduleIndex
    currentQuestions = [...quizModules[moduleIndex]]

    moduleSelection.classList.add("hidden")
    quizStart.classList.remove("hidden")

    document.getElementById("quiz-subtitle").textContent =
      `Modul ${moduleIndex + 1}: ${moduleNames[moduleIndex]} - 10 Soal`
  }

  function selectAllModules() {
    currentModule = "all"
    currentQuestions = []

    // Combine all modules
    quizModules.forEach((module) => {
      currentQuestions = currentQuestions.concat(module)
    })

    // Shuffle questions
    currentQuestions = shuffleArray(currentQuestions)

    moduleSelection.classList.add("hidden")
    quizStart.classList.remove("hidden")

    document.getElementById("quiz-subtitle").textContent = "Kuis Semua Modul - 110 Soal"
  }

  function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function startQuiz() {
    quizStart.classList.add("hidden")
    quizQuestion.classList.remove("hidden")
    currentQuestion = 0
    score = 0
    showQuestion()
  }

  function showQuestion() {
    const question = currentQuestions[currentQuestion]
    document.getElementById("questionText").textContent = question.question
    document.getElementById("currentQuestion").textContent = currentQuestion + 1
    document.getElementById("totalQuestions").textContent = currentQuestions.length

    // Update progress bar
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100
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
    const question = currentQuestions[currentQuestion]
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
    if (currentQuestion < currentQuestions.length) {
      showQuestion()
    } else {
      showResults()
    }
  }

  function showResults() {
    quizQuestion.classList.add("hidden")
    quizResult.classList.remove("hidden")

    document.getElementById("finalScore").textContent = score
    document.getElementById("scoreTotal").textContent = `/ ${currentQuestions.length}`

    let message = ""
    const percentage = (score / currentQuestions.length) * 100

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

  function backToModuleSelection() {
    quizStart.classList.add("hidden")
    quizResult.classList.add("hidden")
    moduleSelection.classList.remove("hidden")
    document.getElementById("progressBar").style.width = "0%"
  }

  // Event listeners
  startBtn.addEventListener("click", startQuiz)
  restartBtn.addEventListener("click", restartQuiz)
  nextBtn.addEventListener("click", nextQuestion)
  backToModules.addEventListener("click", backToModuleSelection)
  backToModulesFromResult.addEventListener("click", backToModuleSelection)
})
