import { create } from 'zustand'
import type {
  Lead,
  Conversation,
  Message,
  Approval,
  AgentEvent,
  Settings,
  EffectiveMode,
  ModeOverride,
  ApprovalReasonKind,
} from '../types'
import {
  seedLeads,
  seedConversations,
  seedMessages,
  seedApprovals,
  seedAgentEvents,
} from '../data/leads'
import { brain as brainFixture, type Brain } from '../data/brain'

let counter = 0
export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`
const nowIso = () => new Date().toISOString()

// ---- Pure helpers (exported so acceptance logic lives in one place) ----

export function getEffectiveMode(conv: Conversation, settings: Settings): EffectiveMode {
  if (conv.modeOverride === 'inherit') return settings.globalMode
  return conv.modeOverride
}

export type ReplyKind = 'positive' | 'pricing' | 'notinterested'

export interface Classification {
  intent: string
  confidence: number
  escalate: boolean
  escalationReason?: string
}

export function classifyReply(kind: ReplyKind): Classification {
  switch (kind) {
    case 'positive':
      return { intent: 'Interested', confidence: 0.91, escalate: false }
    case 'pricing':
      return {
        intent: 'Pricing question',
        confidence: 0.89,
        escalate: true,
        escalationReason: 'Pricing negotiation → human review',
      }
    case 'notinterested':
      return {
        intent: 'Not interested / opt-out',
        confidence: 0.93,
        escalate: true,
        escalationReason: 'Opt-out / not interested → human review',
      }
  }
}

// Canned incoming reply bodies (contact voice).
export const replyBodies: Record<ReplyKind, string> = {
  positive:
    'This looks genuinely useful, the manual shortlisting is exactly our pain right now. Can you send a sample shortlist and show how the match score is calculated?',
  pricing:
    'Before we go further, what do your plans actually cost, and is there a per-campaign option instead of a monthly subscription? I need to check it against this quarter’s budget.',
  notinterested:
    'Appreciate the note, but we’ve just signed with an agency for this and won’t be adding another tool. Please take us off your list, thanks.',
}

interface SendGateParams {
  conversationId: string
  draftText: string
  reasonKind: ApprovalReasonKind
  reason: string
  citesEvidenceIds: string[]
  forceEscalation?: boolean
  escalationReason?: string
}

export type SendGateResult = 'sent' | 'approval' | 'blocked' | 'paused'

interface BDState {
  leads: Lead[]
  conversations: Conversation[]
  messages: Message[]
  approvals: Approval[]
  agentEvents: AgentEvent[]
  settings: Settings
  brain: Brain

  // brain (business brain, editable)
  updateBrain: <K extends keyof Brain>(section: K, value: Brain[K]) => void
  resetBrain: () => void

  // primitives
  logEvent: (e: Omit<AgentEvent, 'id' | 'ts'> & { ts?: string }) => void
  logActivity: (conversationId: string, text: string) => void
  pushMessage: (m: Omit<Message, 'id'>) => Message

  // mode + ownership
  setGlobalMode: (mode: 'human' | 'auto') => void
  setOverride: (conversationId: string, override: ModeOverride) => void
  takeOver: (conversationId: string) => void
  returnToAgent: (conversationId: string) => void
  markRead: (conversationId: string) => void

  // the central rule
  sendGate: (p: SendGateParams) => SendGateResult

  // approvals
  approve: (approvalId: string, editedText?: string) => void
  reject: (approvalId: string) => void

  // human composer
  humanSend: (conversationId: string, text: string) => void

  // discovery + follow-ups (used by sim engine)
  addLead: (lead: Lead) => void
  patchLead: (id: string, patch: Partial<Lead>) => void
  ensureConversation: (leadId: string) => string
  cancelFollowUp: (conversationId: string) => void

  // settings
  patchSettings: (patch: Partial<Settings>) => void
}

const initialSettings: Settings = {
  globalMode: 'human',
  sendStart: '09:00',
  sendEnd: '18:00',
  dailyCap: 25,
  followUpCadence: '3 business days',
  confidenceThreshold: 0.7,
  suppressionList: ['competitors.sg', 'noreply@', 'careers@'],
}

export const useStore = create<BDState>((set, get) => ({
  leads: seedLeads,
  conversations: seedConversations,
  messages: seedMessages,
  approvals: seedApprovals,
  agentEvents: seedAgentEvents,
  settings: initialSettings,
  brain: brainFixture,

  updateBrain: (section, value) =>
    set((s) => ({ brain: { ...s.brain, [section]: value } })),

  resetBrain: () => set({ brain: brainFixture }),

  logEvent: (e) =>
    set((s) => ({
      agentEvents: [{ id: uid('ev'), ts: e.ts ?? nowIso(), type: e.type, text: e.text, leadId: e.leadId }, ...s.agentEvents],
    })),

  logActivity: (conversationId, text) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, activity: [...c.activity, { id: uid('act'), ts: nowIso(), text }] }
          : c,
      ),
    })),

  pushMessage: (m) => {
    const msg: Message = { ...m, id: uid('m') }
    set((s) => ({ messages: [...s.messages, msg] }))
    return msg
  },

  setGlobalMode: (mode) => {
    set((s) => ({ settings: { ...s.settings, globalMode: mode } }))
    get().logEvent({
      type: 'mode',
      text: `Global autonomy → ${mode === 'auto' ? 'Autonomous' : 'Human approval'}.`,
    })
  },

  setOverride: (conversationId, override) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, modeOverride: override } : c,
      ),
    }))
    const label =
      override === 'inherit'
        ? 'Inherit global'
        : override === 'human'
          ? 'Force Human approval'
          : override === 'auto'
            ? 'Force Autonomous'
            : 'Paused'
    get().logActivity(conversationId, `Thread autonomy → ${label}.`)
    get().logEvent({ type: 'mode', text: `Thread autonomy set to ${label}.` })
    if (override === 'paused') get().cancelFollowUp(conversationId)
  },

  takeOver: (conversationId) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, owner: 'human', nextFollowUp: undefined } : c,
      ),
    }))
    get().logActivity(conversationId, 'Owner → You (takeover). Scheduled follow-ups cancelled.')
    get().logEvent({ type: 'mode', text: 'Thread owner → You (takeover). Agent sends blocked.' })
  },

  returnToAgent: (conversationId) => {
    const s = get()
    const conv = s.conversations.find((c) => c.id === conversationId)
    if (!conv) return
    const lead = s.leads.find((l) => l.id === conv.leadId)
    const last = [...s.messages].filter((m) => m.conversationId === conversationId && m.status !== 'draft').at(-1)
    const eff = getEffectiveMode({ ...conv, owner: 'agent' }, s.settings)
    const snippet = last ? `${last.author === 'contact' ? lead?.contact.name ?? 'Contact' : last.author === 'human' ? 'You' : 'Agent'}: “${last.text.slice(0, 80)}${last.text.length > 80 ? '…' : ''}”` : 'no messages yet'
    const summary = `Resumed by agent for ${lead?.company ?? 'this lead'} (${conv.stage}). Last contact, ${snippet}. Agent will continue in ${eff === 'auto' ? 'Autonomous' : eff === 'human' ? 'Human approval' : 'Paused'} mode.`
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === conversationId ? { ...c, owner: 'agent', summary } : c,
      ),
    }))
    get().logActivity(conversationId, 'Owner → Agent. Thread summary regenerated; agent resumes.')
    get().logEvent({ type: 'mode', text: 'Thread owner → Agent. Summary regenerated, agent resumed.' })
  },

  markRead: (conversationId) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: false } : c,
      ),
    })),

  // ---- THE CENTRAL RULE. Every agent-originated send goes through here. ----
  sendGate: (p) => {
    const s = get()
    const conv = s.conversations.find((c) => c.id === p.conversationId)
    if (!conv) return 'blocked'
    const lead = s.leads.find((l) => l.id === conv.leadId)

    // Rule 1: human-owned thread → agent may never send.
    if (conv.owner === 'human') {
      get().logActivity(p.conversationId, 'Agent send blocked, thread is owned by You.')
      get().logEvent({ type: 'system', text: `Agent send blocked on ${lead?.company ?? 'thread'}, owned by You.`, leadId: lead?.id })
      return 'blocked'
    }

    const eff = getEffectiveMode(conv, s.settings)

    const createApproval = (reasonKind: ApprovalReasonKind, reason: string) => {
      const ap: Approval = {
        id: uid('ap'),
        conversationId: p.conversationId,
        leadId: conv.leadId,
        draftText: p.draftText,
        reasonKind,
        reason,
        citesEvidenceIds: p.citesEvidenceIds,
        createdAt: nowIso(),
        status: 'pending',
      }
      set((st) => ({ approvals: [ap, ...st.approvals] }))
    }

    // Rule 2: paused → hold for human, never auto-send.
    if (eff === 'paused') {
      createApproval(p.reasonKind, `Thread paused → held for review`)
      get().logActivity(p.conversationId, 'Thread paused, draft held in Approvals, not sent.')
      get().logEvent({ type: 'approval', text: `Draft for ${lead?.company ?? 'thread'} held (thread paused).`, leadId: lead?.id })
      return 'paused'
    }

    // Rule 3: human mode → agent drafts always go to Approvals, never auto-send.
    if (eff === 'human') {
      createApproval(p.reasonKind, p.reason)
      get().logActivity(p.conversationId, `Draft routed to Approvals (Human approval): ${p.reason}.`)
      get().logEvent({ type: 'approval', text: `Draft for ${lead?.company ?? 'thread'} routed to Approvals: ${p.reason}.`, leadId: lead?.id })
      return 'approval'
    }

    // Rule 4: auto mode. Escalation triggers still route to Approvals.
    const escalate = p.forceEscalation || p.reasonKind === 'escalation'
    if (escalate) {
      const reason = p.escalationReason ?? p.reason
      createApproval('escalation', reason)
      get().logActivity(p.conversationId, `Escalated to Approvals: ${reason}.`)
      get().logEvent({ type: 'approval', text: `${lead?.company ?? 'Thread'} escalated to Approvals: ${reason}.`, leadId: lead?.id })
      return 'approval'
    }

    // Rule 5: auto mode, no escalation → auto-send after (already-shown) policy check.
    get().pushMessage({
      conversationId: p.conversationId,
      author: 'agent',
      text: p.draftText,
      ts: nowIso(),
      status: 'delivered',
    })
    get().logActivity(p.conversationId, 'Policy check passed, auto-sent (Autonomous).')
    get().logEvent({ type: 'send', text: `Auto-sent to ${lead?.company ?? 'thread'} after policy check.`, leadId: lead?.id })
    return 'sent'
  },

  approve: (approvalId, editedText) => {
    const s = get()
    const ap = s.approvals.find((a) => a.id === approvalId)
    if (!ap || ap.status !== 'pending') return
    const conv = s.conversations.find((c) => c.id === ap.conversationId)
    const lead = s.leads.find((l) => l.id === ap.leadId)
    const text = editedText?.trim() || ap.draftText

    // remove any inline pending-draft placeholder for this conversation
    set((st) => ({
      messages: st.messages.filter((m) => !(m.conversationId === ap.conversationId && m.status === 'draft')),
    }))
    get().pushMessage({
      conversationId: ap.conversationId,
      author: 'agent',
      text,
      ts: nowIso(),
      status: 'delivered',
    })
    set((st) => ({
      approvals: st.approvals.map((a) => (a.id === approvalId ? { ...a, status: 'approved' as const, draftText: text } : a)),
      conversations: st.conversations.map((c) =>
        c.id === ap.conversationId && c.stage === 'queued' ? { ...c, stage: 'contacted' } : c,
      ),
    }))
    get().logActivity(ap.conversationId, `Approved${editedText ? ' (edited)' : ''} and sent: ${ap.reason}.`)
    get().logEvent({ type: 'send', text: `Approved${editedText ? ' & edited' : ''}, sent to ${lead?.company ?? 'thread'}. ${conv ? '' : ''}`.trim(), leadId: lead?.id })
  },

  reject: (approvalId) => {
    const s = get()
    const ap = s.approvals.find((a) => a.id === approvalId)
    if (!ap || ap.status !== 'pending') return
    const lead = s.leads.find((l) => l.id === ap.leadId)
    set((st) => ({
      approvals: st.approvals.map((a) => (a.id === approvalId ? { ...a, status: 'rejected' as const } : a)),
    }))
    get().logActivity(ap.conversationId, `Draft rejected by You: ${ap.reason}.`)
    get().logEvent({ type: 'approval', text: `Draft for ${lead?.company ?? 'thread'} rejected by You.`, leadId: lead?.id })
  },

  humanSend: (conversationId, text) => {
    const clean = text.trim()
    if (!clean) return
    const s = get()
    const lead = s.leads.find((l) => l.id === s.conversations.find((c) => c.id === conversationId)?.leadId)
    get().pushMessage({ conversationId, author: 'human', text: clean, ts: nowIso(), status: 'sent' })
    get().logActivity(conversationId, 'You sent a message.')
    get().logEvent({ type: 'send', text: `You sent a message to ${lead?.company ?? 'thread'}.`, leadId: lead?.id })
  },

  addLead: (lead) => set((s) => ({ leads: [...s.leads, lead] })),

  patchLead: (id, patch) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),

  ensureConversation: (leadId) => {
    const s = get()
    const existing = s.conversations.find((c) => c.leadId === leadId)
    if (existing) return existing.id
    const lead = s.leads.find((l) => l.id === leadId)
    const id = uid('c')
    const conv: Conversation = {
      id,
      leadId,
      stage: 'queued',
      modeOverride: 'inherit',
      owner: 'agent',
      summary: `New thread for ${lead?.company ?? 'lead'}. No outreach sent yet.`,
      nextFollowUp: undefined,
      unread: false,
      activity: [{ id: uid('act'), ts: nowIso(), text: 'Conversation opened.' }],
    }
    set((st) => ({
      conversations: [...st.conversations, conv],
      leads: st.leads.map((l) => (l.id === leadId ? { ...l, conversationId: id } : l)),
    }))
    return id
  },

  cancelFollowUp: (conversationId) => {
    const s = get()
    const conv = s.conversations.find((c) => c.id === conversationId)
    if (!conv?.nextFollowUp) return
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === conversationId ? { ...c, nextFollowUp: undefined } : c,
      ),
    }))
    get().logActivity(conversationId, 'Scheduled follow-up cancelled.')
  },

  patchSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
    if (patch.globalMode) {
      get().logEvent({ type: 'mode', text: `Global autonomy → ${patch.globalMode === 'auto' ? 'Autonomous' : 'Human approval'}.` })
    }
  },
}))
