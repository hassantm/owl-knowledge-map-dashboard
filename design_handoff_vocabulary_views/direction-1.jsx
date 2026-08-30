// Direction 1: Refined Pill Grid (real data)
// Years 3-6 × six terms × three subjects. Each pill carries its unit-count.
// Recurring words (3+ units) are outlined and weighted; non-recurring stay quiet.

const D1 = ({ data }) => {
  const { rows, meta } = data;
  const subjects = ["History", "Geography", "Religion"];
  const [yearFilter, setYearFilter] = React.useState("all");
  const [hoverWord, setHoverWord] = React.useState(null);
  const [minUnits, setMinUnits] = React.useState(1);

  const visibleRows = rows.filter(r => yearFilter === "all" || r.year === yearFilter);
  const years = [...new Set(rows.map(r => r.year))].sort();

  return (
    <div style={d1Styles.page}>
      <div style={d1Styles.header}>
        <div>
          <div style={d1Styles.eyebrow}>OWL Knowledge Map · Vocabulary</div>
          <div style={d1Styles.title}>Timeline Matrix</div>
          <div style={d1Styles.lede}>
            All curriculum vocabulary mapped by year, term and subject. The number on each pill shows how many curriculum units that word recurs in.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={d1Styles.controlLabel}>Year</span>
            <Seg value={yearFilter} onChange={setYearFilter} options={[["all","All"], ...years.map(y=>[y,"Y"+y])]} />
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={d1Styles.controlLabel}>Highlight ≥</span>
            <Seg value={minUnits} onChange={setMinUnits} options={[[1,"all"],[2,"2+"],[3,"3+"],[4,"4+"]]} />
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "84px 1fr 1fr 1fr", gap: 1, marginBottom: 4, position: "sticky", top: 0, background: "#fcfcfa", zIndex: 2, paddingTop: 8, paddingBottom: 6 }}>
        <div></div>
        {subjects.map(s => (
          <div key={s} style={{ paddingLeft: 14, borderLeft: `3px solid ${meta.subjects[s].color}` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: meta.subjects[s].ink, fontWeight: 700 }}>{meta.subjects[s].name}</div>
          </div>
        ))}
      </div>

      {visibleRows.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "84px 1fr 1fr 1fr", gap: 24, paddingTop: 18, paddingBottom: 18, borderTop: "1px solid #ece9e3" }}>
          <div>
            <div style={{ fontSize: 11, color: "#8a857a", letterSpacing: "0.06em", fontWeight: 600 }}>YEAR {row.year}</div>
            <div style={{ fontSize: 18, fontWeight: 500, marginTop: 2 }}>{meta.termLabels[row.term]}</div>
          </div>
          {subjects.map(s => (
            <div key={s}>
              {(row.cols[s] || []).map(b => (
                <BookletBlock key={b.id} booklet={b} subject={meta.subjects[s]} hoverWord={hoverWord} setHoverWord={setHoverWord} minUnits={minUnits} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Seg = ({ value, onChange, options }) => (
  <div style={{ display: "inline-flex", border: "1px solid #d6d3cc", borderRadius: 14, background: "#fff", padding: 2 }}>
    {options.map(([v, l]) => (
      <button key={v} onClick={() => onChange(v)} style={{
        border: "none", background: value === v ? "#1a1a1a" : "transparent",
        color: value === v ? "#fff" : "#3a3631",
        fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 12, cursor: "pointer",
      }}>{l}</button>
    ))}
  </div>
);

const BookletBlock = ({ booklet, subject, hoverWord, setHoverWord, minUnits }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.005em" }}>{booklet.title}</div>
    {booklet.chapters.map((ch, idx) => (
      <div key={idx} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: subject.soft, color: subject.ink, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{ch.n}</div>
          <div style={{ fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6b665b", fontWeight: 600 }}>{ch.title}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {ch.words.map((wd, i) => (
            <Pill key={i} word={wd} subject={subject} active={hoverWord === wd.w} dim={wd.u < minUnits} onHover={setHoverWord} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Pill = ({ word, subject, active, dim, onHover }) => {
  const tweaks = window.useVocabTweaks ? window.useVocabTweaks() : { highlightOn: false, minRecur: 2, highlightColor: "#c96442", traceWord: "", dimNonMatching: true, boldRecurrences: true };
  const recurring = word.u >= 3;
  const meetsThreshold = tweaks.highlightOn && word.u >= tweaks.minRecur;
  const traceMatch = tweaks.traceWord && word.w.toLowerCase().includes(tweaks.traceWord.toLowerCase().trim()) && tweaks.traceWord.trim().length > 0;
  const tracing = !!tweaks.traceWord.trim();
  const dimByTrace = tracing && !traceMatch && tweaks.dimNonMatching;
  return (
    <span
      onMouseEnter={() => onHover(word.w)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 4px 3px 10px", borderRadius: 13,
        background: active || traceMatch ? (traceMatch ? tweaks.highlightColor : subject.color) : subject.soft,
        color: (active || traceMatch) ? "#fff" : subject.ink,
        fontSize: 12.5,
        fontWeight: (tweaks.boldRecurrences && meetsThreshold) ? 700 : (recurring ? 600 : 500),
        lineHeight: 1.1,
        border: meetsThreshold ? `1.5px solid ${tweaks.highlightColor}` : (recurring ? `1px solid ${subject.color}` : "1px solid transparent"),
        boxShadow: meetsThreshold ? `0 0 0 2px ${tweaks.highlightColor}22` : "none",
        opacity: dim ? 0.28 : (dimByTrace ? 0.18 : 1),
        transition: "opacity 120ms, background 120ms, box-shadow 120ms",
      }}
    >
      <span>{word.w}</span>
      {word.u > 1 ? (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: 18, height: 18, padding: "0 4px", borderRadius: 9,
          background: active ? "rgba(255,255,255,0.25)" : (recurring ? subject.color : "rgba(0,0,0,0.06)"),
          color: active ? "#fff" : (recurring ? "#fff" : "#5a554a"),
          fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums",
        }}>{word.u}</span>
      ) : null}
    </span>
  );
};

const d1Styles = {
  page: { fontFamily: "'Söhne','Inter',system-ui,sans-serif", color: "#1a1a1a", background: "#fcfcfa", padding: "32px 40px", width: 1640 },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, borderBottom: "1px solid #e7e5e0", paddingBottom: 20 },
  eyebrow: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a857a", marginBottom: 6 },
  title: { fontSize: 32, fontWeight: 500, letterSpacing: "-0.01em" },
  lede: { fontSize: 14, color: "#6b665b", marginTop: 4, maxWidth: 600 },
  controlLabel: { fontSize: 11, color: "#8a857a", letterSpacing: "0.04em", textTransform: "uppercase", marginRight: 6, fontWeight: 600 },
};

window.DirectionOne = D1;
