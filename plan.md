# Influencees — Two-Path Living Plan

> Status: editable working plan, not a fixed implementation contract.
>
> This document is intended to be changed before or during implementation. “Recommended” choices are starting points, not mandatory constraints. Replace the stack, integrations, page order, agent tools, visual direction, and milestones as better information becomes available.

## Conversation context and source of truth

### Background

This work is for **Influencees**, a very early-stage Singapore creator and influencer marketing startup. Influencees positions itself as a trust and intelligence layer connecting Singapore creators with brands. Its public product currently includes creator discovery, profiles, campaign tools, trust signals, estimated rate cards, reporting, and an AI assistant called Ai-kyo.

Public research conducted before this plan found:

- Influencees Pte. Ltd. was incorporated in Singapore on 1 April 2026.
- The company publicly launched around June 2026.
- Davidson Chua is the publicly identified founder.
- The visible team and public creator index are still small.
- The company appears legitimate but remains at a very early product and commercial stage.
- Its current website contains useful functionality but has inconsistent pricing, overlapping claims, unclear distinctions between live and beta capabilities, and ambiguity around how creator data is sourced and refreshed.
- The current visual experience appears to have grown incrementally and lacks one strong information architecture and design system.

These findings are context for the redesign and BD tool, not claims that must be repeated inside either product.

### Hackathon context

The public example problem statement shown to participants was:

> Build a working AI tool that makes Influencees better, either a creator-facing tool localized for Singapore or an automation of one real internal workflow.

However, **this plan is not constrained by that example statement**. The participant spoke directly with the founder and is intentionally following that conversation instead. The founder conversation and the participant’s chosen direction are the primary source of truth.

### Chosen direction

The participant will pursue **two separate paths**:

1. An automated business-development agent and messaging pipeline.
2. A complete static redesign of the public Influencees website.

Both will be built. Neither should be reduced to an appendix of the other. They may share brand assets and visual language, but they are separate problem-solving paths.

### Path 1 context from the founder conversation

Influencees wants a system that:

- Understands Influencees’ business, services, positioning, and target customers.
- Searches for suitable companies that Influencees can work with.
- Uses public LinkedIn company, profile, and recent-post information as research context.
- May use Bright Data for LinkedIn discovery and scraping.
- Understands what each target company has been doing recently.
- Finds a natural, specific reason to approach that company.
- Produces outreach that does not feel generic or mass-generated.
- Operates as a complete business-development pipeline rather than a one-off message generator.

The system must include an **agent that sends messages**, not merely drafts them.

The intended product behavior is:

- The agent discovers and researches leads.
- The agent creates the initial outreach message.
- The exact outgoing message is visible in the dashboard.
- The message is actually sent when a real sender is connected.
- Incoming replies appear in the same dashboard conversation.
- The agent reads those replies and decides how to continue.
- The agent can send follow-up replies itself.
- The founder/operator can also reply manually from within the dashboard.
- The complete conversation remains visible as a normal message thread.

### Human-in-the-loop and autonomous behavior

The dashboard must provide a clear switch between:

- **Human-in-the-loop:** the agent researches and drafts, but a person approves or edits messages before they are sent.
- **Fully autonomous:** the agent researches, sends the initial message, reads replies, and sends appropriate follow-ups without waiting for approval.

The conversation established that:

- The switch should be visible in the dashboard.
- Every message the agent intends to send should be inspectable.
- Messages actually sent by the agent must remain visible in the thread.
- A human should be able to take over any conversation.
- A human should be able to send a direct reply from the dashboard.
- Control may later be returned to the agent.
- Per-conversation control is desirable in addition to a global default.
- Sensitive, uncertain, negative, contractual, or high-value situations may still be escalated even when autonomous mode is enabled.

### Path 1 implementation flexibility

The orchestration technology is intentionally undecided:

- n8n is acceptable.
- A custom agentic workflow is acceptable.
- A hybrid approach is acceptable.

Bright Data is the current proposed research provider, but it may be replaced if a better integration is selected.

LinkedIn data collection and LinkedIn message sending are separate concerns. Bright Data can support public-data collection but does not itself provide the complete two-way messaging system. Sending therefore needs a replaceable channel adapter, assisted workflow, selected third-party connection, browser-controlled approach, or mock implementation.

If a reliable live backend becomes too difficult within the available time, the fallback is a polished dashboard demonstration with hardcoded companies, evidence, messages, replies, state changes, and agent behavior. The mock should simulate the complete experience honestly and preserve clean boundaries for later real integrations.

### Path 2 context from the founder conversation

The second path is a complete redesign of the Influencees public website.

