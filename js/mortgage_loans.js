/**
 * Created by Владимир on 11.02.2017.
 */

//Функция: задает условия простая ипотека первичный рынок
//Входные данные: нет
//Выходные данные: массив conditions с условиями
function EasyMortgagePrimary() {
    var conditions;
    conditions = [
        [50], //размер первоначального взноса
        [13] //ставка
    ];
    return conditions;
}

//Функция: задает условия простая ипотека вторичный рынок
//Входные данные: нет
//Выходные данные: массив conditions с условиями
function EasyMortgageSecondary() {
    var conditions;
    conditions = [
        [50], //размер первоначального взноса
        [13] //ставка
    ];
    return conditions;
}

//Функция: задает условия ипотеки квартира в строящемся доме на первичном рынке
//Входные данные: нет
//Выходные данные: массив conditions с условиями
function ApartmentBuildPrimary() { //Квартира в строящемся доме(ГПБ)
    var conditions;
    conditions = [
        [0, 15, 50], //размер первоначального взноса
        [12, 11, 10.5] //ставка
    ];
    return conditions;
}

//Функция: задает условия ипотеки квартира на вторичном рынке
//Входные данные: нет
//Выходные данные: массив conditions с условиями
function ApartmentSecondary() {
    var conditions;
    conditions = [
        [15, 50], //размер первоначального взноса
        [11.5, 11] //ставка
    ];
    return conditions;
}

//Функция: задает условия ипотеки квартира на первичном рынке рынке
//Входные данные: нет
//Выходные данные: массив conditions с условиями
function ApartmentPrimary() {
    var conditions;
    conditions = [
        [15, 50], //размер первоначального взноса
        [11.5, 11] //ставка
    ];
    return conditions;
}

//Функция: определяет процентную ставку
//Входные данные: initialFee - первоначальный взнос
//Выходные данные: rate - значение ставки
function GetRate(conditions, initialFee, sumObj, category) {
    var rate;

    var rateCol;
    var rateRow = 1;

    //определяем столбец для ставки, по первоначальному взносу
    for (var i = 0; i < conditions[0].length; ++i) {
        //ищем последнее вхождение
        if (initialFee > sumObj * conditions[0][i] / 100) {
            rateCol = i;
        }
    }

    rate = conditions[rateRow][rateCol];

    if (category == "Общие условия") {
        rate += 0.5;
    }

    return rate;
}

//---------------Метод Ньютона-Рафсона----------------------
//Функция: определяет процентную ставку
//Входные данные: initialFee - первоначальный взнос
//Выходные данные: rate - значение ставки
function GetEffectiveRate(sumCredit, term, costs, singlePayment) {
    var x1, tmp, x;
    var error = 0.001;
    var pr = 1; //переменная для проверки

    x = 0.1;

    //метод Ньютона-Рафсона
    while (pr > error) {
        tmp = GetFunction(x, term, sumCredit, costs, singlePayment);
        pr = Math.abs(tmp);
        x1 = x;
        x = x - tmp / GetDerivative(x, term);
    }

    x = x * 100;
    x = x.toFixed(4);

    return x;
}

//Функция: рассчитывает значение функции
//Входные данные: x
//Выходные данные: значение функции
function GetFunction(x, term, sumCredit, costs, singlePayment) {
    var fun;
    var b;

    b = (sumCredit - costs) / singlePayment;

    fun = (1 - Math.pow((1 + x), -term)) / (Math.pow((1 + x), 1 / 12) - 1) - b;

    return fun;
}

//Функция: рассчитывает значение производной
//Входные данные: x
//Выходные данные: значение производной
function GetDerivative(x, term) {
    var der;
    var a, b;

    a = (term * Math.pow(1+x, -1-term)) / (Math.pow(1+x, 1/12)-1);
    b = (1-Math.pow(1+x, -term)) / (12*(Math.pow(1+x, 11/12))*(Math.pow(Math.pow(1+x, 1/12)-1, 2)));

    der = a - b;

    return der;
}

//----------------------------------------------------------

//Функция: проверяет достаточность первоначального взноса
//Входные данные:
//Выходные данные:
function CheckAdequacySum(conditions, initialFee, sumObj) {
    var min;
    var itsOk;
    min = sumObj * conditions[0][0] / 100;
    itsOk = initialFee < min;
    return itsOk;
}

//Функция: определяет выбранную радиокнопку (варианты: да, нет)
//Входные данные: контейнер с радиокнопками
//Выходные данные: вариант ответа (да, нет)
function GetCheckedRadio(radioGroupName) {
    var checkedName;

    for (var x = 0; x < radioGroupName.length; x++)
    {
        if (radioGroupName[x].checked)
        {
            checkedName = (radioGroupName[x].value);
        }
    }
    return checkedName;
}

//Функция: возвращает условия
//Входные данные:
//Выходные данные:
function GetArrayRate(number) {
    var conditions;

    if (number == 0) { //квартира вторичный рынок
        conditions = ApartmentSecondary();
    }
    if (number == 1) { //квартира в строящемся доме
        conditions = ApartmentPrimary();
    }
    if (number == 2) { //Квартира в строящемся доме(ГПБ)
        conditions = ApartmentBuildPrimary();
    }
    if (number == 3) { //Простая ипотека(вторичный рынок)
        conditions = EasyMortgageSecondary();
    }
    if (number == 4) { //Простая ипотека(первичный рынок)
        conditions = EasyMortgagePrimary();
    }

    return conditions;
}

