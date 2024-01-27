export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {

    if (totalPages <= 7) {
        // [1,2,3,4,5,6,7]
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        // [1,2,3,'...', 49, 50]
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}