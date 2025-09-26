// Flashcard data for all modules
const flashcardData = {
  "atom-molekul": [
    {
      question: "Apa definisi atom?",
      answer: "Partikel terkecil dari suatu unsur yang masih memiliki sifat unsur tersebut",
    },
    { question: "Siapa yang pertama kali menggunakan istilah 'atom'?", answer: "Democritus (filsuf Yunani kuno)" },
    {
      question: "Apa perbedaan antara atom dan molekul?",
      answer: "Atom adalah partikel terkecil unsur, molekul adalah gabungan dua atau lebih atom",
    },
    {
      question: "Apa itu ion?",
      answer: "Atom atau molekul yang bermuatan listrik karena kehilangan atau mendapat elektron",
    },
    { question: "Sebutkan tiga partikel subatomik utama!", answer: "Proton, neutron, dan elektron" },
    { question: "Di mana lokasi proton dalam atom?", answer: "Di dalam inti atom (nukleus)" },
    { question: "Apa muatan listrik elektron?", answer: "Negatif (-1)" },
    { question: "Apa yang dimaksud dengan nomor atom?", answer: "Jumlah proton dalam inti atom suatu unsur" },
    { question: "Apa yang dimaksud dengan nomor massa?", answer: "Jumlah proton dan neutron dalam inti atom" },
    { question: "Apa itu isotop?", answer: "Atom-atom dari unsur yang sama dengan jumlah neutron berbeda" },
    { question: "Berapa massa elektron dibandingkan proton?", answer: "Sekitar 1/1836 kali massa proton" },
    { question: "Apa yang dimaksud dengan kation?", answer: "Ion bermuatan positif (kehilangan elektron)" },
    { question: "Apa yang dimaksud dengan anion?", answer: "Ion bermuatan negatif (mendapat elektron)" },
    { question: "Apa rumus molekul air?", answer: "H₂O" },
    { question: "Apa rumus molekul metana?", answer: "CH₄" },
    { question: "Apa yang dimaksud dengan molekul diatomik?", answer: "Molekul yang terdiri dari dua atom" },
    { question: "Sebutkan contoh molekul diatomik!", answer: "H₂, O₂, N₂, Cl₂, F₂, Br₂, I₂" },
    {
      question: "Apa perbedaan senyawa dan campuran?",
      answer: "Senyawa: komposisi tetap, sifat baru; Campuran: komposisi bervariasi, sifat komponen dipertahankan",
    },
    {
      question: "Apa yang dimaksud dengan rumus empiris?",
      answer: "Rumus yang menunjukkan perbandingan paling sederhana atom-atom dalam senyawa",
    },
    {
      question: "Apa yang dimaksud dengan rumus molekul?",
      answer: "Rumus yang menunjukkan jumlah sebenarnya atom-atom dalam satu molekul senyawa",
    },
  ],

  "ikatan-kimia": [
    {
      question: "Apa yang dimaksud dengan ikatan kimia?",
      answer: "Gaya tarik-menarik yang mengikat atom-atom dalam suatu senyawa",
    },
    { question: "Sebutkan tiga jenis ikatan kimia utama!", answer: "Ikatan ionik, ikatan kovalen, dan ikatan logam" },
    {
      question: "Bagaimana terbentuknya ikatan ionik?",
      answer: "Melalui transfer elektron dari atom logam ke atom non-logam",
    },
    { question: "Bagaimana terbentuknya ikatan kovalen?", answer: "Melalui pemakaian bersama pasangan elektron" },
    {
      question: "Apa yang dimaksud dengan ikatan kovalen polar?",
      answer: "Ikatan kovalen dengan distribusi elektron tidak merata",
    },
    {
      question: "Apa yang dimaksud dengan ikatan kovalen nonpolar?",
      answer: "Ikatan kovalen dengan distribusi elektron merata",
    },
    { question: "Apa itu elektronegativitas?", answer: "Kemampuan atom untuk menarik elektron dalam ikatan kimia" },
    { question: "Unsur mana yang memiliki elektronegativitas tertinggi?", answer: "Fluorin (F)" },
    {
      question: "Apa yang dimaksud dengan ikatan hidrogen?",
      answer: "Ikatan lemah antara atom hidrogen dengan atom elektronegatif",
    },
    {
      question: "Sebutkan contoh senyawa dengan ikatan hidrogen!",
      answer: "Air (H₂O), amonia (NH₃), hidrogen fluorida (HF)",
    },
    { question: "Apa yang dimaksud dengan gaya van der Waals?", answer: "Gaya tarik lemah antar molekul" },
    {
      question: "Apa perbedaan ikatan sigma dan pi?",
      answer: "Sigma: tumpang tindih orbital head-to-head; Pi: tumpang tindih orbital side-to-side",
    },
    {
      question: "Apa yang dimaksud dengan hibridisasi?",
      answer: "Pencampuran orbital atom untuk membentuk orbital hibrida",
    },
    {
      question: "Sebutkan jenis hibridisasi sp³!",
      answer: "Hibridisasi dengan geometri tetrahedral, sudut ikatan 109,5°",
    },
    { question: "Apa geometri molekul dengan hibridisasi sp²?", answer: "Trigonal planar dengan sudut ikatan 120°" },
    { question: "Apa geometri molekul dengan hibridisasi sp?", answer: "Linear dengan sudut ikatan 180°" },
    {
      question: "Apa yang dimaksud dengan resonansi?",
      answer: "Delokalisasi elektron dalam molekul dengan beberapa struktur Lewis",
    },
    {
      question: "Apa sifat umum senyawa ionik?",
      answer: "Titik leleh tinggi, larut dalam air, menghantarkan listrik dalam larutan",
    },
    {
      question: "Apa sifat umum senyawa kovalen?",
      answer: "Titik leleh rendah, tidak larut dalam air, tidak menghantarkan listrik",
    },
    {
      question: "Apa yang dimaksud dengan momen dipol?",
      answer: "Ukuran polaritas molekul akibat distribusi muatan tidak merata",
    },
  ],

  "struktur-atom": [
    { question: "Apa model atom Dalton?", answer: "Atom adalah bola pejal yang tidak dapat dibagi lagi" },
    {
      question: "Apa model atom Thomson?",
      answer: "Atom seperti roti kismis dengan elektron tersebar dalam muatan positif",
    },
    {
      question: "Apa model atom Rutherford?",
      answer: "Atom memiliki inti kecil bermuatan positif dengan elektron mengelilinginya",
    },
    {
      question: "Apa model atom Bohr?",
      answer: "Elektron mengelilingi inti dalam lintasan tertentu dengan energi tetap",
    },
    {
      question: "Apa prinsip ketidakpastian Heisenberg?",
      answer: "Tidak dapat menentukan posisi dan momentum elektron secara bersamaan dengan tepat",
    },
    {
      question: "Apa yang dimaksud dengan orbital?",
      answer: "Daerah ruang di sekitar inti atom dengan probabilitas tertinggi menemukan elektron",
    },
    { question: "Sebutkan jenis-jenis orbital!", answer: "Orbital s, p, d, dan f" },
    { question: "Berapa elektron maksimal dalam orbital s?", answer: "2 elektron" },
    { question: "Berapa elektron maksimal dalam subkulit p?", answer: "6 elektron (3 orbital × 2 elektron)" },
    { question: "Apa aturan Aufbau?", answer: "Elektron mengisi orbital dari tingkat energi rendah ke tinggi" },
    { question: "Apa aturan Hund?", answer: "Elektron mengisi orbital dengan spin paralel sebelum berpasangan" },
    {
      question: "Apa prinsip larangan Pauli?",
      answer: "Tidak ada dua elektron dalam atom yang memiliki keempat bilangan kuantum sama",
    },
    { question: "Apa bilangan kuantum utama (n)?", answer: "Menentukan tingkat energi dan ukuran orbital" },
    { question: "Apa bilangan kuantum azimut (l)?", answer: "Menentukan bentuk orbital" },
    { question: "Apa bilangan kuantum magnetik (m)?", answer: "Menentukan orientasi orbital dalam ruang" },
    { question: "Apa bilangan kuantum spin (s)?", answer: "Menentukan arah putaran elektron (+½ atau -½)" },
    {
      question: "Bagaimana susunan tabel periodik modern?",
      answer: "Berdasarkan nomor atom (jumlah proton) yang meningkat",
    },
    {
      question: "Apa yang dimaksud dengan periode dalam tabel periodik?",
      answer: "Baris horizontal yang menunjukkan jumlah kulit elektron",
    },
    {
      question: "Apa yang dimaksud dengan golongan dalam tabel periodik?",
      answer: "Kolom vertikal dengan sifat kimia serupa",
    },
    {
      question: "Apa sifat periodik jari-jari atom?",
      answer: "Menurun dari kiri ke kanan dalam periode, bertambah dari atas ke bawah dalam golongan",
    },
  ],

  "molekul-mol": [
    { question: "Apa definisi mol?", answer: "Satuan jumlah zat yang mengandung 6,022 × 10²³ partikel" },
    { question: "Berapa nilai tetapan Avogadro?", answer: "6,022 × 10²³ partikel/mol" },
    { question: "Apa yang dimaksud dengan massa molar?", answer: "Massa satu mol zat dalam satuan gram/mol" },
    { question: "Bagaimana menghitung jumlah mol dari massa?", answer: "mol = massa (g) / massa molar (g/mol)" },
    { question: "Apa yang dimaksud dengan persamaan kimia?", answer: "Representasi simbolik dari reaksi kimia" },
    {
      question: "Apa yang dimaksud dengan koefisien dalam persamaan kimia?",
      answer: "Angka di depan rumus kimia yang menunjukkan jumlah mol",
    },
    {
      question: "Apa hukum kekekalan massa?",
      answer: "Massa total reaktan sama dengan massa total produk dalam reaksi kimia",
    },
    {
      question: "Bagaimana cara menyetarakan persamaan kimia?",
      answer: "Menyamakan jumlah atom setiap unsur di ruas kiri dan kanan",
    },
    { question: "Apa yang dimaksud dengan reaktan?", answer: "Zat yang bereaksi (di ruas kiri persamaan)" },
    { question: "Apa yang dimaksud dengan produk?", answer: "Zat hasil reaksi (di ruas kanan persamaan)" },
    { question: "Berapa volume 1 mol gas pada STP?", answer: "22,4 liter" },
    { question: "Apa kondisi STP?", answer: "Suhu 0°C (273 K) dan tekanan 1 atm" },
    { question: "Bagaimana menghitung jumlah partikel dari mol?", answer: "Jumlah partikel = mol × 6,022 × 10²³" },
    {
      question: "Apa yang dimaksud dengan rumus empiris?",
      answer: "Rumus yang menunjukkan perbandingan atom paling sederhana",
    },
    {
      question: "Apa yang dimaksud dengan rumus molekul?",
      answer: "Rumus yang menunjukkan jumlah atom sebenarnya dalam molekul",
    },
    { question: "Bagaimana hubungan rumus molekul dan empiris?", answer: "Rumus molekul = (rumus empiris) × n" },
    { question: "Apa yang dimaksud dengan persen komposisi?", answer: "Persentase massa setiap unsur dalam senyawa" },
    { question: "Bagaimana menghitung persen komposisi?", answer: "% unsur = (massa unsur / massa senyawa) × 100%" },
    { question: "Apa yang dimaksud dengan kadar kemurnian?", answer: "Persentase zat murni dalam sampel" },
    {
      question: "Bagaimana menghitung massa molekul relatif?",
      answer: "Jumlah massa atom relatif semua atom dalam molekul",
    },
  ],

  stoikiometri: [
    {
      question: "Apa yang dimaksud dengan stoikiometri?",
      answer: "Perhitungan kuantitatif dalam reaksi kimia berdasarkan persamaan kimia setara",
    },
    {
      question: "Apa yang dimaksud dengan pereaksi pembatas?",
      answer: "Reaktan yang habis terlebih dahulu dan membatasi jumlah produk",
    },
    { question: "Apa yang dimaksud dengan pereaksi berlebih?", answer: "Reaktan yang tersisa setelah reaksi selesai" },
    {
      question: "Bagaimana menentukan pereaksi pembatas?",
      answer: "Hitung mol setiap reaktan, bagi dengan koefisien, yang terkecil adalah pembatas",
    },
    {
      question: "Apa yang dimaksud dengan hasil teoritis?",
      answer: "Jumlah produk maksimal yang dapat dihasilkan berdasarkan perhitungan",
    },
    {
      question: "Apa yang dimaksud dengan hasil aktual?",
      answer: "Jumlah produk yang benar-benar diperoleh dari eksperimen",
    },
    { question: "Bagaimana menghitung persen hasil?", answer: "% hasil = (hasil aktual / hasil teoritis) × 100%" },
    {
      question: "Apa langkah-langkah perhitungan stoikiometri?",
      answer:
        "1) Setarakan persamaan 2) Konversi ke mol 3) Gunakan perbandingan mol 4) Konversi ke satuan yang diminta",
    },
    { question: "Bagaimana konversi massa ke mol?", answer: "mol = massa (g) / Mr (g/mol)" },
    { question: "Bagaimana konversi mol ke massa?", answer: "massa (g) = mol × Mr (g/mol)" },
    { question: "Bagaimana konversi volume gas ke mol pada STP?", answer: "mol = volume (L) / 22,4 (L/mol)" },
    { question: "Bagaimana konversi mol ke volume gas pada STP?", answer: "volume (L) = mol × 22,4 (L/mol)" },
    { question: "Apa persamaan gas ideal?", answer: "PV = nRT" },
    { question: "Berapa nilai tetapan gas ideal (R)?", answer: "0,082 L·atm/(mol·K) atau 8,314 J/(mol·K)" },
    { question: "Bagaimana menghitung mol dari konsentrasi?", answer: "mol = Molaritas (M) × Volume (L)" },
    { question: "Apa yang dimaksud dengan molaritas?", answer: "Jumlah mol zat terlarut per liter larutan" },
    { question: "Bagaimana rumus molaritas?", answer: "M = mol zat terlarut / volume larutan (L)" },
    { question: "Apa yang dimaksud dengan molalitas?", answer: "Jumlah mol zat terlarut per kg pelarut" },
    { question: "Bagaimana rumus molalitas?", answer: "m = mol zat terlarut / massa pelarut (kg)" },
    {
      question: "Apa perbedaan molaritas dan molalitas?",
      answer: "Molaritas per liter larutan, molalitas per kg pelarut",
    },
  ],

  gas: [
    {
      question: "Apa sifat-sifat gas ideal?",
      answer: "Partikel titik, tidak ada gaya antar partikel, tumbukan elastis, gerak acak",
    },
    {
      question: "Apa hukum Boyle?",
      answer: "Pada suhu tetap, tekanan gas berbanding terbalik dengan volume (P₁V₁ = P₂V₂)",
    },
    {
      question: "Apa hukum Charles?",
      answer: "Pada tekanan tetap, volume gas berbanding lurus dengan suhu (V₁/T₁ = V₂/T₂)",
    },
    {
      question: "Apa hukum Gay-Lussac?",
      answer: "Pada volume tetap, tekanan gas berbanding lurus dengan suhu (P₁/T₁ = P₂/T₂)",
    },
    {
      question: "Apa hukum Avogadro?",
      answer: "Pada suhu dan tekanan sama, volume gas berbanding lurus dengan jumlah mol",
    },
    { question: "Apa persamaan gas ideal?", answer: "PV = nRT" },
    { question: "Apa kondisi STP?", answer: "Suhu 0°C (273 K), tekanan 1 atm" },
    { question: "Berapa volume 1 mol gas pada STP?", answer: "22,4 liter" },
    {
      question: "Apa yang dimaksud dengan tekanan parsial?",
      answer: "Tekanan yang diberikan oleh satu komponen gas dalam campuran",
    },
    {
      question: "Apa hukum Dalton tentang tekanan parsial?",
      answer: "Tekanan total = jumlah tekanan parsial semua komponen",
    },
    { question: "Bagaimana menghitung tekanan parsial?", answer: "P parsial = fraksi mol × P total" },
    {
      question: "Apa yang dimaksud dengan fraksi mol?",
      answer: "Perbandingan mol suatu komponen dengan total mol campuran",
    },
    { question: "Apa hukum Graham tentang efusi?", answer: "Laju efusi berbanding terbalik dengan akar massa molar" },
    { question: "Bagaimana rumus hukum Graham?", answer: "r₁/r₂ = √(M₂/M₁)" },
    {
      question: "Apa perbedaan efusi dan difusi?",
      answer: "Efusi: gas keluar melalui lubang kecil; Difusi: gas bercampur",
    },
    { question: "Apa persamaan van der Waals?", answer: "(P + a/V²)(V - b) = RT untuk gas nyata" },
    {
      question: "Mengapa gas nyata menyimpang dari gas ideal?",
      answer: "Karena adanya gaya antar molekul dan volume molekul",
    },
    { question: "Kapan gas berperilaku paling ideal?", answer: "Pada suhu tinggi dan tekanan rendah" },
    {
      question: "Apa yang dimaksud dengan faktor kompresibilitas?",
      answer: "Z = PV/nRT, ukuran penyimpangan dari gas ideal",
    },
    { question: "Bagaimana menghitung massa jenis gas?", answer: "ρ = PM/RT atau ρ = massa/volume" },
  ],

  "molekul-material": [
    {
      question: "Bagaimana struktur molekul mempengaruhi sifat material?",
      answer: "Struktur menentukan ikatan, polaritas, dan interaksi antar molekul",
    },
    {
      question: "Apa perbedaan kristal ionik dan kovalen?",
      answer: "Ionik: ion bermuatan, kovalen: atom terikat kovalen dalam jaringan",
    },
    { question: "Apa sifat kristal ionik?", answer: "Keras, rapuh, titik leleh tinggi, larut dalam air" },
    { question: "Apa sifat kristal kovalen?", answer: "Sangat keras, titik leleh sangat tinggi, tidak larut air" },
    { question: "Sebutkan contoh kristal kovalen!", answer: "Intan, grafit, silikon karbida (SiC)" },
    {
      question: "Apa yang dimaksud dengan polimer?",
      answer: "Molekul besar yang terdiri dari unit berulang (monomer)",
    },
    {
      question: "Apa perbedaan polimer termoplastik dan termoset?",
      answer: "Termoplastik: dapat dilunakkan, termoset: tidak dapat dilunakkan",
    },
    { question: "Apa yang dimaksud dengan kristalitas polimer?", answer: "Tingkat keteraturan susunan rantai polimer" },
    {
      question: "Bagaimana ikatan hidrogen mempengaruhi sifat material?",
      answer: "Meningkatkan titik didih, viskositas, dan kekuatan mekanik",
    },
    { question: "Apa yang dimaksud dengan gaya van der Waals?", answer: "Gaya tarik lemah antar molekul nonpolar" },
    {
      question: "Mengapa intan sangat keras?",
      answer: "Karena setiap atom karbon terikat kovalen dengan 4 atom karbon lain",
    },
    {
      question: "Mengapa grafit dapat menghantarkan listrik?",
      answer: "Karena memiliki elektron terdelokalisasi dalam lapisan",
    },
    { question: "Apa yang dimaksud dengan allotropi?", answer: "Bentuk berbeda dari unsur yang sama" },
    { question: "Sebutkan allotrop karbon!", answer: "Intan, grafit, fuleren, nanotube karbon" },
    { question: "Apa sifat logam secara umum?", answer: "Menghantarkan listrik dan panas, mengkilap, dapat ditempa" },
    {
      question: "Apa teori elektron bebas dalam logam?",
      answer: "Elektron valensi bergerak bebas membentuk 'lautan elektron'",
    },
    { question: "Apa yang dimaksud dengan paduan?", answer: "Campuran logam dengan logam atau non-logam lain" },
    {
      question: "Mengapa paduan sering lebih kuat dari logam murni?",
      answer: "Karena atom asing mengganggu susunan kristal reguler",
    },
    {
      question: "Apa yang dimaksud dengan semikonduktor?",
      answer: "Material dengan konduktivitas listrik antara konduktor dan isolator",
    },
    {
      question: "Bagaimana doping mempengaruhi semikonduktor?",
      answer: "Menambah atom pengotor untuk mengubah sifat listrik",
    },
  ],

  termokimia: [
    {
      question: "Apa yang dimaksud dengan termokimia?",
      answer: "Cabang kimia yang mempelajari perubahan energi dalam reaksi kimia",
    },
    { question: "Apa yang dimaksud dengan entalpi?", answer: "Kandungan kalor sistem pada tekanan tetap" },
    { question: "Apa simbol entalpi?", answer: "H (dari bahasa Yunani: enthalpein = memanaskan)" },
    {
      question: "Apa yang dimaksud dengan perubahan entalpi (ΔH)?",
      answer: "Selisih entalpi produk dengan entalpi reaktan",
    },
    { question: "Apa ciri reaksi eksotermik?", answer: "Melepaskan kalor, ΔH negatif, suhu lingkungan naik" },
    { question: "Apa ciri reaksi endotermik?", answer: "Menyerap kalor, ΔH positif, suhu lingkungan turun" },
    {
      question: "Apa yang dimaksud dengan entalpi pembentukan standar?",
      answer: "Perubahan entalpi pembentukan 1 mol senyawa dari unsur-unsurnya",
    },
    { question: "Berapa entalpi pembentukan unsur bebas?", answer: "Nol (0 kJ/mol)" },
    {
      question: "Apa yang dimaksud dengan entalpi pembakaran?",
      answer: "Perubahan entalpi pembakaran sempurna 1 mol zat",
    },
    { question: "Apa hukum Hess?", answer: "Perubahan entalpi reaksi tidak bergantung pada jalannya reaksi" },
    { question: "Bagaimana menghitung ΔH reaksi dari ΔHf°?", answer: "ΔH = Σ ΔHf° produk - Σ ΔHf° reaktan" },
    {
      question: "Apa yang dimaksud dengan kalorimetri?",
      answer: "Pengukuran kalor yang diserap atau dilepas dalam reaksi",
    },
    { question: "Apa rumus kalor (q)?", answer: "q = m × c × ΔT" },
    {
      question: "Apa yang dimaksud dengan kapasitas kalor?",
      answer: "Jumlah kalor yang diperlukan untuk menaikkan suhu 1°C",
    },
    {
      question: "Apa yang dimaksud dengan kalor jenis?",
      answer: "Kalor yang diperlukan untuk menaikkan suhu 1 gram zat sebesar 1°C",
    },
    { question: "Berapa kalor jenis air?", answer: "4,18 J/(g·°C)" },
    {
      question: "Apa yang dimaksud dengan entalpi penguapan?",
      answer: "Kalor yang diperlukan untuk menguapkan 1 mol zat cair",
    },
    {
      question: "Apa yang dimaksud dengan entalpi peleburan?",
      answer: "Kalor yang diperlukan untuk melebur 1 mol zat padat",
    },
    { question: "Apa kondisi standar dalam termokimia?", answer: "25°C (298 K), 1 atm, konsentrasi 1 M" },
    { question: "Bagaimana hubungan ΔH dan ΔU?", answer: "ΔH = ΔU + Δ(PV) = ΔU + ΔnRT untuk gas" },
  ],

  elektrokimia: [
    {
      question: "Apa yang dimaksud dengan elektrokimia?",
      answer: "Cabang kimia yang mempelajari hubungan listrik dan reaksi kimia",
    },
    {
      question: "Apa yang dimaksud dengan reaksi redoks?",
      answer: "Reaksi yang melibatkan transfer elektron (reduksi-oksidasi)",
    },
    { question: "Apa yang dimaksud dengan oksidasi?", answer: "Pelepasan elektron atau peningkatan bilangan oksidasi" },
    { question: "Apa yang dimaksud dengan reduksi?", answer: "Penerimaan elektron atau penurunan bilangan oksidasi" },
    { question: "Apa yang dimaksud dengan oksidator?", answer: "Zat yang menyebabkan oksidasi (menerima elektron)" },
    { question: "Apa yang dimaksud dengan reduktor?", answer: "Zat yang menyebabkan reduksi (memberikan elektron)" },
    {
      question: "Apa yang dimaksud dengan bilangan oksidasi?",
      answer: "Muatan formal atom jika semua elektron ikatan diberikan ke atom yang lebih elektronegatif",
    },
    { question: "Berapa bilangan oksidasi unsur bebas?", answer: "Nol (0)" },
    {
      question: "Berapa bilangan oksidasi hidrogen dalam senyawa?",
      answer: "Umumnya +1 (kecuali dalam hidrida logam = -1)",
    },
    {
      question: "Berapa bilangan oksidasi oksigen dalam senyawa?",
      answer: "Umumnya -2 (kecuali dalam peroksida = -1)",
    },
    {
      question: "Apa yang dimaksud dengan sel galvani?",
      answer: "Sel elektrokimia yang menghasilkan listrik dari reaksi redoks spontan",
    },
    {
      question: "Apa yang dimaksud dengan sel elektrolisis?",
      answer: "Sel elektrokimia yang menggunakan listrik untuk reaksi redoks non-spontan",
    },
    { question: "Apa fungsi jembatan garam?", answer: "Menjaga netralitas muatan dengan mengalirkan ion" },
    { question: "Apa yang dimaksud dengan anoda?", answer: "Elektroda tempat terjadinya oksidasi" },
    { question: "Apa yang dimaksud dengan katoda?", answer: "Elektroda tempat terjadinya reduksi" },
    { question: "Apa yang dimaksud dengan potensial sel?", answer: "Beda potensial antara katoda dan anoda" },
    { question: "Bagaimana menghitung potensial sel standar?", answer: "E°sel = E°katoda - E°anoda" },
    { question: "Apa persamaan Nernst?", answer: "E = E° - (RT/nF) ln Q" },
    { question: "Apa hukum Faraday I?", answer: "Massa zat yang dihasilkan sebanding dengan muatan listrik" },
    { question: "Apa hukum Faraday II?", answer: "Massa zat yang dihasilkan sebanding dengan massa ekuivalen" },
  ],

  termodinamika: [
    {
      question: "Apa yang dimaksud dengan termodinamika?",
      answer: "Ilmu yang mempelajari hubungan antara kalor, kerja, dan energi",
    },
    { question: "Apa hukum termodinamika I?", answer: "Energi tidak dapat diciptakan atau dimusnahkan (ΔU = q - w)" },
    { question: "Apa hukum termodinamika II?", answer: "Entropi alam semesta selalu meningkat" },
    { question: "Apa hukum termodinamika III?", answer: "Entropi kristal sempurna pada 0 K adalah nol" },
    {
      question: "Apa yang dimaksud dengan sistem termodinamika?",
      answer: "Bagian alam semesta yang sedang dipelajari",
    },
    { question: "Apa yang dimaksud dengan lingkungan?", answer: "Segala sesuatu di luar sistem" },
    {
      question: "Apa perbedaan sistem terbuka, tertutup, dan terisolasi?",
      answer: "Terbuka: pertukaran materi dan energi; Tertutup: hanya energi; Terisolasi: tidak ada pertukaran",
    },
    {
      question: "Apa yang dimaksud dengan energi dalam (U)?",
      answer: "Total energi kinetik dan potensial partikel dalam sistem",
    },
    { question: "Apa yang dimaksud dengan entropi (S)?", answer: "Ukuran ketidakteraturan atau kekacauan sistem" },
    {
      question: "Apa yang dimaksud dengan energi bebas Gibbs (G)?",
      answer: "G = H - TS, menentukan spontanitas reaksi pada T dan P tetap",
    },
    { question: "Kapan reaksi spontan berdasarkan ΔG?", answer: "ΔG < 0 (negatif)" },
    { question: "Kapan reaksi tidak spontan berdasarkan ΔG?", answer: "ΔG > 0 (positif)" },
    { question: "Kapan sistem dalam kesetimbangan berdasarkan ΔG?", answer: "ΔG = 0" },
    { question: "Bagaimana menghitung ΔG°?", answer: "ΔG° = ΔH° - TΔS°" },
    { question: "Apa hubungan ΔG° dengan konstanta kesetimbangan?", answer: "ΔG° = -RT ln K" },
    {
      question: "Apa yang dimaksud dengan proses reversibel?",
      answer: "Proses yang dapat dikembalikan tanpa meninggalkan jejak",
    },
    {
      question: "Apa yang dimaksud dengan proses irreversibel?",
      answer: "Proses yang tidak dapat dikembalikan ke keadaan semula",
    },
    {
      question: "Apa yang dimaksud dengan fungsi keadaan?",
      answer: "Sifat yang hanya bergantung pada keadaan sistem, bukan jalannya",
    },
    {
      question: "Sebutkan contoh fungsi keadaan!",
      answer: "Energi dalam (U), entalpi (H), entropi (S), energi bebas Gibbs (G)",
    },
    {
      question: "Apa yang dimaksud dengan siklus Carnot?",
      answer: "Siklus termodinamika ideal dengan efisiensi maksimum",
    },
  ],

  kesetimbangan: [
    {
      question: "Apa yang dimaksud dengan kesetimbangan kimia?",
      answer: "Keadaan dimana laju reaksi maju sama dengan laju reaksi balik",
    },
    {
      question: "Apa ciri-ciri kesetimbangan dinamis?",
      answer: "Laju reaksi maju = laju reaksi balik, konsentrasi tetap, sifat makroskopis tetap",
    },
    {
      question: "Apa yang dimaksud dengan konstanta kesetimbangan (K)?",
      answer: "Perbandingan konsentrasi produk terhadap reaktan pada kesetimbangan",
    },
    { question: "Bagaimana rumus Kc?", answer: "Kc = [produk]^koefisien / [reaktan]^koefisien" },
    {
      question: "Bagaimana rumus Kp?",
      answer: "Kp = (tekanan parsial produk)^koefisien / (tekanan parsial reaktan)^koefisien",
    },
    { question: "Apa hubungan Kp dan Kc?", answer: "Kp = Kc(RT)^Δn" },
    { question: "Apa yang dimaksud dengan Δn?", answer: "Selisih koefisien produk gas dengan reaktan gas" },
    {
      question: "Apa arti nilai K yang besar (K >> 1)?",
      answer: "Kesetimbangan bergeser ke kanan (produk lebih banyak)",
    },
    {
      question: "Apa arti nilai K yang kecil (K << 1)?",
      answer: "Kesetimbangan bergeser ke kiri (reaktan lebih banyak)",
    },
    {
      question: "Apa prinsip Le Chatelier?",
      answer: "Jika sistem kesetimbangan diberi gangguan, sistem akan bergeser untuk mengurangi gangguan",
    },
    {
      question: "Bagaimana pengaruh konsentrasi terhadap kesetimbangan?",
      answer: "Menambah reaktan atau mengurangi produk menggeser ke kanan",
    },
    {
      question: "Bagaimana pengaruh tekanan terhadap kesetimbangan?",
      answer: "Tekanan tinggi menggeser ke arah jumlah mol gas yang lebih sedikit",
    },
    {
      question: "Bagaimana pengaruh suhu terhadap kesetimbangan?",
      answer: "Suhu tinggi menggeser ke arah reaksi endotermik",
    },
    {
      question: "Bagaimana pengaruh katalis terhadap kesetimbangan?",
      answer: "Katalis tidak menggeser kesetimbangan, hanya mempercepat tercapainya kesetimbangan",
    },
    {
      question: "Apa yang dimaksud dengan quotient reaksi (Q)?",
      answer: "Perbandingan konsentrasi pada saat tertentu (belum setimbang)",
    },
    {
      question: "Bagaimana menentukan arah reaksi dari Q dan K?",
      answer: "Q < K: reaksi ke kanan; Q > K: reaksi ke kiri; Q = K: setimbang",
    },
    {
      question: "Apa yang dimaksud dengan kesetimbangan heterogen?",
      answer: "Kesetimbangan dengan fase berbeda (padat, cair, gas)",
    },
    {
      question: "Mengapa zat padat dan cair tidak masuk dalam rumus K?",
      answer: "Karena konsentrasinya dianggap tetap",
    },
    {
      question: "Apa yang dimaksud dengan kesetimbangan asam-basa?",
      answer: "Kesetimbangan transfer proton antara asam dan basa",
    },
    {
      question: "Apa yang dimaksud dengan kesetimbangan kelarutan?",
      answer: "Kesetimbangan antara zat padat dengan ion-ionnya dalam larutan",
    },
  ],
}

