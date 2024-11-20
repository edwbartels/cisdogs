import { useEffect } from 'react';
import ItemTileMain from './ItemTileMain';
import useItemStore, { Item } from '../stores/itemStore';
import useUserStore from '../stores/userStore';
import useAuthStore from '../stores/authStore';

const HomePage = () => {
	const updateItems = useItemStore((state) => state.updateItems);
	const updateUserItems = useUserStore((state) => state.updateItemIds);
	const userId = useAuthStore((state) => state.user?.id);

	useEffect(() => {
		updateItems().then(() => {
			console.log('update all done');
			if (userId) {
				console.log('passed userid check');
				updateUserItems();
			}
		});
	}, [updateItems]);

	return <div className="home-container"></div>;
};

export default HomePage;
