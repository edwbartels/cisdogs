import React from 'react';

const ItemTileMain: React.FC = () => {
	return (
		<div className="flex flex-col border-wax-amber border-2">
			<div className="bg-wax-gray text-wax-cream"></div>
			<div className="top flex">
				<div className="art">Art</div>
				<div className="details">Details</div>
			</div>
			<div className="bottom">
				<div className="shop"></div>
			</div>
		</div>
	);
};

export default ItemTileMain;
