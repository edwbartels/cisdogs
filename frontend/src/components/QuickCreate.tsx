import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ListingModal from './ListingModal'
import SignInModal from './SignInModal'
import useAuthStore from '../stores/authStore'
import fetchWithAuth from '../utils/fetch'

const QuickCreate: React.FC = () => {
	const [activeModal, setActiveModal] = useState<'listing' | 'signIn' | null>(
		null
	)
	const [listingModalData, setListingModalData] = useState(null)
	const handleOpenListingModal = async () => {
		const url = '/api/users/items/unlisted'
		const res = await fetchWithAuth(url)
		if (!res.ok) {
			const error = await res.text()
			console.log(error)
			throw new Error('Failed to retrieve data for listing modal')
		}
		const data = await res.json()
		setListingModalData(data)

		setActiveModal('listing')
	}
	const { isLoggedIn } = useAuthStore()

	return (
		<div className="flex-col items-center justify-between hidden md:flex">
			<div className="font-bold text-xl border-b-2 border-wax-silver w-full text-center px-4">
				Add a...
			</div>
			<div className="flex space-x-2 text-base self-center ">
				<div className="flex hover:text-wax-amber self-end">
					<div
						className="cursor-pointer"
						onClick={() =>
							isLoggedIn ? handleOpenListingModal() : setActiveModal('signIn')
						}
					>
						Listing
					</div>
				</div>
				<a className="text-xl">|</a>
				<div className="flex hover:text-wax-amber self-end">
					<Link to="submissions">Release</Link>
				</div>
			</div>

			<SignInModal
				isOpen={activeModal === 'signIn'}
				onClose={() => setActiveModal(null)}
			/>

			<ListingModal
				isOpen={activeModal === 'listing'}
				onClose={() => {
					setActiveModal(null)
					setListingModalData(null)
					// useItemStore.setState({ focus: null })
				}}
				data={listingModalData}
			/>
		</div>
	)
}

export default QuickCreate
