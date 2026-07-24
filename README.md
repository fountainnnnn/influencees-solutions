# Influencees

Influencees is a two-part product prototype for creator marketing in Singapore. It pairs a public marketing website with an internal business development workspace.

## What is included

| App | Purpose | Local URL |
| --- | --- | --- |
| [`website`](./website) | Public site for brands and creators, including the creator directory, Trust Check, pricing, and the Ai-kyo assistant demo | `http://localhost:5180` |
| [`bd-agent`](./bd-agent) | Internal dashboard for discovery, lead management, approvals, inbox workflows, and Business Brain configuration | `http://localhost:5181` |

Both apps are independent Vite projects. Their data and interactions are currently client-side prototypes, so no backend services or environment variables are required.

## Quick start

### Requirements

- Node.js 20 or newer
- npm 10 or newer

Install and run the marketing website:

```bash
cd website
npm install
npm run dev -- --port 5180
```

In a second terminal, install and run the BD Agent:

```bash
cd bd-agent
npm install
npm run dev -- --port 5181
```

## Marketing website

The website includes:

- A five-scene introductory sequence with reduced-motion support
- Responsive pages for brands, creators, pricing, Trust Check, and company information
- A searchable directory using real Singapore creator profiles
- An interactive client-side Ai-kyo chat demo
- Ambient motion, scroll transitions, and an accessible shared button system

Primary routes:

| Route | Screen |
| --- | --- |
| `/` | Homepage and Ai-kyo demo |
| `/brands` | Brand workflow |
| `/creators` | Creator proposition |
| `/directory` | Creator directory |
| `/directory/:handle` | Creator profile |
| `/pricing` | Plans and pricing |
| `/trust-check` | Trust Check |
| `/about` | About Influencees |
| `/contact` | Contact |

## BD Agent

The dashboard includes:

- Overview and pipeline activity
- Creator discovery
- Lead records and detail views
- Inbox conversations
- Human approval checkpoints
- Editable Business Brain guidance with reset support
- Autonomy controls for human-led and automated operation

Primary routes:

| Route | Screen |
| --- | --- |
| `/` | Overview |
| `/discovery` | Discovery |
| `/leads` | Leads |
| `/leads/:id` | Lead detail |
| `/inbox` | Inbox |
| `/approvals` | Approvals |
| `/brain` | Business Brain |
| `/settings` | Settings |

## Project structure

```text
Influencees/
├── website/       Marketing website
├── bd-agent/      Internal BD Agent dashboard
├── shared/        Shared project assets
└── docs/          Supporting project documentation
```

Each app keeps its own dependencies, source files, public assets, and build output.

## Commands

Run these from either `website` or `bd-agent`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

## Technology

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React
- Zustand in the BD Agent
- Lenis in the marketing website

## Production builds

Build each app separately:

```bash
cd website
npm run build

cd ../bd-agent
npm run build
```

The generated files are written to each app's `dist` directory.
