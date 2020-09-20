import React from 'react';

function pageHref(num) {
    return `#page-${num + 1}`
}

export class Paginator extends React.Component {
    handlePrevious(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage + 1);
    }

    handlePageButton(page, e) {
        e.preventDefault();
        this.props.onPageChange(page);
    }

    renderPrevious() {
        if(this.props.currentPage > 0) {
            return <a className='reactable-previous-page'
                      href={pageHref(this.props.currentPage - 1)}
                      onClick={this.handlePrevious.bind(this)}>
                        {this.props.previousPageLabel || <span className="chevron left"></span>}
                   </a>
        }
    }

    renderNext() {
        if(this.props.currentPage < this.props.numPages - 1) {
            return <a className='reactable-next-page'
                      href={pageHref(this.props.currentPage + 1)}
                      onClick={this.handleNext.bind(this)}>
                      {this.props.nextPageLabel || <span className="chevron right"></span>}
                   </a>
        }
    }

    renderPageButton(className, pageNum) {

        return <a className={className}
                  key={pageNum}
                  href={pageHref(pageNum)}
                  onClick={this.handlePageButton.bind(this, pageNum)}>
                  {pageNum + 1}
              </a>
    }

    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Paginator');
        }

        if (typeof this.props.numPages === 'undefined') {
            throw new TypeError('Must pass a non-zero numPages argument to Paginator');
        }

        if (typeof this.props.currentPage === 'undefined') {
            throw new TypeError('Must pass a currentPage argument to Paginator');
        }

        let pageButtons = [];
        
		let {itemsPerPage, totalItems,currentChildren,pageButtonLimit, currentPage, numPages} = this.props;
        let lowerHalf = Math.round( pageButtonLimit / 2 );
        let upperHalf = (pageButtonLimit - lowerHalf);

		
		
		var currentPageEnd = (((currentPage + 1) * itemsPerPage) - itemsPerPage + currentChildren);
		var currentPageStart = (currentPageEnd - currentChildren + 1 );
		var showingInfo = (itemsPerPage == 0) ? `Showing ${totalItems} entries` :  (totalItems == 0 ? '' : `Showing ${currentPageStart} to ${currentPageEnd} of ${totalItems} entries`);
		
	
        for (let i = 0; i < this.props.numPages; i++) {
            let showPageButton = false;
            let pageNum = i;
            let className = "reactable-page-button";
            if (currentPage === i) {
                className += " reactable-current-page";
            }
            pageButtons.push( this.renderPageButton(className, pageNum));
        }

        if(currentPage - pageButtonLimit + lowerHalf > 0) {
            if(currentPage > numPages - lowerHalf) {
                pageButtons.splice(0, numPages - pageButtonLimit)
            } else {
                pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf);
            }
        }

        if((numPages - currentPage) > upperHalf) {
            pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit);
        }
		if(pageButtons.length == 0){
			return null;
		}
        return (
            <tbody className="reactable-pagination">
                <tr>
                    <td colSpan={this.props.colSpan}>
						<div className="pagination-container">
							<div className="pagination-info">
								<span>{showingInfo}</span>
							</div>
							<div className="pagination-buttons">
								{this.renderPrevious()}
								{pageButtons}
								{this.renderNext()}
							</div>
						</div>
                    </td>
                </tr>
            </tbody>
        );
    }
};

