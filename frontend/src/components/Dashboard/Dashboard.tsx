import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardItems from './DashboardItems'
import DashboardListings from './DashboardListings'
import DashboardOrders from './DashboardOrders'
import useAuthStore from '../../stores/authStore'

interface DashboardProps {
	defaultTab?: 'items' | 'listings' | 'orders'
}
const Dashboard: React.FC<DashboardProps> = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const defaultTab = location.state?.defaultTab as
		| 'items'
		| 'listings'
		| 'orders'
	const [activeTab, setActiveTab] = useState(defaultTab || 'items')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab as 'items' | 'listings' | 'orders')
	}
	useEffect(() => {
		!isLoggedIn && navigate('/')
	}, [isLoggedIn])

	return (
		<div className="w-full dashboard-container">
			<div className="flex justify-between border-b border-wax-silver min-w-72">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
						<button
							onClick={() => handleTabClick('items')}
							className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
								activeTab === 'items'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-wax-silver'
							}`}
						>
							Collection
						</button>
						<button
							onClick={() => handleTabClick('listings')}
							className={`tab  hover:bg-wax-amber hover:bg-opacity-10 px-2 h-full ${
								activeTab === 'listings'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-wax-silver'
							}`}
						>
							Listings
						</button>
						<button
							onClick={() => handleTabClick('orders')}
							className={`tab hover:bg-wax-amber hover:bg-opacity-10 px-2 h-full ${
								activeTab === 'orders'
									? 'text-blue-500 border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-wax-silver'
							}`}
						>
							Orders
						</button>
						{/* <Link to="#">
							<button className="w-24 mb-1 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray">
								Sell
							</button>
						</Link> */}
					</div>
					{/* <Link to="/submissions">
						<button className="mb-1 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream w-36 text-wax-cream hover:ring-wax-gray">
							Add a release
						</button>
					</Link> */}
				</div>
			</div>
			{/* Tab Content */}
			<div className="flex flex-grow tab-content">
				{activeTab === 'items' && <DashboardItems />}
				{activeTab === 'listings' && <DashboardListings />}
				{activeTab === 'orders' && <DashboardOrders />}
			</div>
		</div>
	)
}

export default Dashboard
