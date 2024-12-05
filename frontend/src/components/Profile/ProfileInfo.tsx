import { useEffect } from 'react'
import useProfileStore from '../../stores/profileStore'

interface ProfileInfoProps {
	userId: number
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userId }) => {
	const { username, member_since, collection_count, getInfo } = useProfileStore(
		(state) => state
	)

	useEffect(() => {
		getInfo(userId)
	}, [getInfo])

	return (
		<div className="mt-4 mb-8 bg-wax-blue mr-8 rounded-md border-2 border-wax-cream text-wax-cream ring-wax-blue ring-2 flex flex-col w-fit">
			<div className="flex flex-col">
				<div className="border-b-2 font-bold text-lg text-center border-wax-silver">
					{username}
				</div>
				<div className="px-1 bg-wax-cream text-wax-gray text-base">{`Member since: ${member_since}`}</div>
				<div className="px-1 bg-wax-cream text-wax-gray text-base">{`Collection: ${collection_count}`}</div>
			</div>
		</div>
	)
}
export default ProfileInfo
