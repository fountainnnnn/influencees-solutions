import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { brain as brainFixture } from '../data/brain'
import type { PricingTier, ExampleMessage } from '../data/brain'
import { Card, Chip, FeatureChip, SectionLabel, cx } from '../components/ui'
import { useStore } from '../state/store'

// ---- text <-> structured field helpers ----

const toLines = (arr: string[]) => arr.join('\n')
const fromLines = (text: string) =>
  text.split('\n').map((s) => s.trim()).filter(Boolean)

const toPricingText = (tiers: PricingTier[]) =>
  tiers.map((t) => `${t.name} | ${t.price} | ${t.note}`).join('\n')
const fromPricingText = (text: string): PricingTier[] =>
  fromLines(text).map((line) => {
    const [name = '', price = '', note = ''] = line.split('|').map((s) => s.trim())
    return { name, price, note }
  })

const toExamplesText = (exs: ExampleMessage[]) =>
  exs.map((e) => `${e.label} | ${e.good ? 'good' : 'avoid'} | ${e.text} | ${e.why}`).join('\n')
const fromExamplesText = (text: string): ExampleMessage[] =>
  fromLines(text).map((line) => {
    const [label = '', goodStr = '', text2 = '', why = ''] = line.split('|').map((s) => s.trim())
    return { label, good: goodStr.toLowerCase() !== 'avoid', text: text2, why }
  })

// ---- shared input styling (design-brief v2 tokens) ----

const inputCls =
  'w-full rounded-[10px] border border-line bg-paper px-2.5 py-1.5 text-[13px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
const textareaCls = cx(inputCls, 'min-h-[72px] resize-y leading-relaxed')

function EditedChip() {
  return <span className="mono rounded-full border border-line bg-paper px-1.5 py-0.5 text-[10px] text-ink-3">Edited</span>
}

function SectionHeader({
  children,
  edited,
  editing,
  onEdit,
  onSave,
  onCancel,
}: {
  children: React.ReactNode
  edited: boolean
  editing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      {children}
      {edited && !editing && <EditedChip />}
      <div className="ml-auto flex items-center gap-1.5">
        {editing ? (
          <>
            <button className="btn btn-xs btn-primary" onClick={onSave}>Save</button>
            <button className="btn btn-xs btn-ghost" onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <button className="btn btn-xs btn-secondary" onClick={onEdit}>Edit</button>
        )}
      </div>
    </div>
  )
}

