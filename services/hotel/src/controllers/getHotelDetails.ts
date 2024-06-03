// import { Request, Response, NextFunction } from 'express';
// import prisma from '@/prisma';
// import axios from 'axios';
// import { INVENTORY_URL } from '@/config';

// const getHotelDetails = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { id } = req.params;
// 		const hotel = await prisma.hotel.findUnique({
// 			where: { id },
// 		});

// 		if (!hotel) {
// 			return res.status(404).json({ message: 'hotel not found' });
// 		}


// 			await prisma.hotel.update({
// 				where: { id: hotel.id },
// 				data: {
// 					inventoryId: inventory.id,
// 				},
// 			});
// 			console.log(
// 				'Product updated successfully with inventory id',
// 				inventory.id
// 			);

// 			return res.status(200).json({
// 				...product,
// 				inventoryId: inventory.id,
// 				stock: inventory.quantity || 0,
// 				stockStatus: inventory.quantity > 0 ? 'In stock' : 'Out of stock',
// 			});
// 		}

// 		// fetch inventory
// 		const { data: inventory } = await axios.get(
// 			`${INVENTORY_URL}/inventories/${product.inventoryId}`
// 		);

// 		return res.status(200).json({
// 			...hotel,
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

// export default getHotelDetails 
;
