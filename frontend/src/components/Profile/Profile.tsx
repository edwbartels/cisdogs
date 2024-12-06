import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ProfileItems from './ProfileItems'
import ProfileListings from './ProfileListings'
import ProfileInfo from './ProfileInfo'

interface ProfileProps {
	defaultTab?: 'items' | 'listings'
}
const Profile: React.FC<ProfileProps> = () => {
	const { userId } = useParams()
	const location = useLocation()
	const defaultTab = location.state?.defaultTab as 'items' | 'listings'
	const [activeTab, setActiveTab] = useState(defaultTab || 'items')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab as 'items' | 'listings')
	}

	return (
		<div className="w-full dashboard-container">
			<ProfileInfo userId={Number(userId)} />
			<div className="flex justify-between border-b border-wax-silver min-w-72">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
						<button
							onClick={() => handleTabClick('items')}
							className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
								activeTab === 'items'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray  dark:text-waxDark-silver'
							}`}
						>
							Collection
						</button>
						<button
							onClick={() => handleTabClick('listings')}
							className={`tab  hover:bg-wax-amber hover:bg-opacity-10 px-2 h-full ${
								activeTab === 'listings'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray  dark:text-waxDark-silver'
							}`}
						>
							Listings
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
			{userId && (
				<div className="flex flex-grow tab-content">
					{activeTab === 'items' && <ProfileItems userId={Number(userId)} />}
					{activeTab === 'listings' && (
						<ProfileListings userId={Number(userId)} />
					)}
					{/* {activeTab === 'orders' && <DashboardOrders />} */}
				</div>
			)}
		</div>
	)
}

export default Profile
