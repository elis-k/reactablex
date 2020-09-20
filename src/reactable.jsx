import React from 'react';
import { Table } from './reactable/table.jsx';
import { Tr } from './reactable/tr.jsx';
import { Td } from './reactable/td.jsx';
import { Th } from './reactable/th.jsx';
import { Tfoot } from './reactable/tfoot.jsx';
import { Thead } from './reactable/thead.jsx';
import { Sort } from './reactable/sort.jsx';
import { unsafe } from './reactable/unsafe.jsx';

React.Children.children = function(children) {
    return React.Children.map(children, function(x) { return x; }) || [];
};

// Array.prototype.find polyfill - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;
            for (var i = 0; i < length; i++) {
                if (i in list) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
            }
            return undefined;
        }
    });
}

const Reactablex = { Table, Tr, Td, Th, Tfoot, Thead, Sort, unsafe };

export { Table, Tr, Td, Th, Tfoot, Thead, Sort, unsafe };

if(typeof(window) !== 'undefined') { window.Reactablex = Reactablex; }
