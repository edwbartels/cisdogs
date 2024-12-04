import { useState } from 'react'
import ReleaseDetailsListings from './ReleaseDetailsListings'

const ReleaseDetailsContainer = () => {
	const [activeTab, setActiveTab] = useState('listings')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	return (
		<div className="w-full dashboard-container mt-8">
			<div className="flex justify-between border-b border-wax-silver">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
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
			<div className="flex flex-grow tab-content">
				{activeTab == 'listings' && <ReleaseDetailsListings />}
			</div>
		</div>
	)
}
export default ReleaseDetailsContainer
