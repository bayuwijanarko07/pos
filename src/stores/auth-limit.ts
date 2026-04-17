import { defineStore } from 'pinia'

export const useAuthLimitStore = defineStore('authLimit', {
  state: () => ({
    timestamps: [] as number[],
  }),
  getters: {
    relevantAttempts: (state) => {
      const now = Date.now()
      // Return attempts within the last 60 seconds
      return state.timestamps.filter(t => now - t < 60000)
    },
    isBlocked(): boolean {
      return this.relevantAttempts.length >= 5
    },
    remainingSeconds(): number {
      if (this.relevantAttempts.length < 5) return 0
      
      // Calculate when the oldest of the 5 allowed attempts will expire
      const oldestRelevant = this.relevantAttempts[0]
      if (oldestRelevant === undefined) return 0
      
      const expiresAt = oldestRelevant + 60000
      return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
    }
  },
  actions: {
    recordAttempt() {
      this.timestamps.push(Date.now())
      // Optional: Cleanup very old timestamps to keep state clean
      const now = Date.now()
      this.timestamps = this.timestamps.filter(t => now - t < 3600000) // Keep 1 hour of history max
    },
    resetAttempts() {
      this.timestamps = []
    }
  },
  persist: true
})
