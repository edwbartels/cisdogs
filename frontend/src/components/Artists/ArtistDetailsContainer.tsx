import { useState } from 'react'
import ArtistDetailsReleases from './ArtistDetailsReleases'
import ArtistDetailsListings from './ArtistDetailsListings'
import ArtistDetailsAlbums from './ArtistDetailsAlbums'

const ArtistDetailsContainer = () => {
	const [activeTab, setActiveTab] = useState('albums')
	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	return (
		<div className="w-full dashboard-container mt-8">
			<div className="flex justify-between border-b border-wax-silver">
				<div className="flex justify-between w-full text-xl tabs">
					<div>
						<button
							onClick={() => handleTabClick('albums')}
							className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
								activeTab === 'albums'
									? 'text-wax-blue border-b-2 rounded border-wax-blue dark:text-waxDark-blue dark:border-waxDark-blue'
									: 'text-wax-gray dark:text-waxDark-silver'
							}`}
						>
							Albums
						</button>
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
				{activeTab == 'albums' && <ArtistDetailsAlbums />}

				{activeTab == 'releases' && <ArtistDetailsReleases />}
				{activeTab == 'listings' && <ArtistDetailsListings />}
			</div>
		</div>
	)
}
export default ArtistDetailsContainer
