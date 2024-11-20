import React from 'react'
import useItemStore, { Item } from '../stores/itemStore'

interface ItemTileMainProps {
	itemId: number
}

const ItemTileMain: React.FC<ItemTileMainProps> = ({ itemId }) => {
	const item: Item = useItemStore((state) => state.items[itemId])

	if (!item) {
		return <div>Item not found</div>
	}
	return (
		<>
			<div className="flex items-center justify-center w-64 h-64 border-2 rounded bg-wax-gray border-wax-amber ">
				<div className="flex flex-col text-wax-cream top">
					<div>{item.owner.username}</div>
					<div className="details">{item.release.media_type}</div>
				</div>
				<div className="bottom">
					<div className="shop"></div>
				</div>
			</div>
		</>
	)
}

export default ItemTileMain
