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

            dd(opencart.count);
            let item = {
                id       : parseInt(this.getAttribute('data-id')),
                title    : this.parentNode.querySelector('.title').innerHTML,
                price    : parseInt(this.parentNode.querySelector('.price').innerHTML),
                quantity : parseInt(this.parentNode.querySelector('.quantity').innerHTML)
            };

            let data = cart.getCartData() || {};

            if(data.hasOwnProperty(item.id)){ // если такой товар есть, то + 1 к количеству

                opencart.count    = item.quantity + opencart.count; // Увеличиваем общее число товаров в корзине
                data[item.id][3]  = item.quantity + data[item.id][3]; // Увеличиваем число товара в корзине
                data[item.id][2]  = item.price * data[item.id][3]; // Увеличиваем цену

            } else { // если товара в корзине еще нет, то добавляем в объект

                opencart.count += item.quantity;
                data[item.id]  = [item.id, item.title, item.price, item.quantity];

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

                let count      = 0;
                let price      = 0;

                for(let items in data){

                    price = price + parseInt(data[items][2]);
                    count = count + parseInt(data[items][3]);
                    opencart.count = count;

                    opencart.items += '<tr class="row">';
                    opencart.items += '<td data-id="' + data[items][0] + '">' + data[items][0] + '</td>';
                    opencart.items += '<td class="title">' + data[items][1] + '</td>';
                    opencart.items += '<td class="price">' + data[items][2] + '</td>';
                    opencart.items += '<td><span class="decrement">-</span> <span class="count">' + data[items][3] + '</span> <span class="increment">+</span></td>';
                    opencart.items += '</tr>';
                }

                opencart.etc          = '<tr><td></td><td>ИТОГО:</td>' + '<td>' + price + '</td>' + '<td>' + count + '</td>' + '</tr>';
                cartContent.innerHTML = opencart.header + opencart.items + opencart.etc + opencart.footer + opencart.form;

                let row = cartContent.querySelectorAll('.row');

                for(var j = 0; j < row.length; j++){
                    cart.addEvent(row[j].querySelector('.decrement'), 'click', cart.quantity);
                    cart.addEvent(row[j].querySelector('.increment'), 'click', cart.quantity);
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
            let row  = cartContent.querySelectorAll('.row');
            let cart = JSON.parse(localStorage.getItem('cart'));

            if (this.innerHTML == '+') {
                this.parentNode.querySelector('.count').innerHTML++;
            } else {
                if (this.parentNode.querySelector('.count').innerHTML > 1) {
                    this.parentNode.querySelector('.count').innerHTML--;
                }
            }
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

    cartContent.innerHTML = 'Корзина <sup>' + opencart.count + '</sup>';

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
