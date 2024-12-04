export type Pagination = {
	total_entries: number
	total_pages: number
	current_page: number
	has_more: boolean
	sorted_ids: number[]
} | null
