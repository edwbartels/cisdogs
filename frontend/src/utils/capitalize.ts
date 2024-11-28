// export const capitalize = (s: string | null) => {
// 	if (typeof s === 'string')
// 		return s
// 			.split(' ')
// 			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// 			.join(' ')
// 	else return ''
// }
export const capitalizeFirst = (s: string | null) => {
	return typeof s === 'string'
		? s
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
		: ''
}
