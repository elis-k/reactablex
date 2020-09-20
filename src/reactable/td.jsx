import React from 'react';
import { isReactComponent } from './lib/is_react_component';
import { stringable } from './lib/stringable';
import { isUnsafe } from './unsafe';
import { filterPropsFrom } from './lib/filter_props_from';

export class Td extends React.Component {
    stringifyIfNotReactComponent(object) {
      if(!isReactComponent(object) && stringable(object) && typeof(object) !== 'undefined') {
        return object.toString()
      }
      return null;
    }
	
    render() {
        var mergedProps = filterPropsFrom(this.props,['key','label','cell','head','data','rowData','value']);
		var bindIdEvents = ['onClick','onMouseOver','onMouseDown','onKeyDown','onKeyUp'];
		
		//Add events to props
		if(typeof this.props.column.cell == "object"){
			for (var key in this.props.column.cell) {
					if(typeof this.props.column.cell[key] == "function" && bindIdEvents.includes(key)){
						mergedProps[key] = this.props.column.cell[key];
					}
			}
		}
			
		//Bind the cell & row arguments to event functions
		for(var b=0; b < bindIdEvents.length; b++){
			var bEvent = bindIdEvents[b];
			if(mergedProps[bEvent]){
				var originalMerged = mergedProps[bEvent];
				mergedProps[bEvent] = (function(value,row,e){
					return originalMerged.apply(null,[e,value,row]);
				}).bind(null,this.props.value,this.props.rowData);
			}
			
		}
        
        var stringifiedChildProps;

        if (typeof(this.props.value) === 'undefined') {
          stringifiedChildProps = this.stringifyIfNotReactComponent(this.props.children)
        }

        if (isUnsafe(this.props.children)) {
            return <td {...mergedProps}
                dangerouslySetInnerHTML={{__html: this.props.children.toString()}}/>
        } else {
          return <td {...mergedProps}>
                {stringifiedChildProps || this.props.children}
            </td>;
        }
    }
};
