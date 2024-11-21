import { useEffect } from 'react'
import ItemTileMain from './ItemTileMain'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'
import DashboardItemTile from './DashboardItemTile'

const DashboardItems = () => {
	// const userId = useAuthStore((state) => state.user?.id)
	const updateDashboardItems = useUserStore(
		(state) => state.updateDashboardItems
	)
	const userItems = useUserStore((state) => state.itemDetails)

	useEffect(() => {
		updateDashboardItems()
	}, [])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(userItems).map((id) => (
					<DashboardItemTile key={id} itemId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default DashboardItems
