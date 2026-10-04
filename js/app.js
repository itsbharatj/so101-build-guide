(() => {
  "use strict";

  const cfg = window.SITE_CONFIG;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Browser storage can be unavailable (private mode, blocked site data) —
  // the page must still work, it just won't remember choices.
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  const GLOBAL = { code: "GLOBAL", name: "Global / my country isn't listed", flag: "🌍", region: "global", amazon: null, market: null };
  const countries = window.COUNTRIES.map(([code, name, flag, group, region, amazon, market]) => ({ code, name, flag, group, region, amazon, market }));
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  const state = {
    country: pickInitialCountry(),
    build: store.get("so101.build", "pair"),
    done: new Set(store.get("so101.done", [])),
  };

  function pickInitialCountry() {
    const fromUrl = new URLSearchParams(location.search).get("country");
    if (fromUrl && (byCode[fromUrl.toUpperCase()] || fromUrl.toUpperCase() === "GLOBAL")) return fromUrl.toUpperCase();
    const saved = store.get("so101.country", null);
    if (saved && (byCode[saved] || saved === "GLOBAL")) return saved;
    // Best guess from the browser locale (e.g. "en-IN" → IN). No network lookups.
    for (const lang of navigator.languages || [navigator.language]) {
      const m = /-([A-Z]{2})$/i.exec(lang || "");
      if (m && byCode[m[1].toUpperCase()]) return m[1].toUpperCase();
    }
    return "GLOBAL";
  }

  const country = () => byCode[state.country] || GLOBAL;

  /* ---------------- link building ---------------- */

  function amazonSearch(tld, q) {
    return { store: `Amazon.${tld}`, url: `https://www.amazon.${tld}/s?k=${encodeURIComponent(q)}`, kind: "search", scope: "local" };
  }

  function linksFor(part, c) {
    const out = [];
    const seen = new Set();
    const push = (l, scope) => {
      if (seen.has(l.url)) return;
      seen.add(l.url);
      out.push({ ...l, scope: l.scope || scope });
    };

    const local = (part.buy[c.region] || []).filter(Boolean);
    local.forEach((l) => push(l, "local"));

    const isMotor = part.group === "Motors";
    const needLocalSearch = !local.length || !isMotor;
    if (needLocalSearch && part.search) {
      const hasSameAmazon = c.amazon && local.some((l) => l.url.includes(`amazon.${c.amazon}/`));
      if (c.amazon && !hasSameAmazon) push(amazonSearch(c.amazon, part.search), "local");
      if (c.market && window.MARKETPLACES[c.market]) {
        const m = window.MARKETPLACES[c.market];
        push({ store: m.name, url: m.search(part.search), kind: "search" }, "local");
      }
    }

    (part.buy.global || []).forEach((l) => push(l, "global"));
    if (!part.buy.global && part.search) {
      push({ store: "AliExpress", url: `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(part.search.replace(/\s+/g, "-"))}.html`, kind: "search" }, "global");
    }
    return out;
  }

  /* ---------------- render: country select ---------------- */

  function renderCountrySelect() {
    const sel = $("#country");
    const groups = {};
    countries.forEach((c) => (groups[c.group] ||= []).push(c));
    let html = `<option value="GLOBAL">${GLOBAL.flag}  ${esc(GLOBAL.name)}</option>`;
    for (const [g, list] of Object.entries(groups)) {
      html += `<optgroup label="${esc(g)}">` +
        list.sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.code}">${c.flag}  ${esc(c.name)}</option>`).join("") +
        `</optgroup>`;
    }
    sel.innerHTML = html;
    sel.value = state.country;
    sel.addEventListener("change", () => {
      state.country = sel.value;
      store.set("so101.country", state.country);
      const url = new URL(location.href);
      url.searchParams.set("country", state.country);
      history.replaceState(null, "", url);
      renderAll();
    });
  }

  /* ---------------- render: BOM ---------------- */

  function qtyFor(part) {
    if (state.build === "follower") return part.qty.follower;
    return part.shared ? part.qty.follower : part.qty.follower + part.qty.leader;
  }

  function qtyBreakdown(part) {
    if (part.shared) return "shared";
    if (state.build === "follower") return "follower";
    const bits = [];
    if (part.qty.follower) bits.push(`${part.qty.follower} follower`);
    if (part.qty.leader) bits.push(`${part.qty.leader} leader`);
    return bits.join(" · ");
  }

  // The official BOM prices USB-C cables as one 2-pack and clamps as a 2- or 4-pack.
  function lineCost(part) {
    if (part.refUSD == null) return 0;
    if (part.id === "usbc") return 7;
    if (part.id === "clamp") return state.build === "pair" ? 9 : 5;
    return part.refUSD * qtyFor(part);
  }

  function renderBOM() {
    const c = country();
    const groups = {};
    window.PARTS.forEach((p) => (groups[p.group] ||= []).push(p));

    $("#bom").innerHTML = Object.entries(groups).map(([g, parts]) => `
      <div class="bom-group">
        <h3>${esc(g)}</h3>
        ${parts.map((p) => partRow(p, c)).join("")}
      </div>`).join("");

    $$("#bom input[type=checkbox]").forEach((cb) => cb.addEventListener("change", () => {
      cb.checked ? state.done.add(cb.dataset.id) : state.done.delete(cb.dataset.id);
      store.set("so101.done", [...state.done]);
      cb.closest(".part").classList.toggle("is-done", cb.checked);
    }));

    const total = window.PARTS.reduce((s, p) => s + (qtyFor(p) ? lineCost(p) : 0), 0);
    $("#total-usd").textContent = `≈ $${Math.round(total)}`;
    $("#total-note").textContent = state.build === "pair"
      ? "official US BOM, both arms, excl. printing"
      : "official US BOM, follower only, excl. printing";
  }

  function partRow(p, c) {
    const q = qtyFor(p);
    const links = linksFor(p, c);
    const where = c.code === "GLOBAL" ? "Worldwide" : `For ${c.flag} ${c.name}`;
    const linkHtml = links.length ? links.map((l) => {
      const cls = l.kind === "search" ? "k-search" : l.scope === "global" ? "k-global" : "k-local";
      const meta = l.kind === "search" ? "search" : l.scope === "global" ? "ships worldwide" : "local";
      return `<li><a class="${cls}" href="${esc(l.url)}" target="_blank" rel="noopener nofollow">
        <span>${esc(l.store)}</span><span class="meta">${meta}<span class="arrow">↗</span></span></a></li>`;
    }).join("") : `<li class="part-note">Any local hardware or electronics store.</li>`;

    const unit = p.refUSD != null ? `ref. $${p.refUSD.toFixed(2)} each` : "price varies";
    return `
      <article class="part ${q ? "" : "is-hidden"} ${state.done.has(p.id) ? "is-done" : ""}" id="part-${p.id}">
        <label class="check" title="Mark as ordered">
          <input type="checkbox" data-id="${p.id}" ${state.done.has(p.id) ? "checked" : ""} aria-label="Mark ${esc(p.name)} as ordered" />
          <span></span>
        </label>
        <div class="qty">${q}<small>${esc(qtyBreakdown(p))}</small></div>
        <div class="part-body">
          <h4 class="part-name">${esc(p.name)}</h4>
          <div class="part-code">${esc(p.code)}</div>
          <div class="specs">${p.specs.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          <p class="part-note">${esc(p.note)}</p>
          <div class="part-price">${unit}</div>
        </div>
        <div class="buy">
          <h4>${esc(where)}</h4>
          <ul>${linkHtml}</ul>
        </div>
      </article>`;
  }

  function renderBanner() {
    const c = country();
    const b = $("#region-banner");
    const motorsLocal = window.PARTS.filter((p) => p.group === "Motors").some((p) => p.buy[c.region]);
    if (c.code === "GLOBAL") {
      b.hidden = false;
      b.innerHTML = `<b>Showing sellers that ship worldwide.</b> Pick your country above to see local stores first. If it isn't listed, these sellers ship almost everywhere, though you may pay import duty.`;
    } else if (!motorsLocal) {
      b.hidden = false;
      b.innerHTML = `<b>No verified local servo stockist in ${c.flag} ${esc(c.name)} yet.</b> The motor links below go to sellers that ship worldwide, and commodity parts link to local stores. Know a good local shop? <a href="${esc(cfg.repoUrl)}/issues" target="_blank" rel="noopener">Tell us</a>.`;
    } else {
      b.hidden = true;
    }
  }

  function renderOptional() {
    $("#optional").innerHTML = window.OPTIONAL_PARTS.map((o) => `
      <div class="opt">
        <h4>${esc(o.name)}</h4>
        <p>${esc(o.note)}</p>
        <div class="pill-links">${o.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener nofollow">${esc(l.store)} ↗</a>`).join("")}</div>
      </div>`).join("");
  }

  /* ---------------- render: motor map ---------------- */

  const RATIO = { C001: "1:345", C044: "1:191", C046: "1:147" };
  function renderJoints() {
    $("#joints").innerHTML = window.JOINTS.map((j) => `
      <tr data-j="${j.n}">
        <td><b>${j.n}</b></td>
        <td>${esc(j.joint)}</td>
        <td><span class="mcode m-${j.leader}">${j.leader}<small>${RATIO[j.leader]}</small></span></td>
        <td><span class="mcode m-${j.follower}">${j.follower}<small>${RATIO[j.follower]}</small></span></td>
      </tr>`).join("");
    const setActive = (n) => {
      $$(".arm-joints g").forEach((g) => g.classList.toggle("is-active", g.dataset.j === n));
      $$("#joints tr").forEach((r) => r.classList.toggle("is-active", r.dataset.j === n));
    };
    $$("#joints tr, .arm-joints g").forEach((el) => {
      el.addEventListener("mouseenter", () => setActive(el.dataset.j));
      el.addEventListener("mouseleave", () => setActive(null));
    });
  }

  /* ---------------- render: kits & services ---------------- */

  function renderKits() {
    const c = country();
    $$(".region-name").forEach((el) => (el.textContent = c.code === "GLOBAL" ? "worldwide shipping" : c.name));
    const local = c.region === "global" ? [] : window.KITS.filter((k) => k.regions.includes(c.region));
    const worldwide = window.KITS.filter((k) => k.regions.includes("global") && !local.includes(k));
    const other = window.KITS.filter((k) => !local.includes(k) && !worldwide.includes(k));

    const card = (k, scope) => `
      <a class="kit ${scope === "local" ? "is-local" : scope === "global" ? "is-global" : ""}" href="${esc(k.url)}" target="_blank" rel="noopener nofollow">
        <div class="seller"><span>${esc(k.seller)}</span>${k.official ? `<span class="off">official list</span>` : ""}</div>
        <h4>${esc(k.name)}</h4>
        <div class="inc">${k.includes.map((i) => `<span>${esc(i)}</span>`).join("")}</div>
      </a>`;

    let html = "";
    if (local.length) html += `<div class="kits-sep">${c.flag} Local to ${esc(c.name)}</div>` + local.map((k) => card(k, "local")).join("");
    html += `<div class="kits-sep">🌍 Ships worldwide</div>` + worldwide.map((k) => card(k, "global")).join("");
    if (other.length) html += `<div class="kits-sep">Other regions</div>` + other.map((k) => card(k, "other")).join("");
    $("#kits-list").innerHTML = html;
  }

  function renderServices() {
    const c = country();
    const sorted = [...window.PRINT_SERVICES].sort((a, b) => b.regions.includes(c.region) - a.regions.includes(c.region));
    $("#services").innerHTML = sorted.map((s) => `
      <a class="service ${s.regions.includes(c.region) && c.region !== "global" ? "is-local" : ""}" href="${esc(s.url)}" target="_blank" rel="noopener nofollow">
        <b>${esc(s.name)} ${s.official ? `<span class="badge-official">official</span>` : ""}</b>
        <p>${esc(s.note)}</p>
      </a>`).join("");
  }

  /* ---------------- render: STL files ---------------- */

  const STL = "assets/stl/";
  const prettyName = (f) => f.replace(/_SO101/i, "").replace(/\.stl$/i, "").replace(/_/g, " ");

  function renderSTL() {
    $("#plates").innerHTML = window.STL_PLATES.map((p) => `
      <div class="plate">
        <span>${esc(p.label)}<small>${esc(p.size)} per file</small></span>
        <a class="file-btn f-follower" href="${STL}plates/${p.follower}" download>↓ Follower</a>
        <a class="file-btn f-leader" href="${STL}plates/${p.leader}" download>↓ Leader</a>
      </div>`).join("");

    $("#gauges").innerHTML = window.STL_GAUGES.map((g) => `
      <a class="file-btn" href="${STL}gauges/${g.file}" download>↓ ${esc(g.label)}</a>`).join("");

    const useLabel = { common: "both", follower: "follower", leader: "leader" };
    $("#stl-parts").innerHTML = window.STL_PARTS.map((p) => `
      <li data-use="${p.use}" data-file="${p.file}" ${p.hint ? `title="${esc(p.hint)}"` : ""}>
        <span class="use use-${p.use}">${useLabel[p.use]}</span>
        <button type="button" class="pname" data-view="${p.file}">${esc(prettyName(p.file))}</button>
        <a class="dl-icon" href="${STL}individual/${p.file}" download aria-label="Download ${esc(p.file)}">↓</a>
      </li>`).join("");

    $$("#stl-parts [data-view]").forEach((b) => b.addEventListener("click", () => viewPart(b.dataset.view, true)));

    $$(".filter-row .chip").forEach((chip) => chip.addEventListener("click", () => {
      $$(".filter-row .chip").forEach((c) => c.classList.toggle("is-on", c === chip));
      const f = chip.dataset.filter;
      $$("#stl-parts li").forEach((li) => li.classList.toggle("is-hidden", f !== "all" && li.dataset.use !== f));
    }));
  }

  function viewPart(file, scroll) {
    $$("#stl-parts li").forEach((li) => li.classList.toggle("is-viewing", li.dataset.file === file));
    $("#viewer-title").textContent = file;
    $("#viewer-dl").href = `${STL}individual/${file}`;
    window.dispatchEvent(new CustomEvent("stl:view", { detail: { url: `${STL}individual/${file}` } }));
    if (scroll) $("#viewer-wrap").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  window.__so101InitialPart = `${STL}individual/Base_SO101.stl`;

  /* ---------------- build toggle, theme, footer ---------------- */

  function initBuildToggle() {
    $$(".seg button").forEach((b) => {
      b.setAttribute("aria-checked", String(b.dataset.build === state.build));
      b.addEventListener("click", () => {
        state.build = b.dataset.build;
        store.set("so101.build", state.build);
        $$(".seg button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        renderBOM();
      });
    });
  }

  function initTheme() {
    const saved = store.get("so101.theme", null);
    if (saved) document.documentElement.dataset.theme = saved;
    $("[data-theme-toggle]").addEventListener("click", () => {
      const cur = document.documentElement.dataset.theme
        || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      store.set("so101.theme", next);
      window.dispatchEvent(new Event("themechange"));
    });
  }

  function initFooter() {
    $$("[data-coffee]").forEach((a) => (a.href = cfg.buyMeACoffeeUrl || "https://buymeacoffee.com/bharatjain"));
    $("#author-link").href = cfg.authorUrl;
    $("#author-link").textContent = cfg.author;
    $("#repo-link").href = `${cfg.repoUrl}/issues`;
    $("#last-checked").textContent = cfg.lastChecked;
  }

  function renderAll() {
    renderBanner();
    renderBOM();
    renderKits();
    renderServices();
  }

  initTheme();
  renderCountrySelect();
  initBuildToggle();
  renderOptional();
  renderJoints();
  renderSTL();
  initFooter();
  renderAll();
  $$("#stl-parts li").find((li) => li.dataset.file === "Base_SO101.stl")?.classList.add("is-viewing");
})();
