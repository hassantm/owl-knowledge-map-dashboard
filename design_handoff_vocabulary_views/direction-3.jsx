// Direction 3: Booklet Library (real data)
// Each booklet is a card. Words rendered as flowing text, sized by unit-reach.
// At 6+ years × 3 subjects this is a lot of cards — paginated by Year.

const D3 = ({ data }) => {
  const tweaks = window.useVocabTweaks ? window.useVocabTweaks() : { highlightOn: false, minRecur: 2, highlightColor: "#c96442", traceWord: "", dimNonMatching: true, boldRecurrences: true };
  const { rows, meta } = data;
  const years = [...new Set(rows.map(r => r.year))].sort();
  const [year, setYear] = React.useState(years[0]);

  const yearRows = rows.filter(r => r.year === year);

  // Aggregate booklets for the current year, deduping by title (booklet may span multiple terms)
  const subjects = ["History", "Geography", "Religion"];

  return (
    <div style={d3Styles.page}>
      <div style={d3Styles.header}>
        <div>
          <div style={d3Styles.eyebrow}>OWL Knowledge Map · Vocabulary</div>
          <div style={d3Styles.title}>Booklet Library</div>
          <div style={d3Styles.lede}>Words sized by reach — bigger type means it recurs across more curriculum units. Browse by year.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <YearTabs years={years} value={year} onChange={setYear} />
          <ScaleLegend />
        </div>
      </div>

      {yearRows.map((row, ri) => (
        <div key={ri} style={{ marginBottom: 28 }}>
          <div style={d3Styles.termBar}>
            <span style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a857a", fontWeight: 700 }}>Year {row.year} · {meta.termLabels[row.term]}</span>
            <div style={{ flex: 1, height: 1, background: "#ece9e3" }}></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 14 }}>
            {subjects.map(s => (
              <div key={s} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(row.cols[s] || []).map(b => (
                  <BookletCard key={b.id} booklet={b} subject={meta.subjects[s]} tweaks={tweaks} />
                ))}
                {(!row.cols[s] || row.cols[s].length === 0) ? <EmptySlot subject={meta.subjects[s]} /> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const YearTabs = ({ years, value, onChange }) => (
  <div style={{ display: "inline-flex", border: "1px solid #d6d3cc", borderRadius: 14, background: "#fff", padding: 2 }}>
    {years.map(y => (
      <button key={y} onClick={() => onChange(y)} style={{
        border: "none", background: value === y ? "#1a1a1a" : "transparent",
        color: value === y ? "#fff" : "#3a3631",
        fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 12, cursor: "pointer",
      }}>Y{y}</button>
    ))}
  </div>
);

const sizeFor = u => {
  if (u >= 4) return { size: 24, weight: 700, opacity: 1 };
  if (u >= 3) return { size: 19, weight: 650, opacity: 1 };
  if (u >= 2) return { size: 15, weight: 500, opacity: 0.92 };
  return { size: 12, weight: 400, opacity: 0.7 };
};

const BookletCard = ({ booklet, subject, tweaks }) => {
  const allWords = booklet.chapters.flatMap(c => c.words);
  const heavy = allWords.filter(w => w.u >= 3).length;
  const trace = (tweaks && tweaks.traceWord || "").toLowerCase().trim();
  return (
    <div style={{ background: "#fff", border: "1px solid #ece9e3", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: subject.soft, padding: "12px 16px", borderBottom: `2px solid ${subject.color}` }}>
        <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: subject.ink, fontWeight: 700, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: subject.color }}></span>
          {subject.name}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.005em" }}>{booklet.title}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: subject.ink }}>
          <Stat n={booklet.chapters.length} label="ch" />
          <Stat n={allWords.length} label="words" />
          <Stat n={heavy} label="recur 3+" />
        </div>
      </div>
      <div style={{ padding: "12px 16px 14px" }}>
        {booklet.chapters.map((ch, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6, paddingBottom: 3, borderBottom: "1px dashed #ece9e3" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: subject.color, fontVariantNumeric: "tabular-nums", minWidth: 14 }}>{String(ch.n).padStart(2, "0")}</div>
              <div style={{ fontSize: 10, color: "#6b665b", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>{ch.title}</div>
            </div>
            <div style={{ lineHeight: 1.5 }}>
              {ch.words.map((wd, i) => {
                const s = sizeFor(wd.u);
                const meets = tweaks && tweaks.highlightOn && wd.u >= tweaks.minRecur;
                const matchTrace = trace && wd.w.toLowerCase().includes(trace);
                const dimByTrace = trace && !matchTrace && tweaks && tweaks.dimNonMatching;
                const hl = (meets || matchTrace) ? (tweaks.highlightColor || "#c96442") : null;
                return (
                  <span key={i} style={{
                    display: "inline-block",
                    margin: "1px 8px 1px 0",
                    padding: hl ? "0 4px" : 0,
                    borderRadius: hl ? 4 : 0,
                    background: hl ? hl + "26" : "transparent",
                    fontSize: s.size,
                    fontWeight: (tweaks && tweaks.boldRecurrences && meets) ? 800 : s.weight,
                    opacity: dimByTrace ? 0.18 : s.opacity,
                    color: hl ? hl : (wd.u >= 3 ? subject.ink : "#1a1a1a"),
                    letterSpacing: wd.u >= 3 ? "-0.01em" : "0",
                    transition: "opacity 120ms, background 120ms",
                  }}>
                    {wd.w}
                    {wd.u >= 3 ? (
                      <sup style={{ fontSize: 9, fontWeight: 700, marginLeft: 2, color: hl || subject.color, fontVariantNumeric: "tabular-nums" }}>{wd.u}</sup>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptySlot = ({ subject }) => (
  <div style={{ background: "#faf8f4", border: "1px dashed #e0ddd5", borderRadius: 6, padding: "16px", fontSize: 11, color: "#a8a39a", textAlign: "center" }}>
    No {subject.name} booklet this term
  </div>
);

const Stat = ({ n, label }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
    <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{n}</span>
    <span style={{ fontSize: 10, opacity: 0.7 }}>{label}</span>
  </div>
);

const ScaleLegend = () => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "6px 12px", border: "1px solid #ece9e3", borderRadius: 4, background: "#fff" }}>
    <span style={{ fontSize: 10, color: "#8a857a", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 4 }}>Reach</span>
    {[1,2,3,4].map(u => {
      const s = sizeFor(u);
      return <span key={u} style={{ fontSize: s.size * 0.7, fontWeight: s.weight, opacity: s.opacity, fontVariantNumeric: "tabular-nums" }}>{u}</span>;
    })}
  </div>
);

const d3Styles = {
  page: { fontFamily: "'Söhne','Inter',system-ui,sans-serif", color: "#1a1a1a", background: "#fcfcfa", padding: "32px 40px", width: 1640 },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, borderBottom: "1px solid #e7e5e0", paddingBottom: 20 },
  eyebrow: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a857a", marginBottom: 6 },
  title: { fontSize: 32, fontWeight: 500, letterSpacing: "-0.01em" },
  lede: { fontSize: 14, color: "#6b665b", marginTop: 4, maxWidth: 600 },
  termBar: { display: "flex", alignItems: "center", gap: 14 },
};

window.DirectionThree = D3;
