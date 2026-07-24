import { ShieldCheck, Zap, MessageSquare } from 'lucide-react'
import { useStore } from '../state/store'
import { Card, FeatureChip, SectionLabel, cx } from '../components/ui'

const hours = Array.from({ length: 13 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`)

export default function Settings() {
  const settings = useStore((s) => s.settings)
  const patch = useStore((s) => s.patchSettings)
  const setGlobalMode = useStore((s) => s.setGlobalMode)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
      {/* Global autonomy */}
      <Card className="px-5 py-4">
        <SectionLabel>Global autonomy</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGlobalMode('human')}
            className={cx(
              'rounded-lg border px-4 py-3 text-left transition-colors',
              settings.globalMode === 'human' ? 'border-info/40 bg-info/6' : 'border-line hover:border-ink-3',
            )}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className={cx('h-4 w-4', settings.globalMode === 'human' ? 'text-info' : 'text-ink-3')} strokeWidth={1.75} />
              <span className="text-[13px] font-medium text-ink">Human approval</span>
            </div>
            <p className="mt-1.5 text-[12px] text-ink-2">Every agent draft waits in Approvals. Nothing sends without your click.</p>
          </button>
          <button
            type="button"
            onClick={() => setGlobalMode('auto')}
            className={cx(
              'rounded-lg border px-4 py-3 text-left transition-colors',
              settings.globalMode === 'auto' ? 'border-accent/40 bg-accent/6' : 'border-line hover:border-ink-3',
            )}
          >
            <div className="flex items-center gap-2">
              <Zap className={cx('h-4 w-4', settings.globalMode === 'auto' ? 'text-accent' : 'text-ink-3')} strokeWidth={1.75} />
              <span className="text-[13px] font-medium text-ink">Autonomous</span>
            </div>
            <p className="mt-1.5 text-[12px] text-ink-2">Agent sends after a policy check. Pricing, legal, hostile, opt-out and low-confidence still escalate.</p>
          </button>
        </div>
      </Card>

      {/* Sending policy */}
      <Card className="px-5 py-4">
        <SectionLabel>Sending policy</SectionLabel>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-[12px] text-ink-2">Sending window</span>
            <div className="mt-1.5 flex items-center gap-2">
              <select
                value={settings.sendStart}
                onChange={(e) => patch({ sendStart: e.target.value })}
                className="w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-accent/50"
              >
                {hours.map((h) => <option key={h}>{h}</option>)}
              </select>
              <span className="text-ink-3">to</span>
              <select
                value={settings.sendEnd}
                onChange={(e) => patch({ sendEnd: e.target.value })}
                className="w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-accent/50"
              >
                {hours.map((h) => <option key={h}>{h}</option>)}
              </select>
            </div>
            <span className="mt-1 block text-[11px] text-ink-3">SGT · outside this window, sends queue for the next morning.</span>
          </label>

          <label className="block">
            <span className="text-[12px] text-ink-2">Daily send cap</span>
            <input
              type="number"
              min={1}
              max={200}
              value={settings.dailyCap}
              onChange={(e) => patch({ dailyCap: Number(e.target.value) })}
              className="mono mt-1.5 w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[13px] tabular text-ink outline-none focus:border-accent/50"
            />
            <span className="mt-1 block text-[11px] text-ink-3">Across all threads, to avoid spammy patterns.</span>
          </label>

          <label className="block">
            <span className="text-[12px] text-ink-2">Follow-up cadence</span>
            <select
              value={settings.followUpCadence}
              onChange={(e) => patch({ followUpCadence: e.target.value })}
              className="mt-1.5 w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink outline-none focus:border-accent/50"
            >
              <option>2 business days</option>
              <option>3 business days</option>
              <option>5 business days</option>
              <option>1 week</option>
            </select>
            <span className="mt-1 block text-[11px] text-ink-3">Max 2 follow-ups, then the thread rests.</span>
          </label>

          <label className="block">
            <span className="text-[12px] text-ink-2">
              Confidence threshold <span className="mono text-ink">{settings.confidenceThreshold.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.5}
              max={0.95}
              step={0.01}
              value={settings.confidenceThreshold}
              onChange={(e) => patch({ confidenceThreshold: Number(e.target.value) })}
              className="mt-2.5 w-full accent-[var(--color-accent)]"
            />
            <span className="mt-1 block text-[11px] text-ink-3">Below this, drafts escalate to Approvals even in Autonomous mode.</span>
          </label>
        </div>
      </Card>

      {/* Channel */}
      <Card className="px-5 py-4">
        <SectionLabel>Channel</SectionLabel>
        <div className="mt-3 flex items-center gap-3 rounded-md border border-line bg-paper px-3 py-2.5">
          <MessageSquare className="h-4 w-4 text-info" strokeWidth={1.75} />
          <div className="flex-1">
            <div className="text-[13px] font-medium text-ink">LinkedIn</div>
            <div className="text-[11px] text-ink-3">Outreach and replies via LinkedIn messaging.</div>
          </div>
          <FeatureChip status="BETA" />
          <span className="mono rounded-md border border-warn/30 bg-warn/8 px-1.5 py-0.5 text-[10px] text-warn">SIMULATED</span>
        </div>
      </Card>

      {/* Suppression */}
      <Card className="px-5 py-4">
        <SectionLabel>Suppression list</SectionLabel>
        <p className="mt-1.5 text-[12px] text-ink-2">Domains and addresses the agent will never contact.</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {settings.suppressionList.map((s) => (
            <span key={s} className="mono rounded-md border border-line bg-surface px-2 py-1 text-[12px] text-ink-2">{s}</span>
          ))}
        </div>
      </Card>
    </div>
  )
}