The participant’s assessment is that the current website feels heavily “vibe coded”: it has many ideas and features, but the design, hierarchy, messaging, page relationships, and credibility cues do not yet feel governed by one mature system.

The requested redesign should:

- Pull together all current public pages.
- Reconsider the information architecture rather than merely reskinning the homepage.
- Produce a coherent design system.
- Improve both the brand-facing and creator-facing journeys.
- Make the platform feel credible, deliberate, and trustworthy.
- Present live, beta, and coming-soon functionality clearly.
- Resolve pricing and messaging inconsistencies in the prototype.
- Use realistic hardcoded creator, campaign, trust, pricing, and analytics data.
- Be responsive.
- Be static and require no backend.

The participant will provide visual reference images later. Those references should guide art direction, typography, layout, density, motion, and component treatment. The design should be influenced by the references without blindly copying them.

### Planning and handoff expectations

This is a **living handoff plan**, not a strict specification.

The participant intends to:

- Make personal changes before implementation.
- Pass the plan to Claude later.
- Apply additional Claude-side skills and workflows.
- Potentially replace technical and design decisions based on those skills.

Therefore:

- Do not force strict adherence to this document.
- Do not treat suggested architecture as irreversible.
- Preserve the product intent while allowing different implementation methods.
- Ask for clarification only when a change would materially affect the intended experience.
- Prefer demonstrable product behavior over architectural complexity.

Kimi must not be used for this project unless the participant explicitly changes that instruction later.

## 1. Outcome

Build two separate but visually related deliverables:

1. **Path 1 — Influencees BD Agent:** an internal business-development system that discovers suitable companies, researches them, composes contextual outreach, sends and receives messages, and manages follow-ups through a dashboard. It supports both human-in-the-loop and autonomous operation.
2. **Path 2 — Influencees Website Redesign:** a responsive, static redesign of Influencees’ public website, using hardcoded content and data with no required backend. The visual direction will be refined after reference images are supplied.

The paths can share brand assets and design tokens, but each should remain independently demonstrable.

---

# Path 1 — Influencees BD Agent

## 2. Product concept

Working description:

> An AI business-development operator that understands Influencees, finds relevant Singapore companies, researches their current activity, initiates context-aware outreach, handles replies, and keeps the founder in control.

Possible working names:

- Influencees Radar
- Influencees Scout
- Influencees Growth Agent
- Ai-kyo for Growth
- Influencees Outreach OS

Naming can wait until the visual direction is known.

## 3. Primary users

### Founder/operator

Needs to:

- Define what Influencees sells and which companies are suitable.
- See newly discovered leads and why they were selected.
- Review the evidence behind personalization.
- Choose human approval or autonomous operation.
- Read every outgoing and incoming message.
- Reply manually from the dashboard.
- Take control of a conversation and return it to the agent.
- See scheduled follow-ups, failures, replies, and pipeline movement.

### Prospective company contact

Should receive:

- A message relevant to their organization and recent activity.
- No fabricated claims or generic “AI personalization.”
- Coherent follow-ups that remember the conversation.
- A clear way to decline further contact.
- A human handoff when commercial judgment is needed.

## 4. Suggested product areas

These are recommended dashboard areas and may be merged for a smaller build.

### 4.1 Overview

- Leads found this week
- Messages sent
- Reply rate
- Positive replies
- Meetings or next steps
- Items awaiting approval
- Agent activity feed
- Current operating mode

### 4.2 Lead discovery

- Search or agent-run controls
- Target geography, industry, company size, and keywords
- Discovered companies
- Fit score and confidence
- Relevant recent activity
- Suggested contact
- Qualification and rejection reason
- Add to outreach campaign

### 4.3 Lead detail

- Company profile
- Contact information
- Recent posts, news, hiring, launches, or campaigns
- Evidence links and retrieval dates
- Fit-score breakdown
- Suggested Influencees partnership angle
- Risks or missing information
- Conversation history

### 4.4 Shared inbox

Three-column layout is a useful default:

1. Conversation list
2. Full message thread
3. Company context and agent controls

Each thread should show:

- Outgoing agent messages
- Human-sent messages
- Incoming replies
- Drafts waiting for approval
- Sent, delivered, failed, or simulated state
- Timestamps
- Scheduled follow-up
- Current owner: agent or human
- Current autonomy mode
- Conversation summary
- Agent activity and decision history

Composer actions:

- Send manually
- Ask agent to draft
- Rewrite with an instruction
- Approve or reject
- Schedule follow-up
- Pause agent
- Take over
- Return control to agent
- Close, nurture, or mark uninterested

### 4.5 Approval queue

- Initial messages awaiting review
- Replies awaiting review
- Messages flagged as uncertain or sensitive
- Approve, edit, reject, or defer
- Bulk approval may be omitted from the first version

