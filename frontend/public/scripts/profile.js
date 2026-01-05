;(() => {
  const API = window.API;
  const Auth = window.Auth;

  const $ = (id) => document.getElementById(id);

  const el = {
    avatarText: $("avatarText"),
    userName: $("userName"),
    userEmail: $("userEmail"),
    userCreated: $("userCreated"),
    btnLogout: $("btnLogout"),

    warningBox: $("warningBox"),
    warningText: $("warningText"),

    skelWrap: $("skelWrap"),
    contentWrap: $("contentWrap"),

    statLearning: $("statLearning"),
    chipLearning: $("chipLearning"),
    statFlashAvg: $("statFlashAvg"),
    chipFlash: $("chipFlash"),
    statQuizBest: $("statQuizBest"),
    chipQuiz: $("chipQuiz"),
    statGames: $("statGames"),

    segmentRow: $("segmentRow"),
    fadeLeft: $("fadeLeft"),
    fadeRight: $("fadeRight"),

    sectionTitle: $("sectionTitle"),
    sectionSub: $("sectionSub"),
    panelCard: $("panelCard"),
  };

  function showWarning(msg) {
    if (!msg) {
      el.warningBox.classList.add("hidden");
      el.warningText.textContent = "";
      return;
    }
    el.warningText.textContent = msg;
    el.warningBox.classList.remove("hidden");
  }

  function setLoading(isLoading) {
    if (isLoading) {
      el.skelWrap.classList.remove("hidden");
      el.contentWrap.classList.add("hidden");
    } else {
      el.skelWrap.classList.add("hidden");
      el.contentWrap.classList.remove("hidden");
    }
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDateID(iso) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function clampPct(p) {
    const n = Math.round(Number(p) || 0);
    return Math.max(0, Math.min(100, n));
  }

  function getInitials(nameOrEmail) {
    const s = String(nameOrEmail || "").trim();
    if (!s) return "VL";
    if (s.includes("@")) return s.slice(0, 2).toUpperCase();
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function latestFlashcardsPerModule(items = []) {
    const map = new Map();
    items.forEach((it) => {
      const mod = it.module || "Modul";
      const prev = map.get(mod);
      const t = new Date(it.at).getTime();
      const pt = prev ? new Date(prev.at).getTime() : -1;
      if (!prev || t > pt) map.set(mod, it);
    });
    return Array.from(map.values());
  }

  function sumLearning(items = []) {
    const total = items.length;
    const modules = new Set(items.map((x) => x.module));
    return { totalActions: total, uniqueModules: modules.size };
  }

  function quizSummary(items = []) {
    if (!items.length) return { attempts: 0, bestPct: 0, avgPct: 0 };
    const pcts = items.map((q) => clampPct((Number(q.score || 0) / Math.max(1, Number(q.total || 0))) * 100));
    const best = Math.max(...pcts);
    const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    return { attempts: items.length, bestPct: best, avgPct: avg };
  }

  function gamesSummary(items = []) {
    const completed = items.filter((g) => String(g.metric || "").toLowerCase() === "completed");
    const totalCompletions = completed.reduce((acc, g) => acc + (Number(g.value || 0) || 0), 0);

    const byGame = new Map();
    completed.forEach((g) => {
      const k = String(g.game || "game").toLowerCase();
      byGame.set(k, (byGame.get(k) || 0) + (Number(g.value || 0) || 0));
    });

    const top = Array.from(byGame.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k, v]) => ({ game: k, count: v }));

    return { totalCompletions, top };
  }

  function prettyGameName(key) {
    if (key === "acid-base-mixer") return "Acid-Base Mixer";
    if (key === "periodic-table") return "Periodic Table";
    return String(key || "game")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function fetchProfileFromBackend() {
    // 1) coba /profile
    let prof = null;
    try {
      prof = await Auth.getProfile(); // sudah handle auth+token
    } catch (e) {
      prof = {};
    }

    const out = { ...prof };

    const needLearning = !Array.isArray(out.learning);
    const needFlashcards = !Array.isArray(out.flashcards);
    const needQuizzes = !Array.isArray(out.quizzes);
    const needGames = !Array.isArray(out.games);

    // fallback ke endpoint progress lama (format { ok, count, data })
    if (needLearning) {
      const r = await Auth.fetchProtected("/progress/learning?limit=100", { method: "GET" });
      out.learning = r?.data ?? [];
    }
    if (needFlashcards) {
      const r = await Auth.fetchProtected("/progress/flashcard", { method: "GET" });
      out.flashcards = r?.data ?? [];
    }
    if (needQuizzes) {
      const r = await Auth.fetchProtected("/progress/quiz?limit=100", { method: "GET" });
      out.quizzes = r?.data ?? [];
    }
    if (needGames) {
      const r = await Auth.fetchProtected("/progress/game?limit=100", { method: "GET" });
      out.games = r?.data ?? [];
    }

    // pastikan user minimal ada dari cache (Auth.login sudah simpan)
    if (!out.user) {
      const u = Auth.getUser?.();
      out.user = {
        email: u?.email || localStorage.getItem("user_email") || "-",
        full_name: u?.fullName || localStorage.getItem("user_name") || "Pengguna",
        created_at: u?.created_at || localStorage.getItem("user_created") || null,
      };
    }

    return out;
  }

  function renderRowItem({ title, right, sub }) {
    return `
      <div class="row-item">
        <div class="row-left">
          <div class="row-title">${escapeHtml(title)}</div>
          ${sub ? `<div class="row-sub">${escapeHtml(sub)}</div>` : ""}
        </div>
        <div class="row-right">${escapeHtml(right)}</div>
      </div>
    `;
  }

  function renderEmpty(text) {
    return `<div class="empty">${escapeHtml(text)}</div>`;
  }

  function renderFlashProgress(it) {
    const total = Math.max(1, Number(it.total || 0));
    const cur = Math.max(0, Number(it.current || 0));
    const pct = clampPct((cur / total) * 100);

    return `
      <div class="progress-block">
        <div class="progress-top">
          <div class="row-title">${escapeHtml(it.module || "Modul")}</div>
          <div class="progress-pct">${pct}%</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-sub">${cur}/${total} kartu • update ${escapeHtml(formatDateID(it.at))}</div>
      </div>
    `;
  }

  function renderSummaryChip(label, value) {
    return `
      <div class="summary-chip">
        <div class="summary-label">${escapeHtml(label)}</div>
        <div class="summary-value">${escapeHtml(value)}</div>
      </div>
    `;
  }

  function setActiveTab(tabKey) {
    const buttons = el.segmentRow.querySelectorAll(".segment-item");
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabKey));
  }

  function renderTab(tabKey, data) {
    const learning = data.learning || [];
    const flashcards = latestFlashcardsPerModule(data.flashcards || []);
    const quizzes = data.quizzes || [];
    const games = data.games || [];

    if (tabKey === "learning") {
      el.sectionTitle.textContent = "Progres Pembelajaran";
      el.sectionSub.textContent = "Riwayat aksi pada modul pembelajaran";
      el.panelCard.innerHTML =
        learning.length === 0
          ? renderEmpty("Belum ada aktivitas pembelajaran.")
          : learning.slice(0, 12).map((it) =>
              renderRowItem({
                title: it.module || "Modul",
                right: it.action || "-",
                sub: formatDateID(it.at),
              })
            ).join("");
      return;
    }

    if (tabKey === "flashcards") {
      el.sectionTitle.textContent = "Flashcard";
      el.sectionSub.textContent = "Progres terbaru per modul";
      el.panelCard.innerHTML =
        flashcards.length === 0
          ? renderEmpty("Belum ada progres flashcard.")
          : flashcards.map(renderFlashProgress).join("");
      return;
    }

    if (tabKey === "quizzes") {
      const qs = quizSummary(quizzes);
      el.sectionTitle.textContent = "Kuis";
      el.sectionSub.textContent = "Skor & ringkasan performa";

      const summaryHtml = `
        <div class="summary-row">
          ${renderSummaryChip("Percobaan", String(qs.attempts))}
          ${renderSummaryChip("Best", `${qs.bestPct}%`)}
          ${renderSummaryChip("Rata-rata", `${qs.avgPct}%`)}
        </div>
        <div style="height:12px"></div>
      `;

      const listHtml =
        quizzes.length === 0
          ? renderEmpty("Belum ada hasil kuis.")
          : quizzes.slice(0, 12).map((q) => {
              const total = Math.max(1, Number(q.total || 0));
              const score = Math.max(0, Number(q.score || 0));
              const pct = clampPct((score / total) * 100);
              return renderRowItem({
                title: q.module || "Kuis",
                right: `${score}/${total} (${pct}%)`,
                sub: q.at ? formatDateID(q.at) : "",
              });
            }).join("");

      el.panelCard.innerHTML = summaryHtml + listHtml;
      return;
    }

    // games
    const gs = gamesSummary(games);
    el.sectionTitle.textContent = "Games";
    el.sectionSub.textContent = "Total completion & game teratas";

    const summaryHtml = `
      <div class="summary-row">
        ${renderSummaryChip("Total selesai", String(gs.totalCompletions))}
      </div>
      <div style="height:12px"></div>
    `;

    const listHtml =
      gs.totalCompletions === 0
        ? renderEmpty("Belum ada progress games.")
        : gs.top.map((g) =>
            renderRowItem({
              title: prettyGameName(g.game),
              right: `${g.count}x`,
              sub: "completed",
            })
          ).join("");

    el.panelCard.innerHTML = summaryHtml + listHtml;
  }

  function updateFadeHints() {
    const row = el.segmentRow;
    if (!row) return;

    const max = Math.max(0, row.scrollWidth - row.clientWidth);
    const x = row.scrollLeft;

    el.fadeLeft.classList.toggle("hidden", !(x > 6));
    el.fadeRight.classList.toggle("hidden", !(max - x > 6));
  }

  function fillHeaderAndStats(data) {
    const user = data.user || {};
    const email = user.email || localStorage.getItem("user_email") || "-";
    const name = user.full_name || localStorage.getItem("user_name") || "Pengguna";
    const createdAt = user.created_at || localStorage.getItem("user_created") || null;

    el.userName.textContent = name;
    el.userEmail.textContent = email;
    el.userCreated.textContent = `Terdaftar • ${formatDateID(createdAt)}`;
    el.avatarText.textContent = getInitials(name || email);

    const learning = data.learning || [];
    const flashcards = latestFlashcardsPerModule(data.flashcards || []);
    const quizzes = data.quizzes || [];
    const games = data.games || [];

    const ls = sumLearning(learning);
    const qs = quizSummary(quizzes);
    const gs = gamesSummary(games);

    const flashAvg = (() => {
      if (!flashcards.length) return 0;
      const pcts = flashcards.map((f) =>
        clampPct((Number(f.current || 0) / Math.max(1, Number(f.total || 0))) * 100)
      );
      return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    })();

    el.statLearning.textContent = String(ls.totalActions);
    el.chipLearning.textContent = `${ls.uniqueModules} modul`;

    el.statFlashAvg.textContent = `${flashAvg}%`;
    el.chipFlash.textContent = `${flashcards.length} modul`;

    el.statQuizBest.textContent = `${qs.bestPct}%`;
    el.chipQuiz.textContent = `avg ${qs.avgPct}%`;

    el.statGames.textContent = String(gs.totalCompletions);
  }

  async function init() {
    if (!Auth?.isLoggedIn?.()) {
      Auth?.logout?.();
      return;
    }

    setLoading(true);
    showWarning(null);

    try {
      const data = await fetchProfileFromBackend();
      fillHeaderAndStats(data);

      // default tab
      const defaultTab = "learning";
      setActiveTab(defaultTab);
      renderTab(defaultTab, data);

      // tab click handler
      el.segmentRow.addEventListener("click", (e) => {
        const btn = e.target.closest(".segment-item");
        if (!btn) return;
        const tabKey = btn.dataset.tab;
        setActiveTab(tabKey);
        renderTab(tabKey, data);
      });

      // fade hint tabs
      updateFadeHints();
      el.segmentRow.addEventListener("scroll", updateFadeHints, { passive: true });
      window.addEventListener("resize", updateFadeHints);

      // logout
      el.btnLogout.addEventListener("click", () => Auth.logout());
    } catch (e) {
      showWarning(`Gagal memuat profile. (${e?.message || e})`);
    } finally {
      setLoading(false);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();