import React from "react";
import './paginationcss.css';

const Pagination = ({
    currentPage,
    setCurrentPage,
    totalPages
}) => {

    const maxVisiblePages = 5;

    let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
    );

    let endPage = startPage + maxVisiblePages - 1;

    // FIX OVERFLOW
    if (endPage > totalPages) {

        endPage = totalPages;

        startPage = Math.max(
            1,
            endPage - maxVisiblePages + 1
        );

    }

    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (

        <div className="pagination-container">

            <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() =>
                    setCurrentPage(currentPage - 1)
                }
            >
                Previous
            </button>

            <div className="pagination-pages">

                {pages.map((page) => (

                    <button
                        key={page}
                        className={`pagination-button ${
                            currentPage === page
                                ? "active-page"
                                : ""
                        }`}
                        onClick={() =>
                            setCurrentPage(page)
                        }
                    >
                        {page}
                    </button>

                ))}

            </div>

            <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() =>
                    setCurrentPage(currentPage + 1)
                }
            >
                Next
            </button>

        </div>

    );

}

export default Pagination;