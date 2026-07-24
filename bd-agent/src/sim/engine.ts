import type { Lead, Message } from '../types'
import { useStore, uid, classifyReply, replyBodies, getEffectiveMode } from '../state/store'
import type { ReplyKind, SendGateResult } from '../state/store'
import { useRuntime } from '../state/runtime'

const nowIso = () => new Date().toISOString()

// ---- Cancellable timed sequence ----
export interface Step {
  delay: number
  run: () => void
}

export function runSequence(steps: Step[]): () => void {
  const ids: ReturnType<typeof setTimeout>[] = []
  let t = 0
  for (const s of steps) {
    t += s.delay
    ids.push(setTimeout(s.run, t))
  }
  return () => ids.forEach((id) => clearTimeout(id))
}

// ---------------------------------------------------------------------------
// (1) DISCOVERY, stream a log, then add 3 leads one-by-one (discovered →
//     researching → scored), logging agent events along the way.
// ---------------------------------------------------------------------------

interface Candidate {
  company: string
  niche: Lead['niche']
  staff: number
  location: string
  profile: string
  contact: Lead['contact']
  fitScore: number
  fitBreakdown: Lead['fitBreakdown']
  fitExplanation: string
  confidence: number
  partnershipAngle: string
  risks: string[]
  evidence: Omit<Lead['evidence'][number], 'id'>[]
  qualifyReason: string
}

const candidates: Candidate[] = [
  {
    company: 'Kiln & Co',
    niche: 'F&B',
    staff: 30,
    location: 'Katong, Singapore',
    profile:
      'Artisan bakery-café, 2 outlets. Sourdough and laminated pastries with a loyal weekend crowd. Teasing a third outlet opening.',
    contact: { name: 'Germaine Yeo', role: 'Co-founder', linkedin: 'linkedin.com/in/germaine-yeo-kiln' },
    fitScore: 80,
    fitBreakdown: { icpMatch: 86, spendSignal: 68, timing: 84, reachability: 80 },
    fitExplanation:
      'Consumer F&B with a physical expansion signal (third outlet). Spend is modest, a Starter-tier, launch-week creator push fits.',
    confidence: 0.79,
    partnershipAngle: 'Match SG food creators to the third-outlet opening week for tasting content.',
    risks: ['Small team, modest budget.', 'Peak weekend ops may limit event capacity.'],
    evidence: [
      {
        claim: 'Opening a third outlet.',
        sourceUrl: 'linkedin.com/company/kiln-and-co/posts/third-outlet',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-24',
        excerpt: '"Outlet number three is happening. Katong friends, you will not have to travel far soon."',
        confidence: 0.82,
      },
    ],
    qualifyReason: 'Expansion signal + clean F&B fit. Starter-tier launch push.',
  },
  {
    company: 'Verde Wellness',
    niche: 'Fitness',
    staff: 40,
    location: 'Bukit Timah, Singapore',
    profile:
      'Plant-based supplements DTC brand. Subscription model, wellness-forward audience. Running a "reset" seasonal bundle.',
    contact: { name: 'Hui Min Chua', role: 'Head of Growth', linkedin: 'linkedin.com/in/huimin-chua-verde' },
    fitScore: 76,
    fitBreakdown: { icpMatch: 80, spendSignal: 74, timing: 78, reachability: 72 },
    fitExplanation:
      'DTC wellness with subscription economics and a seasonal bundle, creators are a natural acquisition channel. Health claims need careful vetting, which suits Trust Check.',
    confidence: 0.74,
    partnershipAngle: 'Shortlist SG wellness creators for the reset bundle; screen claims and engagement with Trust Check.',
    risks: ['Supplement claims carry compliance risk.', 'Subscription CAC scrutiny, will want measurable results.'],
    evidence: [
      {
        claim: 'Running a seasonal "reset" bundle with a growth push.',
        sourceUrl: 'linkedin.com/company/verde-wellness/posts/reset-bundle',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-24',
        excerpt: '"The Reset bundle is back. New year energy in July, we are pushing hard on this one."',
        confidence: 0.78,
      },
    ],
    qualifyReason: 'DTC subscription + seasonal push. Trust Check screens the claims.',
  },
  {
    company: 'Straits Denim',
    niche: 'Retail',
    staff: 55,
    location: 'Haji Lane, Singapore',
    profile:
      'Heritage-inspired denim label. Small-batch drops, strong in-store culture. Launching a limited selvedge run tied to National Day.',
    contact: { name: 'Faizal Osman', role: 'Marketing Lead', linkedin: 'linkedin.com/in/faizal-osman-straits' },
    fitScore: 72,
    fitBreakdown: { icpMatch: 78, spendSignal: 66, timing: 80, reachability: 64 },
    fitExplanation:
      'Consumer retail with a dated drop (National Day selvedge run), good timing. Reachability is lower; marketing contact is less active publicly.',
    confidence: 0.71,
    partnershipAngle: 'Pair the selvedge run with SG fashion/lifestyle creators for a National Day drop story.',
    risks: ['Niche audience, creator fit must be tight.', 'Contact less responsive publicly.'],
    evidence: [
      {
        claim: 'Launching a limited National Day selvedge run.',
        sourceUrl: 'linkedin.com/company/straits-denim/posts/national-day-run',
        sourceType: 'Instagram',
        retrievedAt: '2026-07-24',
        excerpt: '"A limited selvedge run for National Day. Made here, worn here. Numbers are small."',
        confidence: 0.75,
      },
    ],
    qualifyReason: 'Dated drop gives clean timing; tighten creator fit.',
  },
]

