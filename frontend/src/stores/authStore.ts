import { create } from 'zustand'
import { persist, devtools, subscribeWithSelector } from 'zustand/middleware'
import useUserStore from './userStore'
import { jwtDecode } from 'jwt-decode'
import fetchWithAuth from '../utils/fetch'

export type User = {
	id: number
	username: string
	email: string
}

export interface AuthStore {
	isLoggedIn: boolean
	accessToken: string | null
	user: User | null
	refreshToken: () => Promise<void>
	login: (userData: User, token: string) => void
	logout: () => void
	scheduleTokenRefresh: () => void
}

const useAuthStore = create(
	devtools(
		subscribeWithSelector(
			persist<AuthStore>(
				(set, get) => ({
					isLoggedIn: false,
					accessToken: null,
					user: null,
					refreshToken: async () => {
						try {
							const res = await fetchWithAuth('api/refresh-token', {
								method: 'POST',
								credentials: 'include',
							})
							if (res.ok) {
								const data = await res.json()
								const decoded: { exp: number } = jwtDecode(data.accessToken)
								set({
									accessToken: data.accessToken,
									isLoggedIn: true,
								})

								const expiresIn = decoded.exp * 1000 - Date.now()
								setTimeout(() => get().refreshToken(), expiresIn - 60000)
							} else {
								throw new Error('failed to refresh token')
							}
						} catch (e) {
							console.error('Refresh token error:', e)
							set({ isLoggedIn: false, accessToken: null })
						}
					},
					login: (userData, token) => {
						const decoded: { exp: number } = jwtDecode(token)
						set({
							isLoggedIn: true,
							user: userData,
							accessToken: token,
						})

						const expiresIn = decoded.exp * 1000 - Date.now()
						setTimeout(() => get().refreshToken(), expiresIn - 60000)
					},
					logout: () => {
						set({ isLoggedIn: false, user: null, accessToken: null })
					},
					scheduleTokenRefresh: () => {
						const { accessToken } = get()
						if (!accessToken) return

						try {
							const decoded: { exp: number } = jwtDecode(accessToken)
							const expiresIn = decoded.exp * 1000 - Date.now()
							if (expiresIn > 0) {
								setTimeout(() => get().refreshToken(), expiresIn - 60000)
							} else {
								get().logout()
							}
						} catch (e) {
							console.error('Failed to decode token:', e)
							get().logout()
						}
					},
				}),
				{
					name: 'authStore',
					onRehydrateStorage: (state) => {
						setTimeout(() => {
							useUserStore.getState().getCollection()
						}, 0)
					},
				}
			)
		)
	)
)

export default useAuthStore