### 4.6 Pipeline

Suggested stages:

- Discovered
- Researching
- Qualified
- Ready for outreach
- Contacted
- Replied
- Interested
- Meeting/next step
- Nurture
- Closed
- Unsubscribed

Stages can be simplified without changing the underlying concept.

### 4.7 Business brain

Editable knowledge describing:

- Influencees’ positioning
- Product capabilities
- Ideal customer profiles
- Target and excluded industries
- Preferred company sizes
- Common pain points
- Partnership and campaign examples
- Pricing information that the agent may disclose
- Claims the agent must not make
- Tone of voice
- Example good and bad messages
- Escalation rules

For the demo, this may be stored as hardcoded structured data. A later version could support documents, embeddings, or retrieval.

### 4.8 Settings and integrations

- Global mode: human approval or autonomous
- Per-thread override behavior
- Sending hours
- Daily message limits
- Follow-up cadence
- Confidence threshold
- Channel connection state
- Demo/live mode
- Suppression list

## 5. Autonomy model

### 5.1 Global default

Provide a visible switch:

```text
Human approval  ←→  Fully autonomous
```

- **Human approval:** the agent may research and draft, but messages wait for approval.
- **Fully autonomous:** the agent may send when its confidence and policy checks pass.

### 5.2 Per-thread override

Each conversation should independently support:

- Follow global setting
- Force human approval
- Force autonomous
- Pause all agent actions

The per-thread setting should override the global default.

### 5.3 Takeover behavior

When the operator selects **Take over**:

- The thread owner becomes human.
- Scheduled agent replies are cancelled or paused.
- The agent may still summarize or suggest drafts if requested.
- No autonomous message may be sent in that thread.

When the operator selects **Return to agent**:

- The agent reads the complete thread, including human messages.
- It creates or updates the conversation summary.
- It resumes from the current context rather than restarting the sequence.

### 5.4 Recommended escalation triggers

Even in autonomous mode, the system can route these to a human:

- Pricing negotiation or discounts
- Contractual or legal questions
- Angry, hostile, or reputationally sensitive replies
- Explicit opt-out
- Requests for unsupported claims or private data
- Meeting scheduling, if calendar integration is absent
- Low-confidence intent classification
- High-value strategic accounts

These rules are defaults and can be relaxed for a controlled demonstration.

## 6. End-to-end workflows

### 6.1 Discover and qualify

```text
Run starts
→ Search for candidate companies
→ Normalize company information
→ Collect recent public activity
→ Identify a likely decision-maker
→ Score fit
→ Store evidence
→ Qualify, reject, or request review
```

Possible inputs:

- Bright Data LinkedIn company, post, and profile data
- Company website
- Public news or press releases
- Public job listings
- Manually seeded demo fixtures

### 6.2 Initial outreach

```text
Qualified lead
→ Choose a partnership angle
→ Select supporting evidence
→ Draft message
→ Check claims, tone, duplication, and policy
→ Approval queue OR autonomous send
→ Store exact sent message
→ Schedule follow-up
```

### 6.3 Incoming reply

```text
Reply received
→ Attach to conversation
→ Classify intent
→ Update summary and pipeline
→ Decide whether to answer, escalate, nurture, or stop
→ Draft response
→ Approval queue OR autonomous send
```

Suggested intent classes:

- Interested
- Needs more information
- Objection
- Not now
- Wrong person
- Meeting request
- Unsubscribe
- Negative or sensitive
- Unclear

### 6.4 Follow-up

```text
No reply before due date
→ Verify thread is still active
→ Check message limit and opt-out state
→ Generate non-repetitive follow-up
→ Approval queue OR send
→ Stop after configured sequence limit
```

### 6.5 Manual dashboard reply

```text
Operator writes reply
→ Optional agent rewrite
→ Operator sends
→ Message is stored as human-authored
→ Agent memory and conversation summary update
```

## 7. Suggested agent roles

These can be separate agents, separate workflow steps, or one orchestrator with tools. Do not create multiple agents merely for appearance.

### Business-context component

- Retrieves relevant Influencees facts.
- Enforces allowed and forbidden claims.

### Research component

- Finds current company signals.
- Extracts evidence with source URLs and dates.
- Avoids treating inference as fact.

### Qualification component

- Scores fit using transparent criteria.
- Explains the score and uncertainty.

### Outreach component

- Produces short, natural messages.
- Uses only supported context.
- Maintains tone and avoids repeated phrasing.

### Conversation component

- Reads incoming replies.
- Tracks intent and conversation state.
- Chooses a response or escalation.

### Follow-up component

- Respects cadence, limits, opt-outs, and thread history.
- Stops sequences when a person responds or declines.