function buildLead(c: Candidate): Lead {
  const id = uid('l')
  return {
    id,
    company: c.company,
    niche: c.niche,
    staff: c.staff,
    location: c.location,
    profile: c.profile,
    contact: c.contact,
    fitScore: c.fitScore,
    fitBreakdown: c.fitBreakdown,
    fitExplanation: c.fitExplanation,
    confidence: c.confidence,
    partnershipAngle: c.partnershipAngle,
    risks: c.risks,
    evidence: c.evidence.map((e) => ({ ...e, id: uid('e') })),
    stage: 'discovered',
    qualifyReason: c.qualifyReason,
    discoveredAt: '2026-07-24',
  }
}

export interface DiscoveryHandlers {
  onLog: (line: string) => void
  onDone: () => void
}

export function runDiscovery({ onLog, onDone }: DiscoveryHandlers): () => void {
  const store = useStore.getState()
  const rt = useRuntime.getState()
  rt.begin()

  const built = candidates.map(buildLead)
  const steps: Step[] = []

  steps.push({ delay: 500, run: () => onLog('Searching LinkedIn for SG F&B, wellness and retail brands with active campaign signals…') })
  steps.push({ delay: 900, run: () => onLog('Filtering by ICP: consumer brands, 10 to 200 staff, influencer-marketing intent…') })

  built.forEach((lead, i) => {
    steps.push({
      delay: 1100,
      run: () => {
        onLog(`Found ${lead.company} (${lead.niche}), collecting recent posts…`)
        store.addLead(lead)
        store.logEvent({ type: 'discovery', text: `Discovered ${lead.company} (${lead.niche}).`, leadId: lead.id })
      },
    })
    steps.push({
      delay: 900,
      run: () => {
        onLog(`Researching ${lead.company}, reading ${lead.evidence.length} source${lead.evidence.length > 1 ? 's' : ''}…`)
        store.patchLead(lead.id, { stage: 'researching' })
      },
    })
    steps.push({
      delay: 1000,
      run: () => {
        onLog(`Scoring fit for ${lead.company}… fit ${lead.fitScore}, confidence ${lead.confidence.toFixed(2)}.`)
        store.patchLead(lead.id, { stage: 'scored' })
        store.logEvent({ type: 'discovery', text: `Scored ${lead.company}, fit ${lead.fitScore} (confidence ${lead.confidence.toFixed(2)}).`, leadId: lead.id })
      },
    })
    if (i === built.length - 1) {
      steps.push({
        delay: 700,
        run: () => {
          onLog(`Done. ${built.length} new leads added to the pipeline.`)
          rt.end()
          onDone()
        },
      })
    }
  })

  return runSequence(steps)
}

