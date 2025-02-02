module.exports = (objectPagination, query, totalInfo) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const totalPage = Math.ceil(totalInfo / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;

    return objectPagination;
};
