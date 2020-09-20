const internalProps = [
    'hideTableHeader',
    'column',
    'columns',
	'findcolumns',
	'scrollable',
    'sortable',
    'searchable',
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
	'currentChildren',
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

