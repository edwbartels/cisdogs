import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useUserStore from '../../stores/userStore'
import { Order } from '../../stores/orderStore'
import DropdownMenu from '../Util/DropdownMenu'
import EyeIcon from '../Icons/EyeIcon'

interface DashboardOrderTitleProps {
	orderId: number
	type: 'sale' | 'purchase'
}

type DropdownOptions = 'remove' | 'extra' | null

const DashboardOrderTile: React.FC<DashboardOrderTitleProps> = ({
	type,
	orderId,
}) => {
	const order: Order | null =
		type === 'sale'
			? useUserStore(
					(state) => state.orders.sales && state.orders.sales[orderId]
			  )
			: useUserStore(
					(state) => state.orders.purchases && state.orders.purchases[orderId]
			  )
	const navigate = useNavigate()

	const [activeDropdown, setActiveDropdown] = useState<{
		orderId: number
		type: DropdownOptions
	} | null>(null)

	const menuOptions = [{ label: 'Remove', value: 'remove' }]
	const extraOptions = [
		{ label: 'Item', value: 'item' },
		{ label: 'Release', value: 'release' },
		{ label: 'Album', value: 'album' },
		{ label: 'Artist', value: 'artist' },
	]

	// const toggleDropdown = (drop: DropdownOptions) => setActiveDropdown(drop)

	const handleOptionSelect = (option: { label: string; value: string }) => {
		switch (option.value) {
			// case 'remove':
			// 	removeItem(itemId)
			// 	break
			case 'item':
				navigate(`/item/${order?.item.id}`)
				break
			case 'release':
				navigate(`/release/${order?.release.id}`)
				break
			case 'album':
				navigate(`/album/${order?.album.id}`)
				break
			case 'artist':
				navigate(`/artist/${order?.artist.id}`)
				break
			default:
		}
		setActiveDropdown(null)
	}
	const handleOpenDropdown = (orderId: number, type: DropdownOptions) => {
		setActiveDropdown({ orderId, type })
	}

	const handleCloseDropdown = () => {
		setActiveDropdown(null)
	}

	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const clickInside = event.target.closest('.dropdown')
			if (!clickInside) {
				setActiveDropdown(null)
			}
		},
		[activeDropdown]
	)

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClickOutside])
	if (!order) {
		return <div>Order not found</div>
	}
	return (
		<>
			<div
				className={`flex flex-col items-center justify-between w-56 h-64 m-1 rounded border-6 bg-wax-cream border-wax-amber ring-8 
				 ring-wax-gray
				`}
			>
				{' '}
				{`Release ID: ${order.release.id}`}
				<div className="flex justify-between w-full h-6 px-1 bg-wax-amber">
					<div className="relative flex space-x-1">
						<EyeIcon id={order.release.id} />

						{!order.listing && (
							<div className="flex flex-col remove-dropdown">
								<FontAwesomeIcon
									icon={faMinus}
									size="xl"
									onClick={() =>
										activeDropdown?.orderId === orderId &&
										activeDropdown.type === 'remove'
											? handleCloseDropdown()
											: handleOpenDropdown(orderId, 'remove')
									}
									className="cursor-pointer hover:text-wax-cream"
								/>
								<DropdownMenu
									options={menuOptions}
									isOpen={
										activeDropdown?.orderId === orderId &&
										activeDropdown.type === 'remove'
									}
									onSelect={handleOptionSelect}
									className="border-wax-red font-semibold hover:ring-2 hover:ring-wax-gray hover:bg-wax-red hover:text-wax-cream hover:border-wax-gray "
								/>
							</div>
						)}
					</div>
					<div className="relative flex flex-col extra-dropdown">
						<FontAwesomeIcon
							icon={faEllipsis}
							size="xl"
							onClick={() =>
								activeDropdown?.orderId === orderId &&
								activeDropdown.type === 'extra'
									? handleCloseDropdown()
									: handleOpenDropdown(orderId, 'extra')
							}
							className="cursor-pointer hover:text-wax-cream"
						/>
						<DropdownMenu
							title="View Details"
							options={extraOptions}
							isOpen={
								activeDropdown?.orderId === orderId &&
								activeDropdown.type === 'extra'
							}
							onSelect={handleOptionSelect}
							className="-right-2 bg-wax-cream"
						/>
					</div>
				</div>
				<div
					className="flex flex-col justify-between w-full h-56 text-wax-gray "
					style={{
						backgroundImage: "url('/tile-background.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}
				>
					<div className="w-full font-semibold text-center cursor-default bg-opacity-60 text-wax-black bg-wax-silver">
						{order.album.title}
					</div>
					<div></div>
				</div>
				<div className="flex items-end justify-between w-full h-6 px-2 font-semibold bg-wax-gray text-wax-amber">
					<div className="cursor-pointer">{order.artist.name}</div>
					{order.listing && (
						<div className="cursor-pointer">
							$ {order.listing.price.toFixed(2)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default DashboardOrderTile