// ---------------------------------------------------------------------------
// (2) DRAFT OUTREACH, visible steps + typing effect, then sendGate.
// ---------------------------------------------------------------------------

export function draftForLead(lead: Lead): string {
  const ev = lead.evidence[0]
  const observation = ev ? ev.claim.replace(/\.$/, '') : `${lead.company} is active in ${lead.niche}`
  return `Hi ${lead.contact.name.split(' ')[0]}, saw ${lead.company} is ${observation.charAt(0).toLowerCase() + observation.slice(1)}. ${lead.partnershipAngle} Worth a short look this week?`
}

export interface DraftHandlers {
  onStep: (label: string, index: number, total: number) => void
  onType: (partial: string) => void
  onResult: (result: SendGateResult, fullText: string) => void
}

export function draftOutreach(leadId: string, h: DraftHandlers): () => void {
  const store = useStore.getState()
  const rt = useRuntime.getState()
  rt.begin()
  const lead = store.leads.find((l) => l.id === leadId)
  if (!lead) {
    rt.end()
    return () => {}
  }
  const convId = store.ensureConversation(leadId)
  const full = draftForLead(lead)
  const stepLabels = [
    'Selecting partnership angle…',
    `Checking evidence (${lead.evidence.length} item${lead.evidence.length > 1 ? 's' : ''})…`,
    'Drafting message…',
    'Running policy check…',
  ]

  const steps: Step[] = []
  stepLabels.forEach((label, i) => {
    steps.push({ delay: i === 0 ? 300 : 850, run: () => h.onStep(label, i, stepLabels.length) })
  })

  // typing effect that runs after the "Drafting message…" step appears
  const words = full.split(' ')
  words.forEach((_, i) => {
    steps.push({ delay: i === 0 ? 250 : 45, run: () => h.onType(words.slice(0, i + 1).join(' ')) })
  })

  steps.push({
    delay: 700,
    run: () => {
      const result = store.sendGate({
        conversationId: convId,
        draftText: full,
        reasonKind: 'outreach',
        reason: 'Initial outreach',
        citesEvidenceIds: lead.evidence.map((e) => e.id),
      })
      if (result === 'sent') store.patchLead(leadId, { stage: 'contacted' })
      rt.end()
      h.onResult(result, full)
    },
  })

  return runSequence(steps)
}

// ---------------------------------------------------------------------------
// (3) REPLY INJECTION, incoming reply → classify → summary → response draft.
// ---------------------------------------------------------------------------

export interface ReplyHandlers {
  onClassify?: (intent: string, confidence: number) => void
  onResult?: (result: SendGateResult) => void
}

