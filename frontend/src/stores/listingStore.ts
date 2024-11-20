import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Listing = {
	id: number;
	seller_id: number;
	item_id: number;
	active: boolean;
	status: 'available' | 'closed';
	price: number;
	quality: 'm' | 'vg' | 'g' | 'f' | 'ng';
	description: string | null;
	seller: {
		id: number;
		email: string;
		username: string;
	};
	item: {
		id: number;
		owner_id: number;
		release_id: number;
	};
};

interface ListingStore {
	listings: {
		[key: number]: Listing;
	};
	updateListings: () => Promise<void>;
}

const useListingStore = create(
	devtools<ListingStore>(
		(set) => ({
			listings: {},
			updateListings: async () => {
				try {
					const url = '/api/listings/';
					const res = await fetch(url);
					if (!res.ok) {
						throw new Error('Fetch all listings failed');
					}
					const allListings = await res.json();
					set({ listings: allListings });
				} catch (e) {
					console.error(e);
				}
			},
		}),
		{ name: 'listingStore' }
	)
);

export default useListingStore;
