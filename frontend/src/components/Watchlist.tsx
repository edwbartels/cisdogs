import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WatchlistReleases from './WatchlistReleases'
import WatchlistListings from './WatchlistListings'
import useAuthStore from '../stores/authStore'

const Watchlist = () => {
	const navigate = useNavigate()
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const [activeTab, setActiveTab] = useState<string>('releases')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	useEffect(() => {
		!isLoggedIn && navigate('/')
	}, [isLoggedIn])

	return (
		<div className="w-full dashboard-container">
			<div className="pb-8 text-center text-9xl ">Watchlist</div>
			<div className="flex justify-between border-b border-wax-silver">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
						<button
							onClick={() => handleTabClick('releases')}
							className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
								activeTab === 'releases'
									? 'text-wax-blue border-b-2 rounded border-wax-blue'
									: 'text-wax-gray'
							}`}
						>
							Releases
						</button>
						<button
							onClick={() => handleTabClick('listings')}
							className={`tab  hover:bg-wax-amber hover:bg-opacity-10 px-2 h-full ${
								activeTab === 'listings'
									? 'text-wax-blue border-b-2 rounded border-wax-blue'
									: 'text-wax-gray'
							}`}
						>
							Listings
						</button>
					</div>
				</div>
			</div>
			{/* Tab Content */}
			<div className="flex flex-grow tab-content">
				{activeTab === 'releases' && <WatchlistReleases />}
				{activeTab === 'listings' && <WatchlistListings />}
				{/* {activeTab === 'orders' && <OrdersTab />} } */}
			</div>
		</div>
	)
}

export default Watchlist