For an initial build, these may all be prompt templates and deterministic functions inside one service.

## 8. Orchestration options

### Option A — n8n-led

Good when:

- Speed and visible workflow execution matter.
- The team already understands n8n.
- Integrations and webhooks dominate the implementation.

Potential flow:

```text
Schedule/Webhook
→ Bright Data
→ Normalize
→ Enrich
→ Score
→ Generate message
→ Wait for approval when required
→ Channel adapter
→ Store result
→ Schedule follow-up
```

Tradeoff: conversation ownership, per-thread autonomy, idempotency, and complex state transitions can become difficult to reason about if all state lives inside n8n.

### Option B — custom agent service

Good when:

- Conversation state and autonomy are the product’s main value.
- Strong testing and deterministic behavior are important.
- The implementation can support background jobs.

Tradeoff: more infrastructure and slower initial integration work.

### Option C — hybrid starting point

Suggested default, but not mandatory:

- Dashboard and database own the product state.
- A small agent/orchestration service owns decisions and conversation transitions.
- n8n handles replaceable integration workflows such as scheduled discovery, enrichment, and notifications.

This preserves a clear control plane while retaining n8n’s demo and integration advantages.

### Minimal demo alternative

- No n8n.
- No database required.
- Seeded companies and conversations in local fixtures.
- Timed frontend events simulate research, drafting, sending, replies, and follow-ups.
- A small state store controls autonomy and takeover behavior.

The visual experience and state transitions should match the intended real system so the backend can be attached later.

## 9. Channel adapter strategy

Use a replaceable interface rather than coupling the dashboard to one sender.

Conceptual operations:

```text
sendMessage()
fetchReplies()
receiveWebhook()
getDeliveryStatus()
validateConnection()
```

Possible adapters:

- **Mock/demo:** records outgoing messages and injects controlled replies.
- **Email:** real send and receive through an approved email provider.
- **LinkedIn assisted:** prepares the message and opens or copies it for a human.
- **LinkedIn connected:** uses an authorized or chosen third-party connection if available.
- **Browser automation:** technically possible but fragile and higher-risk; keep isolated if explored.

The dashboard should display whether a message is real, assisted, or simulated.

## 10. Suggested data model

This is conceptual and can be simplified.

### Company

- Identity, website, location, industry, size
- LinkedIn URL
- Summary
- Recent activity
- Last researched timestamp

### Contact

- Name, role, company
- Public profile URL
- Channel identifiers
- Confidence that this is the right contact

### Lead

- Company and contact
- Fit score
- Score explanation
- Status
- Recommended partnership angle
- Campaign assignment

### Evidence

- Claim or extracted signal
- Source URL
- Source type
- Retrieved timestamp
- Confidence
- Excerpt or structured value

### Conversation

- Company/contact
- Channel
- Current owner
- Global or overridden autonomy mode
- Pipeline stage
- Summary
- Follow-up date
- Suppression/opt-out state

### Message

- Direction
- Author: agent, human, or contact
- Body
- Draft/sent/delivered/failed/simulated status
- Timestamp
- Evidence used
- Approval reference

### Approval

- Draft reference
- Requested timestamp
- Approved, edited, rejected, or expired status
- Reviewer action

### Agent event

- Action considered
- Decision
- Reason
- Confidence
- Result
- Timestamp

### Campaign/settings

- Targeting filters
- Message cadence
- Limits
- Default autonomy
- Escalation rules

## 11. Suggested state model

Lead state:

```text
discovered
→ researching
→ scored
→ qualified | rejected | review_required
→ drafting
→ approval_required | ready_to_send
→ contacted
→ awaiting_reply
→ active_conversation
→ interested | nurture | closed | unsubscribed
```

Thread-control state, handled separately:

```text
agent_controlled | human_controlled | paused
```

Separating lead state from thread ownership avoids confusing “human takeover” with the commercial pipeline stage.

## 12. Message-quality requirements

Suggested rules:

- Every personalized factual claim must link to stored evidence.
- Do not mention a recent post unless its source and date are available.
- Avoid pretending the agent personally experienced or admired something.
- Do not fabricate familiarity.
- Keep the first message concise.
- Provide a specific reason Influencees may be relevant.
- Do not expose internal fit scores to the recipient.
- Do not send another follow-up after an opt-out or clear rejection.
- Prevent exact or near-exact duplicates across the same company.

## 13. Real, partial-live, and mock build levels

### Level 1 — polished simulation

- Hardcoded business brain
- Seeded companies and posts
- Simulated research sequence
- Real dashboard state changes
- Mock message delivery and replies
- Working autonomy switch, approvals, takeover, and follow-up logic

### Level 2 — partial live

