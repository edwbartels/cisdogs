import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import ItemTileMain from './ItemTileMain'
import useItemStore from '../../stores/itemStore'
import useUserStore from '../../stores/userStore'
import useAuthStore from '../../stores/authStore'

const Browse: React.FC = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { updateItems, clearState } = useItemStore((state) => state)
	const updateUserItems = useUserStore((state) => state.updateItemIds)
	const userId = useAuthStore((state) => state.user?.id)
	const hasMore = useItemStore((state) => state.pagination?.has_more)
	const sortedIds = useItemStore((state) => state.pagination?.sorted_ids)

	useEffect(() => {
		updateItems().then(() => {
			if (userId) {
				updateUserItems()
			}
		})
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [updateItems, userId, updateUserItems])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			updateItems().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, updateItems])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 pl-4 mt-4">
				{sortedIds &&
					sortedIds.map((id) => <ItemTileMain key={id} itemId={id} />)}
			</div>
			{hasMore && (
				<div ref={ref} className="loader pt-16 self-center">
					Loading...
				</div>
			)}
		</div>
	)
}

export default Browse
