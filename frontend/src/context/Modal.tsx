import { useState, useRef, createContext, useContext, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface ModalContextType {
	modalRef: React.RefObject<HTMLDivElement>
	modalContent: ReactNode | null
	setModalContent: React.Dispatch<React.SetStateAction<ReactNode>>
	setOnModalClose: React.Dispatch<React.SetStateAction<(() => void) | null>>
	closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
	children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const [modalContent, setModalContent] = useState<ReactNode | null>(null)
	const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null)

	const closeModal = () => {
		setModalContent(null)
		if (typeof onModalClose === 'function') {
			setOnModalClose(() => {})
			onModalClose()
		}
	}
	const contextValue = {
		modalRef,
		modalContent,
		setModalContent,
		setOnModalClose,
		closeModal,
	}
	return (
		<>
			<ModalContext.Provider value={contextValue}>
				{children}
			</ModalContext.Provider>
			<div ref={modalRef} />
		</>
	)
}

export const Modal = () => {
	const context = useContext(ModalContext)
	if (!context) return null

	const { modalRef, modalContent, closeModal } = context
	//   const { modalRef, modalContent, closeModal } = useContext(ModalContext)
	if (!modalRef || !modalRef.current || !modalContent) return null

	return ReactDOM.createPortal(
		<div id="modal">
			<div id="modal-background" onClick={closeModal} />
			<div id="modal-content">{modalContent}</div>
		</div>,
		modalRef.current
	)
}

export const useModal = () => {
	// useContext(ModalContext)
	const context = useContext(ModalContext)
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalProvider')
	}
	return context
}
