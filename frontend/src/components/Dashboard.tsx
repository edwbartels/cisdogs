import { useEffect } from 'react'
// import ItemTileMain from './ItemTileMain'
// import useItemStore from '../stores/itemStore'
import useUserStore from '../stores/userStore'
// import useAuthStore from '../stores/authStore'

const Dashboard = () => {
	const updateDashboard = useUserStore((state) => state.updateDashboard)
	// const updateItems = useItemStore((state) => state.updateItems)
	// const updateUserItems = useUserStore((state) => state.updateItemIds)
	// const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		updateDashboard()
	}, [updateDashboard])

	return <div className="home-container"></div>
}

export default Dashboard
