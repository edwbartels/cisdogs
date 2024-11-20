export const filterObject = (
	obj: Record<any, any>,
	callback: (key: any, value: any) => boolean
) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => callback(key, value))
	);
};
