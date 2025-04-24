const mainTitle = document.getElementsByTagName('h1')[0]; // получаем заголовок 'калькулятор верстки'
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

let screenBlocks = document.querySelectorAll('.screen'); //блок с коллекцией экранов

const appData = {
    title: '',
    screens: [],
    screenPrice: 0,
    adaptiv: true,
    rollback: 10,
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPercent: [],
    servicesNumber: [],
    init: () => {
        appData.addTitle();
        btnCalculate.addEventListener('click', appData.start)
        btnPlus.addEventListener('click', appData.addScreenBlock)
    },

    start: () => {
        appData.addScreens();
        appData.addServices();

        appData.addPrices();
        // appData.getServicePercentPrices(); // цена со скидкой
        appData.showResult();
        // appData.logger();
    },

    addTitle: () => {
        document.title = title.textContent;
    },

    showResult: () => {
        totalInput1.value = appData.screenPrice;
        totalInput3.value = appData.servicePricesPercent + appData.servicePricesNumber;
        totalInput4.value = appData.fullPrice;
    },

    addScreens: () => {
        let screenBlocks = document.querySelectorAll('.screen');

        screenBlocks.forEach((screen, index) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value
            })
        })

        console.log(appData.screens);
    },

    addServices: () => {
        otherItemsPercent.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesPercent[label.textContent] = +input.value;
            }
        })

        otherItemsNumber.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value;
            }
        })
    },

    addScreenBlock: () => {
        const cloneScreen = screenBlocks[0].cloneNode(true);

        screenBlocks[screenBlocks.length - 1].after(cloneScreen);

    },

    //проверка на наличие хотя бы одной буквы в строке
    isText: (str) => {
        return typeof str === 'string' && str.trim() !== '' && /[a-zA-Zа-яА-Я]/.test(str);
    },

    addPrices: () => {
        for (let screen of appData.screens) {
            appData.screenPrice += +screen.price;
        }

        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += appData.servicesNumber[key];
        }

        for (let key in appData.servicesPercent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
        }
        appData.fullPrice = appData.screenPrice + appData.servicePricesNumber + appData.servicePricesPercent;
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

appData.init();