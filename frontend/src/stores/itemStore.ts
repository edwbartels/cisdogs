import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Item = {
	id: number;
	release_id: number;
	owner_id: number;
	listed: boolean;
	owner: {
		id: number;
		username: string;
	};
	release: {
		id: number;
		album_id: number;
		media_type: string;
		variant: string | null;
	};
};

interface ItemStore {
	items: {
		[key: number]: Item;
	};
	updateItems: () => Promise<void>;
}

const useItemStore = create(
	devtools<ItemStore>(
		(set) => ({
			items: {},
			updateItems: async () => {
				try {
					const url = '/api/items';
					const res = await fetch(url);
					if (!res.ok) {
						throw new Error('Fetch all items failed');
					}
					const allItems = await res.json();
					set({ items: allItems });
				} catch (e) {
					console.error(e);
				}
			},
		}),
		{ name: 'itemStore' }
	)
);

export default useItemStore;
