import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../stores/userStore'
import useDashboardStore from '../../stores/dashboardStore'
import { Order } from '../../stores/orderStore'
import { capitalizeFirst } from '../../utils/capitalize'

const DashboardOrders = () => {
	const navigate = useNavigate()
	const { orders, getOrders, clearStateAll } = useDashboardStore(
		(state) => state.orders.all
	)
	const { sales, getSales, clearStateSales } = useDashboardStore(
		(state) => state.orders.sales
	)
	const { purchases, getPurchases, clearStatePurchases } = useDashboardStore(
		(state) => state.orders.purchases
	)
	const hasMoreAll = useDashboardStore(
		(state) => state.orders.all.pagination?.has_more
	)
	const hasMoreSales = useDashboardStore(
		(state) => state.orders.sales.pagination?.has_more
	)
	const hasMorePurchases = useDashboardStore(
		(state) => state.orders.purchases.pagination?.has_more
	)
	const sortedIdsAll = useDashboardStore(
		(state) => state.orders.all.pagination?.sorted_ids
	)
	const sortedIdsSales = useDashboardStore(
		(state) => state.orders.sales.pagination?.sorted_ids
	)
	const sortedIdsPurchases = useDashboardStore(
		(state) => state.orders.purchases.pagination?.sorted_ids
	)
	const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'purchases'>(
		'all'
	)

	useEffect(() => {
		getOrders()
		getSales()
		getPurchases()
		return () => {
			clearStateAll()
			clearStateSales()
			clearStatePurchases()
			window.scrollTo({ top: 0 })
		}
	}, [getOrders, getSales, getPurchases])

	const visibleData =
		activeTab === 'all'
			? sortedIdsAll?.map((id) => orders[id])
			: activeTab === 'sales'
			? sortedIdsSales?.map((id) => orders[id])
			: sortedIdsPurchases?.map((id) => orders[id])

	return (
		<div className="flex flex-col self-center m-4 w-[90%]">
			<div>
				{['all', 'sales', 'purchases'].map((tab) => (
					<button
						key={tab}
						className={`tab px-2 hover:bg-wax-amber hover:bg-opacity-10 h-full ${
							activeTab === tab
								? 'text-wax-blue border-b-2 border-wax-blue rounded dark:text-waxDark-blue'
								: 'text-wax-gray dark:text-waxDark-silver'
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
								<td className="pl-2">{record.price.toFixed(2)}</td>
								<td className="pl-2">
									{activeTab === 'all' ? (
										<div className="relative group">
											<div
												className="hover:bg-wax-blue hover:bg-opacity-15 cursor-pointer"
												onClick={() => {
													record.type === 'sale'
														? navigate(`/profile/${record.buyer.id}`)
														: navigate(`/profile/${record.seller.id}`)
												}}
											>
												{capitalizeFirst(record.type)}
											</div>
											<div
												className="absolute z-10 
								invisible group-hover:visible
								bg-wax-gray text-wax-cream text-sm rounded py-1 px-2 absolute bottom-full right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
											>
												{record.type === 'sale'
													? record.buyer.username
													: record.seller.username}
											</div>
										</div>
									) : activeTab === 'sales' ? (
										<div
											className="hover:bg-wax-blue hover:bg-opacity-15 cursor-pointer"
											onClick={() => navigate(`/profile/${record.buyer.id}`)}
										>
											{record.buyer.username}
										</div>
									) : (
										<div
											className="hover:bg-wax-blue hover:bg-opacity-15 cursor-pointer"
											onClick={() => navigate(`/profile/${record.seller.id}`)}
										>
											{record.seller.username}
										</div>
									)}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default DashboardOrders
