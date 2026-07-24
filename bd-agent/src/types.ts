// ---- Core domain types for the Influencees BD Agent (all simulated) ----

export type Niche =
  | 'F&B'
  | 'Beauty'
  | 'Fitness'
  | 'Fintech'
  | 'Retail'
  | 'Travel'

export type Stage =
  | 'discovered'
  | 'researching'
  | 'scored'
  | 'queued'
  | 'contacted'
  | 'replied'
  | 'negotiating'
  | 'meeting'
  | 'rejected'

export type GlobalMode = 'human' | 'auto'
export type ModeOverride = 'inherit' | 'human' | 'auto' | 'paused'
export type EffectiveMode = 'human' | 'auto' | 'paused'
export type Owner = 'agent' | 'human'

export type SourceType =
  | 'LinkedIn post'
  | 'Company page'
  | 'Job posting'
  | 'News'
  | 'Instagram'

export interface Evidence {
  id: string
  claim: string
  sourceUrl: string
  sourceType: SourceType
  retrievedAt: string // YYYY-MM-DD
  excerpt: string
  confidence: number // 0..1
}

export interface FitBreakdown {
  icpMatch: number // 0..100
  spendSignal: number
  timing: number
  reachability: number
}

export interface Contact {
  name: string
  role: string
  linkedin: string
}

export interface Lead {
  id: string
  company: string
  niche: Niche
  staff: number
  location: string
  profile: string
  contact: Contact
  fitScore: number // 0..100
  fitBreakdown: FitBreakdown
  fitExplanation: string
  confidence: number // 0..1
  partnershipAngle: string
  risks: string[]
  evidence: Evidence[]
  stage: Stage
  qualifyReason?: string
  rejectReason?: string
  conversationId?: string
  discoveredAt: string // YYYY-MM-DD
}

export type MessageAuthor = 'agent' | 'contact' | 'human' | 'system'
export type MessageStatus = 'sent' | 'delivered' | 'simulated' | 'draft'

export interface Message {
  id: string
  conversationId: string
  author: MessageAuthor
  text: string
  ts: string // ISO
  status?: MessageStatus
  intent?: string // classification chip on incoming replies
  confidence?: number // classification confidence
}

export interface ActivityEntry {
  id: string
  ts: string // ISO
  text: string
}

export interface Conversation {
  id: string
  leadId: string
  stage: Stage
  modeOverride: ModeOverride
  owner: Owner
  summary: string
  nextFollowUp?: string // human label e.g. "Fri 10:00", undefined = none
  unread: boolean
  activity: ActivityEntry[]
}

export type ApprovalReasonKind = 'outreach' | 'reply' | 'escalation'

export interface Approval {
  id: string
  conversationId: string
  leadId: string
  draftText: string
  reasonKind: ApprovalReasonKind
  reason: string
  citesEvidenceIds: string[]
  createdAt: string // ISO
  status: 'pending' | 'approved' | 'rejected'
}

export type AgentEventType =
  | 'discovery'
  | 'draft'
  | 'send'
  | 'mode'
  | 'reply'
  | 'approval'
  | 'system'

export interface AgentEvent {
  id: string
  ts: string // ISO
  type: AgentEventType
  text: string
  leadId?: string
}

export interface Settings {
  globalMode: GlobalMode
  sendStart: string // "09:00"
  sendEnd: string // "18:00"
  dailyCap: number
  followUpCadence: string // "3 business days"
  confidenceThreshold: number // 0..1
  suppressionList: string[]
}
