import type { FilterType } from './types'

type TaskFiltersProps = {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  const filters: FilterType[] = ['all', 'active', 'completed']

  return (
    <div className="filter-row" aria-label="Task filters">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={filter === activeFilter ? 'filter-button active' : 'filter-button'}
          onClick={() => onFilterChange(filter)}
        >
          {filter === 'all' ? 'All' : filter === 'active' ? 'Open' : 'Done'}
        </button>
      ))}
    </div>
  )
}
