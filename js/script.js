const mainTitle = document.getElementsByTagName('h1')[0]; // gjпучаем заголовок 'калькулятор верстки'
const actionButtons = document.getElementsByClassName('handler_btn'); //получение активных кнопок рассчитать и сброс
const btnCalculate = actionButtons[0]; //рассчитать
const btnReset = actionButtons[1]; //сброс
const btnPlus = document.querySelector('.screen-btn'); //кнопка +
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');
const rangeInput = document.querySelector('.rollback input[type="range"]');
const rangeValueSpan = document.querySelector('.rollback .range-value')
const totalInputs = document.getElementsByClassName('total-input'); //коллекция инпутов справа
// Получаем каждый input отдельно
const totalInput1 = totalInputs[0];
const totalInput2 = totalInputs[1];
const totalInput3 = totalInputs[2];
const totalInput4 = totalInputs[3];
const totalInput5 = totalInputs[4];
const totalInput6 = totalInputs[5];

let screenBlocks = document.querySelectorAll('.screen'); //блок с коллекцией экранов

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptiv: true,
    rollback: 10,
    allServicePrices: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    services: [],

    asking: () => {
        //название проекта
        do {
            appData.title = prompt('Как называется ваш проект?', 'Калькулятор вёрстки').trim();
        } while (!appData.isText(appData.title));

        //данные по экрану
        for (let i = 0; i < 2; i++) {
            let price, name;

            do {
                name = prompt('Какие типы экранов нужно разработать?').trim();
            } while (!appData.isText(name));

            do {
                price = parseFloat(prompt('Сколько будет стоить данная работа?').trim());
            } while (!appData.isNumber(price))

            appData.screens.push({ id: i, name: name, price: price })
        }

        //дополнительные услуги
        for (let i = 0; i < 2; i++) {
            let name, servicePrice;

            do {
                name = prompt('Какой дополнительный тип услуги нужен?').trim();
            } while (!appData.isText(name));

            do {
                servicePrice = prompt('Сколько это будет стоить?').trim();
            } while (!appData.isNumber(servicePrice));  // проверяем, является ли введенная стоимость числом

            appData.services.push({ id: i, name: name, servicePrice: parseFloat(servicePrice) })
        }

        //адаптив на сайте
        appData.adaptiv = confirm('Нужен ли адаптив на сайте?');
    },

    //проверка на наличие хотя бы одной буквы в строке
    isText: (str) => {
        return typeof str === 'string' && str.trim() !== '' && /[a-zA-Zа-яА-Я]/.test(str);
    },

    //ф-ция проверки на число
    isNumber: (num) => {
        return !isNaN(parseFloat(num)) && isFinite(num) && /^[0-9]+(\.[0-9]+)?$/.test(num);;
    },

    addPrices: () => {
        appData.screenPrice = appData.screens.reduce((sum, screen) => sum + screen.price, 0);
        appData.allServicePrices = appData.services.reduce((sum, service) => sum + service.servicePrice, 0);
    },

    //функция возвращает общую стоимость(работа + услуги)
    getFullPrice: () => {
        appData.fullPrice = appData.screenPrice + appData.allServicePrices;
    },

    // функция возвращает title с заглавной буквы и остальными строчными
    getTitle: () => {
        appData.title = appData.title.trim().charAt(0).toUpperCase() + appData.title.trim().slice(1).toLowerCase();
    },

    getRollbackMessage: (price) => {
        if (price <= 0) return 'Что то пошло не так';
        if (price <= 15000) return 'Скидка не предусмотрена';
        if (price <= 30000) return 'Даем скидку в 5%';

        return 'Даем скидку в 10%';
    },

    // функция возвращает стоимость за вычетом отката (со скидкой)
    getServicePercentPrices: () => {
        appData.servicePercentPrice = (appData.fullPrice - (appData.fullPrice * (appData.rollback / 100)))
    },

    start: () => {
        appData.asking();
        appData.addPrices();
        appData.getFullPrice(); // итоговая стоимость работы
        appData.getServicePercentPrices(); // цена со скидкой
        appData.getTitle();

        appData.logger();
    },

    logger: () => {
        console.log('Стоимость всех дополнительных услуг:', appData.allServicePrices);
        console.log('Скидка:', appData.getRollbackMessage(appData.fullPrice));
        console.log(`Стоимость за вычетом отката посреднику ${appData.servicePercentPrice} рублей`);
        console.log(appData.screens);
        console.log(appData.services);

        // //выводим все свойства объекта в колнсоль
        // for (let key in appData) {
        //     console.log(`${key}: ${appData[key]}`);
        // }
    }
}

appData.start();