/**
 * Created by Dan on 14.01.2017.
 */

;'use strict';

var cartModule = (function ($) { // namespace

    var cart = {
        addAllEvents : function () { // Добавляем все события
            $('.item').each(function(){
                $(this).find('.add_item').click(cart.addToCart);

                let count = $(this).find('.count');
                $(this).find('.decrement').click(function() {
                    if (count.html() > 1) {
                        count.html(parseInt(count.html()) - 1);
                    }
                });

                $(this).find('.increment').click(function() {
                    count.html(parseInt(count.html()) + 1);
                });
            });

            $(document).on('click', '#checkout', this.openCart);
        },

        getCartData : function () { // Получаем данные корзины из localStorage
            return JSON.parse(localStorage.getItem('RudraJS-Cart'));
        },

        setCartData : function (key) { // Добавляем данные корзины в localStorage
            localStorage.setItem('RudraJS-Cart', JSON.stringify(key));
        },

        addToCart : function () { // Добавляем товар в корзину
            let item = {
                id       : parseInt($(this).attr('data-id')),
                title    : $(this).attr('data-title'),
                price    : parseInt($(this).attr('data-price')),
                quantity : parseInt($(this).parent().parent().find('.count').html()),
                apiece   : parseInt($(this).attr('data-price'))
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
            cart.getContent().html('');
            cart.getCheckout().html('Товар добавлен');
            setTimeout(cart.checkout(), 1000);
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

                cart.getContent().html(''
                    + '<table width="100%" class="table table-bordered table-hover">'
                    + '<tr><th>id</th><th>Наименование</th><th>Цена</th><th>Кол-во</th><th></th></tr>'
                    + item
                    + '<tr><td></td><td>ИТОГО:</td><td class="all_price">' + price + '</td><td class="all_count">' + count + '</td><td><button id="clear_cart" class="btn btn-default">Очистить корзину</button></td></tr>'
                    + '</table>');

                cart.getContent().find('.quantity').each(function(){
                    $(this).find('.decrement').click(cart.quantity);
                    $(this).find('.increment').click(cart.quantity);
                    $(this).find('.delete').click(cart.delete);
                });

                $(document).on('click', '#clear_cart', cart.clearCart);

            } else {
                cart.getCheckout().html('В корзине пусто!');
                cart.getContent().html('');
            }
        },


        delete : function () { // Удаляем элемент из корзины
            localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - this.parentNode.querySelector('.count').innerHTML);
            let data = cart.getCartData();
            delete data[this.parentNode.querySelector('.id').innerHTML];

            cart.setCartData(data);
            cart.openCart();
            cart.checkout();
        },

        clearCart : function () {
            cart.getContent().html('');
            cart.getCheckout().html('Корзина очищена.');
            localStorage.clear();
            localStorage.setItem('RudraJS-Cart::count', 0);
        },

        quantity : function () { // Увеличение, уменьшение количества товара
            let item = {
                id       : $(this).parent().parent().find('.id').html(),
                title    : $(this).parent().parent().find('.title').html(),
                price    : $(this).parent().parent().find('.price'),
                count    : $(this).parent().find('.count'),
                apiece   : cart.getCartData()[$(this).parent().parent().find('.id').html()][4],
                data     : cart.getCartData()
            };

            if ($(this).html() == '+') {
                item.count.html(parseInt(item.count.html()) + 1);
                localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) + 1);
            } else {

                if (item.count.html() > 1) {
                    item.count.html(item.count.html() - 1);
                    localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - 1);
                } else {

                    localStorage.setItem('RudraJS-Cart::count', parseInt(localStorage.getItem('RudraJS-Cart::count')) - item.count.html());
                    delete item.data[item.id];
                    $(this).parent().parent().html('');
                    cart.setCartData(item.data);
                    cart.openCart();
                    cart.checkout();

                    return false;
                }
            }

            item.price.html(item.count.html() * item.apiece);
            item.data[item.id]  = [item.id, item.title, item.price.html(), item.count.html(), item.apiece];

            cart.setCartData(item.data);
            cart.openCart();
            cart.checkout();
        },

        checkout : function () {
            cart.getCheckout().html('Корзина <sup>' + parseInt(localStorage.getItem('RudraJS-Cart::count')) + '</sup>');
        },

        setLocalStorage : function () {
            if (localStorage.getItem('RudraJS-Cart::count') === null) {
                localStorage.setItem('RudraJS-Cart::count', 0);
            }
        },

        getContent : function () {
            return $('#cart_content');
        },

        getCheckout : function () {
            return $('#checkout');
        }

    };

    cart.setLocalStorage();
    cart.checkout();

    return {
        init : function() {
            return $(document).ready(cart.addAllEvents());
        },
    }

})(jQuery);

function dd(data) {
    console.log(data);
}

cartModule.init();
