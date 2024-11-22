import { useState } from 'react'
// import ItemTileMain from './ItemTileMain'
// import useItemStore from '../stores/itemStore'
// import useUserStore from '../stores/userStore'
// import useAuthStore from '../stores/authStore'
import DashboardItems from './DashboardItems'
import DashboardListings from './DashboardListings'
import { Link } from 'react-router-dom'

const Dashboard = () => {
	const [activeTab, setActiveTab] = useState('items')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}
	// const updateDashboard = useUserStore((state) => state.updateDashboard)
	// const updateItems = useItemStore((state) => state.updateItems)
	// const updateUserItems = useUserStore((state) => state.updateItemIds)
	// const userId = useAuthStore((state) => state.user?.id)

	// useEffect(() => {
	// 	updateDashboard()
	// }, [updateDashboard])

	return (
		<div className="w-fulldashboard-container">
			<div className="pb-8 text-center text-9xl ">User Details</div>
			<div className="flex justify-between border-b border-wax-silver">
				<div className="flex w-full text-xl tabs">
					<button
						onClick={() => handleTabClick('items')}
						className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 ${
							activeTab === 'items'
								? 'text-wax-blue border-b-2 rounded border-wax-blue'
								: 'text-wax-gray'
						}`}
					>
						Collection
					</button>
					<button
						onClick={() => handleTabClick('listings')}
						className={`tab  hover:bg-wax-amber hover:bg-opacity-10 px-2 ${
							activeTab === 'listings'
								? 'text-wax-blue border-b-2 rounded border-wax-blue'
								: 'text-wax-gray'
						}`}
					>
						Listings
					</button>
					<button
						onClick={() => handleTabClick('orders')}
						className={`tab hover:bg-wax-amber hover:bg-opacity-10 px-2 ${
							activeTab === 'orders'
								? 'text-blue-500 border-b-2 rounded border-wax-blue'
								: 'text-wax-gray'
						}`}
					>
						Orders
					</button>
					<Link to="/submissions">
						<button className="mb-1 ml-8 rounded-md ring-2 ring-wax-blue w-36 text-wax-cream bg-wax-teal hover:ring-4">
							Add a release
						</button>
					</Link>
				</div>
			</div>
			{/* Tab Content */}
			<div className="flex flex-grow tab-content">
				{activeTab === 'items' && <DashboardItems />}
				{activeTab === 'listings' && <DashboardListings />}
				{/* {activeTab === 'orders' && <OrdersTab />} } */}
			</div>
		</div>
	)
}

// const ItemsTab: React.FC = () => <div>Your Items</div>
// const ListingsTab = () => <div>Your Listings</div>
// const OrdersTab = () => <div>Your Orders</div>

export default Dashboard
