import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type ModalOption = 'login' | 'signup' | 'listing'

export interface ModalStore {
	modalOptions: ModalOption[]
	activeModal: ModalOption | null
	setActiveModal: (option: ModalOption | null) => void
}

export const useModalStore = create(
	devtools<ModalStore>(
		(set) => ({
			modalOptions: ['login', 'signup', 'listing'],
			activeModal: null,
			setActiveModal: (option) =>
				set((state) => {
					if (option === null || state.modalOptions.includes(option)) {
						return { activeModal: option }
					}
					console.warn(`Invalid modal option: ${option}`)
					return state
				}),
		}),
		{ name: 'Modal' }
	)
)
