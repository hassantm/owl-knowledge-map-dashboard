// Direction 2: Word Atlas (real data)
// Word-first index across the WHOLE curriculum. Tiered by frequency.
// Each row shows the word + tiny coloured dots for each booklet it appears in.

const D2 = ({ data }) => {
  const tweaks = window.useVocabTweaks ? window.useVocabTweaks() : { highlightOn: false, minRecur: 2, highlightColor: "#c96442", traceWord: "", dimNonMatching: true, boldRecurrences: true };
  const { rows, meta } = data;

  // Build word index: word -> { totalUnits, locations: [{year,term,subject,booklet,chapter}] }
  const idx = {};
  for (const row of rows) {
    for (const sub of Object.keys(row.cols)) {
      for (const b of row.cols[sub]) {
        for (const ch of b.chapters) {
          for (const wd of ch.words) {
            const key = wd.w.toLowerCase();
            if (!idx[key]) idx[key] = { word: wd.w, units: wd.u, locations: [] };
            idx[key].locations.push({ year: row.year, term: row.term, subject: sub, booklet: b.title, chapter: ch.n });
          }
        }
      }
    }
  }
  const all = Object.values(idx);

  const [filter, setFilter] = React.useState("");
  const [tierOpen, setTierOpen] = React.useState({ 4: true, 3: true, 2: true, 1: false });

  // Combine local search filter with global trace tweak
  const activeFilter = (tweaks.traceWord && tweaks.traceWord.trim()) || filter;
  const matches = (w) => {
    if (!activeFilter) return true;
    return w.word.toLowerCase().includes(activeFilter.toLowerCase());
  };

  // Apply highlight class via min recur from tweaks
  const tiers = [
    { n: 4, label: "Across 4 units", desc: "Curriculum cornerstones", words: all.filter(w => w.units === 4 && matches(w)) },
    { n: 3, label: "Across 3 units", desc: "Repeated touchpoints", words: all.filter(w => w.units === 3 && matches(w)) },
    { n: 2, label: "Across 2 units", desc: "Cross-referenced", words: all.filter(w => w.units === 2 && matches(w)) },
    { n: 1, label: "Single unit", desc: "Specific to one topic", words: all.filter(w => w.units === 1 && matches(w)) },
  ];

  const total = all.length;

  return (
    <div style={d2Styles.page}>
      <div style={d2Styles.header}>
        <div>
          <div style={d2Styles.eyebrow}>OWL Knowledge Map · Vocabulary</div>
          <div style={d2Styles.title}>Word Atlas</div>
          <div style={d2Styles.lede}>Every word in the curriculum, ranked by reach. {total.toLocaleString()} unique words across Years 3–6.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <input value={tweaks.traceWord || filter} onChange={e=>setFilter(e.target.value)} placeholder="Search a word…" style={d2Styles.search} />
          <Legend meta={meta} />
        </div>
      </div>

      {tiers.map(tier => (
        <div key={tier.n} style={{ marginBottom: 28 }}>
          <button onClick={() => setTierOpen({...tierOpen, [tier.n]: !tierOpen[tier.n]})} style={d2Styles.tierHead}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={d2Styles.tierBadge(tier.n)}>{tier.n}</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{tier.label}</span>
              <span style={{ fontSize: 12, color: "#8a857a", letterSpacing: "0.04em" }}>{tier.desc}</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#8a857a", fontVariantNumeric: "tabular-nums" }}>{tier.words.length.toLocaleString()} words</span>
              <span style={{ fontSize: 14, color: "#8a857a", transform: tierOpen[tier.n] ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 150ms" }}>›</span>
            </div>
          </button>
          {tierOpen[tier.n] ? (
            <div style={{ display: "grid", gridTemplateColumns: tier.n >= 3 ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: tier.n >= 3 ? "12px 28px" : "8px 24px", marginTop: 14 }}>
              {tier.words.slice(0, tier.n === 1 ? 200 : 1000).map((w, i) => (
                <WordEntry key={i} entry={w} meta={meta} compact={tier.n < 3} tweaks={tweaks} />
              ))}
              {tier.n === 1 && tier.words.length > 200 ? (
                <div style={{ gridColumn: "1 / -1", fontSize: 12, color: "#8a857a", padding: "8px 0" }}>+ {tier.words.length - 200} more single-unit words</div>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const WordEntry = ({ entry, meta, compact, tweaks }) => {
  const meets = tweaks && tweaks.highlightOn && entry.units >= tweaks.minRecur;
  const trace = tweaks && tweaks.traceWord && tweaks.traceWord.trim() && entry.word.toLowerCase().includes(tweaks.traceWord.toLowerCase().trim());
  const hl = (meets || trace) ? (tweaks.highlightColor || "#c96442") : null;
  // Group locations by booklet so we don't repeat
  const bookletSet = new Map();
  for (const l of entry.locations) {
    const k = l.booklet + "|" + l.subject;
    if (!bookletSet.has(k)) bookletSet.set(k, l);
  }
  const booklets = [...bookletSet.values()];
  if (compact) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "2px 4px", borderRadius: 6,
        background: hl ? hl + "22" : "transparent",
        outline: hl ? `1px solid ${hl}` : "none",
        opacity: tweaks && tweaks.traceWord && tweaks.traceWord.trim() && !trace && tweaks.dimNonMatching ? 0.25 : 1,
      }}>
        <div style={{ display: "flex", gap: 2 }}>
          {booklets.slice(0, 4).map((l, i) => (
            <span key={i} title={l.booklet} style={{ width: 6, height: 6, borderRadius: 3, background: meta.subjects[l.subject].color }}></span>
          ))}
        </div>
        <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: hl ? 700 : 400 }}>{entry.word}</span>
      </div>
    );
  }
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10, padding: "4px 6px", borderRadius: 6,
      background: hl ? hl + "1a" : "transparent",
      outline: hl ? `1px solid ${hl}` : "none",
      opacity: tweaks && tweaks.traceWord && tweaks.traceWord.trim() && !trace && tweaks.dimNonMatching ? 0.25 : 1,
    }}>
      <div style={{
        minWidth: 26, height: 26, padding: "0 7px",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 13, background: hl || "#1a1a1a", color: "#fff",
        fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0,
      }}>{entry.units}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: hl ? 700 : 500, marginBottom: 3 }}>{entry.word}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {booklets.map((l, i) => (
            <span key={i} style={{
              fontSize: 10, padding: "2px 6px", borderRadius: 8,
              background: meta.subjects[l.subject].soft, color: meta.subjects[l.subject].ink,
              fontWeight: 500,
            }}>{l.booklet}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Legend = ({ meta }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
    {Object.entries(meta.subjects).map(([k, s]) => (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }}></div>
        <div style={{ fontSize: 11, color: "#3a3631" }}>{s.name}</div>
      </div>
    ))}
  </div>
);

const d2Styles = {
  page: { fontFamily: "'Söhne','Inter',system-ui,sans-serif", color: "#1a1a1a", background: "#fcfcfa", padding: "32px 40px", width: 1640 },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, borderBottom: "1px solid #e7e5e0", paddingBottom: 20 },
  eyebrow: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a857a", marginBottom: 6 },
  title: { fontSize: 32, fontWeight: 500, letterSpacing: "-0.01em" },
  lede: { fontSize: 14, color: "#6b665b", marginTop: 4 },
  search: { fontSize: 13, padding: "8px 14px", border: "1px solid #d6d3cc", borderRadius: 16, width: 240, fontFamily: "inherit", background: "#fff", outline: "none" },
  tierHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", padding: "10px 0", borderBottom: "1px solid #ece9e3",
    background: "transparent", border: "none", borderTop: "none", borderLeft: "none", borderRight: "none",
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
  },
  tierBadge: (n) => ({
    width: 28, height: 28, borderRadius: 14, color: "#fff", fontWeight: 700,
    fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: n === 4 ? "#1a1a1a" : n === 3 ? "#3a3631" : n === 2 ? "#8a857a" : "#c8c4bc",
  }),
};

window.DirectionTwo = D2;
