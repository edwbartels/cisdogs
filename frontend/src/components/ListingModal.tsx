import React, { useState, useMemo, useEffect } from 'react'
import useItemStore from '../stores/itemStore'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'
import { capitalizeFirst } from '../utils/capitalize'

export type Item = {
	id: number
	release: string
	album: string
	artist: string
}
type Artist = {
	id: number
	name: string
	albums: Album[]
}
type Album = {
	id: number
	title: string
	releases: Release[]
}
type Release = {
	id: number
	variant: string | null
	media_type: string
	items: {
		id: number
	}[]
}
interface ListingModalProps {
	isOpen: boolean
	onClose: () => void
	data: {
		artists: Artist[]
	} | null
}

const ListingModal: React.FC<ListingModalProps> = ({
	isOpen,
	onClose,
	data,
}) => {
	const userId = useAuthStore((state) => state.user?.id)
	const item = useItemStore((state) => state.focus) || null
	// if
	const [listingDetails, setListingDetails] = useState({
		item_id: item?.id || null,
		seller_id: item?.owner.id || null,
		price: 0,
		quality: '',
		description: '',
	})
	const [selectedArtist, setSelectedArtist] = useState<number | null>(
		item?.artist.id || null
	)
	const [selectedAlbum, setSelectedAlbum] = useState<number | null>(
		item?.album.id || null
	)
	const [selectedRelease, setSelectedRelease] = useState<number | null>(
		item?.release.id || null
	)
	useEffect(() => {
		setListingDetails({
			...listingDetails,
			item_id: item?.id || null,
			seller_id: userId || null,
		})
	}, [item, userId])
	const clearInfo = () => {
		setSelectedArtist(null)
		setSelectedAlbum(null)
		setSelectedRelease(null)
		setListingDetails({
			...listingDetails,
			price: 0,
			quality: '',
			description: '',
		})
		// useItemStore.setState({ focus: null })
	}

	const filteredAlbums = useMemo(() => {
		if (!selectedArtist) return []
		const artist = data?.artists.find((a) => a.id === selectedArtist)
		return artist ? artist.albums : []
	}, [selectedArtist])

	const filteredReleases = useMemo(() => {
		if (!selectedAlbum) return []
		const album = filteredAlbums.find((a) => a.id === selectedAlbum)
		return album ? album.releases : []
	}, [selectedAlbum, filteredAlbums])

	const handleArtistChange = (artistId: number) => {
		setSelectedArtist(artistId)
		setSelectedAlbum(null)
		setSelectedRelease(null)
	}

	const handleAlbumChange = (albumId: number) => {
		setSelectedAlbum(albumId)
		setSelectedRelease(null)
	}

	const handleReleaseChange = (releaseId: number) => {
		setSelectedRelease(releaseId)

		const artist = data?.artists.find((artist) =>
			artist.albums.some((album) =>
				album.releases.some((release) => release.id === releaseId)
			)
		)
		const album = artist?.albums.find((album) =>
			album.releases.some((release) => release.id === releaseId)
		)
		const release = album?.releases.find((release) => release.id === releaseId)
		const item = release?.items[0]
		const itemId = item && item.id

		setSelectedArtist(artist?.id || null)
		setSelectedAlbum(album?.id || null)
		setListingDetails({
			...listingDetails,
			item_id: itemId || null,
			seller_id: userId || null,
		})
	}

	// }
	const handleFormChange =
		(listingDetailsField: string) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			setListingDetails({
				...listingDetails,
				[listingDetailsField]: e.target.value,
			})
		}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		item && setListingDetails({ ...listingDetails, item_id: item.id })
		userId && setListingDetails({ ...listingDetails, seller_id: userId })
		try {
			const url = '/api/listings/'
			const res = await fetchWithAuth(url, {
				method: 'POST',
				body: JSON.stringify(listingDetails),
				credentials: 'include',
			})
			if (!res.ok) {
				const error = await res.text()
				console.log(error)
				throw new Error('Failed to create listing')
			}
			clearInfo()
			onClose()
			window.location.reload()
		} catch (e) {
			console.error(e)
		}
	}
	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center text-center bg-opacity-50 bg-wax-black"
			onClick={onClose}
		>
			<div
				className="flex flex-col w-1/2 p-4 border-4 rounded shadow-lg bg-wax-silver border-wax-gray space-y-1"
				onClick={(e) => e.stopPropagation()}
			>
				<strong className="text-wax-black border-b-2 border-wax-black pb-1 mb-4">
					Create Listing
				</strong>
				{item ? (
					<>
						<div className="mb-4 text-3xl font-bold border-b-2 text-wax-black border-wax-black">
							{`${item?.artist.name} - ${item?.album.title}`}
						</div>
						<div className="mb-4 text-2xl font-bold text-wax-black">
							{`${item?.release.variant} - ${item?.release.media_type}`}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center space-y-2 text-wax-gray">
						<div className="w-3/5">
							{/* <label>Artist</label> */}
							<select
								value={selectedArtist || ''}
								onChange={(e) => handleArtistChange(Number(e.target.value))}
								className="block w-full p-2  border rounded text-wax-black"
							>
								<option value="">Select Artist</option>
								{data?.artists.map((artist) => (
									<option key={artist.id} value={artist.id}>
										{artist.name}
									</option>
								))}
							</select>
						</div>
						<div className="w-3/5">
							{/* <label>Album</label> */}
							<select
								value={selectedAlbum || ''}
								onChange={(e) => handleAlbumChange(Number(e.target.value))}
								className="block w-full p-2 border rounded text-wax-black"
								disabled={!selectedArtist}
							>
								<option value="">Select Album</option>
								{filteredAlbums.map((album) => (
									<option key={album.id} value={album.id}>
										{album.title}
									</option>
								))}
							</select>
						</div>
						<div className="w-3/5">
							{/* <label>Release</label> */}
							<select
								value={selectedRelease || ''}
								onChange={(e) => handleReleaseChange(Number(e.target.value))}
								className="block w-full p-2 border rounded text-wax-black"
								disabled={!selectedAlbum}
							>
								<option value="">Select Release</option>
								{filteredReleases.map((release) => (
									<option key={release.id} value={release.id}>
										{capitalizeFirst(release.variant)}
									</option>
								))}
							</select>
						</div>
					</div>
				)}
				<form
					className="flex flex-col items-center pt-1"
					onSubmit={handleSubmit}
				>
					<select
						onChange={handleFormChange('quality')}
						defaultValue={listingDetails.quality}
						className="block w-3/5 p-2 mb-2 border rounded text-wax-black"
						required
					>
						<option value="" disabled>
							Select Quality
						</option>
						<option value="m">Mint</option>
						<option value="vg">Very Good</option>
						<option value="g">Good</option>
						<option value="f">Fair</option>
						<option value="ng">Not Good</option>
					</select>
					<textarea
						onChange={handleFormChange('description')}
						defaultValue={listingDetails.description}
						placeholder="Description"
						className="block w-3/5 p-1 mb-2 border rounded text-wax-black max-h-60"
						rows={5}
						required
					/>
					<input
						type="number"
						onChange={handleFormChange('price')}
						defaultValue={listingDetails.price}
						className="block w-3/5 p-1 mb-2 border rounded text-wax-black"
					>
						${' '}
					</input>
					<button
						type="submit"
						className="w-2/5 py-2 mt-2 bg-green-700 border-4 rounded border-wax-silver text-wax-cream hover:border-green-700"
					>
						Post
					</button>
					<button
						onClick={onClose}
						className="w-1/5 px-4 py-2 mt-2 text-white border-4 rounded border-wax-silver bg-wax-red hover:border-wax-red"
					>
						Close
					</button>
				</form>
			</div>
		</div>
	)
}
export default ListingModal
