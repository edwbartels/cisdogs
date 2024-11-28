import React from 'react'
import { Album } from '../stores/albumStore'
import { useNavigate } from 'react-router-dom'

interface AlbumDetailsFormProps {
	album: Album
}

const AlbumDetailsForm: React.FC<AlbumDetailsFormProps> = ({ album }) => {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col self-center">
			<div className="flex mt-8 self-center border  border-wax-silver w-4/5 text-xl min-w-[800px]">
				<div className="flex p-4 min-w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img src={album.art || '/tile-background.png'} />
				</div>
				<div className="flex  py-4 px-8 bg-wax-gray bg-opacity-30 justify-around flex-grow">
					<div className="flex flex-col justify-between">
						<div>
							<div className="flex flex-col">
								<div className="ml-2 font-semibold underline">Artist</div>
								<div
									className="pl-2 cursor-pointer hover:underline"
									onClick={() => navigate(`/artist/${album.artist.id}`)}
								>
									{album.artist.name}
								</div>
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold underline">Album</div>
								<div className="pl-2">{album.title}</div>
							</div>
							{/* <div>{`Releases: ${Object.keys(album.releases).length}`}</div> */}
							{/* <div className="flex flex-col ">
								<div className="mt-1 ml-2 font-semibold">Release Variant</div>
								<div className="pl-2">{release.variant}</div>
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold">Format</div>
								<div className="pl-2">{release.media_type}</div>
							</div> */}
						</div>
					</div>
					<div className="flex flex-col items-center justify-between">
						<div>
							<div className="font-semibold underline">Track List</div>
							<div className="pt-1 text-sm text-left">
								{Object.values(album.track_data).map((track, index) => (
									<div key={index}>
										{index + 1}: {track}
									</div>
								))}
							</div>
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AlbumDetailsForm