// Module titles mapping
const moduleNames = {
  "atom-molekul": "Modul 1: Atom dan Molekul",
  "ikatan-kimia": "Modul 2: Ikatan Kimia dan Struktur",
  "struktur-atom": "Modul 3: Struktur Atom dan Sistem Periodik",
  "molekul-mol": "Modul 4: Molekul, Mol, dan Persamaan Kimia",
  stoikiometri: "Modul 5: Stoikiometri",
  gas: "Modul 6: Gas",
  "molekul-material": "Modul 7: Molekul dan Material",
  termokimia: "Modul 8: Termokimia",
  elektrokimia: "Modul 9: Elektrokimia",
  termodinamika: "Modul 10: Termodinamika",
  kesetimbangan: "Modul 11: Kesetimbangan Kimia",
}

// Global variables
let currentModule = ""
let currentCard = 0
let flashcards = []

// DOM elements
const moduleSelection = document.getElementById("moduleSelection")
const flashcardInterface = document.getElementById("flashcardInterface")
const currentModuleTitle = document.getElementById("currentModuleTitle")
const flashcard = document.getElementById("flashcard")
const questionElement = document.getElementById("question")
const answerElement = document.getElementById("answer")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const cardCounter = document.getElementById("cardCounter")
const progress = document.getElementById("progress")
const backToModules = document.getElementById("backToModules")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
})

function setupEventListeners() {
  // Module selection
  const moduleCards = document.querySelectorAll(".module-card")
  moduleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const module = card.dataset.module
      startModule(module)
    })
  })

  // Flashcard controls
  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped")
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

  backToModules.addEventListener("click", () => {
    showModuleSelection()
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (flashcardInterface.style.display !== "none") {
      switch (e.key) {
        case "ArrowLeft":
          if (currentCard > 0) {
            currentCard--
            updateCard()
          }
          break
        case "ArrowRight":
          if (currentCard < flashcards.length - 1) {
            currentCard++
            updateCard()
          }
          break
        case " ":
          e.preventDefault()
          flashcard.classList.toggle("flipped")
          break
        case "Escape":
          showModuleSelection()
          break
      }
    }
  })
}

function startModule(module) {
  currentModule = module
  flashcards = flashcardData[module]
  currentCard = 0

  currentModuleTitle.textContent = moduleNames[module]

  moduleSelection.style.display = "none"
  flashcardInterface.style.display = "block"

  updateCard()
}

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

function showModuleSelection() {
  flashcardInterface.style.display = "none"
  moduleSelection.style.display = "block"
  currentModule = ""
  currentCard = 0
  flashcards = []
}
