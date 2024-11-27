import { useEffect } from 'react'
import ReleaseTile from './ReleaseTile'
import useReleaseStore from '../stores/releaseStore'

const Releases: React.FC = () => {
	const { releases, getReleases } = useReleaseStore((state) => state)

	useEffect(() => {
		getReleases()
	}, [getReleases])
	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Releases</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(releases).map((id) => (
					<ReleaseTile key={id} releaseId={Number(id)} />
				))}
			</div>
		</div>
	)
}
export default Releases
