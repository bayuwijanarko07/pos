import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  roles: string[]
}

interface UserState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    profile: null,
    loading: false
  }),

  getters: {
    cashierId: (state) => state.user?.id ?? null,

    cashierName: (state) =>
      state.profile?.full_name ??
      state.user?.email ??
      'Guest',

    avatar: (state) =>
      state.profile?.avatar_url ?? null,

    roles: (state) =>
      state.profile?.roles ?? []
  },

  actions: {
    async fetchUser() {
      this.loading = true

      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.error(error)
        this.loading = false
        return
      }

      this.user = data.user

      if (data.user) {
        await this.fetchProfile(data.user.id)
      }

      this.loading = false
    },

    async fetchProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          avatar_url,
          user_roles (
            roles (
              name
            )
          )
        `)
        .eq('id', userId)
        .single()

      if (error || !data) {
        console.error(error)
        return
      }

      const roles =
        data.user_roles?.map((r: any) => r.roles.name) ?? []

      this.profile = {
        id: data.id,
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: data.avatar_url,
        roles
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },

    initAuthListener() {
      supabase.auth.onAuthStateChange(async (_event, session) => {
        this.user = session?.user ?? null

        if (session?.user) {
          await this.fetchProfile(session.user.id)
        } else {
          this.profile = null
        }
      })
    }
  }
})