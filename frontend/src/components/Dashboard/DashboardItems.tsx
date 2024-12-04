import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import DashboardItemTile from './DashboardItemTile'
import useDashboardStore from '../../stores/dashboardStore'

const DashboardItems = () => {
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { getItems, clearState } = useDashboardStore((state) => state.items)
	const hasMore = useDashboardStore((state) => state.items.pagination?.has_more)
	const sortedIds = useDashboardStore(
		(state) => state.items.pagination?.sorted_ids
	)
	// const { hasMore, sortedIds } = useDashboardStore(
	// 	(state) => state.items.pagination?
	// )
	// const { itemDetails, updateDashboardItems } = useUserStore((state) => state)
	// const hasMore = useUserStore((state) => state.pagination?.has_more)
	// const sortedIds = useUserStore((state) => state.pagination?.sorted_ids)

	useEffect(() => {
		getItems()
		return () => {
			clearState()
			window.scrollTo({ top: 0 })
		}
	}, [getItems])

	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getItems().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, getItems])
	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{sortedIds &&
					sortedIds.map((id) => (
						<DashboardItemTile key={id} itemId={Number(id)} />
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

export default DashboardItems
