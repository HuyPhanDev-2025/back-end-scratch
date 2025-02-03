// Button Status
const buttonStatus = document.querySelectorAll(`[button-status]`);
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}

// End Button Status

// Form Search
const searchForm = document.querySelector("#form-search");
if (searchForm) {
    let url = new URL(window.location.href);

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url;
    });
}

// End Form Search

// ======= Pagination =======
const buttonPagination = document.querySelectorAll(`[button-pagination]`);
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url;
        });
    });
}

// ======= End Pagination =======

// ======= Checkbox Multi =======
const checkboxMulti = document.querySelector(`[checkbox-multi]`);
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector(`input[name='checkall']`);
    const inputsId = checkboxMulti.querySelectorAll(`input[name="id"]`);

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach((input) => {
                input.checked = true;
            });
        } else {
            inputsId.forEach((input) => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                `input[name="id"]:checked`
            ).length;

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}

// ======= End Checkbox Multi =======

// ======= Form Change Multi =======
const formChangeMulti = document.querySelector(`[form-change-multi]`);
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector(`[checkbox-multi]`);

        const inputChecked = checkboxMulti.querySelectorAll(
            `input[name="id"]:checked`
        );

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm(
                `Bạn có chắc muốn xóa những sản phẩm này?`
            );

            if (!isConfirm) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector(`input[name="ids"]`);

            inputChecked.forEach((input) => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector(`input[name="position"]`).value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Please choose at least 1 record");
        }
    });
}

// ======= End Form Change Multi =======

// ======= Show Alert =======
const showAlert = document.querySelector(`div[show-alert]`);
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));

    const closeAlert = showAlert.querySelector(`[close-alert]`);

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

// ======= End Show Alert =======

// ======= Upload Image =======
const uploadImage = document.querySelector(`[upload-image]`);
if (uploadImage) {
    const uploadImageInput = document.querySelector(`[upload-image-input]`);
    const uploadImagePreview = document.querySelector(`[upload-image-preview]`);

    uploadImageInput.addEventListener("change", (e) => {
        const [file] = uploadImageInput.files;
        if (file) {
            const closeImagePreview =
                uploadImage.querySelector(`.close-image-preview`);

            uploadImagePreview.src = URL.createObjectURL(file);

            // Close Preview
            closeImagePreview.addEventListener("click", () => {
                uploadImagePreview.src = "";
                uploadImageInput.value = "";
            });
        }
    });
}

// ======= End Upload Image =======

// ======= Sort =======
const sort = document.querySelector(`[sort]`);
if (sort) {
    const sortSelect = sort.querySelector(`[sort-select]`);
    const sortClear = sort.querySelector(`[sort-clear]`);
    let url = new URL(window.location.href);

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
        }

        window.location.href = url;
    });

    // Clear Sorting
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url;
    });

    // Add selected for sort
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(
            `option[value=${stringSort}]`
        );
        optionSelected.selected = true;
    }
}

// ======= End Sort =======