- Bright Data discovery or enrichment is real
- Agent-generated messages are real
- Message delivery remains mock or assisted
- Incoming replies are controlled demo events

### Level 3 — connected

- Live discovery
- Persistent database
- Real channel adapter
- Inbound reply synchronization
- Background follow-ups
- Operational limits and audit logs

Implementation can stop at any level while leaving clear adapter boundaries for the next one.

## 14. Path 1 delivery phases

The phases are sequencing suggestions, not fixed sprints.

### Phase A — product shell

- Confirm dashboard information architecture.
- Define mock companies, contacts, posts, messages, and replies.
- Build navigation, overview, lead list, inbox, and lead detail.
- Establish visual tokens shared with Path 2 if useful.

### Phase B — control plane

- Implement global autonomy mode.
- Implement per-thread overrides.
- Implement approval queue.
- Implement takeover, pause, and return-to-agent behavior.
- Add pipeline and activity history.

### Phase C — agent behavior

- Add Influencees business brain.
- Add lead scoring and explanations.
- Add evidence-bound message drafting.
- Add reply classification and follow-up logic.
- Add guardrails and escalations.

### Phase D — integrations

- Add Bright Data or another selected source.
- Add n8n if it improves integration speed.
- Add mock, email, or selected LinkedIn adapter.
- Add persistence and background scheduling if required.

### Phase E — demo polish

- Seed a coherent end-to-end story.
- Add loading, progress, empty, failure, and success states.
- Ensure autonomous and human modes visibly diverge.
- Validate the entire demo without depending on unstable external systems.

## 15. Path 1 demo script

Suggested narrative:

1. Open Overview and explain the agent’s goal.
2. Show the stored Influencees business knowledge and target criteria.
3. Start a discovery run.
4. Watch the agent find and rank several Singapore companies.
5. Open one lead and show recent evidence plus the recommended partnership angle.
6. Keep human approval enabled.
7. Let the agent draft an initial message.
8. Edit or approve it and show it entering the thread as sent.
9. Trigger or receive a reply.
10. Show the agent interpreting it and preparing a response for approval.
11. Switch another conversation to autonomous mode.
12. Show the agent sending a context-aware reply itself.
13. Take over the conversation and send a manual message.
14. Return it to the agent.
15. Show the follow-up or meeting state update and audit history.

Have a fully local fallback so the demo remains reliable without network access.

## 16. Path 1 suggested acceptance checkpoints

These are editable checkpoints.

- A lead can move from discovery to a visible conversation.
- Every scored lead has a reason and at least one evidence source.
- A message based on “recent activity” displays the supporting source.
- Human-approval mode cannot send an unapproved agent draft.
- Autonomous mode can send without approval when no escalation rule is triggered.
- A per-thread setting overrides the global setting.
- Taking over prevents autonomous sends in that thread.
- Returning control gives the agent the complete current conversation.
- Incoming replies appear in the same dashboard thread.
- The operator can manually reply from the dashboard.
- Follow-ups stop after a reply, rejection, opt-out, or configured limit.
- All sends and control changes appear in an activity history.
- Demo mode makes no accidental external sends.

## 17. Path 1 risks and adjustable mitigations

| Risk | Possible mitigation |
|---|---|
| LinkedIn account restriction | Use an adapter, controlled test account, assisted mode, or mock sending |
| Hallucinated personalization | Require evidence-bound claims and confidence thresholds |
| Spam-like messaging | Limit volume, vary only where evidence supports it, preserve opt-outs |
| Duplicate sends | Idempotency keys and a thread-level send lock |
| Agent replies incorrectly | Escalation rules, confidence thresholds, reply caps |
| Agent continues after takeover | Separate ownership state and enforce it before every send |
| External service fails during demo | Seeded fixtures and a mock adapter |
| Sensitive data enters an AI provider | Minimize payloads and avoid private customer data |
| Cost grows unexpectedly | Per-run and per-day limits, cached enrichment, demo fixtures |
| Scope expands into a full CRM | Keep only the stages and fields needed for the demonstration |

---

# Path 2 — Influencees Website Redesign

## 18. Product objective

Create a complete static public-site concept that feels intentional, credible, and consistent while remaining recognizably Influencees.

The redesign should improve:

- Brand trust
- Visual hierarchy
- Information architecture
- Creator and brand journey separation
- Product explanation
- Feature-status transparency
- Pricing consistency
- Evidence and credibility
- Responsive behavior
- Overall finish

It does not need to reproduce the current visual treatment or page structure.

## 19. Inputs to gather before locking the visual direction

- User-provided reference images
- Influencees logo and available brand assets
- Current public-site screenshots or extracted content
- Pages the founder considers essential
- Product screenshots, if any should be represented
- Desired personality: premium, playful, editorial, technical, community-led, or a blend