export default function BusinessBrain() {
  const brain = useStore((s) => s.brain)
  const updateBrain = useStore((s) => s.updateBrain)
  const resetBrain = useStore((s) => s.resetBrain)

  const [editing, setEditing] = useState<string | null>(null)

  // drafts per section, only populated while editing that section
  const [positioningDraft, setPositioningDraft] = useState({ oneLiner: '', tagline: '', footprint: '', pillars: '' })
  const [brandPricingDraft, setBrandPricingDraft] = useState('')
  const [creatorPricingDraft, setCreatorPricingDraft] = useState('')
  const [icpDraft, setIcpDraft] = useState({ summary: '', niches: '', positiveSignals: '', negativeSignals: '', idealContacts: '' })
  const [allowedDraft, setAllowedDraft] = useState('')
  const [forbiddenDraft, setForbiddenDraft] = useState('')
  const [toneDraft, setToneDraft] = useState('')
  const [examplesDraft, setExamplesDraft] = useState('')

  const startEdit = (section: string) => {
    if (section === 'positioning') {
      setPositioningDraft({
        oneLiner: brain.positioning.oneLiner,
        tagline: brain.positioning.tagline,
        footprint: brain.positioning.footprint,
        pillars: toLines(brain.positioning.pillars),
      })
    } else if (section === 'brandPricing') {
      setBrandPricingDraft(toPricingText(brain.brandPricing))
    } else if (section === 'creatorPricing') {
      setCreatorPricingDraft(toPricingText(brain.creatorPricing))
    } else if (section === 'icp') {
      setIcpDraft({
        summary: brain.icp.summary,
        niches: toLines(brain.icp.niches as unknown as string[]),
        positiveSignals: toLines(brain.icp.positiveSignals),
        negativeSignals: toLines(brain.icp.negativeSignals),
        idealContacts: toLines(brain.icp.idealContacts),
      })
    } else if (section === 'allowedClaims') {
      setAllowedDraft(toLines(brain.allowedClaims))
    } else if (section === 'forbiddenClaims') {
      setForbiddenDraft(toLines(brain.forbiddenClaims))
    } else if (section === 'tone') {
      setToneDraft(toLines(brain.tone.rules))
    } else if (section === 'examples') {
      setExamplesDraft(toExamplesText(brain.examples))
    }
    setEditing(section)
  }

  const cancelEdit = () => setEditing(null)

  const saveEdit = (section: string) => {
    if (section === 'positioning') {
      updateBrain('positioning', {
        ...brain.positioning,
        oneLiner: positioningDraft.oneLiner,
        tagline: positioningDraft.tagline,
        footprint: positioningDraft.footprint,
        pillars: fromLines(positioningDraft.pillars),
      })
    } else if (section === 'brandPricing') {
      updateBrain('brandPricing', fromPricingText(brandPricingDraft))
    } else if (section === 'creatorPricing') {
      updateBrain('creatorPricing', fromPricingText(creatorPricingDraft))
    } else if (section === 'icp') {
      updateBrain('icp', {
        ...brain.icp,
        summary: icpDraft.summary,
        niches: fromLines(icpDraft.niches) as unknown as typeof brain.icp.niches,
        positiveSignals: fromLines(icpDraft.positiveSignals),
        negativeSignals: fromLines(icpDraft.negativeSignals),
        idealContacts: fromLines(icpDraft.idealContacts),
      })
    } else if (section === 'allowedClaims') {
      updateBrain('allowedClaims', fromLines(allowedDraft))
    } else if (section === 'forbiddenClaims') {
      updateBrain('forbiddenClaims', fromLines(forbiddenDraft))
    } else if (section === 'tone') {
      updateBrain('tone', { ...brain.tone, rules: fromLines(toneDraft) })
    } else if (section === 'examples') {
      updateBrain('examples', fromExamplesText(examplesDraft))
    }
    setEditing(null)
  }

  const isEdited = (section: keyof typeof brain) =>
    JSON.stringify(brain[section]) !== JSON.stringify(brainFixture[section])

  const anyEdited = (Object.keys(brainFixture) as (keyof typeof brain)[]).some(isEdited)

  const handleReset = () => {
    if (window.confirm('Reset Business Brain to defaults? This discards all edits.')) {
      resetBrain()
      setEditing(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      {/* Positioning */}
      <Card className="px-5 py-4">
        <SectionHeader
          edited={isEdited('positioning')}
          editing={editing === 'positioning'}
          onEdit={() => startEdit('positioning')}
          onSave={() => saveEdit('positioning')}
          onCancel={cancelEdit}
        >
          <SectionLabel>Positioning</SectionLabel>
          <FeatureChip status="LIVE" />
        </SectionHeader>

        {editing === 'positioning' ? (
          <div className="mt-2 space-y-2">
            <textarea
              className={textareaCls}
              value={positioningDraft.oneLiner}
              onChange={(e) => setPositioningDraft((d) => ({ ...d, oneLiner: e.target.value }))}
            />
            <input
              className={inputCls}
              value={positioningDraft.tagline}
              onChange={(e) => setPositioningDraft((d) => ({ ...d, tagline: e.target.value }))}
              placeholder="Tagline"
            />
            <input
              className={inputCls}
              value={positioningDraft.footprint}
              onChange={(e) => setPositioningDraft((d) => ({ ...d, footprint: e.target.value }))}
              placeholder="Footprint"
            />
            <div>
              <div className="mb-1 text-[11px] text-ink-3">Pillars, one per line</div>
              <textarea
                className={textareaCls}
                value={positioningDraft.pillars}
                onChange={(e) => setPositioningDraft((d) => ({ ...d, pillars: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 max-w-3xl text-[15px] font-medium leading-snug text-ink">{brain.positioning.oneLiner}</p>
            <p className="mt-2 text-[12px] italic text-ink-2">“{brain.positioning.tagline}”</p>
            <p className="mono mt-2 text-[11px] text-ink-3">{brain.positioning.footprint}</p>
            <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {brain.positioning.pillars.map((p, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border border-line bg-paper px-3 py-2 text-[12px] text-ink-2">
                  <span className="mono text-ink-3">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {/* Pricing */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="px-5 py-4">
          <SectionHeader
            edited={isEdited('brandPricing')}
            editing={editing === 'brandPricing'}
            onEdit={() => startEdit('brandPricing')}
            onSave={() => saveEdit('brandPricing')}
            onCancel={cancelEdit}
          >
            <SectionLabel>Brand pricing (USD)</SectionLabel>
          </SectionHeader>

          {editing === 'brandPricing' ? (
            <div className="mt-2">
              <div className="mb-1 text-[11px] text-ink-3">One tier per line: name | price | note</div>
              <textarea
                className={textareaCls}
                value={brandPricingDraft}
                onChange={(e) => setBrandPricingDraft(e.target.value)}
              />
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {brain.brandPricing.map((t) => (
                <li key={t.name} className="py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-ink">{t.name}</span>
                    <span className="mono text-[13px] text-accent">{t.price}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-3">{t.note}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="px-5 py-4">
          <SectionHeader
            edited={isEdited('creatorPricing')}
            editing={editing === 'creatorPricing'}
            onEdit={() => startEdit('creatorPricing')}
            onSave={() => saveEdit('creatorPricing')}
            onCancel={cancelEdit}
          >
            <SectionLabel>Creator pricing (USD)</SectionLabel>
          </SectionHeader>

          {editing === 'creatorPricing' ? (
            <div className="mt-2">
              <div className="mb-1 text-[11px] text-ink-3">One tier per line: name | price | note</div>
              <textarea
                className={textareaCls}
                value={creatorPricingDraft}
                onChange={(e) => setCreatorPricingDraft(e.target.value)}
              />
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {brain.creatorPricing.map((t) => (
                <li key={t.name} className="py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-ink">{t.name}</span>
                    <span className="mono text-[13px] text-accent">{t.price}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-3">{t.note}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 space-y-1.5 border-t border-line pt-3">
            <div className="flex items-center gap-2 text-[12px] text-ink-2"><span className="font-medium text-ink">Ai-kyo</span> {brain.products.aikyo}</div>
            <div className="flex items-start gap-2 text-[12px] text-ink-2"><FeatureChip status="BETA" /> {brain.products.trustCheck}</div>
            <div className="flex items-center gap-2 text-[12px] text-ink-2"><FeatureChip status="BETA" /> {brain.products.briefBuilder}</div>
          </div>
        </Card>
      </div>

      {/* ICP */}
      <Card className="mt-6 px-5 py-4">
        <SectionHeader
          edited={isEdited('icp')}
          editing={editing === 'icp'}
          onEdit={() => startEdit('icp')}
          onSave={() => saveEdit('icp')}
          onCancel={cancelEdit}
        >
          <SectionLabel>Ideal customer profile</SectionLabel>
        </SectionHeader>

        {editing === 'icp' ? (
          <div className="mt-2 space-y-3">
            <textarea
              className={textareaCls}
              value={icpDraft.summary}
              onChange={(e) => setIcpDraft((d) => ({ ...d, summary: e.target.value }))}
            />
            <div>
              <div className="mb-1 text-[11px] text-ink-3">Niches, one per line</div>
              <textarea className={textareaCls} value={icpDraft.niches} onChange={(e) => setIcpDraft((d) => ({ ...d, niches: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[11px] text-ink-3">Positive signals, one per line</div>
                <textarea className={textareaCls} value={icpDraft.positiveSignals} onChange={(e) => setIcpDraft((d) => ({ ...d, positiveSignals: e.target.value }))} />
              </div>
              <div>
                <div className="mb-1 text-[11px] text-ink-3">Negative signals, one per line</div>
                <textarea className={textareaCls} value={icpDraft.negativeSignals} onChange={(e) => setIcpDraft((d) => ({ ...d, negativeSignals: e.target.value }))} />
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] text-ink-3">Ideal contacts, one per line</div>
              <textarea className={textareaCls} value={icpDraft.idealContacts} onChange={(e) => setIcpDraft((d) => ({ ...d, idealContacts: e.target.value }))} />
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[13px] text-ink">{brain.icp.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {brain.icp.niches.map((n) => (
                <Chip key={n} tone="neutral">{n}</Chip>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-1.5 text-[12px] font-medium text-ok">Positive signals</div>
                <ul className="space-y-1">
                  {brain.icp.positiveSignals.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-ink-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" strokeWidth={2} /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-medium text-ink-2">Negative signals</div>
                <ul className="space-y-1">
                  {brain.icp.negativeSignals.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-ink-2">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" strokeWidth={2} /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3 text-[12px] text-ink-2">
              <span className="text-ink-3">Ideal contacts: </span>
              {brain.icp.idealContacts.join(' · ')}
            </div>
          </>
        )}
      </Card>

      {/* Claims */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="px-5 py-4">
          <SectionHeader
            edited={isEdited('allowedClaims')}
            editing={editing === 'allowedClaims'}
            onEdit={() => startEdit('allowedClaims')}
            onSave={() => saveEdit('allowedClaims')}
            onCancel={cancelEdit}
          >
            <SectionLabel>Allowed claims</SectionLabel>
          </SectionHeader>

          {editing === 'allowedClaims' ? (
            <div className="mt-2">
              <div className="mb-1 text-[11px] text-ink-3">One claim per line</div>
              <textarea className={textareaCls} value={allowedDraft} onChange={(e) => setAllowedDraft(e.target.value)} />
            </div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {brain.allowedClaims.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-ink-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" strokeWidth={2} /> {c}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="px-5 py-4">
          <SectionHeader
            edited={isEdited('forbiddenClaims')}
            editing={editing === 'forbiddenClaims'}
            onEdit={() => startEdit('forbiddenClaims')}
            onSave={() => saveEdit('forbiddenClaims')}
            onCancel={cancelEdit}
          >
            <SectionLabel>Forbidden claims</SectionLabel>
          </SectionHeader>

          {editing === 'forbiddenClaims' ? (
            <div className="mt-2">
              <div className="mb-1 text-[11px] text-ink-3">One claim per line</div>
              <textarea className={textareaCls} value={forbiddenDraft} onChange={(e) => setForbiddenDraft(e.target.value)} />
            </div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {brain.forbiddenClaims.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-ink-2">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} /> {c}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Tone */}
      <Card className="mt-6 px-5 py-4">
        <SectionHeader
          edited={isEdited('tone')}
          editing={editing === 'tone'}
          onEdit={() => startEdit('tone')}
          onSave={() => saveEdit('tone')}
          onCancel={cancelEdit}
        >
          <SectionLabel>Tone rules</SectionLabel>
        </SectionHeader>

        {editing === 'tone' ? (
          <div className="mt-2">
            <div className="mb-1 text-[11px] text-ink-3">One rule per line</div>
            <textarea className={textareaCls} value={toneDraft} onChange={(e) => setToneDraft(e.target.value)} />
          </div>
        ) : (
          <ul className="mt-2 grid grid-cols-1 gap-1.5 md:grid-cols-2">
            {brain.tone.rules.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-ink-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-3" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Example good vs bad */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <SectionLabel>Example message: good vs bad</SectionLabel>
          {isEdited('examples') && editing !== 'examples' && <EditedChip />}
          <div className="ml-auto flex items-center gap-1.5">
            {editing === 'examples' ? (
              <>
                <button className="btn btn-xs btn-primary" onClick={() => saveEdit('examples')}>Save</button>
                <button className="btn btn-xs btn-ghost" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-xs btn-secondary" onClick={() => startEdit('examples')}>Edit</button>
            )}
          </div>
        </div>

        {editing === 'examples' ? (
          <div className="mt-2">
            <div className="mb-1 text-[11px] text-ink-3">One example per line: label | good/avoid | text | why</div>
            <textarea className={cx(textareaCls, 'min-h-[140px]')} value={examplesDraft} onChange={(e) => setExamplesDraft(e.target.value)} />
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {brain.examples.map((ex, i) => (
              <Card key={i} className={cx('px-4 py-3.5', ex.good ? 'border-ok/30' : 'border-accent/30')}>
                <div className="flex items-center gap-2">
                  {ex.good ? <Chip tone="ok">Good</Chip> : <Chip tone="accent">Avoid</Chip>}
                  <span className="text-[12px] font-medium text-ink">{ex.label}</span>
                </div>
                <p className="mt-2 rounded-md bg-paper px-3 py-2.5 text-[13px] leading-relaxed text-ink">{ex.text}</p>
                <p className="mt-2 text-[11px] text-ink-3">{ex.why}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      {anyEdited && (
        <div className="mt-6 flex justify-end">
          <button className="btn btn-xs btn-ghost" onClick={handleReset}>Reset to defaults</button>
        </div>
      )}
    </div>
  )
}
