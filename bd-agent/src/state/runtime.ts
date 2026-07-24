import { create } from 'zustand'

// Lightweight, ephemeral UI runtime state (agent working indicator, sim jobs).
// Kept separate from the domain store so sim ticks don't churn domain data.

export type AgentStatus = 'idle' | 'working'

interface RuntimeState {
  status: AgentStatus
  activeJobs: number
  begin: () => void
  end: () => void
}

export const useRuntime = create<RuntimeState>((set) => ({
  status: 'idle',
  activeJobs: 0,
  begin: () => set((s) => ({ activeJobs: s.activeJobs + 1, status: 'working' })),
  end: () =>
    set((s) => {
      const n = Math.max(0, s.activeJobs - 1)
      return { activeJobs: n, status: n === 0 ? 'idle' : 'working' }
    }),
}))
