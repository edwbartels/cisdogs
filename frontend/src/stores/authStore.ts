import { create } from 'zustand'
import { persist, devtools, subscribeWithSelector } from 'zustand/middleware'
import { useNavigate } from 'react-router-dom'
import useUserStore from './userStore'
import useItemStore from './itemStore'
import useListingStore from './listingStore'
import { jwtDecode } from 'jwt-decode'
import fetchWithAuth from '../utils/fetch'

export type User = {
	id: number
	username: string
	email: string
}
interface Item {
	id: number
	seller_id: number
	price: number
	release_id: number
	release: string
	album: string
	artist: string
}

interface OrderCreate {
	seller_id: number
	buyer_id: number | null
	listing_id: number
	release_id: number
}

export interface AuthStore {
	isLoggedIn: boolean
	accessToken: string | null
	user: User | null
	cart: { [key: number]: Item }
	addToCart: (item: Item) => void
	removeFromCart: (item: Item) => void
	checkoutCart: () => void
	refreshToken: () => Promise<void>
	login: (userData: User, token: string) => void
	logout: () => void
	scheduleTokenRefresh: () => void
}

const { updateItems } = useItemStore.getState()
const { updateListings } = useListingStore.getState()
const { getOrders, getCollection } = useUserStore.getState()

const useAuthStore = create(
	devtools(
		subscribeWithSelector(
			persist<AuthStore>(
				(set, get) => ({
					isLoggedIn: false,
					accessToken: null,
					user: null,
					cart: {},
					addToCart: (item) => {
						set((state) => ({
							cart: { ...state.cart, [item.id]: item },
						}))
					},
					removeFromCart: (item) => {
						set((state) => {
							const newCart = { ...state.cart }
							delete newCart[item.id]
							return { cart: newCart }
						})
					},
					checkoutCart: async () => {
						const reqCart: OrderCreate[] = Object.values(get().cart).map(
							(cartItem) => {
								return {
									...cartItem,
									buyer_id: get().user?.id || null,
									seller_id: cartItem.seller_id,
									listing_id: cartItem.id,
								}
							}
						)
						console.log(reqCart)
						try {
							const url = '/api/checkout'
							const res = await fetchWithAuth(url, {
								method: 'POST',
								body: JSON.stringify(reqCart),
								credentials: 'include',
							})
							if (!res.ok) {
								const error = await res.text()
								console.log(error)
								throw new Error('Failed to checkout items')
							}
							alert('Checkout successful!')

							updateItems()
							updateListings()
							getCollection()
							set({ cart: {} })
						} catch (e) {
							console.error(e)
						}
					},
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
					onRehydrateStorage: () => () => {
						const authState = useAuthStore.getState()
						const userStore = useUserStore.getState()
						if (authState.isLoggedIn) {
							setTimeout(() => {
								userStore.getCollection()
								userStore.getWatchlist()
							}, 0)
						} else {
							setTimeout(() => {
								useUserStore.setState({ collection: new Set() })
								useUserStore.setState({ watchlist: new Set() })
							}, 0)
						}
					},
				}
			)
		)
	)
)

export default useAuthStore
