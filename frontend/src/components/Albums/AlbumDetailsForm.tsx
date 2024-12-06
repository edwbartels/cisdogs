import React from 'react'
import { Album } from '../../stores/albumStore'
import { useNavigate } from 'react-router-dom'

interface AlbumDetailsFormProps {
	album: Album
}

const AlbumDetailsForm: React.FC<AlbumDetailsFormProps> = ({ album }) => {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col self-center">
			<div className="flex mt-8 self-center border  border-wax-silver w-[90%] text-xl min-w-[800px]">
				<div className="flex p-4 w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img className="w-full" src={album.art || '/tile-background.png'} />
				</div>
				<div className="flex  py-4 px-8 bg-wax-gray bg-opacity-30 justify-between flex-grow">
					<div className="flex flex-col justify-between">
						<div>
							<div className="flex flex-col">
								<div className="ml-2 font-semibold ">Artist</div>
								<div
									className="ml-4 cursor-pointer max-w-fit hover:underline"
									onClick={() => navigate(`/artist/${album.artist.id}`)}
								>
									{album.artist.name}
								</div>
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold ">Album</div>
								<div className="ml-4">{album.title}</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center justify-between">
						<div>
							<div className="font-semibold ">Track List</div>
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
