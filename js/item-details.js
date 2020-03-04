//Add information from the catalog.js to the block of page item-details-page
(function () {
    const itemProduct = document.getElementById("itemProduct");

    const getCatalog = () => {
        const catalogArray = catalog;
        const id = itemProduct.getAttribute("data-id");

        let currentItem = catalogArray.filter(item => item.id === id);

        return function () {
            document.getElementById("title").innerText = currentItem[0].title;
            document.getElementsByClassName("descProduct")[0].innerText = currentItem[0].description;
            document.getElementsByClassName("descProduct")[1].innerText = currentItem[0].description;
            document.getElementById("price").innerText = currentItem[0].discountedPrice;
        }
    };
    if (itemProduct) getCatalog()();
})();
