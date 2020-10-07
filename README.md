
# Reactablex

[![license](https://img.shields.io/github/license/elis-k/reactablex)](https://github.com/elis-k/reactablex/blob/master/LICENSE) 
[![npm](https://img.shields.io/npm/v/reactablex)](https://www.npmjs.com/package/reactablex)
[![npm](https://img.shields.io/npm/dw/reactablex)](https://www.npmjs.com/package/reactablex)

Simple, Flexible and customizable data tables for React.

## Quick Features

- Simple API
- Easy way to pass data, manipulate, handle events & customize 
- Responsive, it can fit to any size
- Search
- Sorting
- Pagination
- Scrolling with Fixed Head (plugin optional using [SimpleBar](https://github.com/Grsmto/simplebar))
- Minimal CSS Design, customizable

## Installation

### Using NPM

```sh
npm install reactablex
```

## Usage

**A good example:**

[![Edit exciting-babbage-jhiyj](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/exciting-babbage-jhiyj?fontsize=14&hidenavigation=1&theme=dark)


 **The most simple example:**

```jsx

import { Table } from "reactablex";
import "reactablex/lib/style.css";

ReactDOM.render(
    <Table data={[
        { Name: 'Griffin Smith', Age: 18 },
        { Age: 23,  Name: 'Lee Salminen' },
        { Age: 28, Position: 'Developer' },
    ]} />,
    document.getElementById('table')
);
```

While pretty basic, some people might need just this, some things you can notice:

- The columns can be parsed from data if not specified.
- The data array objects can be in any order, and you can omit any you like





## Quick Documentation
The data is just an array of objects
```jsx
var data = [
		{ username: 'claus', timestamp: 1600601211},
		{ username: 'amigo', timestamp: 1600601311},
		{ username: 'lol', timestamp: 1600601411},
		{ username: 'test', timestamp: 1600601511},
		{ username: 'bob', timestamp: 1600601611},
];
```

The columns is an array of objects where you can configure the options for the table.
Here are the available options:
```jsx
var columns = [{
	key: 'username', //Must match with a data object key (Required)
	label: 'Profile Username', //The column head label (Required)
	cell:{ // Options and Events for each cell (<td>) (Optional)
		/*
		* Customize cell & row options
		* Function is called for each cell
		*/
		render: (cellValue, rowData)=>{
			return {
				value: cellValue, //The cell value
				props:{}, //Pass custom props to cell element, ex.: className
				rowProps:{}, //Pass custom props to the whole row (<tr>) element
				showRow:true, //You can also hide the whole row
			}
		}
		//Handle events for each cell
		onClick: (event,cellValue,rowData)=>{},
		onMouseOver: (event,cellValue,rowData)=>{},
		onMouseDown: (event,cellValue,rowData)=>{},
		onKeyDown:(event,cellValue,rowData)=>{},
		onKeyUp:(event,cellValue,rowData)=>{}
	}
	head:{ //Options for the column head (Optional)
		render: (label) => {
			return{
				value: label,
				props:{},
				rowProps: {}
			}
		}
		onClick: (event,cellValue,rowData)=>{},
		onMouseOver: (event,cellValue,rowData)=>{},
		onMouseDown: (event,cellValue,rowData)=>{},
		onKeyDown:(event,cellValue,rowData)=>{},
		onKeyUp:(event,cellValue,rowData)=>{}
	}
	
},
{
	key: 'timestamp',
	label: 'Date Added',
	cell: {
		render: (timestamp)=>{
			return {
				value: new Date(timestamp).getDateString()
			}
		}
    }
}
];
```

You can also pass data extra rows as children of Table component:

```jsx
import { Table, Tr, Td } from "reactablex";

ReactDOM.render(
    <Table className="table" id="table">
        <Tr>
            <Td column="Name" data="Griffin Smith">
                <b>Griffin Smith</b>
            </Td>
            <Td column="Age">18</Td>
        </Tr>
        <Tr>
            <Td column="Name">Lee Salminen</Td>
            <Td column="Age">23</Td>
        </Tr>
        <Tr>
            <Td column="Position">Developer</Td>
            <Td column="Age">28</Td>
        </Tr>
    </Table>,
    document.getElementById('table')
);
```

### Table Component Options

```jsx
<Table 
	data={data} 
	columns={columns} 
	
	itemsPerPage={10}
	pageButtonLimit={5} 
	noDataText="No users found." 
	sortable={['username','timestamp']}
	searchable={['username']}
	findcolumns
	scrollable='500px'
 />
```

**Pagination**
 - You can enable pagination by specifying `itemsPerPage` Enable  by limiting the entries per page.  Include an optional `pageButtonLimit` prop to
customize the number of page buttons in the pagination, which defaults to 10.

**Sorting**
- To enable sorting on all columns, just specify `sortable={true}` or you can pass an array to `sortable`,
which contains column keys (or column objects in case of custom sorting function)

The  default sorting function does a good job, but if you want to specify a custom sort function, use the following structure for the column
object:

```jsx

{column: 'Column Name', sortFunction: function(a, b){
    return a > b ? 1 : -1;
}}
```
**Searching**
- To enable searching  specify `searchable` prop with an array of column keys that can be searched.

**Scrolling**
- To enable scrolling  specify `scrollable` prop with a string of max-height, i.e `scrollable='500px'` , and you should install the [SimpleBar](https://github.com/Grsmto/simplebar/tree/master/packages/simplebar-react) dependency.


**Empty Data**
- Use `noDataText` prop to set the text to show when no entries are found .


**More Events**

 - `onSort`  Called when the sorting in the table changes. This handler
   will be passed an object that contains the column name that is being
   sorted by, and the direction it is being sorted.
   
 -  `onSearch` Called every time the filtering changes. This handler will
   be passed a string containing the text that's being used for
   filtering.
   
 -  `onPageChange` Called every time the page changes. This handler will
   be passed a number representing the current page, zero based.

**Auto Parse Columns**
- Just add the prop `findcolumns` to parse the column labels & keys from the data object.

By default the columns will not be parsed if you have specified a column array. This option might be useful in case you want to customize a column and just parse the rest of column labels from data.

*Note*: This library is based on the [Reactable](https://github.com/glittershark/reactable) library.
