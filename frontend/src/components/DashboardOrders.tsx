import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'
import useUserStore from '../stores/userStore'
import DashboardOrderTile from './DashboardOrderTile'

const DashboardOrders = () => {
	const getOrders = useUserStore((state) => state.getOrders)
	const sales = useUserStore((state) => state.orders.sales)
	console.log(sales)
	const purchases = useUserStore((state) => state.orders.purchases)
	console.log(purchases)
	const userId = useAuthStore((state) => state.user?.id)
	useEffect(() => {
		getOrders()
	}, [])

	return (
		<div className="flex self-center">
			<div className="flex flex-col w-1/2 ">
				{' '}
				<div className="text-center font-bold">Sales</div>
				<div className="flex flex-wrap justify-start gap-4 p-4">
					{sales &&
						Object.keys(sales).map((id) => (
							<DashboardOrderTile key={id} type="sale" orderId={Number(id)} />
						))}
				</div>
			</div>
			<div className="flex flex-col  w-1/2">
				{' '}
				<div className="text-center font-bold">Purchases</div>
				<div className="flex flex-wrap justify-start gap-4 p-4">
					{purchases &&
						Object.keys(purchases).map((id) => (
							<DashboardOrderTile
								key={id}
								type="purchase"
								orderId={Number(id)}
							/>
						))}
				</div>
			</div>
		</div>
	)
}

export default DashboardOrders
