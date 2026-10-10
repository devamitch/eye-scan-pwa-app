import { useCallback, useMemo, useState } from 'react';

export interface SearchFilters {
	searchQuery: string;
	specialty?: string;
	rating?: number;
	location?: string;
	sortBy?: 'rating' | 'reviews' | 'experience' | 'name';
	sortOrder?: 'asc' | 'desc';
}

export function useSearch<T extends Record<string, any>>(
	items: T[],
	searchFields: (keyof T)[],
	initialFilters?: Partial<SearchFilters>
) {
	const [filters, setFilters] = useState<SearchFilters>({
		searchQuery: '',
		sortBy: 'rating',
		sortOrder: 'desc',
		...initialFilters,
	});

	// Filter items based on search query
	const filteredItems = useMemo(() => {
		let result = [...items];

		// Search filter
		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			result = result.filter((item) =>
				searchFields.some((field) => {
					const value = item[field];
					if (Array.isArray(value)) {
						return value.some((v) => String(v).toLowerCase().includes(query));
					}
					return String(value).toLowerCase().includes(query);
				})
			);
		}

		// Specialty filter
		if (filters.specialty) {
			result = result.filter((item) => {
				if ('specialty' in item) {
					return String(item.specialty)
						.toLowerCase()
						.includes(filters.specialty!.toLowerCase());
				}
				if ('specialties' in item && Array.isArray(item.specialties)) {
					return item.specialties.some((s: string) =>
						s.toLowerCase().includes(filters.specialty!.toLowerCase())
					);
				}
				return true;
			});
		}

		// Rating filter
		if (filters.rating !== undefined) {
			result = result.filter((item) => {
				if ('rating' in item && typeof item.rating === 'number') {
					return item.rating >= filters.rating!;
				}
				return true;
			});
		}

		// Location filter
		if (filters.location) {
			result = result.filter((item) => {
				if ('location' in item) {
					return String(item.location)
						.toLowerCase()
						.includes(filters.location!.toLowerCase());
				}
				return true;
			});
		}

		// Sort
		if (filters.sortBy) {
			result.sort((a, b) => {
				const aValue = a[filters.sortBy!];
				const bValue = b[filters.sortBy!];

				let comparison = 0;
				if (typeof aValue === 'string' && typeof bValue === 'string') {
					comparison = aValue.localeCompare(bValue);
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					comparison = aValue - bValue;
				}

				return filters.sortOrder === 'asc' ? comparison : -comparison;
			});
		}

		return result;
	}, [items, filters, searchFields]);

	const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	const resetFilters = useCallback(() => {
		setFilters({
			searchQuery: '',
			sortBy: 'rating',
			sortOrder: 'desc',
		});
	}, []);

	const setSearchQuery = useCallback((query: string) => {
		setFilters((prev) => ({ ...prev, searchQuery: query }));
	}, []);

	const setSpecialty = useCallback((specialty: string | undefined) => {
		setFilters((prev) => ({ ...prev, specialty }));
	}, []);

	const setRating = useCallback((rating: number | undefined) => {
		setFilters((prev) => ({ ...prev, rating }));
	}, []);

	const setLocation = useCallback((location: string | undefined) => {
		setFilters((prev) => ({ ...prev, location }));
	}, []);

	const setSortBy = useCallback(
		(sortBy: SearchFilters['sortBy'], sortOrder?: SearchFilters['sortOrder']) => {
			setFilters((prev) => ({
				...prev,
				sortBy,
				sortOrder: sortOrder || prev.sortOrder,
			}));
		},
		[]
	);

	return {
		filters,
		filteredItems,
		updateFilters,
		resetFilters,
		setSearchQuery,
		setSpecialty,
		setRating,
		setLocation,
		setSortBy,
		resultCount: filteredItems.length,
		totalCount: items.length,
	};
}
