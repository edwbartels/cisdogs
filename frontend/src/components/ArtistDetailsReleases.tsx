import { useEffect } from 'react'
import useArtistStore from '../stores/artistStore'
import useReleaseStore from '../stores/releaseStore'
import ReleaseTile from './ReleaseTile'

const ArtistDetailsReleases = () => {
	const artistId = useArtistStore((state) => state.focus?.id)
	const { releases, getByReleases } = useReleaseStore((state) => state)

	useEffect(() => {
		getByReleases('artist', Number(artistId))
	}, [getByReleases])

	if (!Object.keys(releases).length)
		return <div className="m-4">No releases found.</div>
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(releases).map((id) => (
					<ReleaseTile key={id} releaseId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default ArtistDetailsReleases
