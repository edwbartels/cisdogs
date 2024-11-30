import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ModalOption = 'login' | 'signup' | 'listing'

export interface ModalStore {
	modalOptions: ModalOption[]
	activeModal: ModalOption | null
	setActiveModal: (option: ModalOption | null) => void
	next: string | null
	setNext: (option: string | null) => void
}

const useModalStore = create(
	devtools<ModalStore>(
		(set) => ({
			modalOptions: ['login', 'signup', 'listing'],
			activeModal: null,
			next: null,
			setActiveModal: (option) =>
				set((state) => {
					if (option === null || state.modalOptions.includes(option)) {
						return { activeModal: option }
					}
					console.warn(`Invalid modal option: ${option}`)
					return state
				}),
			setNext: (option) => set({ next: option }),
		}),
		{ name: 'Modal' }
	)
)
export default useModalStore
