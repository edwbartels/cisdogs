import React from 'react'
import { Release } from '../stores/releaseStore'
import { useNavigate } from 'react-router-dom'

interface ReleaseDetailsFormProps {
	release: Release
}

const ReleaseDetailsForm: React.FC<ReleaseDetailsFormProps> = ({ release }) => {
	const navigate = useNavigate()
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="p-10 text-center border w-96 border-wax-black aspect-video">
					Image Upload tbd...
				</div>
			</div>
			<div className="flex w-full">
				<div className="flex w-full p-4 bg-wax-gray bg-opacity-30">
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold">Artist</div>
								<div
									className="pl-2 cursor-pointer max-w-fit hover:underline"
									onClick={() => navigate(`/artist/${release.artist.id}`)}
								>
									{release.artist.name}
								</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album</div>
								<div
									className="pl-2 cursor-pointer max-w-fit hover:underline"
									onClick={() => navigate(`/album/${release.album.id}`)}
								>
									{release.album.title}
								</div>
							</div>
							<div className="flex flex-col w-4/5">
								<div className="mt-1 ml-2 font-semibold">Format</div>
								<div className="pl-2">{release.media_type}</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release Variant</div>
								<div className="pl-2">{release.variant}</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center justify-between w-1/2">
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
	)
}

export default ReleaseDetailsForm
