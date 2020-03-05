'use strict';

// Common rules for my project

function MainObject() {// Create a constructor for our MainObject and launch it
    this.begin();
}

MainObject.prototype.begin = function () { //Create a prototype for our future object MainObject
    this.polyfill();
    new SearchField();
    new Gamburger();
    new CatalogBanner(document.querySelector('.extraOff'));
    new FilterCatalog(document.querySelector('.formFilter'));
    new ProductOptions(document.querySelector('.listOptions'));
    new Switcher(document.querySelector('.tumbs'));
    new Bag(document.querySelector('.addToBag'));
    new GoToItem(document.querySelector('.rowArrivals'));
    if (window.localStorage && window.sessionStorage) {
        this.innerStorage();
    }
    new Shop(document.querySelector('.shoppingBag'));
};

MainObject.prototype.innerStorage = function () {
    this.localStorageCommonPrice = (localStorage.goodsPrice) ? `£ ${localStorage.goodsPrice}` : "";
    this.localStorageCountItems = (localStorage.goodsCounter) ? localStorage.goodsCounter : "";

    document.querySelector('.commonPrice').innerHTML = this.localStorageCommonPrice + '<span class="countItems"> ('+ this.localStorageCountItems +')</span>';
    return [this.localStorageCommonPrice, this.localStorageCountItems];
};

MainObject.prototype.polyfill = function () {
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
    if (!Element.prototype.closest) Element.prototype.closest = function (selector) {
        let el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
};

document.addEventListener('DOMContentLoaded',function() {
    new MainObject();
});//Create a main object after creating a function constructor with several prototypes

SearchField.prototype = Object.create(MainObject.prototype);//Create the prototypes for our constructors
Gamburger.prototype = Object.create(MainObject.prototype);
CatalogBanner.prototype = Object.create(MainObject.prototype);
FilterCatalog.prototype = Object.create(MainObject.prototype);
ProductOptions.prototype = Object.create(MainObject.prototype);
Switcher.prototype = Object.create(MainObject.prototype);
Bag.prototype = Object.create(MainObject.prototype);
GoToItem.prototype = Object.create(MainObject.prototype);
Shop.prototype = Object.create(MainObject.prototype);

window.addEventListener('resize', function(event){//Invoke this listener when
    // our size on the second page is change
    new CatalogBanner(document.querySelector('.extraOff'));
});



function SearchField() { //Function constructor SearchField
    this.searchButton = document.querySelector('.searchButton');
    this.searchButton.addEventListener('click',this.openSearch.bind(this));
}

function Gamburger () {//Function constructor Gamburger
    this.hamburger = document.querySelector('.mobileMenu');
    this.nav = document.querySelector('.nav');
    this.hamburger.addEventListener('click', this.openMenu.bind(this));
}

SearchField.prototype.openSearch = function () {
    document.querySelector('.search').classList.toggle('openSearch');
    document.querySelector('.searchForm').classList.toggle('display');
};

Gamburger.prototype.openMenu = function (e) {
    e.preventDefault();

    document.querySelector('.header').classList.toggle('openMenu');
    this.nav.classList.toggle('display');
};
// Common rules for my project

//Catalog js second page
function FilterCatalog (filter) {//Main constructor for our filter on the catalog.page

    if (!filter) return;

    this.filterForm = filter;
    this.tabletLabel = document.querySelector('.filterTablet');
    this.desktopSelects = document.querySelector('.desktopSelects');
    this.selectItems = document.querySelectorAll('.selectItem');
    this.options = this.filterForm.querySelectorAll('option');
    this.tabletLabel.addEventListener('click', this.openFilter.bind(this));

    this.ww = window.innerWidth;
    if (this.ww > 1024) {
        this.desktopToggle();
    } else {
        this.mobileSelectedOptions();
    }
}


function CatalogBanner (offer) {
    if (!offer) return;

    this.offer = offer;
    this.itemImg = document.querySelectorAll('.arrivalItem')[0];
    this.itemImg.style.cssText= 'margin-bottom:' + (this.offer.clientHeight + this.offer.clientHeight/4) + 'px;';
}

function GoToItem (items) {
    if (!items) return;
    this.items = items;
    this.items.addEventListener('click', this.goToDetailItem.bind(this));
}

FilterCatalog.prototype.openFilter = function () {
    this.desktopSelects.classList.toggle('mobileSelects');
};

document.addEventListener('mouseover', function(event) {
    let container = document.querySelector(".desktopSelects");
    if (!container) return;

    if (!container.contains(event.target)) {
        let items = container.querySelectorAll("select");
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("display");
        }
    }
});

FilterCatalog.prototype.openSelect = function (e) {
    let target = e && e.target || e.srcElement;

    if (target.parentNode.getAttribute('class') != 'selectLabel') return;

    target = target.parentNode.parentNode;
    for (let i = 0; i < this.selectItems.length; i++) {
        if (this.selectItems[i] != target) {
            this.selectItems[i].querySelector('select').classList.remove('display');
        }
    }

    target.querySelector('select').classList.add('display');

    let optionLength = target.querySelector('select').children.length;
    target.querySelector('select').setAttribute('size', optionLength);
};