Reference images should influence the system, not be copied literally.

## 20. Current public-page inventory

The current site exposes these page groups:

### Core marketing

- Home
- What is Influencees?
- For Brands
- For Creators
- About
- Pricing
- Contact

### Product and participation

- Trust Check
- Join/Get Started
- Creator index
- Individual creator profiles
- Trending in Singapore
- Marketer page

### Community/company

- Demo Day 2026
- Careers

### Legal

- Privacy Policy
- Terms of Service

The redesign may consolidate or rename pages if the content is clearer that way.

## 21. Suggested redesigned information architecture

### Global navigation

- Product
- For Brands
- For Creators
- Creator Directory
- Pricing
- Resources or About
- Sign in
- Primary CTA

Possible simplification:

- Product
- Brands
- Creators
- Pricing
- About

Choose after the visual references and content priorities are clear.

### Footer

- Platform pages
- Creator and brand entry points
- Company/about
- Contact
- Legal
- Social links
- Singapore/company identity

## 22. Recommended page plans

### 22.1 Home

Possible section order:

1. Clear two-sided value proposition
2. Creator and brand path selector
3. Product demonstration
4. Creator discovery and trust
5. Campaign workflow
6. AI assistant
7. Real or clearly labeled sample evidence
8. Pricing preview
9. Community/social proof
10. Final CTA

Avoid presenting every feature at equal importance.

### 22.2 For Brands

- Brand-specific hero and outcome
- How discovery works
- Creator comparison
- Trust and data methodology
- Campaign workflow
- Reporting and attribution
- Example campaign or dashboard
- Pricing
- CTA

### 22.3 For Creators

- Creator-specific hero
- Verified profile and discovery
- Rate card and brand passport
- Deal management
- Brief support and AI assistance
- Example creator profile
- Free versus paid features
- CTA

### 22.4 Product/How It Works

- One connected workflow
- Feature map
- Live, beta, and coming-soon labels
- Data-source explanation
- AI limitations and human control
- Integrations or supported platforms

This may replace or absorb “What is Influencees?”

### 22.5 Creator directory

- Hardcoded search and filter interface
- Creator cards
- Niche, platform, reach, and engagement examples
- Trust indicators
- Empty/search states
- No backend required; filters may work locally

### 22.6 Creator profile template

- Creator identity
- Platforms and niche
- Performance overview
- Content examples
- Audience snapshot
- Trust indicators
- Estimated rate information with clear caveat
- Brand CTA

Create several hardcoded profiles through one reusable template.

### 22.7 Trust Check

- Clear beta label
- What it currently checks
- What it does not determine
- Example input and report
- Confidence visualization
- Responsible-use note
- Interactive static demonstration if desired

### 22.8 Pricing

- One authoritative set of prices
- Monthly/annual toggle may be local-only
- Separate brand and creator plans
- Clear feature comparison
- Enterprise CTA
- Billing and cancellation FAQ

### 22.9 Trending

Options:

- Keep as a polished coming-soon page.
- Turn it into a hardcoded editorial trends experience.
- Remove it from primary navigation until it is live.

The choice can follow the references and founder priorities.

### 22.10 About

- Problem and mission
- Singapore-first positioning
- Founder/team
- Product principles
- Ecosystem or programme support described precisely
- Contact or collaboration CTA

### 22.11 Demo Day/community page

- Event story
- Photos or placeholders
- Product milestones
- Participants or partners
- CTA to join the next initiative

### 22.12 Careers

- Small-team narrative
- Values
- Open roles or general-interest form
- Working style
- Clear employment/internship labeling

### 22.13 Contact

- Brand inquiry
- Creator support
- Partnership/media
- General support
- Static form treatment; no submission backend required

### 22.14 Legal

- Readable typography
- Table of contents
- Last-updated date
- Consistent company identity and contact

## 23. Content-system improvements

Recommended content rules:

- Use one canonical pricing source.
- Distinguish live, beta, and coming-soon features everywhere.
- Do not call periodically refreshed data “live” without explanation.
- Explain what “verified” means.
- Explain what Trust Check does and does not prove.
- Separate marketing claims from evidence.
- Avoid repeating the same feature descriptions on every page.
- Use creator language on creator pages and brand language on brand pages.
- Keep AI copy specific to user outcomes.

For the static prototype, content may be rewritten for clarity while remaining truthful to the known product.

## 24. Design-system plan

The final system should follow the supplied visual references. A useful foundation includes:

### Foundations

- Brand and neutral colors
- Type families and scale
- Spacing scale
- Grid and content widths
- Border radii
- Borders and elevation
- Motion timing
- Icon style
- Illustration/image treatment

