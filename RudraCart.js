/**
 * Created by Dan on 14.01.2017.
 */

;'use strict';

var cartModule = (function () { // namespace

    var cart = {
        addAllEvents : function () { // Добавляем все события
            let itemBox = document.getElementsByClassName('item');

            for(var i = 0; i < itemBox.length; i++){
                this.addEvent(itemBox[i].querySelector('.add_item'), 'click', this.addToCart);
                this.addEvent(itemBox[i].querySelector('.decrement'), 'click', function () {
                    if (this.parentNode.querySelector('.count').innerHTML > 1) {
                        this.parentNode.querySelector('.count').innerHTML--;
                    }
                });
                this.addEvent(itemBox[i].querySelector('.increment'), 'click', function () {
                    this.parentNode.querySelector('.count').innerHTML++;
                });
            }
            this.addEvent(document.getElementById('checkout'), 'click', this.openCart);
        },

        addEvent : function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, handler)
            } else {
                element['on' + type] = handler;
            }
        },

        getCartData : function () { // Получаем данные корзины из localStorage
            return JSON.parse(localStorage.getItem('RudraJS-Cart'));
        },

        setCartData : function (key) { // Добавляем данные корзины в localStorage
            localStorage.setItem('RudraJS-Cart', JSON.stringify(key));
        },

        addToCart : function () { // Добавляем товар в корзину
            let item = {
                id       : parseInt(this.getAttribute('data-id')),
                title    : this.getAttribute('data-title'),
                price    : parseInt(this.getAttribute('data-price')),
                quantity : parseInt(this.parentNode.parentNode.querySelector('.count').innerHTML),
                apiece   : parseInt(this.getAttribute('data-price'))
            };

            let data = cart.getCartData() || {};

            if(data.hasOwnProperty(item.id)){ // если такой товар есть, то + 1 к количеству
                localStorage.setItem('RudraJS-Cart::count', item.quantity + parseInt(localStorage.getItem('RudraJS-Cart::count'))); // Увеличиваем общее число товаров в корзине
                data[item.id][3]  = item.quantity + data[item.id][3]; // Увеличиваем число товара в корзине
                data[item.id][2]  = item.price * data[item.id][3]; // Увеличиваем цену
            } else { // если товара в корзине еще нет, то добавляем в объект
                localStorage.setItem('RudraJS-Cart::count', item.quantity + parseInt(localStorage.getItem('RudraJS-Cart::count')));
                item.price     = item.price * item.quantity;
                data[item.id]  = [item.id, item.title, item.price, item.quantity, item.apiece];
            }

            cart.setCartData(data);
            cart.getContent().innerHTML  = '';
            cart.getCheckout().innerHTML = 'Товар добавлен';
            setTimeout(function(){
                cart.getCheckout().innerHTML = 'Корзина <sup>' + parseInt(localStorage.getItem('RudraJS-Cart::count')) + '</sup>';
            }, 1000);
        },

        openCart : function () {
            let data = cart.getCartData() || {};

            if(Object.keys(data).length !== 0){
                let count = 0;
                let price = 0;
                let item  = '';

                for(let items in data){

                    price = price + parseInt(data[items][2]);
                    count = count + parseInt(data[items][3]);

                    item += '<tr class="quantity" data-id="' + data[items][0] + '">'
                         + '<td class="id">' + data[items][0] + '</td>'
                         + '<td class="title">' + data[items][1] + '</td>'
                         + '<td class="price">' + data[items][2] + '</td>'
                         + '<td><button class="decrement btn btn-primary">-</button> <button class="count btn btn-default">' + data[items][3] + '</button> <button class="increment btn btn-primary">+</button></td>'
                         + '<td class="delete"><button class="btn btn-warning">Удалить</button></td>'
                         + '</tr>';
                }

                cart.getContent().innerHTML = ''
                    + '<table width="100%" class="table table-bordered table-hover">'
                    + '<tr><th>id</th><th>Наименование</th><th>Цена</th><th>Кол-во</th><th></th></tr>'
                    + item
                    +'<tr><td></td><td>ИТОГО:</td><td class="all_price">' + price + '</td><td class="all_count">' + count + '</td><td><button id="clear_cart" class="btn btn-default">Очистить корзину</button></td></tr>'
                    + '</table>';

                let quantity = cart.getContent().querySelectorAll('.quantity');

                for(let j = 0; j < quantity.length; j++){
                    cart.addEvent(quantity[j].querySelector('.decrement'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.increment'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.delete'), 'click', cart.delete);
                }

                cart.addEvent(document.getElementById('clear_cart'), 'click', cart.clearCart);

            } else {
                cart.getCheckout().innerHTML = 'В корзине пусто!';
                cart.getContent().innerHTML  = ''
            }
        },


        delete : function () { // Удаляем элемент из корзины
            localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - this.parentNode.querySelector('.count').innerHTML);
            var data = cart.getCartData();
            delete data[this.parentNode.querySelector('.id').innerHTML];

            cart.setCartData(data);
            cart.openCart();
            cart.checkout();
        },

        clearCart : function () {
            cart.getContent().innerHTML  = '';
            cart.getCheckout().innerHTML = 'Корзина очищена.';
            localStorage.clear();
            localStorage.setItem('RudraJS-Cart::count', 0);
        },

        quantity : function () { // Увеличение, уменьшение количества товара
            let item = {
                id       : parseInt(this.parentNode.parentNode.querySelector('.id').innerHTML),
                title    : this.parentNode.parentNode.querySelector('.title').innerHTML,
                price    : this.parentNode.parentNode.querySelector('.price'),
                count    : this.parentNode.parentNode.querySelector('.count'),
                apiece   : cart.getCartData()[this.parentNode.parentNode.querySelector('.id').innerHTML][4],
                data     : cart.getCartData(),
            };



            if (this.innerHTML == '+') {
                item.count.innerHTML++;
                item.price.innerHTML = item.count.innerHTML * item.apiece;
                localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) + 1);

            } else {
                if (item.count.innerHTML > 1) {
                    item.count.innerHTML--;
                    item.price.innerHTML = item.count.innerHTML * item.apiece;
                    localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - 1);
                } else {
                    localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - item.count.innerHTML);
                    delete item.data[item.id];
                    this.parentNode.parentNode.innerHTML = '';

                    cart.setCartData(item.data);
                    cart.openCart();
                    cart.checkout();

                    return false;
                }
            }

            item.data[item.id]  = [item.id, item.title, item.price.innerHTML, item.count.innerHTML, item.apiece];

            cart.setCartData(item.data);
            cart.openCart();
            cart.checkout();
        },

        checkout : function () {
            this.getCheckout().innerHTML = 'Корзина <sup>' + parseInt(localStorage.getItem('RudraJS-Cart::count')) + '</sup>';
        },

        setLocalStorage : function () {
            if (localStorage.getItem('RudraJS-Cart::count') === null) {
                localStorage.setItem('RudraJS-Cart::count', 0);
            }
        },

        getContent : function () {
            return document.getElementById('cart_content');
        },

        getCheckout : function () {
            return document.getElementById('checkout');
        }

    };

    cart.setLocalStorage();
    cart.checkout();

    return {
        init : function() {
            return document.addEventListener("DOMContentLoaded", function(event) {
                cart.addAllEvents();
            });
        },
    }

})();

function dd(data) {
    console.log(data);
}

cartModule.init();
