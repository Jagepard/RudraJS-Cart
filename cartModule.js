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
            return JSON.parse(localStorage.getItem('cart'));
        },

        setCartData : function (key) { // Добавляем данные корзины в localStorage
            localStorage.setItem('cart', JSON.stringify(key));
        },

        addToCart : function () { // Добавляем товар в корзину
            let item = {
                id       : parseInt(this.getAttribute('data-id')),
                title    : this.parentNode.querySelector('.title').innerHTML,
                price    : parseInt(this.parentNode.querySelector('.price').innerHTML),
                quantity : parseInt(this.parentNode.querySelector('.quantity').innerHTML)
            };

            let data = cart.getCartData() || {};

            if(data.hasOwnProperty(item.id)){ // если такой товар есть, то + 1 к количеству

                localStorage.setItem('count', item.quantity + parseInt(localStorage.getItem('count'))); // Увеличиваем общее число товаров в корзине
                data[item.id][3]  = item.quantity + data[item.id][3]; // Увеличиваем число товара в корзине
                data[item.id][2]  = item.price * data[item.id][3]; // Увеличиваем цену

            } else { // если товара в корзине еще нет, то добавляем в объект

                localStorage.setItem('count', item.quantity + parseInt(localStorage.getItem('count')));
                data[item.id]  = [item.id, item.title, item.price, item.quantity];

            }

            cart.setCartData(data);
            cartContent.innerHTML = 'Товар добавлен';
            setTimeout(function(){
                cartContent.innerHTML = 'Корзина <sup>' + parseInt(localStorage.getItem('count')) + '</sup>';
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
                    item += '<td>' + data[items][0] + '</td>';
                    item += '<td>' + data[items][1] + '</td>';
                    item += '<td>' + data[items][2] + '</td>';
                    item += '<td><span class="decrement">-</span> <span class="count">' + data[items][3] + '</span> <span class="increment">+</span></td>';
                    item += '</tr>';
                }

                cartContent.innerHTML = '' +
                    '<table width="100%" class="table-hover">' +
                    '<tr><th>id</th><th>Наименование</th><th>Цена</th><th>Кол-во</th></tr>' +
                    item +
                    '<tr><td></td><td>ИТОГО:</td><td>' + price + '</td><td>' + count + '</td></tr>' +
                    '</table>';

                let quantity = cartContent.querySelectorAll('.quantity');

                for(let j = 0; j < quantity.length; j++){
                    cart.addEvent(quantity[j].querySelector('.decrement'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.increment'), 'click', cart.quantity);
                }

            } else {
                cartContent.innerHTML = 'В корзине пусто!';
            }
        },

        clearCart : function () {
            localStorage.clear();
            cartContent.innerHTML = 'Корзина очищена.';
            localStorage.setItem('count', 0);
        },

        quantity : function () {
            dd(cartContent.querySelector('.quantity').innerHTML);
            let quantity = cartContent.querySelectorAll('.quantity');

            for(let j = 0; j < quantity.length; j++){

                dd(quantity[j]);
            }

            if (this.innerHTML == '+') {
                this.parentNode.querySelector('.count').innerHTML++;
                localStorage.setItem('count', parseInt(localStorage.getItem('count')) + 1)
            } else {
                if (this.parentNode.querySelector('.count').innerHTML > 1) {
                    this.parentNode.querySelector('.count').innerHTML--;
                    localStorage.setItem('count', parseInt(localStorage.getItem('count')) - 1)
                }
            }
        }

    };

    if (localStorage.getItem('count') === null) {
        localStorage.setItem('count', 0);
    }

    var itemBox      = document.querySelectorAll('.item');
    var cartContent  = document.querySelector('#cart_content');

    cartContent.innerHTML = 'Корзина <sup>' + localStorage.getItem('count') + '</sup>';

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
