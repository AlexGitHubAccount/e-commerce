'use strict';
// File App.js
function App() {
    this.init();
}

document.addEventListener('DOMContentLoaded',function() {
    new App();
});

App.prototype.init = function () {
    this.polyfillClosest();
    new Search();
    new Menu();
    new OfferBanner(document.querySelector('.extraOff'));
    new Filter(document.querySelector('.formFilter'));
    new ProductOptions(document.querySelector('.listOptions'));
    new Thumbnail(document.querySelector('.tumbs'));
    new Bag(document.querySelector('.addToBag'));
    new GoToItem(document.querySelector('.rowArrivals'));
    if (window.localStorage && window.sessionStorage) {
        this.storage();
    }
    new Shop(document.querySelector('.shoppingBag'));
};

App.prototype.storage = function () {
    this.localStorageCommonPrice = (localStorage.commonPrice) ? `£ ${localStorage.commonPrice}` : "";
    this.localStorageCountItems = (localStorage.countItems) ? localStorage.countItems : "";

    document.querySelector('.commonPrice').innerHTML = this.localStorageCommonPrice + '<span class="countItems"> ('+ this.localStorageCountItems +')</span>';
    return [this.localStorageCommonPrice, this.localStorageCountItems];
};

App.prototype.polyfillClosest = function () {
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

Search.prototype = Object.create(App.prototype);//Create an prototype for an object Search
//  (for tag input) which located in the header
Menu.prototype = Object.create(App.prototype);
OfferBanner.prototype = Object.create(App.prototype);
Filter.prototype = Object.create(App.prototype);
ProductOptions.prototype = Object.create(App.prototype);
Thumbnail.prototype = Object.create(App.prototype);
Bag.prototype = Object.create(App.prototype);
GoToItem.prototype = Object.create(App.prototype);
Shop.prototype = Object.create(App.prototype);

window.addEventListener('resize', function(event){
    new OfferBanner(document.querySelector('.extraOff'));
});
// File App.js

//main.js
function Search() {
    this.searchButton = document.querySelector('.searchButton');
    this.searchButton.addEventListener('click',this.openSearch.bind(this)
    );
}

function Menu () {
    this.hamburger = document.querySelector('.mobileMenu');
    this.nav = document.querySelector('.nav');
    this.hamburger.addEventListener('click', this.openMenu.bind(this));
}


Search.prototype.openSearch = function () {
    document.querySelector('.search').classList.toggle('openSearch');
    document.querySelector('.searchForm').classList.toggle('display');
};

Menu.prototype.openMenu = function (e) {
    e.preventDefault();

    document.querySelector('.header').classList.toggle('openMenu');
    this.nav.classList.toggle('display');
};
//main.js

//Catalog js
function Filter (filter) {

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


function OfferBanner (offer) {
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


Filter.prototype.openFilter = function () {
    this.desktopSelects.classList.toggle('mobileSelects');
};

document.onmouseover = function(event) {
    let container = document.querySelector(".desktopSelects");
    if (!container) return;

    if (!container.contains(event.target)) {
        let items = container.querySelectorAll("select");
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("display");
        }
    }
};

Filter.prototype.openSelect = function (e) {
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

Filter.prototype.desktopToggle = function () {
    this.desktopSelects.addEventListener('mouseover', this.openSelect.bind(this));

    for (let i = 0; i < this.options.length; i++) {
        this.options[i].closest('select').addEventListener('click', this.closeSelect.bind(this));
    }
};

Filter.prototype.closeSelect = function (e) {
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

Filter.prototype.filterStyles = function (method, value, option) {
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

Filter.prototype.mobileSelectedOptions = function () {
    this.filterTablet = document.querySelector('.filterTablet');

    for (var j = 0; j < this.selectItems.length; j++) {
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
//Catalog.js

// item details js
function Bag (button) {
    if (!button) return;

    this.buttonAdd = button;
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.buttonAdd.addEventListener('click', this.addGoose.bind(this));
}

function Thumbnail(thumbnail) {
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


Thumbnail.prototype.doFullImg = function (e) {
    var target = e && e.target || e.srcElement;

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

        localStorage.countItems = quantityOfGooses;
        localStorage.commonPrice = price.toFixed(2);

        document.querySelector('.commonPrice').innerHTML =
            `£ ${localStorage.commonPrice}<span class="countItems"> (${localStorage.countItems})</span>`;
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

    let obj = JSON.stringify(this.cart);
    localStorage.cart = obj;
};
// item details js

//shop js
function Shop (shop) {
    if (!shop) return;

    this.shop = shop;
    this.buttonBuy = document.querySelector('.buyNow');
    this.totalCost = document.querySelector('.totalCost');
    this.emptyBag = document.querySelector('.emptyBag');
    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    this.checkEmpty();
    var str = '';
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
                    <img src="${item.img}" alt="">
                    <p class="priceBag">${item.price}</p>
                </div>
                <div class="shopOptions">
                    <p class="titleProduct">
                        <a href="item1.html" class="productBag">${item.product}</a>
                    </p>
                    <p class="optionBag">Color: <span class="colorBag">${item.color}</span></p>
                    <p class="optionBag">Size: <span class="sizeBag">${item.size}</span></p>
                    <p class="optionBag">Quantity: 
                        <img src="img/shopping-bag/minus.png" class="shopOptions-sign"></img>
                        <span class="quantityBag">${item.qw}</span>
                        <img src="img/shopping-bag/plus.png" class="shopOptions-sign"></img>
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

    let object = JSON.stringify(this.cart);
    localStorage.cart = object;

    this.cart =  (localStorage.cart) ? JSON.parse(localStorage.cart) : {};
    for (let key in this.cart) {
        quantityOfGooses++;
        price += +this.cart[key].price.split('£')[1]*this.cart[key].qw;
    }

    localStorage.countItems = quantityOfGooses;
    localStorage.commonPrice = price;

    document.querySelector('.commonPrice').innerHTML = `£ ${localStorage.commonPrice} <span class="countItems"> (${localStorage.countItems})</span>`;

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
    this.totalCost.innerHTML = localStorage.commonPrice ? ('£ ' + localStorage.commonPrice) : '£ 0';
};
//shop js



