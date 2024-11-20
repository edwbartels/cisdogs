import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import useAuthStore from './authStore';
import useItemStore, { Item } from './itemStore';

// type Item = {
// 	id: number;
// 	release_id: number;
// 	owner_id: number;
// 	listed: boolean;
// 	owner: {
// 		id: number;
// 		username: string;
// 	};
// 	release: {
// 		id: number;
// 		album_id: number;
// 		media_type: string;
// 		variant: string | null;
// 	};
// };
interface UserStore {
	// id: number | null;
	itemIds: number[];
	// setUser: (userId: number) => void;
	updateItemIds: () => void;
}

const useUserStore = create(
	devtools<UserStore>(
		(set) => ({
			// id: null,
			itemIds: [],
			// setUser: (userId) => set({ id: userId }),
			updateItemIds: () => {
				const userId = useAuthStore.getState().user?.id;
				const items = useItemStore.getState().items;

				if (userId) {
					const ownedItems = Object.values(items)
						.filter((item) => item.owner_id === userId)
						.map((item) => item.id);
					console.log(ownedItems);
					set({ itemIds: ownedItems });
				}
			},
		}),
		{ name: 'userStore' }
	)
);

export default useUserStore;
