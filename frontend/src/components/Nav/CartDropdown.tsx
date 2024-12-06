import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faMinus } from '@fortawesome/free-solid-svg-icons'
import useAuthStore from '../../stores/authStore'

interface CartItem {
	id: number
	seller_id: number
	price: number
	release: string
	release_id: number
	album: string
	artist: string
}

interface CartDropdownProps {
	cartItems: {
		[key: number]: CartItem
	}
	onCheckout: () => void
}

const CartDropdown: React.FC<CartDropdownProps> = ({
	cartItems,
	onCheckout,
}) => {
	const { removeFromCart } = useAuthStore((state) => state)
	const navigate = useNavigate()
	const goToDashboardWithTab = (
		defaultTab: 'items' | 'listings' | 'orders'
	) => {
		navigate('/dashboard', { state: { defaultTab } })
	}

	const [isOpen, setIsOpen] = useState(false)
	const handleClickOutside = React.useCallback(
		(event: MouseEvent) => {
			if (!(event.target instanceof Element)) {
				return
			}
			const clickInside = event.target.closest('.cart')
			if (!clickInside) {
				setIsOpen(false)
			}
		},
		[isOpen]
	)

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleClickOutside])

	const calculateTotal = (): number => {
		return Object.values(cartItems).reduce(
			(total, item) => total + item.price,
			0
		)
	}
	const handleCheckout = async () => {
		await onCheckout()
		goToDashboardWithTab('orders')
		setIsOpen(false)
	}

	return (
		<div className="relative ml-4 self-center cart">
			<FontAwesomeIcon
				icon={faShoppingCart}
				onClick={() => setIsOpen((prev) => !prev)}
				size="xs"
				className="cursor-pointer hover:text-wax-amber dark:hover:text-waxDark-amber"
			/>
			{isOpen && (
				<div className="absolute top-full right-0 border-2 rounded-md border-wax-gray bg-wax-silver p-2 w-80 shadow-lg shadow-wax-black text-wax-black z-10 text-base dark:bg-waxDark-silver">
					{/* <div className="font-bold">Your Cart</div> */}
					{Object.values(cartItems).length === 0 ? (
						<p>Your cart is empty</p>
					) : (
						<ul className="p-0 m-0 list-none">
							{Object.values(cartItems).map((item) => (
								<li key={item.id} className="p-1 border-b-2 border-wax-cream">
									<div className="underline text-lg">{item.release}</div>
									<div>{`${item.album} - ${item.artist}`}</div>
									<div className="font-bold flex justify-between">
										${item.price.toFixed(2)}
										<FontAwesomeIcon
											icon={faMinus}
											size={'lg'}
											onClick={() => removeFromCart(item)}
											className="text-wax-red cursor-pointer hover:shadow-md hover:shadow-wax-gray hover:rounded-3xl hover:ring-2 hover:border-2 border-wax-silver hover:ring-wax-gray dark:text-waxDark-red dark:hover:ring-waxDark-black dark:hover:shadow-waxDark-black"
										/>
									</div>
								</li>
							))}
						</ul>
					)}
					<div className="mt-4 flex justify-between">
						<strong>Total: ${calculateTotal().toFixed(2)}</strong>
						<button
							className="mt-2 py-1 px-2 bg-wax-blue cursor-pointer rounded-md border-2 border-wax-silver text-wax-cream hover:ring-2 hover:ring-wax-amber hover:border-wax-blue hover:shadow-xl dark:bg-waxDark-blue dark:border-waxDark-silver dark:hover:ring-waxDark-black"
							onClick={handleCheckout}
						>
							Checkout
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default CartDropdown
