/**
 * Created by Владимир on 10.12.2017.
 */
var url = 'mortgage_test.html';
module.exports = {
    'Заголовок страницы корректен': function (test) {
        test
            .open(url)
            .assert.title().is('Тест ипотечного калькулятора', 'Я жажду служить')
            .done();
    },
    'Проверка начального заполнения': function (test) {
        test
            .open(url)
            .assert.val('#sumObj', 0, 'Стоимость объекта 0')
            .assert.val('#initialFee', 0, 'Первоначальный взнос 0')
            .assert.val('#term', 0, 'Срок 0')
            .assert.val('#costs', 0, 'Дополнитльные затраты 0')
            .assert.val('#radio-773', 0, 'Дополнитльные затраты 0')
            .assert.notSelected('#radio1')
            .assert.selected('#radio2')
            .assert.val('#cred', "", 'Check')
            .assert.val('#prog', "", 'Check')
            .assert.val('#i_rate', "", 'Check')
            .assert.val('#sum_credit', "", 'Check')
            .assert.val('#pay', "", 'Check')
            .assert.val('#i_ef_rate', "", 'Check')
            .done();
    },
    'Проверка вызова javascript функции': function (test) {
        test.open(url)
            .assert.text('#button').is('Рассчитать')
            .assert.visible('#button')
            .assert.attr('#button', 'type', 'submit')
            //.assert.attr('#nav', 'data-nav', 'true') // класс
            .click('#button')
            .done();
    },
    'Проверка вывода со значениями введенными по умолчанию': function (test) {
        test.open(url)
            .click('#button')
            .assert.val('#cred', 0, 'Check')
            .assert.val('#prog', "Квартира на вторичном рынке", 'Check')
            .assert.val('#i_rate', 'NaN', 'Check')
            .assert.val('#sum_credit', 'NaN', 'Check')
            .assert.val('#pay', 'NaN', 'Check')
            .assert.val('#i_ef_rate', 'NaN', 'Check')
            .done();
    },
    'Проверка вывода с заданным вводом': function (test) {
        test.open(url)
            .setValue('#sumObj', '1000000')
            .setValue('#initialFee', '200000')
            .setValue('#term', '10')
            .setValue('#costs', '2000')
            .click('#button')
            .assert.val('#cred', '800000', 'Check')
            .assert.val('#prog', "Квартира на вторичном рынке", 'Check')
            .assert.val('#i_rate', '12', 'Check')
            .assert.text('#itogSum3').is('Первоначальный взнос')
            .assert.text('#rate3').is('не удовлетворяет')
            .assert.text('#pay3').is('требованиям программы')
            .done();
    },
    'Проверка вывода': function (test) {
        test.open(url)
            .setValue('#sumObj', '1000000')
            .setValue('#initialFee', '200000')
            .setValue('#term', '10')
            .setValue('#costs', '2000')
            .click('#button')
            .execute(function () {
                var x = document.getElementById('sum_credit').value.substring(document.getElementById('sum_credit').value.indexOf(".") + 1).length;
                var y = document.getElementById('pay').value.substring(document.getElementById('pay').value.indexOf(".") + 1).length;
                var z = document.getElementById('i_ef_rate').value.substring(document.getElementById('i_ef_rate').value.indexOf(".") + 1).length;
                var a = document.getElementById('itogSum0').textContent.substring('Сумма долга: ');
                var b = document.getElementById('rate0').textContent.substring('Ставка процента: ');
                if ((x === 2) && (y === 2) && (z === 2) && (a !== -1) && (b !== -1)) {
                    alert("Тест пройден")
                }
            })
            //.assert.dialogText('Тест пройден')
            .accept()
            .done();
    }
};