export function injectReply(conversationId: string, kind: ReplyKind, h: ReplyHandlers = {}): () => void {
  const store = useStore.getState()
  const rt = useRuntime.getState()
  rt.begin()
  const conv = store.conversations.find((c) => c.id === conversationId)
  const lead = store.leads.find((l) => l.id === conv?.leadId)
  const cls = classifyReply(kind)

  const steps: Step[] = []

  // incoming message arrives
  steps.push({
    delay: 500,
    run: () => {
      const incoming: Omit<Message, 'id'> = {
        conversationId,
        author: 'contact',
        text: replyBodies[kind],
        ts: nowIso(),
        status: 'delivered',
      }
      store.pushMessage(incoming)
      useStore.setState((s) => ({
        conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unread: true } : c)),
      }))
      store.logEvent({ type: 'reply', text: `${lead?.company ?? 'Contact'} replied.`, leadId: lead?.id })
    },
  })

  // agent classifies (visible chip on the message)
  steps.push({
    delay: 900,
    run: () => {
      useStore.setState((s) => ({
        messages: s.messages.map((m, idx, arr) =>
          idx === arr.length - 1 && m.conversationId === conversationId && m.author === 'contact'
            ? { ...m, intent: cls.intent, confidence: cls.confidence }
            : m,
        ),
      }))
      store.logActivity(conversationId, `Incoming reply classified: ${cls.intent} (${cls.confidence.toFixed(2)}).`)
      h.onClassify?.(cls.intent, cls.confidence)
    },
  })

  // summary updates
  steps.push({
    delay: 700,
    run: () => {
      const summary =
        kind === 'positive'
          ? `${lead?.contact.name ?? 'Contact'} replied positively, wants a sample shortlist and to see how the match score works. Agent is drafting a response.`
          : kind === 'pricing'
            ? `${lead?.contact.name ?? 'Contact'} asked about pricing and a per-campaign option. Pricing is an escalation trigger, a reply is being routed to human review.`
            : `${lead?.contact.name ?? 'Contact'} signalled not interested / opt-out. Escalation trigger, routed to human review; no further agent sends without approval.`
      useStore.setState((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, summary, stage: kind === 'positive' ? 'replied' : 'negotiating' } : c,
        ),
      }))
    },
  })

  // agent drafts a response and routes it per mode + escalation rules
  steps.push({
    delay: 900,
    run: () => {
      const draft = responseDraft(kind, lead?.contact.name.split(' ')[0] ?? 'there')
      const result = store.sendGate({
        conversationId,
        draftText: draft,
        reasonKind: cls.escalate ? 'escalation' : 'reply',
        reason: cls.escalate ? cls.escalationReason ?? 'Escalated → human review' : 'Reply to inbound',
        citesEvidenceIds: lead?.evidence.slice(0, 1).map((e) => e.id) ?? [],
        forceEscalation: cls.escalate,
        escalationReason: cls.escalationReason,
      })
      rt.end()
      h.onResult?.(result)
    },
  })

  return runSequence(steps)
}

function responseDraft(kind: ReplyKind, firstName: string): string {
  switch (kind) {
    case 'positive':
      return `Great, I’ll put together a short sample shortlist for you. The match score weights real engagement, audience overlap with your customer, and content-fit against the brief (not follower count). Want me to send 5 SG creators mapped to the campaign so you can see the scoring in context?`
    case 'pricing':
      return `Hi ${firstName}, fair to ask. Plans start at Brand Starter ($49/mo) for a single campaign, and Growth ($119/mo) adds Ai-kyo, UTM and advanced analytics. For a one-off push, Starter usually covers it, happy to map it to your budget on a quick call.`
    case 'notinterested':
      return `Understood, ${firstName}, I’ll close this out and take you off the list. If the agency engagement changes, we’re here. Thanks for the reply.`
  }
}

// ---------------------------------------------------------------------------
// (4) ADVANCE TIME, fire a scheduled follow-up draft cycle.
// ---------------------------------------------------------------------------

export interface FollowUpHandlers {
  onStep?: (label: string) => void
  onResult?: (result: SendGateResult | 'none') => void
}

export function advanceTime(conversationId: string, h: FollowUpHandlers = {}): () => void {
  const store = useStore.getState()
  const conv = store.conversations.find((c) => c.id === conversationId)
  const lead = store.leads.find((l) => l.id === conv?.leadId)
  if (!conv || !conv.nextFollowUp) {
    h.onResult?.('none')
    return () => {}
  }
  const rt = useRuntime.getState()
  rt.begin()

  const steps: Step[] = []
  steps.push({ delay: 400, run: () => h.onStep?.(`Follow-up due (${conv.nextFollowUp}), checking thread…`) })
  steps.push({
    delay: 900,
    run: () => {
      h.onStep?.('Drafting follow-up…')
      store.cancelFollowUp(conversationId)
    },
  })
  steps.push({
    delay: 900,
    run: () => {
      const eff = getEffectiveMode(conv, store.settings)
      h.onStep?.(eff === 'auto' ? 'Running policy check…' : 'Routing to review…')
      const draft = `Hi ${lead?.contact.name.split(' ')[0] ?? 'there'}, following up on the note above. No rush, but if the ${lead?.niche ?? 'campaign'} timing is close I can have a sample shortlist over to you the same day. Worth a quick look?`
      const result = store.sendGate({
        conversationId,
        draftText: draft,
        reasonKind: 'reply',
        reason: 'Scheduled follow-up',
        citesEvidenceIds: [],
      })
      rt.end()
      h.onResult?.(result)
    },
  })

  return runSequence(steps)
}
