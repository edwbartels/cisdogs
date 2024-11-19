import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type User = {
	id: number;
	username: string;
	email: string;
};

interface AuthStore {
	isLoggedIn: boolean;
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
}

const useAuthStore = create(
	devtools(
		persist<AuthStore>(
			(set) => ({
				isLoggedIn: false,
				user: null,
				login: (userData) => {
					const userLocalStorage =
						localStorage.getItem('accessToken');
					if (userLocalStorage) {
						set({
							isLoggedIn: true,
							user: {
								id: userData.id,
								username: userData.username,
								email: userData.email,
							},
						});
					}
				},
				logout: () => {
					set({ isLoggedIn: false, user: null });
					// Consider localStorage.clear()
					localStorage.removeItem('accessToken');
				},
			}),
			{
				name: 'userAuthStore',
			}
		)
	)
);

export default useAuthStore;