### Core components

- Navigation and mobile menu
- Footer
- Buttons and text links
- Eyebrows, badges, and feature-status chips
- Product cards
- Creator cards
- Metric and trust cards
- Pricing cards and comparison rows
- Testimonial or quote blocks
- Logos/support marks
- Tabs and segmented controls
- Accordions
- Forms
- Modal or drawer, if useful
- Empty/loading/error states for product mockups

### Product-display components

- Dashboard shell
- Creator comparison
- Campaign pipeline
- Message thread
- Trust report
- Analytics chart
- AI assistant panel

The public-site product mockups and Path 1 dashboard may share visual motifs without becoming identical products.

## 25. Static implementation options

### Option A — same framework as Path 1

Benefits:

- Easy token and component sharing.
- One development environment.
- Easier handoff.

Tradeoff:

- The marketing site may carry more framework complexity than necessary.

### Option B — static-focused framework

Benefits:

- Clean static output and page-focused development.
- Strong performance.

Tradeoff:

- Shared code requires a package or duplicated tokens.

### Option C — independent standalone site

Benefits:

- Maximum freedom for design exploration.
- No coupling to the dashboard.

Tradeoff:

- More duplicated foundations.

Any option is valid. The references and Claude-side skills may make one approach preferable later.

## 26. Reference-image workflow

When references arrive:

1. Classify each reference by what is useful: layout, typography, color, density, cards, navigation, motion, or imagery.
2. Identify recurring principles rather than copying isolated details.
3. Create a short art-direction board.
4. Produce two or three high-level directions if the references conflict.
5. Select or combine a direction.
6. Apply it first to Home and one product-heavy page.
7. Validate before propagating it across all templates.

This reduces the cost of redesigning every page twice.

## 27. Path 2 delivery phases

### Phase A — audit and direction

- Capture current pages and content.
- Identify reusable, conflicting, and removable material.
- Review supplied references.
- Establish information architecture and art direction.

### Phase B — foundations

- Create tokens and global styles.
- Build navigation, footer, buttons, typography, cards, and status labels.
- Prepare hardcoded content/data structures.

### Phase C — representative pages

- Build Home.
- Build one audience page, likely Brands.
- Build one product/data page, likely Creator Profile or Trust Check.
- Review the system before scaling.

### Phase D — complete page set

- Build remaining core pages.
- Add creator-profile variants.
- Add community, careers, contact, and legal templates.
- Consolidate duplicated content.

### Phase E — responsive and interaction polish

- Validate mobile, tablet, and desktop.
- Add purposeful motion and hover/focus states.
- Check accessibility, overflow, and content density.
- Verify all links and page transitions.

## 28. Path 2 demo script

1. Begin with the design problem: trust-oriented product, inconsistent presentation.
2. Show the redesigned Home and the brand/creator split.
3. Enter the Brands journey and demonstrate product value.
4. Browse the hardcoded creator directory.
5. Open a creator profile and explain trust/data presentation.
6. Open Trust Check and show responsible beta labeling.
7. Show consistent pricing.
8. Compare desktop and mobile navigation.
9. Briefly show the design system or reusable components.
10. End with how the new experience improves credibility and conversion.

## 29. Path 2 suggested acceptance checkpoints

- Every agreed public page has a redesigned route or an intentional consolidation destination.
- Navigation clearly separates brand and creator journeys.
- Prices are consistent everywhere.
- Live, beta, and coming-soon features are visibly differentiated.
- Core pages work at approximately 360px, 768px, and 1440px widths.
- No unintended horizontal overflow occurs.
- Interactive controls work locally even when data is hardcoded.
- All forms clearly indicate prototype behavior if they do not submit.
- Repeated templates use shared components.
- Keyboard focus is visible.
- Text and controls meet reasonable contrast standards.
- Reduced-motion preferences are respected if significant animation is used.
- Creator and campaign data is clearly sample data where appropriate.

## 30. Path 2 risks and adjustable mitigations

| Risk | Possible mitigation |
|---|---|
| References arrive late | Build semantic structure before committing to detailed styling |
| Too many pages | Prioritize templates; generate variants from reusable data |
| Redesign becomes only cosmetic | Fix journeys, hierarchy, claims, and status labeling |
| Hardcoded prototype feels fake | Use internally consistent sample creators, campaigns, and metrics |
| Current content is contradictory | Establish canonical content data before building pages |
| Visual direction conflicts with existing brand | Preserve recognizable logo/color cues while evolving the system |
| Both paths diverge visually | Share a minimal brand foundation, not necessarily all components |

---

# Combined execution strategy

## 31. Keep the deliverables separate