//Функция: расчет разового платежа
//Входные данные: сумма кредита, ставка, срок
//Выходные данные: разовый платеж
function GetSinglePayment(sumCredit, rate, term) {
    var singlePayment;
    var a;

    a = (1 - Math.pow((1 + rate / (12 * 100)), (- term * 12))) / (1 + rate / (12 * 100) - 1);
    singlePayment = sumCredit / a;
    singlePayment = singlePayment.toFixed(2);

    return singlePayment;
}

//Функция: главная
//Входные данные: нет
//Выходные данные: нет
function Mortgage() {
    //переменные, задаются пользователем
    var sumObj; //сумма объекта недвижимости
    var term; //срок
    var costs; //дополнительные затраты по кредиту
    var initialFee; //первоначальный взнос

    //радиокнопки, меню
    var category; //категория заемщика
    //var view; //вид платежа

    //переменные рассчетные
    var sumCredit; //сумма кредита
    var rate; //ставка
    var itogSum; //итоговая сумма кредита
    //var ef_rate; //эффективная процентная ставка
    var conditions; //массив условий
    var singlePayment; //разовый платеж
    var effectivRate; //эффективная ставка

    var efRateMin = 0;
    var efRateRow = 0;

    //массив результатов
    var arrayRes = [
        ["Квартира на вторичном рынке", 0, 0, 0, 0],
        ["Квартира в строящемся доме", 0, 0, 0, 0],
        ["Квартира в строящемся доме(ГПБ)", 0, 0, 0, 0],
        ["Простая ипотека(вторичный рынок)", 0, 0, 0, 0],
        ["Простая ипотека(первичный рынок)", 0, 0, 0, 0]
    ];

    //считывание данных
    sumObj = document.getElementById('sumObj').value;
    initialFee = document.getElementById('initialFee').value;
    term = document.getElementById('term').value;
    costs = document.getElementById('costs').value;

    //перевод в числа
    sumObj = Number(sumObj);
    initialFee = Number(initialFee);
    term = Number(term);
    costs = Number(costs);
    //радиокнопки
    category = GetCheckedRadio(document.getElementsByName('radio-773'));
    //view = GetCheckedRadio(document.getElementsByName('radio-775'));

    //сумма кредита
    sumCredit = sumObj - initialFee;

    //цикл расчета значений всех программ
    for (var i = 0; i < arrayRes.length; ++i) {
        //получения массива с условиями
        conditions = GetArrayRate(i);

        //проверка минимального взноса
        if (CheckAdequacySum(conditions, initialFee, sumObj)) {
            document.getElementById('itogSum' + i.toString()).innerHTML = 'Первоначальный взнос';
            document.getElementById('rate' + i.toString()).innerHTML = 'не удовлетворяет';
            document.getElementById('pay' + i.toString()).innerHTML = 'требованиям программы';
            document.getElementById('ef_rate' + i.toString()).innerHTML = '';
            continue;
        }
        //расчет параметров
        rate = GetRate(conditions, initialFee, sumObj, category);
        singlePayment = GetSinglePayment(sumCredit, rate, term);
        itogSum = singlePayment * term * 12;
        itogSum = itogSum.toFixed(2);
        effectivRate = GetEffectiveRate(sumCredit, term, costs, singlePayment);

        arrayRes[i][1] = rate;
        arrayRes[i][2] = itogSum;
        arrayRes[i][3] = singlePayment;
        arrayRes[i][4] = effectivRate;

        document.getElementById('itogSum' + i.toString()).innerHTML = "Сумма долга: " + arrayRes[i][2];
        document.getElementById('rate' + i.toString()).innerHTML = "Ставка процента: " + arrayRes[i][1];
        document.getElementById('pay' + i.toString()).innerHTML = "Платеж: " + arrayRes[i][3];
        document.getElementById('ef_rate' + i.toString()).innerHTML = "Эффективная ставка: " + arrayRes[i][4];
    }

    //выбор выгодного кредита
    efRateMin = arrayRes[0][4];
    efRateRow = 0;
    for (var i = 0; i < arrayRes.length; ++i) {
        if ((efRateMin < arrayRes[i][4]) && (arrayRes[i][4] != 0)) {
            efRateMin = arrayRes[i][4];
            efRateRow = i;
        }
    }

    document.getElementById('cred').value = sumCredit;
    document.getElementById('prog').value = arrayRes[efRateRow][0];
    document.getElementById('i_rate').value = arrayRes[efRateRow][1];
    document.getElementById('sum_credit').value = arrayRes[efRateRow][2];
    document.getElementById('pay').value = arrayRes[efRateRow][3];
    document.getElementById('i_ef_rate').value = arrayRes[efRateRow][4];
}

window.onload = function (e) {
    document.getElementById('button').onclick = Mortgage
};