/**
 * Created by Dan on 14.01.2017.
 */

;'use strict';

var cartModule = (function () { // namespace

    var cart = {
        addAllEvents : function () { // Добавляем все события
            for(var i = 0; i < itemBox.length; i++){
                this.addEvent(itemBox[i].querySelector('.add_item'), 'click', this.addToCart);
            }
            this.addEvent(document.getElementById('checkout'), 'click', this.openCart);
            this.addEvent(document.getElementById('clear_cart'), 'click', this.clearCart);
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
                quantity : parseInt(this.getAttribute('data-quantity')),
                apiece   : parseInt(this.getAttribute('data-price'))
            };

            let data = cart.getCartData() || {};

            if(data.hasOwnProperty(item.id)){ // если такой товар есть, то + 1 к количеству

                localStorage.setItem('RudraJS-Cart::count', item.quantity + parseInt(localStorage.getItem('RudraJS-Cart::count'))); // Увеличиваем общее число товаров в корзине
                data[item.id][3]  = item.quantity + data[item.id][3]; // Увеличиваем число товара в корзине
                data[item.id][2]  = item.price * data[item.id][3]; // Увеличиваем цену

            } else { // если товара в корзине еще нет, то добавляем в объект

                localStorage.setItem('RudraJS-Cart::count', item.quantity + parseInt(localStorage.getItem('RudraJS-Cart::count')));
                data[item.id]  = [item.id, item.title, item.price, item.quantity, item.apiece];

            }

            cart.setCartData(data);
            checkout.innerHTML = 'Товар добавлен';
            setTimeout(function(){
                checkout.innerHTML = 'Корзина <sup>' + parseInt(localStorage.getItem('RudraJS-Cart::count')) + '</sup>';
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

                    item += '<tr class="quantity" data-id="' + data[items][0] + '">';
                    item += '<td class="id">' + data[items][0] + '</td>';
                    item += '<td class="title">' + data[items][1] + '</td>';
                    item += '<td class="price">' + data[items][2] + '</td>';
                    item += '<td><button class="decrement btn btn-primary">-</button> <button class="count btn btn-default">' + data[items][3] + '</button> <button class="increment btn btn-primary">+</button></td>';
                    item += '<td class="delete"><button class="btn btn-warning">Удалить</button></td>';
                    item += '</tr>';
                }

                cartContent.innerHTML = '' +
                    '<table width="100%" class="table table-bordered table-hover">' +
                    '<tr><th>id</th><th>Наименование</th><th>Цена</th><th>Кол-во</th><th></th></tr>' +
                    item +
                    '<tr><td></td><td>ИТОГО:</td><td class="all_price">' + price + '</td><td class="all_count">' + count + '</td><td></td></tr>' +
                    '</table>';

                let quantity = cartContent.querySelectorAll('.quantity');

                for(let j = 0; j < quantity.length; j++){
                    cart.addEvent(quantity[j].querySelector('.decrement'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.increment'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.delete'), 'click', cart.delete);
                }

            } else {
                checkout.innerHTML    = 'В корзине пусто!';
                cartContent.innerHTML = ''
            }
        },

        delete : function () { // Удаляем элемент из корзины
            localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - this.parentNode.querySelector('.count').innerHTML);
            var data = cart.getCartData();
            delete data[this.parentNode.querySelector('.id').innerHTML];
            cart.setCartData(data);
            cart.openCart();
        },

        clearCart : function () {
            cartContent.innerHTML = '';
            checkout.innerHTML    = 'Корзина очищена.';
            localStorage.clear();
            localStorage.setItem('RudraJS-Cart::count', 0);
        },

        quantity : function () { // Увеличение, уменьшение количества товара

            let apiece = cart.getCartData()[this.parentNode.parentNode.querySelector('.id').innerHTML][4];

            if (this.innerHTML == '+') {

                this.parentNode.querySelector('.count').innerHTML++;
                this.parentNode.parentNode.querySelector('.price').innerHTML = this.parentNode.querySelector('.count').innerHTML * apiece;
                localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) + 1)

            } else {

                if (this.parentNode.querySelector('.count').innerHTML > 1) {
                    this.parentNode.querySelector('.count').innerHTML--;
                    this.parentNode.parentNode.querySelector('.price').innerHTML = this.parentNode.querySelector('.count').innerHTML * apiece;
                    localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - 1)
                }
            }

            let item = {
                id       : this.parentNode.parentNode.querySelector('.id').innerHTML,
                title    : this.parentNode.parentNode.querySelector('.title').innerHTML,
                price    : parseInt(this.parentNode.parentNode.querySelector('.price').innerHTML),
                quantity : parseInt(this.parentNode.parentNode.querySelector('.count').innerHTML),
                apiece   : apiece
            };

            var data       = cart.getCartData();
            data[item.id]  = [item.id, item.title, item.price, item.quantity, item.apiece];

            cart.setCartData(data);
            cart.openCart();
        }

    };

    if (localStorage.getItem('RudraJS-Cart::count') === null) {
        localStorage.setItem('RudraJS-Cart::count', 0);
    }

    var itemBox      = document.querySelectorAll('.item');
    var cartContent  = document.querySelector('#cart_content');
    var checkout     = document.getElementById('checkout');

    checkout.innerHTML = 'Корзина <sup>' + localStorage.getItem('RudraJS-Cart::count') + '</sup>';

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
