import React from 'react';
import { Th } from './th';
import { Filterer } from './filterer';
import { filterPropsFrom } from './lib/filter_props_from';

export class Thead extends React.Component {
    static getColumns(component) {
        // Can't use React.Children.map since that doesn't return a proper array
        let columns = [];
        React.Children.forEach(component.props.children, th => {
            var column = {};
            if (!th) return;
            if (typeof th.props !== 'undefined') {
                column.props = filterPropsFrom(th.props);

                // use the content as the label & key
                if (typeof th.props.children !== 'undefined') {
                    column.label = th.props.children;
                    column.key = column.label;
                }

                // the key in the column attribute supersedes the one defined previously
                if (typeof th.props.column === 'string') {
                    column.key = th.props.column;

                    // in case we don't have a label yet
                    if (typeof column.label === 'undefined') {
                        column.label = column.key;
                    }
                }
            }

            if (typeof column.key === 'undefined') {
                throw new TypeError(
                    '<th> must have either a "column" property or a string ' +
                    'child');
            } else {
                columns.push(column);
            }
        });

        return columns;
    }

    handleClickTh(column,e) {
        this.props.onSort(column.key);
		var extraOnClick = column.head && column.head.onClick || column.props.onClick;
		if(typeof extraOnClick == "function"){
			return extraOnClick(e,column);
		}
    }

    handleKeyDownTh(column, event) {
      if (event.keyCode === 13) {
        this.props.onSort(column.key);
      }
    }

    render() {
        // Declare the list of Ths
        var Ths = [];
		var extraRowProps = {};
        for (var index = 0; index < this.props.columns.length; index++) {
            var column = this.props.columns[index];
            var thClass = `reactable-th-${column.key.replace(/\s+/g, '-').toLowerCase()}`;
            var sortClass = '';
            var thRole = null;
			var value = column.label;
			column.props = column.props || {};
			
            if (this.props.sortableColumns[column.key]) {
                sortClass += 'reactable-header-sortable ';
                thRole = 'button';
            }

            if (this.props.sort.column === column.key) {
                sortClass += 'reactable-header-sort';
                if (this.props.sort.direction === 1) {
                    sortClass += '-asc';
                }
                else {
                    sortClass += '-desc';
                }
            }

            if (sortClass.length > 0) {
              thClass += ` ${sortClass}`;
            }
			
			
			//Custom Render data function for head ths
			var renderData = {
				value: value,
				props:{},
				rowProps: {}
			}
			if(column.head && typeof column.head.render == "function"){
				var customRenderData = column.head.render(value,this.props.columns) || {};
				renderData = {...renderData,...customRenderData};
			}
			extraRowProps = renderData.rowProps;
			column.props = {...column.props,...renderData.props};
			
            if (
                typeof(column.props) === 'object' &&
                typeof(column.props.className) === 'string'
            ) {
                thClass += ` ${column.props.className}`;
            }
			
		
			
            Ths.push(
                <Th {...column.props}
                    className={thClass}
                    key={index}
                    onClick={this.handleClickTh.bind(this, column)}
                    onKeyDown={this.handleKeyDownTh.bind(this, column)}
                    role={thRole}
                    tabIndex="0">
                    {renderData.value}
                </Th>
            );
        }
		
		var showPages = (function(){
		
			var optionsToShow = [10,20,30,40,50,100];
			var setItemsPerPage = this.props.setItemsPerPage;
			var totalItems = this.props.totalItems;
			var itemsPerPage = this.props.itemsPerPage;
			return (<div className="reactable-show">
									<span>Show</span>
									<select value={itemsPerPage} onChange={(e) => {
										setItemsPerPage(e.target.value);
									}}>
										{optionsToShow.map((optionNum,i)=>{
											
											if((optionNum - totalItems) > 9){
												return null;
											}
											return <option value={optionNum} key={i}>{optionNum}</option>
											}).filter(x => x)
										}
										<option value={0}>All</option>
									</select>
								</div>);
								
		}).bind(this)();
		var actions= (<div className="reactable-head-options">
										<svg version="1.1" id="reactable_more_icon" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 384 384" style={{"enableBackground":"new 0 0 384 384"}} space="preserve"> <g> <g> <circle cx="192" cy="42.667" r="42.667"/> </g> </g> <g> <g> <circle cx="192" cy="192" r="42.667"/> </g> </g> <g> <g> <circle cx="192" cy="341.333" r="42.667"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>
										
									</div>);
									
        // Manually transfer props
        var props = filterPropsFrom(this.props);

        return (
            <thead {...props}>
                {this.props.filtering === true ?
                <tr className="reactable-filterer">
						<td colSpan={this.props.columns.length}>
							<div className="reactable-head-block">
								{showPages}
								<div className="reactable-head-block-left">
									<Filterer
										colSpan={this.props.columns.length}
										onFilter={this.props.onFilter}
										placeholder={this.props.filterPlaceholder}
										value={this.props.currentFilter}
										className={this.props.filterClassName}
									/>
									{actions}
								</div>
							</div>
						</td>
					
				</tr>
				: null}
                <tr {...extraRowProps} className="reactable-column-header">{Ths}</tr>
            </thead>
        );
    }
};
