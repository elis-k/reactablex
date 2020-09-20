import React from 'react';
import ReactDOM from 'react-dom';

export class FiltererInput extends React.Component {
    onChange(e) {
		var value = e.currentTarget.value;
        this.props.onFilter(value);
    }

    render() {
        return (
		<div className='reactable-filterer-icon'>
			<svg version="1.1" id="reactable-filterer-search-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 192.904 192.904" style={{enableBackground:"new 0 0 192.904 192.904"}} ><path d="M190.707,180.101l-47.078-47.077c11.702-14.072,18.752-32.142,18.752-51.831C162.381,36.423,125.959,0,81.191,0C36.422,0,0,36.423,0,81.193c0,44.767,36.422,81.187,81.191,81.187c19.688,0,37.759-7.049,51.831-18.751l47.079,47.078c1.464,1.465,3.384,2.197,5.303,2.197c1.919,0,3.839-0.732,5.304-2.197C193.637,187.778,193.637,183.03,190.707,180.101z M15,81.193C15,44.694,44.693,15,81.191,15c36.497,0,66.189,29.694,66.189,66.193c0,36.496-29.692,66.187-66.189,66.187C44.693,147.38,15,117.689,15,81.193z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
            <input type="text"
                className={this.props.className}
                placeholder={this.props.placeholder}
                value={this.props.value}
                onKeyUp={this.onChange.bind(this)}
                onChange={this.onChange.bind(this)} />
		</div>
        );
    }
};

export class Filterer extends React.Component {
    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Filterer');
        }

        return (
           
                    <FiltererInput onFilter={this.props.onFilter}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        className={this.props.className ? 'reactable-filter-input ' + this.props.className : 'reactable-filter-input'} />
               
           
        );
    }
};

