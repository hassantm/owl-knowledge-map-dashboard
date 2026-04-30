import type { VocabBooklet, SubjectMeta } from '../../lib/vocabData'
import { reachStyle, matchesTrace, meetsHighlight } from '../../lib/vocabHelpers'
import type { HighlightState } from './highlightTypes'

interface BookletCardProps {
  booklet: VocabBooklet
  subject: SubjectMeta
  subjectKey: string
  highlight: HighlightState
  deferredTrace: string
}

export default function BookletCard({ booklet, subject, subjectKey, highlight, deferredTrace }: BookletCardProps) {
  const totalWords = booklet.chapters.reduce((n, ch) => n + ch.words.length, 0)
  const recurCount = booklet.chapters.reduce(
    (n, ch) => n + ch.words.filter(w => w.u >= 3).length,
    0
  )

  return (
    <div className="bg-white border border-[#ece9e3] rounded-[6px] overflow-hidden">
      {/* Card header */}
      <div
        style={{ background: subject.soft, borderBottom: `2px solid ${subject.color}` }}
        className="px-3 py-3"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span
            style={{ background: subject.color }}
            className="inline-block w-1.5 h-1.5 rounded-full"
          />
          <span
            style={{ color: subject.ink }}
            className="text-[9px] font-bold uppercase tracking-widest"
          >
            {subjectKey}
          </span>
        </div>
        <div style={{ color: subject.ink }} className="text-[17px] font-semibold leading-snug">
          {booklet.title}
        </div>
        <div className="flex gap-3 mt-1 text-[11px]" style={{ color: subject.ink, opacity: 0.7 }}>
          <span>{booklet.chapters.length} ch.</span>
          <span>{totalWords} words</span>
          {recurCount > 0 && <span>recur 3+: {recurCount}</span>}
        </div>
      </div>

      {/* Card body */}
      <div className="px-3 py-3 flex flex-col gap-3">
        {booklet.chapters.map(chapter => (
          <div key={chapter.n}>
            <div
              style={{ color: subject.color }}
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
            >
              Ch. {chapter.n}
              {chapter.title ? ` · ${chapter.title}` : ''}
            </div>
            <div
              className="border-b border-dashed border-[#e5e1da] mb-1.5"
            />
            <div className="leading-relaxed">
              {chapter.words.map((wd, i) => {
                const rs = reachStyle(wd.u)
                const isTrace = deferredTrace ? matchesTrace(wd.w, deferredTrace) : false
                const isHighlighted = meetsHighlight(wd.u, highlight)
                const dimByTrace = deferredTrace.trim() !== '' && !isTrace && highlight.dimNonMatching

                let color = wd.u >= 3 ? subject.ink : '#4a5568'
                let bg: string | undefined
                if (isTrace) {
                  bg = highlight.highlightColor + '40'
                  color = highlight.highlightColor
                }

                return (
                  <span key={i}>
                    <span
                      style={{
                        fontSize: rs.fontSize,
                        fontWeight: rs.fontWeight,
                        fontVariationSettings: rs.fontVariationSettings,
                        opacity: dimByTrace ? 0.18 : rs.opacity,
                        color,
                        background: bg,
                        borderRadius: bg ? 3 : undefined,
                        padding: bg ? '0 2px' : undefined,
                        outline: isHighlighted && !isTrace ? `1.5px solid ${highlight.highlightColor}` : undefined,
                        outlineOffset: 1,
                        transition: 'opacity 120ms ease',
                      }}
                    >
                      {wd.w}
                      {rs.showSuperscript && (
                        <sup style={{ fontSize: 8, color: subject.color, marginLeft: 1 }}>
                          {wd.u}
                        </sup>
                      )}
                    </span>
                    {i < chapter.words.length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
