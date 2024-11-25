import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

interface CartItem {
	id: number
	name: string
	price: number
	quantity: number
}

interface CartDropdownProps {
	cartItems: CartItem[]
	onCheckout: () => void
}

const CartDropdown: React.FC<CartDropdownProps> = ({
	cartItems,
	onCheckout,
}) => {
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

	return (
		<div className="relative ml-4 self-center cart">
			<FontAwesomeIcon
				icon={faShoppingCart}
				onClick={() => setIsOpen((prev) => !prev)}
				size="xs"
				className="cursor-pointer hover:text-wax-amber"
			/>
			{isOpen && (
				<div className="absolute top-full right-0 border-2 rounded-md border-wax-gray bg-wax-silver p-2 w-80 shadow-lg shadow-wax-black text-wax-black z-10 text-base">
					{/* <div className="font-bold">Your Cart</div> */}
					{Object.values(cartItems).length === 0 ? (
						<p>Your cart is empty</p>
					) : (
						<ul className="p-0 m-0 list-none">
							{Object.values(cartItems).map((item) => (
								<li key={item.id} className="p-1 border-b-2 border-wax-cream">
									<strong>{item.name}</strong>
									<div>${item.price.toFixed(2)}</div>
								</li>
							))}
						</ul>
					)}
					<div className="mt-4 flex justify-between">
						<strong>Total: ${calculateTotal().toFixed(2)}</strong>
						<button
							className="mt-2 py-1 px-2 bg-wax-blue cursor-pointer rounded-md border-2 border-wax-silver text-wax-cream hover:ring-2 hover:ring-wax-amber hover:border-wax-blue hover:shadow-xl"
							onClick={onCheckout}
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
