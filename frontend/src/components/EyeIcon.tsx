import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faEye as faEyeSolid } from '@fortawesome/free-solid-svg-icons'
import useAuthStore from '../stores/authStore'
import useUserStore from '../stores/userStore'

interface EyeIconProps {
	id: number
}

const EyeIcon: React.FC<EyeIconProps> = ({ id }) => {
	const userId = useAuthStore((state) => state.user?.id)
	const { watchlist, addToWatchlist, removeFromWatchlist } = useUserStore(
		(state) => state
	)
	// const [isHovered, setIsHovered] = useState<boolean>(false)
	return (
		userId &&
		(watchlist.has(id) ? (
			<FontAwesomeIcon
				icon={faEyeSolid}
				size="xl"
				className="cursor-pointer hover:text-wax-cream hover:bg-wax-black hover:bg-opacity-50 hover:rounded-lg"
				onClick={() => removeFromWatchlist(userId, id)}
				// onMouseEnter={() => setIsHovered(true)}
				// onMouseLeave={() => setIsHovered(false)}
			/>
		) : (
			<FontAwesomeIcon
				icon={faEyeSlash}
				size="xl"
				className="cursor-pointer hover:text-wax-cream hover:bg-wax-black hover:bg-opacity-50 hover:rounded-3xl"
				onClick={() => addToWatchlist(userId, id)}
				// onMouseEnter={() => setIsHovered(true)}
				// onMouseLeave={() => setIsHovered(false)}
			/>
		))
	)
}
export default EyeIcon
