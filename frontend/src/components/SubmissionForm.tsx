import React, { useState, useEffect } from 'react'

type TrackData = {
	[key: string]: string
}
interface ReleaseFormState {
	artist: string
	album: string
	variant: string
	media_type: string
	track_data: TrackData
}
const SubmissionForm = () => {
	const [releaseForm, setReleaseForm] = useState<ReleaseFormState>({
		artist: '',
		album: '',
		variant: '',
		media_type: '',
		track_data: {},
	})

	useEffect(() => {
		setReleaseForm((prev) => ({ ...prev, track_data: {} }))
	}, [releaseForm.artist, releaseForm.album])

	const handleFormChange =
		(releaseFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setReleaseForm((prev) => ({
				...prev,
				[releaseFormField]: e.target.value,
			}))
		}

	const transformParam = (input: string) => {
		return input.trim().replace(/\s+/g, '+')
	}
	const getTracks = async () => {
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
			setReleaseForm((prev) => ({
				...prev,
				track_data: data,
			}))
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
				console.log(releaseForm)
				const token = localStorage.getItem('accessToken')
				const url = '/api/releases/'
				const res = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(releaseForm),
					credentials: 'include',
				})
				if (!res.ok) {
					const error = await res.text()
					console.log(error)
					throw new Error('Failed to create release')
				}
				const data = await res.json()
				console.log(data)
			} catch (e) {
				console.error(e)
			}
		}
	}
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="p-10 text-center border w-96 border-wax-black aspect-video">
					Image Upload tbd...
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
								<input
									onChange={handleFormChange('artist')}
									defaultValue={releaseForm.artist}
									required
									type="text"
									className="pl-2"
								></input>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album *</div>
								<input
									onChange={handleFormChange('album')}
									defaultValue={releaseForm.album}
									required
									type="text"
									className="pl-2"
								></input>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release Variant</div>
								<input
									onChange={handleFormChange('variant')}
									defaultValue={releaseForm.variant}
									required
									type="text"
									className="pl-2"
								></input>
							</div>
						</div>
						<button
							type="submit"
							className="w-4/5 ml-1 rounded-md ring-2 ring-wax-blue text-wax-cream bg-wax-teal hover:ring-4"
						>
							Submit
						</button>
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
									Get Track List?
								</div>
								<div className="text-sm italic text-center">
									Make sure the artist and album fields are spelled correctly
								</div>
								<div
									onClick={getTracks}
									className="w-3/5 mt-4 text-center rounded-md cursor-pointer ring-2 ring-wax-silver text-wax-gray bg-wax-cream hover:ring-4"
								>
									Add Tracks
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
