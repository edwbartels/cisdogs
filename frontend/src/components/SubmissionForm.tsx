import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useArtistStore from '../stores/artistStore'
import useAlbumStore from '../stores/albumStore'
import useReleaseStore from '../stores/releaseStore'
import fetchWithAuth from '../utils/fetch'

type TrackData = {
	[key: string]: string
}
interface ReleaseFormState {
	artist: string
	album: string
	variant: string
	media_type: string
	track_data: TrackData
	art: string | null
}
const SubmissionForm = () => {
	const navigate = useNavigate()
	const [releaseForm, setReleaseForm] = useState<ReleaseFormState>({
		artist: '',
		album: '',
		variant: '',
		media_type: '',
		track_data: {},
		art: null,
	})
	const { artists, getArtists, addArtist } = useArtistStore((state) => state)
	const { albums, getByAlbums, clearAlbums, addAlbum } = useAlbumStore(
		(state) => state
	)
	const getReleases = useReleaseStore((state) => state.getReleases)
	const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
	const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null)

	useEffect(() => {
		getArtists()
	}, [])
	useEffect(() => {
		selectedArtist ? getByAlbums('artist', selectedArtist) : clearAlbums()
	}, [selectedArtist])

	const handleArtistChange = (artistId: number) => {
		setSelectedArtist(artistId)
		setSelectedAlbum(null)
		setReleaseForm({
			...releaseForm,
			artist: artists[artistId] ? artists[artistId].name : '',
			album: '',
			art: '',
			track_data: {},
		})
	}
	const handleAlbumChange = (albumId: number) => {
		setSelectedAlbum(albumId)
		setReleaseForm({
			...releaseForm,
			album: albums[albumId] ? albums[albumId].title : '',
			art: albums[albumId] ? albums[albumId].art : '',
			track_data: albums[albumId] ? albums[albumId].track_data : {},
		})
	}

	const handleFormChange =
		(releaseFormField: string) =>
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			releaseFormField !== 'media_type'
				? setReleaseForm({
						...releaseForm,
						[releaseFormField]: e.target.value,
				  })
				: e.target.value === 'cd' || e.target.value === 'cassette'
				? setReleaseForm({
						...releaseForm,
						media_type: e.target.value,
						variant: e.target.value,
				  })
				: setReleaseForm({
						...releaseForm,
						variant: '',
						media_type: e.target.value,
				  })
		}

	const transformParam = (input: string) => {
		return input.trim().replace(/\s+/g, '+')
	}
	const getData = async () => {
		const artistParam = transformParam(releaseForm.artist)
		const albumParam = transformParam(releaseForm.album)
		if (!(artistParam && albumParam)) return
		const url = `/api/track_data/${artistParam}/${albumParam}`
		try {
			const res = await fetch(url)
			if (!res.ok) {
				throw new Error("Couldn't find track list")
			}
			const data = await res.json()
			if (data) {
				const artistAdded = await addArtist(releaseForm.artist)
				if (artistAdded) {
					getArtists()
					const albumAdded = await addAlbum({
						artist_id: Object.values(artistAdded)[0].id,
						title: releaseForm.album,
						track_data: data.track_data,
						art: data.art,
					})
					if (albumAdded) {
						setSelectedArtist(Object.values(artistAdded)[0].id)
						setSelectedAlbum(Object.values(albumAdded)[0].id)
						setReleaseForm((prev) => ({
							...prev,
							track_data: data.track_data,
							art: data.art,
						}))
					}
					setSelectedArtist(Object.values(artistAdded)[0].id)
				}
			} else {
				alert(
					"Couldn't find release info, please check the artist and album fields and try again."
				)
			}
		} catch (e) {
			console.error(e)
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!releaseForm.media_type) {
			throw new Error('Format required.')
		} else {
			try {
				const releaseCreate = {
					artist_id: Number(selectedArtist),
					album_id: Number(selectedAlbum),
					track_data: releaseForm.track_data,
					media_type: releaseForm.media_type,
					variant: releaseForm.variant,
				}
				const url = '/api/releases/'
				const res = await fetchWithAuth(url, {
					method: 'POST',
					body: JSON.stringify(releaseCreate),
					credentials: 'include',
				})
				if (!res.ok) {
					// const error = await res.text()
					// console.log(error)
					throw new Error('Failed to create release')
				}
				const data = await res.json()
				getReleases()
				navigate(`/release/${data.id}`)
			} catch (e) {
				console.error(e)
			}
		}
	}
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="flex p-4 min-w-[300px] items-center  bg-wax-gray bg-opacity-15">
					<img src={releaseForm.art || '/tile-background.png'} />
				</div>
			</div>
			<div className="flex w-full">
				<form
					onSubmit={handleSubmit}
					className="flex w-full p-4 bg-wax-gray bg-opacity-30"
				>
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold">Artist *</div>
								<select
									value={selectedArtist || ''}
									onChange={(e) => {
										handleArtistChange(Number(e.target.value))
									}}
									className="block w-full p-1  border rounded text-wax-black"
								>
									<option value="">New Artist</option>
									{Object.values(artists).map((artist) => (
										<option key={artist.id} value={artist.id}>
											{artist.name}
										</option>
									))}
								</select>
								{!selectedArtist && (
									<input
										onChange={handleFormChange('artist')}
										defaultValue={releaseForm.artist}
										required
										type="text"
										className="pl-2 mt-1"
									></input>
								)}
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album *</div>
								<select
									value={selectedAlbum || ''}
									onChange={(e) => handleAlbumChange(Number(e.target.value))}
									className="block w-full p-1 border rounded text-wax-black"
									disabled={releaseForm.artist === ''}
								>
									<option value="">New Album</option>
									{Object.values(albums).map((album) => (
										<option key={album.id} value={album.id}>
											{album.title}
										</option>
									))}
								</select>
								{releaseForm.artist && !selectedAlbum && (
									<input
										onChange={handleFormChange('album')}
										defaultValue={releaseForm.album}
										required
										type="text"
										className="pl-2 mt-1"
									></input>
								)}
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Vinyl Variant</div>
								<input
									onChange={handleFormChange('variant')}
									defaultValue={releaseForm.variant}
									value={releaseForm.variant}
									required
									type="text"
									className="pl-2"
									disabled={releaseForm.media_type != 'vinyl'}
								></input>
							</div>
						</div>
						{selectedAlbum ? (
							<button
								type="submit"
								className="self-center w-3/5 ml-1 rounded-md ring-2 ring-wax-cream text-wax-cream bg-green-700 hover:ring-4 hover:ring-wax-gray"
								disabled={!releaseForm.media_type}
							>
								Submit
							</button>
						) : (
							<button
								type="button"
								onClick={getData}
								className="self-center text-center self-center w-3/5 ml-1 rounded-md ring-2 ring-wax-cream text-wax-cream bg-green-700 hover:ring-4 hover:ring-wax-gray cursor-pointer disabled:cursor-default disabled:bg-opacity-50 disabled:hover:ring-2 disabled:hover:ring-wax-cream"
								disabled={!releaseForm.album}
							>
								Get Album Info
							</button>
						)}
					</div>
					<div className="flex flex-col items-center w-1/2">
						<div className="font-semibold text-center">Format *</div>
						<div className="flex justify-center mt-1 space-x-3">
							<label>
								<input
									type="radio"
									name="media_type"
									value="vinyl"
									checked={releaseForm.media_type === 'vinyl'}
									onChange={handleFormChange('media_type')}
								/>
								{`  Vinyl`}
							</label>
							<label>
								<input
									type="radio"
									name="media_type"
									value="cd"
									checked={releaseForm.media_type === 'cd'}
									onChange={handleFormChange('media_type')}
								/>
								{`  CD`}
							</label>
							<label>
								<input
									type="radio"
									name="media_type"
									value="cassette"
									checked={releaseForm.media_type === 'cassette'}
									onChange={handleFormChange('media_type')}
								/>
								{`  Cassette`}
							</label>
						</div>
						{Object.keys(releaseForm.track_data).length ? (
							<div className="pt-1 text-sm text-left">
								{Object.values(releaseForm.track_data).map((track, index) => (
									<div key={index}>
										{index + 1}: {track}
									</div>
								))}
							</div>
						) : (
							<>
								<div className="mt-2 font-semibold text-center">
									Get Track List
								</div>
								<div className="text-sm italic text-center">
									Make sure the artist and album fields are spelled correctly
								</div>
							</>
						)}
					</div>
				</form>
			</div>
		</div>
	)
}
export default SubmissionForm
