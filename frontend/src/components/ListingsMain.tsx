import { useEffect } from 'react';
import ItemTileMain from './ItemTileMain';
import useListingStore from '../stores/listingStore';
import useUserStore from '../stores/userStore';
import useAuthStore from '../stores/authStore';

const ListingsMain = () => {
	const updateListings = useListingStore((state) => state.updateListings);
	const updateUserListings = useUserStore((state) => state.updateListingIds);
	const userId = useAuthStore((state) => state.user?.id);

	useEffect(() => {
		updateListings().then(() => {
			if (userId) {
				updateUserListings();
			}
		});
	}, [updateListings]);

	return <div className="listings-container"></div>;
};

export default ListingsMain;
