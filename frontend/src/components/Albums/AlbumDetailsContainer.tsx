import { useState } from 'react'
import AlbumDetailsReleases from './AlbumDetailsReleases'
import AlbumDetailsListings from './AlbumDetailsListings'

const AlbumDetailsContainer = () => {
	const [activeTab, setActiveTab] = useState('releases')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	return (
		<div className="w-full dashboard-container mt-8">
			<div className="flex justify-between border-b border-wax-silver">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
						<button
							onClick={() => handleTabClick('releases')}
							className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
								activeTab === 'releases'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-waxDark-silver'
							}`}
						>
							Releases
						</button>
						<button
							onClick={() => handleTabClick('listings')}
							className={`tab  hover:bg-wax-amber hover:bg-opacity-10 px-2 h-full ${
								activeTab === 'listings'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-waxDark-silver'
							}`}
						>
							Listings
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-grow tab-content">
				{activeTab == 'releases' && <AlbumDetailsReleases />}
				{activeTab == 'listings' && <AlbumDetailsListings />}
			</div>
		</div>
	)
}
export default AlbumDetailsContainer
