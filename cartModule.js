/**
 * Created by Dan on 14.01.2017.
 */

;'use strict';

var cartModule = (function () { // namespace

    class Cart {

        addAllEvents() { // Добавляем все события
            for(var i = 0; i < itemBox.length; i++){
                this.addEvent(itemBox[i].querySelector('.add_item'), 'click', this.addToCart);
            }
            this.addEvent(document.getElementById('checkout'), 'click', this.openCart);
            this.addEvent(document.getElementById('clear_cart'), 'click', this.clearCart);
        }

        addEvent(element, type, handler){ // Добавляем событие
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, handler)
            } else {
                element['on' + type] = handler;
            }
        }

        getCartData(){ // Получаем данные корзины из localStorage
            return JSON.parse(localStorage.getItem('cart'));
        }

        setCartData(o){ // Добавляем данные корзины в localStorage
            localStorage.setItem('cart', JSON.stringify(o));
        }

        addToCart(){ // Добавляем товар в корзину

            let item = {
                id       : parseInt(this.getAttribute('data-id')),
                title    : this.parentNode.querySelector('.title').innerHTML,
                price    : parseInt(this.parentNode.querySelector('.price').innerHTML),
                quantity : parseInt(this.parentNode.querySelector('.quantity').innerHTML)
            };

            let data = cart.getCartData() || {};

            if(data.hasOwnProperty(item.id)){ // если такой товар есть, то + 1 к количеству

                opencart.count    = item.quantity + opencart.count; // Увеличиваем общее число товаров в корзине
                data[item.id][2]  = item.quantity + data[item.id][2]; // Увеличиваем число товара в корзине
                data[item.id][1]  = item.price * data[item.id][2]; // Увеличиваем цену

            } else { // если товара в корзине еще нет, то добавляем в объект

                opencart.count += item.quantity;
                data[item.id]  = [item.title, item.price, item.quantity];

            }

            cart.setCartData(data);
            cartContent.innerHTML = 'Товар добавлен';
            setTimeout(function(){
                cartContent.innerHTML = 'Корзина <sup>' + opencart.count + '</sup>';
            }, 1000);

            dd(localStorage.getItem('cart'));
        }

        openCart(){

            opencart.items = '';

            let data = cart.getCartData() || {};

            if(Object.keys(data).length !== 0){

                let i          = 0;
                let count      = 0;
                let price      = 0;

                for(let items in data){

                    ++i;
                    price = price + parseInt(data[items][1]);
                    count = count + parseInt(data[items][2]);

                    opencart.items += '<tr>';
                    opencart.items += '<td>' + i + '</td>';
                    opencart.items += '<td>' + data[items][0] + '</td>';
                    opencart.items += '<td>' + data[items][1] + '</td>';
                    opencart.items += '<td class="quantity"><span class="decrement">-</span> <span class="count">' + data[items][2] + '</span> <span class="increment">+</span></td>';
                    opencart.items += '</tr>';
                }

                opencart.etc          = '<tr><td></td><td>ИТОГО:</td>' + '<td>' + price + '</td>' + '<td>' + count + '</td>' + '</tr>';
                cartContent.innerHTML = opencart.header + opencart.items + opencart.etc + opencart.footer + opencart.form;

                let quantity = cartContent.querySelectorAll('.quantity');

                for(var j = 0; j < quantity.length; j++){
                    cart.addEvent(quantity[j].querySelector('.decrement'), 'click', cart.quantity);
                    cart.addEvent(quantity[j].querySelector('.increment'), 'click', cart.quantity);
                }

            } else {
                cartContent.innerHTML = 'В корзине пусто!';
            }
        }

        clearCart(){
            localStorage.clear();
            cartContent.innerHTML = 'Корзина очищена.';
            cartData              = {};
            opencart.count        = 0;
            opencart.items        = '';
        };

        quantity(){
            let cart  = JSON.parse(localStorage.getItem('cart'));
            let count = (this.innerHTML == '+') ? this.parentNode.querySelector('.count').innerHTML++ : this.parentNode.querySelector('.count').innerHTML--;

            console.log(count);
        }
    }

    var cart         = new Cart();

    var opencart     = {
        header : '<table width="100%" class="table-hover"><tr><th>id</th><th>Наименование</th><th>Цена</th><th>Кол-во</th></tr>',
        items  : '',
        etc    : '',
        footer : '</table>',
        count  : 0, // общее число товаров в корзине
        form   : '',
    };

    var itemBox      = document.querySelectorAll('.item');
    var cartContent  = document.querySelector('#cart_content');
    var cartData     = cart.getCartData() || {};

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
