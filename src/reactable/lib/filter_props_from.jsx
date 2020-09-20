const internalProps = [
    'hideTableHeader',
    'column',
    'columns',
    'sortable',
    'filterable',
    'filtering',
    'onFilter',
    'filterPlaceholder',
    'filterClassName',
    'currentFilter',
    'sort',
    'sortBy',
    'sortableColumns',
    'onSort',
    'defaultSort',
    'defaultSortDescending',
    'itemsPerPage',
    'filterBy',
    'hideFilterInput',
    'noDataText',
    'currentPage',
    'onPageChange',
    'previousPageLabel',
    'nextPageLabel',
    'pageButtonLimit',
    'childNode',
    'data',
    'children',
	'setItemsPerPage',
	'totalItems',
	'itemsPerPage'
];

export function filterPropsFrom(baseProps,extraFilter=[]) {
    baseProps = baseProps || {};
	var filterProps = [...internalProps,...extraFilter];
    var props = {};
    for (var key in baseProps) {
        if (!filterProps.includes(key)) {
            props[key] = baseProps[key];
        }
    }

    return props;
}

