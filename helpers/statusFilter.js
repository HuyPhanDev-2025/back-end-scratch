module.exports = (query) => {
    let statusFilter = [
        {
            name: "Tất cả",
            status: "",
            class: "",
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "",
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: "",
        },
    ];

    // console.log(req.query.status);
    if (query.status) {
        const index = statusFilter.findIndex(
            (item) => item.status == query.status
        );
        statusFilter[index].class = "active";
    } else {
        const index = statusFilter.findIndex((item) => item.status == "");
        statusFilter[index].class = "active";
    }

    // console.log(statusFilter);

    return statusFilter;
};
