import useAuthStore from './authStore'
import useUserStore from './userStore'

export const initializeSubscriptions = () => {
	// Subscribe to `isLoggedIn` changes
	const unsubscribeAuth = useAuthStore.subscribe(
		(state) => state.isLoggedIn,
		(isLoggedIn) => {
			console.log('Auth state changed. Is logged in:', isLoggedIn)
			if (isLoggedIn) {
				useUserStore.getState().getCollection()
			} else {
				useUserStore.setState({ collection: new Set() }) // Clear collection on logout
			}
		}
	)

	// Return cleanup function
	return () => {
		unsubscribeAuth()
	}
}
