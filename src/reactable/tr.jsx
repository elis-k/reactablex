import React from 'react';
import { Td } from './td';
import { toArray } from './lib/to_array';
import { filterPropsFrom } from './lib/filter_props_from';

export class Tr extends React.Component {

	notEmpty(o){
		for(var i in o){
			return true;
		}
		return false;
	}
    render() {
        var children = toArray(React.Children.children(this.props.children));

        if (
            this.props.data &&
                this.props.columns &&
                    typeof this.props.columns.map === 'function'
        ) {
            if (typeof(children.concat) === 'undefined') { console.log(children); }
			
			
			
			children = children.concat(this.props.columns.map(((column,i)=>{
				if(column){
					return <Td {...column.renderData.props} column={column} value={this.props.data[column.key]} rowData={this.props.data} key={column.key}>{column.renderData.value}</Td>;
				}
				else{
					return <Td column={column} data={null} rowData={this.props.data} key={i} />;
				}
				
			}).bind(this)));
			
			
        }

        // Manually transfer props
        var props = filterPropsFrom(this.props);
		

        return React.createElement('tr', props, children);
    }
};

Tr.childNode = Td;
Tr.dataType = 'object';