FilterCatalog.prototype.desktopToggle = function () {
    this.desktopSelects.addEventListener('mouseover', this.openSelect.bind(this));

    for (let i = 0; i < this.options.length; i++) {
        this.options[i].closest('select').addEventListener('click', this.closeSelect.bind(this));
    }
};

FilterCatalog.prototype.closeSelect = function (e) {
    let target = e && e.target || e.srcElement;

    this.valueFilter = target.closest('.selectItem').querySelector('.valueFilter');
    this.nameFilter = target.closest('.selectItem').querySelector('.nameFilter');

    target.closest('select').classList.remove('display');

    let currentTarget = (target.tagName.toLowerCase() == 'select') ? target.options.selectedIndex : target;
    let optionVal = (currentTarget.value === 'notSelected') ?
        this.filterStyles('remove', '', currentTarget) :
        this.filterStyles('add', target.innerText, currentTarget);
    return optionVal;

};

FilterCatalog.prototype.filterStyles = function (method, value, option) {
    let firstItem = document.querySelector('.desktopSelects').firstElementChild;
    let lastItem = document.querySelector('.desktopSelects').lastElementChild;

    option.closest('.selectItem').classList[method]('selectedItem');
    this.nameFilter.classList[method]('nameFilterSmall');
    this.valueFilter.innerHTML = value;


    if (option.closest('.selectItem') === firstItem) {
        document.querySelector('.filter').classList[method]('firstSelected');
    }
    if (option.closest('.selectItem') === lastItem) {
        document.querySelector('.filter').classList[method]('lastSelected');
    }

};

FilterCatalog.prototype.mobileSelectedOptions = function () {
    this.filterTablet = document.querySelector('.filterTablet');

    for (let j = 0; j < this.selectItems.length; j++) {
        this.selectItems[j].querySelector('select').children[0].setAttribute('selected', 'selected');
        this.filterTablet.innerHTML +=  this.selectItems[j].querySelector('select').children[0].innerHTML + ',';
    }
};


GoToItem.prototype.goToDetailItem = function (e) {
    let target = e && e.target || e.srcElement;

    let item = target.closest('.arrivalItem').getAttribute('data-product');

    if (!item) return;

    document.location.href = 'item' + item + '.html';
    return item;
};
//Catalog.js second page

// item-details-page.js third page
function Bag (button) {
    if (!button) return;

    this.buttonAdd = button;
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.buttonAdd.addEventListener('click', this.addGoose.bind(this));
}

function Switcher(thumbnail) {
    if (!thumbnail) return;

    this.thumbnailBlock = thumbnail;
    this.fullImg = document.querySelector('.fullItem').querySelector('img');
    this.thumbnailBlock.addEventListener('click', this.doFullImg.bind(this));
}

function ProductOptions (list) {
    if (!list) return;

    this.options = document.querySelector('.rowOptionsProduct ');
    this.options.addEventListener('click', this.addClassToOption.bind(this));
}


Switcher.prototype.doFullImg = function (e) {
    let target = e && e.target || e.srcElement;

    if (!target.parentNode.querySelector('img')) return;
    this.fullImg.src = target.parentNode.querySelector('img').src;
};

ProductOptions.prototype.addClassToOption = function (e) {
    let target = e && e.target || e.srcElement;
    let listOption = target.parentNode;

    if (target.tagName.toLowerCase() != 'li') return;

    for (let i = 0; i < listOption.children.length; i++) {
        listOption.children[i].classList.remove('activeOption');
    }
    target.classList.add('activeOption');
};


Bag.prototype.addGoose = function (e) {
    e.preventDefault();

    let quantityOfGooses = 0;
    let price = 0;

    function getElements(select) {
        return document.querySelectorAll(select).length
    }

    function removeActionClass() {
        const radioList = document.querySelectorAll(".listOptions li");
        for (let i = 0; i < radioList.length; i++) {
            radioList[i].classList.remove("activeOption");
        }
    }

    if (getElements('.activeOption') === getElements('.listOptions')) {
        document.querySelector('.chooseOptions').classList.remove('display');
        setTimeout(function () {
            document.querySelector('.addedGoose').classList.remove('display');
        },4000);

        this.addCart(e);

        for (let key in this.cart) {
            quantityOfGooses++;
            price += +(this.cart[key].price.split('£')[1]*this.cart[key].qw);
        }

        localStorage.goodsCounter = quantityOfGooses;
        localStorage.goodsPrice = price.toFixed(2);

        document.querySelector('.commonPrice').innerHTML =
            `£ ${localStorage.goodsPrice}<span class="countItems"> (${localStorage.goodsCounter})</span>`;
        document.querySelector('.addedGoose').classList.add('display');
    } else {
        document.querySelector('.chooseOptions').classList.add('display');
    }

    removeActionClass();
};

