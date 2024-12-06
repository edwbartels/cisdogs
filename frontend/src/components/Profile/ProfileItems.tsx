import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import ProfileItemTile from './ProfileItemTile'
import useProfileStore from '../../stores/profileStore'

interface ProfileItemsProps {
	userId: number
}

const ProfileItems: React.FC<ProfileItemsProps> = ({ userId }) => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { getItems, clearState } = useProfileStore((state) => state.items)
	const hasMore = useProfileStore((state) => state.items.pagination?.has_more)
	const sortedIds = useProfileStore(
		(state) => state.items.pagination?.sorted_ids
	)

	useEffect(() => {
		getItems(userId)
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getItems])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getItems(userId).finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, getItems])
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => (
						<ProfileItemTile key={id} itemId={Number(id)} />
					))}
			</div>
			{hasMore && (
				<div ref={ref} className="loader pt-16 self-center">
					Loading...
				</div>
			)}
		</div>
	)
}

export default ProfileItems
