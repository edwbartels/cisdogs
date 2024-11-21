import { useEffect } from 'react'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'
import DashboardListingTile from './DashboardListingTile'

const DashboardListings = () => {
	const updateDashboardListings = useUserStore(
		(state) => state.updateDashboardListings
	)
	const userListings = useUserStore((state) => state.listingDetails)

	useEffect(() => {
		updateDashboardListings()
	}, [])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(userListings).map((id) => (
					<DashboardListingTile key={id} listingId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default DashboardListings