Bag.prototype.addCart = function (e) {
    let productName = document.querySelector('.nameProduct').innerText,
        productPrice = document.querySelector('.priceItem').innerText,
        productSize = document.querySelector('.sizeOptions').querySelector('.activeOption').innerText,
        productColor = document.querySelector('.colorOptions').querySelector('.activeOption').innerText,
        id = document.querySelector('.nameProduct').getAttribute('data-nameProduct'),
        imgProduct = document.querySelector('.fullItem').querySelector('img').getAttribute('src'),
        uniqId = id + "-"+productColor + ' '+ productSize;
    uniqId = uniqId.replace(/\s/g, '-');

    if (this.cart[uniqId]) {
        this.cart[uniqId].qw += 1;
    } else {
        this.cart[uniqId] = {
            product: productName,
            price: productPrice,
            size: productSize,
            color: productColor,
            id: id,
            img: imgProduct,
            qw: 1
        };
    }

    localStorage.cart = JSON.stringify(this.cart);
};
//item-details-page.js third page

//shopping-bag.js fourth page
function Shop (shop) {
    if (!shop) return;
    this.shop = shop;
    this.buttonBuy = document.querySelector('.buyNow');
    this.totalCost = document.querySelector('.totalCost');
    this.emptyBag = document.querySelector('.emptyBag');
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.checkEmpty();
    let str = '';
    this.buttonBuy.addEventListener('click', this.buyGoose.bind(this));
    this.emptyBag.addEventListener('click', this.clearBag.bind(this, ''));
    this.totalSum();

    for (let key in this.cart) {
        str = this.createItem(this.cart[key], key);
        document.querySelector('.shopItems').insertAdjacentHTML('beforeEnd', str);
    }

    this.removeButton = document.querySelectorAll('.removeItem');

    for (let i = 0; i < this.removeButton.length; i++) {
        this.removeButton[i].addEventListener('click', this.removeItem.bind(this));
    }
}

Shop.prototype.createItem = function (item, key) {
    return (`<div class="shoppingBlock clearfix" data-block="${key}">
                <div class="shopImg">
                    <div class="shopImg-wrapper-photo">
                    <img src="${item.img}" alt="photo-product">
                    <div class="viewCover">
                        <p class="quickView">Edit item</p>
                    </div>
                    </div>
                    <p class="priceBag">${item.price}</p>
                </div>
                <div class="shopOptions">
                    <p class="titleProduct">
                        <a href="item1.html" class="productBag">${item.product}</a>
                    </p>
                    <p class="optionBag">Color: <span class="colorBag">${item.color}</span></p>
                    <p class="optionBag">Size: <span class="sizeBag">${item.size}</span></p>
                    <p class="optionBag count">Quantity:
                        <img data-count="minus" src="img/shopping-bag/minus.png" class="shopOptions-sign"></img>
                        <span class="quantityBag">${item.qw}</span>
                        <img data-count="plus" src="img/shopping-bag/plus.png" class="shopOptions-sign"></img>
                    </p>
                    <p class="removeItem">Remove Item</p>
                </div>
            </div>`);
};

Shop.prototype.buyGoose = function (e) {
    e.preventDefault();
    this.clearBag();
    document.querySelector('.shopItems').innerHTML = '<p class="thanks">Thank you for your purchase</p>';
    this.totalSum();
};

Shop.prototype.removeItem = function (e) {
    let target = e && e.target || e.srcElement,
        item = target.closest('.shoppingBlock'),
        data = item.getAttribute('data-block'),
        price = 0,
        quantityOfGooses = 0;

    item.parentNode.removeChild(item);
    delete this.cart[data];

    localStorage.cart = JSON.stringify(this.cart);

    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    for (let key in this.cart) {
        quantityOfGooses++;
        price += +this.cart[key].price.split('£')[1]*this.cart[key].qw;
    }

    localStorage.goodsCounter = quantityOfGooses;
    localStorage.goodsPrice = price;

    document.querySelector('.commonPrice').innerHTML = `£ ${localStorage.goodsPrice} <span class="countItems"> (${localStorage.goodsCounter})</span>`;

    this.checkEmpty();
    this.totalSum();
};


Shop.prototype.clearBag = function (param, e) {
    if (e) e.preventDefault();

    localStorage.clear();
    document.querySelector('.commonPrice').innerHTML = '(0)';

    if (param == '') {
        this.emptyInfo();
        this.totalSum();
    }
};

Shop.prototype.emptyInfo = function () {
    document.querySelector('.shopItems').innerHTML = '<p class="empty">Your shopping bag is empty. Use Catalog to add new items</p>';
};

Shop.prototype.checkEmpty = function () {
    if (localStorage.cart == '{}' ||localStorage.cart == undefined) {
        this.emptyInfo();
    }
};
Shop.prototype.totalSum = function () {
    this.totalCost.innerHTML = localStorage.goodsPrice ? ('£ ' + localStorage.goodsPrice) : '£ 0';
};
////shopping-bag.js fourth page