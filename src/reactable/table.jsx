import React from 'react';
import { filterPropsFrom } from './lib/filter_props_from';
import { extractDataFrom } from './lib/extract_data_from';
import { isUnsafe } from './unsafe';
import { Thead } from './thead';
import { Th } from './th';
import { Tr } from './tr';
import { Tfoot } from './tfoot';
import { Paginator } from './paginator';



export class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			itemsPerPage: props.itemsPerPage || 0,
            currentPage: this.props.currentPage ? this.props.currentPage : 0,
            currentSort: {
                column: null,
                direction: this.props.defaultSortDescending ? -1 : 1
            },
			overflow: false,
            filter: ''
        };
		this.tbodyRef = false;
		this.updateScrollWidth = this.updateScrollWidth.bind(this);
        // Set the state of the current sort to the default sort
        if (props.sortBy !== false || props.defaultSort !== false) {
            let sortingColumn = props.sortBy || props.defaultSort;
            this.state.currentSort = this.getCurrentSort(sortingColumn);
        }
    }

    filterBy(filter) {
        this.setState({ filter: filter });
    }

    // Translate a user defined column array to hold column objects if strings are specified
    // (e.g. ['column1'] => [{key: 'column1', label: 'column1'}])
    translateColumnsArray(columns) {
        return columns.map(function(column, i) {
            if (typeof(column) === 'string') {
                return {
                    key:   column,
                    label: column
                };
            } else {
                if (typeof(column.sortable) !== 'undefined') {
                    let sortFunction = column.sortable === true ? 'default' : column.sortable;
                    this._sortable[column.key] = sortFunction;
                }

                return column;
            }
        }.bind(this));
    }

    parseChildData(props) {
        let data = [], tfoot;

        // Transform any children back to a data array
        if (typeof(props.children) !== 'undefined') {
            React.Children.forEach(props.children, function(child) {
                if (typeof(child) === 'undefined' || child === null) {
                    return;
                }

                switch (`${child.type}`) {
                    case `${Thead}`:
                    break;
                    case `${Tfoot}`:
                        if (typeof(tfoot) !== 'undefined') {
                            console.warn ('You can only have one <Tfoot>, but more than one was specified.' +
                                          'Ignoring all but the last one');
                        }
                        tfoot = child;
                    break;
                    case `${Tr}`:
                        let childData = child.props.data || {};

                        React.Children.forEach(child.props.children, function(descendant) {
                            // TODO
                            /* if (descendant.type.ConvenienceConstructor === Td) { */
                            if (
                                typeof(descendant) !== 'object' ||
                                descendant == null
                            ) {
                                return;
                            } else if (typeof(descendant.props.column) !== 'undefined') {
                                let value;

                                if (typeof(descendant.props.data) !== 'undefined') {
                                    value = descendant.props.data;
                                } else if (typeof(descendant.props.children) !== 'undefined') {
                                    value = descendant.props.children;
                                } else {
                                    console.warn('exports.Td specified without ' +
                                                 'a `data` property or children, ' +
                                                 'ignoring');
                                    return;
                                }

                                childData[descendant.props.column] = {
                                    value: value,
                                    props: filterPropsFrom(descendant.props),
                                    __reactableMeta: true
                                };
                            } else {
                                console.warn('exports.Td specified without a ' +
                                             '`column` property, ignoring');
                            }
                        });

                        data.push({
                            data: childData,
                            props: filterPropsFrom(child.props),
                            __reactableMeta: true
                        });
                    break;

                    default:
                        console.warn ('The only possible children of <Table> are <Thead>, <Tr>, ' +
                                      'or one <Tfoot>.');
                }
            }.bind(this));
        }

        return { data, tfoot };
    }

    initialize(props) {
        this.data = props.data || [];
        let { data, tfoot } = this.parseChildData(props);

        this.data = this.data.concat(data);
        this.tfoot = tfoot;

        this.initializeSorts(props);
        this.initializeFilters(props);
    }

    initializeFilters(props) {
        this._searchable = {};
        // Transform searchable properties into a more friendly list
        for (let i in props.searchable) {
            let column = props.searchable[i];
            let columnName, filterFunction;
	
			columnName = typeof(column) == 'string' ? column : (column.column || column.key);
			filterFunction = typeof(column.filterFunction) == 'function' ? column.filterFunction : 'default';
			
			this._searchable[columnName] = filterFunction;
        }
    }

    initializeSorts(props) {
        this._sortable = {};
        // Transform sortable properties into a more friendly list
        for (let i in props.sortable) {
            let column = props.sortable[i];
            let columnName, sortFunction;
			
			columnName = typeof(column) == 'string' ? column : (column.column || column.key);
			sortFunction = typeof(column.sortFunction) == 'function' ? column.sortFunction : 'default';
      
            this._sortable[columnName] = sortFunction;
        }
    }

    getCurrentSort(column) {
        let columnName, sortDirection;

        if (typeof column != "string") {
			columnName = typeof(column) == 'string' ? column : (column.column || column.key);

            if (typeof(column.direction) !== 'undefined') {
                if (column.direction === 1 || column.direction === 'asc') {
                    sortDirection = 1;
                } else if (column.direction === -1 || column.direction === 'desc') {
                    sortDirection = -1;
                } else {
                    let defaultDirection = this.props.defaultSortDescending ? 'descending' : 'ascending';

                    console.warn('Invalid default sort specified. Defaulting to ' + defaultDirection );
                    sortDirection = this.props.defaultSortDescending ? -1 : 1;
                }
            } else {
                sortDirection = this.props.defaultSortDescending ? -1 : 1;
            }
        } else {
            columnName      = column;
            sortDirection   = this.props.defaultSortDescending ? -1 : 1;
        }

        return {
            column: columnName,
            direction: sortDirection
        };
    }

    updateCurrentSort(sortBy) {
        if (sortBy !== false &&
            sortBy.column !== this.state.currentSort.column &&
                sortBy.direction !== this.state.currentSort.direction) {

            this.setState({ currentSort: this.getCurrentSort(sortBy) });
        }
    }

    updateCurrentPage(nextPage) {
        if (typeof(nextPage) !== 'undefined' && nextPage !== this.state.currentPage) {
            this.setState({ currentPage: nextPage});
        }
    }

    componentWillMount() {
        this.initialize(this.props);
        this.sortByCurrentSort();
        this.filterBy(this.props.filterBy);
    }
	updateScrollWidth(){
		if(this.tbodyRef){
			var el = this.tbodyRef;
			var overflow = (el.scrollHeight > el.clientHeight);
			console.log("Overflow: " + overflow.toString());
			if(overflow != this.state.overflow){
				this.setState({
					overflow: overflow
				});
				
			}
			
		}
	}
	componentDidMount(){
		this.updateScrollWidth();
	}
	componentDidUpdate(){
		this.updateScrollWidth();
	}
    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
        this.updateCurrentPage(nextProps.currentPage)
        this.updateCurrentSort(nextProps.sortBy);
        this.sortByCurrentSort();
        this.filterBy(nextProps.filterBy);
    }

    applyFilter(filter, children) {
        // Helper function to apply filter text to a list of table rows
        filter = filter.toLowerCase();
        let matchedChildren = [];

        for (let i = 0; i < children.length; i++) {
            let data = children[i].props.data;

            for (let filterColumn in this._searchable) {
                if (typeof(data[filterColumn]) !== 'undefined') {
                    // Default filter
                    if (typeof(this._searchable[filterColumn]) === 'undefined' || this._searchable[filterColumn]=== 'default') {
                        if (extractDataFrom(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1) {
                            matchedChildren.push(children[i]);
                            break;
                        }
                    } else {
                        // Apply custom filter
                        if (this._searchable[filterColumn](extractDataFrom(data, filterColumn).toString(), filter)) {
                            matchedChildren.push(children[i]);
                            break;
                        }
                    }
                }
            }
        }

        return matchedChildren;
    }
	
    sortByCurrentSort() {
        // Apply a sort function according to the current sort in the state.
        // This allows us to perform a default sort even on a non sortable column.
        let currentSort = this.state.currentSort;

        if (currentSort.column === null) {
            return;
        }

        this.data.sort(function(a, b){
            let keyA = extractDataFrom(a, currentSort.column);
            keyA = isUnsafe(keyA) ? keyA.toString() : keyA || '';
            let keyB = extractDataFrom(b, currentSort.column);
            keyB = isUnsafe(keyB) ? keyB.toString() : keyB || '';

            // Default sort
            if (
                typeof(this._sortable[currentSort.column]) === 'undefined' ||
                    this._sortable[currentSort.column] === 'default'
            ) {

                // Reverse direction if we're doing a reverse sort
                if (keyA < keyB) {
                    return -1 * currentSort.direction;
                }

                if (keyA > keyB) {
                    return 1 * currentSort.direction;
                }

                return 0;
            } else {
                // Reverse columns if we're doing a reverse sort
                if (currentSort.direction === 1) {
                    return this._sortable[currentSort.column](keyA, keyB);
                } else {
                    return this._sortable[currentSort.column](keyB, keyA);
                }
            }
        }.bind(this));
    }

    onSort(column) {
        // Don't perform sort on unsortable columns
        if (typeof(this._sortable[column]) === 'undefined') {
            return;
        }

        let currentSort = this.state.currentSort;

        if (currentSort.column === column) {
            currentSort.direction *= -1;
        } else {
            currentSort.column = column;
            currentSort.direction = this.props.defaultSortDescending ? -1 : 1;
        }

        // Set the current sort and pass it to the sort function
        this.setState({ currentSort: currentSort });
        this.sortByCurrentSort();

        if (typeof(this.props.onSort) === 'function') {
            this.props.onSort(currentSort);
        }
    }
	setItemsPerPage(num){
		return this.setState({
			itemsPerPage: num
		});
		
	}
	notEmpty(o){
		for(var i in o){
			return true;
		}
		return false;
	}
	parseRowColumns(columns,data){
		
		//Match data to columns and create array
		var rowColumns = [];
		var extraRowProps = {};
		for(var c=0;c < columns.length; c++){
			var column = columns[c];
			if (data.hasOwnProperty(column.key)) {
					
					var value = data[column.key];
					var props = {};
                    if (
                        typeof(value) !== 'undefined' &&
                            value !== null &&
                                value.__reactableMeta === true
                    ) {
                        props = value.props;
                        value = value.value;
                    }
					
					//Custom Render data function for cells
					var renderData = {
						value: value,
						showRow: true,
						props:props,
						rowProps: {},
						
					}
					if(column.cell && typeof column.cell.render == "function"){
						var customRenderData = column.cell.render(value,data) || {};
						renderData = {...renderData,...customRenderData};
					}
					
					if(renderData.rowProps && typeof renderData.rowProps == "object" && this.notEmpty(renderData.rowProps)){
						extraRowProps = renderData.rowProps;
					}
					
					
					if(!renderData.showRow){
						return false;
					}
					
					rowColumns[rowColumns.length] = {...column, renderData: renderData};
			}
			else{
				rowColumns[rowColumns.length] = false;
			}
		}
		
		return {rowColumns: rowColumns, rowProps: extraRowProps};
	}
	
    render() {
        let children = [];
        let columns;
        let userColumnsSpecified = false;
        let showHeaders = typeof this.props.hideTableHeader === 'undefined';

        let firstChild = null;


        if (this.props.children) {
            if (
                this.props.children.length > 0 &&
                this.props.children[0] &&
                this.props.children[0].type === Thead
            ) {
                firstChild = this.props.children[0]
            } else if (
                this.props.children.type === Thead
            ) {
                firstChild = this.props.children
            }
        }

        if (firstChild !== null) {
            columns = Thead.getColumns(firstChild);
        } else {
            columns = this.props.columns || [];
        }

        if (columns.length > 0) {
            userColumnsSpecified = true;
            columns = this.translateColumnsArray(columns);
        }

        // Build up table rows
        if (this.data && typeof this.data.map === 'function') {
            
			// Build up the columns array
            children = children.concat(this.data.map(function(rawData, i) {
                let data = rawData;
                let props = {};
                if (rawData.__reactableMeta === true) {
                    data = rawData.data;
                    props = rawData.props;
                }

                // Loop through the keys in each data row and build a td for it
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        // Update the columns array with the data's keys if columns were not
                        // already specified
                        if (userColumnsSpecified === false || this.props.findcolumns) {
                            let column = {
                                key:   k,
                                label: k,
								
                            };

                            // Only add a new column if it doesn't already exist in the columns array
                            if (
                                columns.find(function(element) {
                                return element.key === column.key;
                            }) === undefined
                            ) {
                                columns.push(column);
                            }
                        }
                    }
                }
				var parseRow = this.parseRowColumns.bind(this)(columns,data);
				
				if(!parseRow || !parseRow.rowColumns){
					return null;
				}
				
				var extraProps = parseRow.rowProps || {};
				props = {...props,...extraProps};

                return (
                    <Tr  {...props} columns={parseRow.rowColumns} key={i} data={data} />
                );
            }.bind(this)).filter(x => x));
        }
		
        if (this.props.sortable === true) {
            for (let i = 0; i < columns.length; i++) {
                this._sortable[columns[i].key] = 'default';
            }
        }

        // Determine if we render the filter box
        let filtering = false;
        if (
            this.props.searchable &&
                Array.isArray(this.props.searchable) &&
                    this.props.searchable.length > 0 &&
                        !this.props.hideFilterInput
        ) {
            filtering = true;
        }

        // Apply filters
        let filteredChildren = children;
        if (this.state.filter !== '') {
            filteredChildren = this.applyFilter(this.state.filter, filteredChildren);
        }

        // Determine pagination properties and which columns to display
        let itemsPerPage = this.state.itemsPerPage;
        let pagination = false;
        let numPages;
        let currentPage = this.state.currentPage;
        let pageButtonLimit = this.props.pageButtonLimit || 10;

        let currentChildren = filteredChildren;
        if (itemsPerPage > 0) {
            numPages = Math.ceil(filteredChildren.length / itemsPerPage);

            if (currentPage > numPages - 1) {
                currentPage = numPages - 1;
            }

            pagination = true;
            currentChildren = filteredChildren.slice(
                currentPage * itemsPerPage,
                (currentPage + 1) * itemsPerPage
            );
        }

        // Manually transfer props
        let props = filterPropsFrom(this.props);

        let noDataText = this.props.noDataText ? <tr className="reactable-no-data"><td colSpan={columns.length}>{this.props.noDataText}</td></tr> : null;

        var tableHeader = null;
        if (columns && columns.length > 0 && showHeaders) {
            tableHeader = (
                <Thead className={this.state.overflow ? 'doScroll' : ''} columns={columns}
                       filtering={filtering}
					   setItemsPerPage={this.setItemsPerPage.bind(this)}
					   totalItems={filteredChildren.length}
					   itemsPerPage={this.state.itemsPerPage}
                       onFilter={filter => {
                     this.setState({ filter: filter });
                     if (this.props.onSearch) {
                        this.props.onSearch(filter)
                     }
                 }}
                       filterPlaceholder={this.props.filterPlaceholder}
                       filterClassName={this.props.filterClassName}
                       currentFilter={this.state.filter}
                       sort={this.state.currentSort}
                       sortableColumns={this._sortable}
                       onSort={this.onSort.bind(this)}
                       key="thead"/>
            )
        }
		var tableChildren = currentChildren.length > 0 ? currentChildren : noDataText;
		var maxHeight = (typeof this.props.scrollable == "string") ? this.props.scrollable : "initial";
		
		var scrollBody = function(){
			try{
				var SimpleBar = require('simplebar-react').default;
				return(
				<SimpleBar style={{ maxHeight: 'inherit' }}>
					{tableChildren}
				</SimpleBar>)
			}
			catch(err){}
			return tableChildren;
				
		}();
		
        return <table  {...props} className={'reactablex' + ((props.className) ? (' ' + props.className) : '')}>
            {tableHeader}
            <tbody ref={instnace => this.tbodyRef = instnace} style={{ maxHeight: maxHeight }} className="reactable-data" key="tbody">
				{ (this.props.scrollable) ? scrollBody : tableChildren }
            </tbody>
            {pagination === true ?
             <Paginator colSpan={columns.length}
                 pageButtonLimit={pageButtonLimit}
                 numPages={numPages}
                 currentPage={currentPage}
				 itemsPerPage={this.state.itemsPerPage}
				 currentChildren={currentChildren.length}
				 totalItems={filteredChildren.length}
                 onPageChange={page => {
                     this.setState({ currentPage: page });
                     if (this.props.onPageChange) {
                        this.props.onPageChange(page)
                     }
                 }}
                 previousPageLabel={this.props.previousPageLabel}
                 nextPageLabel={this.props.nextPageLabel}
                 key="paginator"/>
             : null}
            {this.tfoot}
        </table>;
    }
}

Table.defaultProps = {
    sortBy: false,
    defaultSort: false,
    defaultSortDescending: false,
    itemsPerPage: 0,
    filterBy: '',
    hideFilterInput: false
};
