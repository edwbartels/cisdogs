import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useItemStore, { Item } from '../stores/itemStore'
import useAuthStore from '../stores/authStore'
import ItemDetailsForm from './ItemDetailsForm'

const ItemDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const itemId = id ? parseInt(id, 10) : null
	if (itemId === null || isNaN(itemId)) {
		return <p>Invalid Item Id</p>
	}
	const getFocus = useItemStore((state) => state.getFocus)
	const item = useItemStore((state) => state.focus)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		getFocus(itemId)
		return () => useItemStore.setState({ focus: null })
	}, [])

	if (!item) return <div>Loading...</div>

	return <ItemDetailsForm item={item} />
}

export default ItemDetails
