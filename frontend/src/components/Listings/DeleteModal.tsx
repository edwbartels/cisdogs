import { useNavigate } from 'react-router-dom'
import fetchWithAuth from '../../utils/fetch'
import useUserStore from '../../stores/userStore'

interface DeleteModalProps {
	id: number
	isOpen: boolean
	onClose: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, isOpen, onClose }) => {
	const navigate = useNavigate()
	const removeListing = useUserStore((state) => state.removeListing)

	const handleDelete = () => {
		removeListing(id)
		navigate('/dashboard')
		alert('Listing cancelled')
		// onClose()
	}
	if (!isOpen) return null
	return (
		<div
			className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-wax-black"
			onClick={onClose} // Close modal on background click
		>
			<div
				className="flex flex-col items-center py-4 px-2 border-4 rounded shadow-lg bg-wax-silver border-wax-gray text-wax-black"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
			>
				<div className="mb-2 text-xl font-bold">
					Are you sure you want to cancel this listing?
				</div>
				<div className="text-sm w-4/5 mb-2">
					Use the edit option to make minor changes. Otherwise, you can re-post
					a listing at any time
				</div>
				<div className="space-x-4 mt-2">
					<button
						className="w-24 py-1 bg-wax-red rounded-lg ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
						onClick={handleDelete}
					>
						Confirm
					</button>
					<button
						className="w-24 py-1 bg-wax-gray rounded-lg ring-2 ring-wax-cream text-wax-cream hover:ring-wax-black"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}
export default DeleteModal
