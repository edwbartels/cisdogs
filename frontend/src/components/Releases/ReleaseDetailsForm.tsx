import React from 'react'
import { Release } from '../../stores/releaseStore'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'
import { capitalizeFirst } from '../../utils/capitalize'

interface ReleaseDetailsFormProps {
	release: Release
}

const ReleaseDetailsForm: React.FC<ReleaseDetailsFormProps> = ({ release }) => {
	const navigate = useNavigate()
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
	const userId = useAuthStore((state) => state.user?.id)
	const { collection, addToCollection } = useUserStore((state) => state)
	return (
		<div className="flex flex-col self-center">
			<div className="flex mt-8 border self-center w-[90%] bg-wax-gray bg-opacity-15 border-wax-silver">
				<div className="flex p-4 min-w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img
						className="w-full"
						src={release.album.art || '/tile-background.png'}
					/>
				</div>
				<div className="flex w-full">
					<div className="flex w-full p-4 bg-wax-gray bg-opacity-30">
						<div className="flex flex-col justify-between w-1/2">
							<div>
								<div className="flex flex-col w-4/5 ">
									<div className="ml-2 font-semibold">Artist</div>
									<div
										className="ml-4 cursor-pointer max-w-fit hover:underline"
										onClick={() => navigate(`/artist/${release.artist.id}`)}
									>
										{release.artist.name}
									</div>
								</div>
								<div className="flex flex-col w-4/5 ">
									<div className="mt-1 ml-2 font-semibold">Album</div>
									<div
										className="ml-4 cursor-pointer max-w-fit hover:underline"
										onClick={() => navigate(`/album/${release.album.id}`)}
									>
										{release.album.title}
									</div>
								</div>
								<div className="flex flex-col w-4/5">
									<div className="mt-1 ml-2 font-semibold">Format</div>
									<div className="ml-4">
										{release.media_type === 'cd'
											? release.media_type.toUpperCase()
											: capitalizeFirst(release.media_type)}
									</div>
								</div>
								<div className="flex flex-col w-4/5 ">
									<div className="mt-1 ml-2 font-semibold">Release Variant</div>
									<div className="ml-4">
										{release.variant === 'cd'
											? release.variant.toUpperCase()
											: capitalizeFirst(release.variant)}
									</div>
								</div>
							</div>
							{isLoggedIn && userId && !collection?.has(release.id) && (
								<button
									type="button"
									onClick={() =>
										addToCollection({
											release_id: release.id,
											owner_id: userId,
										})
									}
									className="self-center text-center self-center w-3/5 ml-1 rounded-md ring-2 ring-wax-cream text-wax-cream bg-green-700 hover:ring-4 hover:ring-wax-gray cursor-pointer disabled:cursor-default disabled:bg-opacity-50 disabled:hover:ring-2 disabled:hover:ring-wax-cream"
								>
									Add to Collection
								</button>
							)}
						</div>
						<div className="flex flex-col items-center  w-1/2">
							<div className="font-semibold">Track List</div>
							<div className="pt-1 text-sm text-left">
								{Object.values(release.album.track_data).map((track, index) => (
									<div key={index}>
										{index + 1}: {track}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReleaseDetailsForm
