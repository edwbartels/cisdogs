import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../stores/userStore'
import useDashboardStore from '../../stores/dashboardStore'
import { Order } from '../../stores/orderStore'
import { capitalizeFirst } from '../../utils/capitalize'

const DashboardOrders = () => {
	const navigate = useNavigate()
	const { ref, inView } = useInView({ threshold: 1.0 })
	const debounceFetch = useRef(false)
	const { orders, getOrders, clearStateAll } = useDashboardStore(
		(state) => state.orders.all
	)
	const hasMore = useDashboardStore(
		(state) => state.orders.all.pagination?.has_more
	)
	const sortedIds = useDashboardStore(
		(state) => state.orders.all.pagination?.sorted_ids
	)
	const { sales, purchases } = useUserStore((state) => state.orders)
	const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'purchases'>(
		'all'
	)

	useEffect(() => {
		getOrders()
		return () => {
			clearStateAll()
			window.scrollTo({ top: 0 })
		}
	}, [getOrders])
	useEffect(() => {
		if (inView && hasMore && !debounceFetch.current) {
			debounceFetch.current = true
			getOrders().finally(() => (debounceFetch.current = false))
		}
	}, [inView, hasMore, getOrders])

	const tableData = (ordersData: { [key: number]: Order } | null) => {
		if (!ordersData) return []
		return Object.values(ordersData).map((order) => ({
			...order,
			type: 'sales' in orders ? 'sale' : 'purchases',
		}))
	}
	const tableSales = tableData(sales)
	const tablePurchases = tableData(purchases)
	const tableAll = sortedIds

	const visibleData =
		activeTab === 'all'
			? sortedIds?.map((id) => orders[id])
			: activeTab === 'sales'
			? tableSales
			: tablePurchases

	return (
		<div className="flex flex-col self-center m-4 w-[90%]">
			<div>
				{['all', 'sales', 'purchases'].map((tab) => (
					<button
						key={tab}
						className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
							activeTab === tab
								? 'text-wax-blue border-b-2 border-wax-blue rounded'
								: 'text-wax-gray'
						}`}
						onClick={() => setActiveTab(tab as 'all' | 'sales' | 'purchases')}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>
			<table className="mt-4 border-seperate border-2 border-wax-gray">
				<thead className="border-b-2 border-wax-blue">
					<tr className="">
						<th className="">Date</th>
						<th>Release</th>
						<th>Album</th>
						<th>Artist</th>
						<th>Quality</th>
						<th>Price</th>
						{activeTab === 'all' ? (
							<th>Type</th>
						) : activeTab === 'sales' ? (
							<th>Buyer</th>
						) : (
							<th>Seller</th>
						)}
					</tr>
				</thead>
				<tbody className="border-separate">
					{visibleData &&
						visibleData.map((record, index) => (
							<tr key={record.id}>
								<td className="pl-2">
									{new Date(record.created).toLocaleDateString()}
								</td>
								<td
									className="pl-2 cursor-pointer hover:bg-wax-blue hover:bg-opacity-15"
									onClick={() => navigate(`/release/${record.release.id}`)}
								>
									{capitalizeFirst(record.release.variant)}
								</td>

								<td
									className="pl-2 cursor-pointer hover:bg-wax-blue hover:bg-opacity-15"
									onClick={() => navigate(`/album/${record.album.id}`)}
								>
									{capitalizeFirst(record.album.title)}
								</td>
								<td
									className="pl-2 cursor-pointer hover:bg-wax-blue hover:bg-opacity-15"
									onClick={() => navigate(`/artist/${record.artist.id}`)}
								>
									{capitalizeFirst(record.artist.name)}
								</td>
								<td className="pl-2">{record.quality.toUpperCase()}</td>
								<td className="pl-2">{record.price}</td>
								<td className="pl-2">
									{activeTab === 'all'
										? `${capitalizeFirst(record.type)}`
										: activeTab === 'sales'
										? `${record.buyer.username}`
										: `${record.seller.username}`}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default DashboardOrders