Recommended boundary:

```text
Path 1: internal operator product
Path 2: external marketing and discovery experience
Shared: brand assets, optional tokens, sample creator/company data
```

Do not force shared application logic merely because both use the Influencees brand.

## 32. Suggested order

One adaptable sequence:

1. Gather visual references and finalize shared brand foundations.
2. Establish Path 1’s dashboard shell and Path 2’s Home-page direction.
3. Build the Path 1 control plane and demo state machine.
4. Scale the Path 2 system across its templates.
5. Add live integrations to Path 1 only where they improve the demonstration.
6. Polish and rehearse both demos independently.

Alternative:

- Build the Path 1 functional simulation first.
- Complete Path 2 afterward with a completely independent visual system.

Choose based on deadlines, available skills, and which deliverable needs validation first.

## 33. Suggested greenfield structure

This is one possible structure, not a required layout:

```text
Influencees/
├─ apps/
│  ├─ bd-agent/
│  │  ├─ app-or-src/
│  │  ├─ components/
│  │  ├─ features/
│  │  │  ├─ overview/
│  │  │  ├─ discovery/
│  │  │  ├─ leads/
│  │  │  ├─ inbox/
│  │  │  ├─ approvals/
│  │  │  ├─ pipeline/
│  │  │  ├─ business-brain/
│  │  │  └─ settings/
│  │  ├─ agent/
│  │  │  ├─ research/
│  │  │  ├─ scoring/
│  │  │  ├─ outreach/
│  │  │  ├─ conversation/
│  │  │  ├─ policies/
│  │  │  └─ orchestration/
│  │  ├─ integrations/
│  │  │  ├─ bright-data/
│  │  │  ├─ n8n/
│  │  │  └─ channels/
│  │  │     ├─ mock/
│  │  │     ├─ email/
│  │  │     └─ linkedin/
│  │  └─ fixtures/
│  └─ website-redesign/
│     ├─ pages-or-routes/
│     ├─ components/
│     ├─ templates/
│     ├─ content/
│     ├─ data/
│     ├─ styles/
│     └─ public/
├─ packages/
│  └─ brand/
│     ├─ assets/
│     ├─ tokens/
│     └─ content-guidelines/
├─ workflows/
│  └─ n8n/
├─ docs/
│  ├─ decisions/
│  ├─ demos/
│  ├─ research/
│  └─ references/
└─ README.md
```

This may be collapsed into two simple folders for a faster prototype.

## 34. Flexible scope tiers

### Essential

Path 1:

- Dashboard
- Lead detail with evidence
- Shared inbox
- Human/autonomous switch
- Approval flow
- Takeover/return control
- Visible outgoing and incoming messages
- Reliable simulated end-to-end run

Path 2:

- Visual direction
- Shared design foundations
- Home
- Brands
- Creators
- Creator directory/profile
- Pricing
- Responsive navigation

### Strong extension

Path 1:

- Live Bright Data enrichment
- Persistent database
- Real email adapter
- n8n workflow
- Follow-up scheduler

Path 2:

- Trust Check
- About
- Demo Day/community
- Careers
- Contact
- Legal templates

### Optional

Path 1:

- Real LinkedIn adapter
- Multi-user accounts
- CRM/calendar integrations
- Analytics beyond the demo

Path 2:

- Trending editorial experience
- Extensive motion system
- Blog/resources
- Many creator-profile variants

## 35. Verification approach

### Path 1

- Run deterministic fixture-based flows for both autonomy modes.
- Verify no external send occurs in demo mode.
- Test global and per-thread precedence.
- Test takeover during a scheduled agent action.
- Test positive, negative, unclear, meeting, and unsubscribe replies.
- Test failed sends and retry behavior.
- Confirm the exact sent message is retained.

### Path 2

- Review every route at common mobile, tablet, and desktop widths.
- Check navigation and footer consistency.
- Check canonical pricing and feature statuses.
- Verify local filters, tabs, accordions, and toggles.
- Check keyboard navigation and reduced motion.
- Review creator/brand copy from each audience’s perspective.

## 36. Handoff notes for later implementation

Before implementation, the receiving developer or Claude session should be free to:

- Replace the suggested stack.
- Remove n8n or make it the primary orchestrator.
- Use a different data provider.
- Change page groupings.
- Change the autonomy model after testing.
- Reduce or expand the number of routes.
- Apply additional design, frontend, testing, security, or agent skills.
- Split this plan into separate implementation briefs.

The non-negotiable product intent is limited to:

1. Path 1 visibly manages real or simulated two-way outreach with controllable autonomy.
2. Path 2 presents a coherent, responsive redesign of the agreed public Influencees experience.

Everything else is open to revision.
