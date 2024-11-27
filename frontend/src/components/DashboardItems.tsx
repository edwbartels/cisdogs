import { useEffect } from 'react'
import useUserStore from '../stores/userStore'
import DashboardItemTile from './DashboardItemTile'

const DashboardItems = () => {
	const { itemDetails, updateDashboardItems } = useUserStore((state) => state)

	useEffect(() => {
		updateDashboardItems()
	}, [])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(itemDetails).map((id) => (
					<DashboardItemTile key={id} itemId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default DashboardItems
