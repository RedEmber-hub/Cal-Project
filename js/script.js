// Получаем заголовок 'калькулятор верстки'
const mainTitle = document.getElementsByTagName('h1')[0];

// Получаем кнопки "Рассчитать" и "Сброс"
const actionButtons = document.getElementsByClassName('handler_btn');
const btnCalculate = actionButtons[0];
const btnReset = actionButtons[1];

// Кнопка добавления экрана "+"
const btnPlus = document.querySelector('.screen-btn');

// Дополнительные услуги: процентные и фиксированные
const otherItemsPercent = document.querySelectorAll('.other-items.percent');
const otherItemsNumber = document.querySelectorAll('.other-items.number');

// Элементы для ползунка отката
const rangeInput = document.querySelector('.rollback input[type="range"]');
const rangeValueSpan = document.querySelector('.rollback .range-value')

// Вывод результатов в правой части
const totalInputs = document.getElementsByClassName('total-input');
const totalInput1 = totalInputs[0];
const totalInput2 = totalInputs[1];
const totalInput3 = totalInputs[2];
const totalInput4 = totalInputs[3];
const totalInput5 = totalInputs[4];

// Коллекция блоков с экранами
let screenBlocks = document.querySelectorAll('.screen'); //блок с коллекцией экранов

// Главный объект с данными и методами
const appData = {
    // Основные свойства объекта
    title: '',
    screens: [],
    screenPrice: 0,
    adaptiv: true,
    rollback: 10, // начальный процент отката
    servicePricesPercent: 0,
    servicePricesNumber: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    servicesPercent: [],
    servicesNumber: [],
    isCalculated: false,  // флаг — был ли произведён расчет

    // Инициализация приложения
    init: () => {
        appData.addTitle();
        appData.checkFormValidity();

        // Клик по "Рассчитать"
        btnCalculate.addEventListener('click', appData.start);

        // Клик по "+"
        btnPlus.addEventListener('click', appData.addScreenBlock);

        // Проверка формы при вводе данных
        document.addEventListener('input', (e) => {
            if (e.target.closest('.screen')) {
                appData.checkFormValidity();
            }
        });

        // Проверка формы при изменении select
        document.addEventListener('change', (e) => {
            if (e.target.closest('.screen')) {
                appData.checkFormValidity();
            }
        });

        // Настройка ползунка
        appData.setupRollbackInput();
    },

    // Запуск расчётов
    start: () => {
        appData.checkFormValidity();
        appData.addScreens();
        appData.addServices();

        appData.addPrices();
        // appData.getServicePercentPrices(); // цена со скидкой
        appData.showResult();
        // appData.logger();
        appData.isCalculated = true; // ← добавили флаг
    },

    // Проверка заполненности полей для включения кнопки "Рассчитать"
    checkFormValidity: () => {
        let isValid = true;

        const screenBlocks = document.querySelectorAll('.screen');

        screenBlocks.forEach(screen => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');

            const isSelectEmpty = select.value === '';
            const isInputEmptyOrInvalid = input.value.trim() === '' || isNaN(input.value) || +input.value <= 0;

            if (isSelectEmpty || isInputEmptyOrInvalid) {
                isValid = false;
            }
        });

        // Включаем или отключаем кнопку
        btnCalculate.disabled = !isValid;
        btnCalculate.style.backgroundColor = isValid ? '#A52A2A' : '#c5acab';
    },

    // Установка заголовка страницы
    addTitle: () => {
        document.title = title.textContent;
    },

    // Вывод результатов в форму справа
    showResult: () => {
        totalInput1.value = appData.screenPrice;
        totalInput2.value = appData.totalScreensCount;
        totalInput3.value = appData.servicePricesPercent + appData.servicePricesNumber;
        totalInput4.value = appData.fullPrice;
        totalInput5.value = appData.servicePercentPrice;
    },

    // Добавление информации о каждом экране
    addScreens: () => {
        appData.screens = [];
        const screenBlocks = document.querySelectorAll('.screen');

        screenBlocks.forEach((screen, index) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;
            const count = +input.value;

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: count
            })
        })

        console.log(appData.screens);
    },

    // Добавление данных о доп. услугах
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

    // Добавление нового блока экрана
    addScreenBlock: () => {
        const cloneScreen = screenBlocks[0].cloneNode(true);

        screenBlocks[screenBlocks.length - 1].after(cloneScreen);

        screenBlocks = document.querySelectorAll('.screen');
        appData.checkFormValidity();
    },

    // Проверка: строка содержит хотя бы одну букву?
    isText: (str) => {
        return typeof str === 'string' && str.trim() !== '' && /[a-zA-Zа-яА-Я]/.test(str);
    },

    // Подсчёт всех цен
    addPrices: () => {
        appData.screenPrice = 0;
        appData.servicePricesNumber = 0;
        appData.servicePricesPercent = 0;
        appData.totalScreensCount = 0;

        // Складываем стоимость экранов
        for (let screen of appData.screens) {
            appData.screenPrice += +screen.price;
            appData.totalScreensCount += screen.count;
        }

        // Складываем фиксированные услуги
        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += appData.servicesNumber[key];
        }

        // Складываем процентные услуги
        for (let key in appData.servicesPercent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
        }

        // Общая сумма
        appData.fullPrice = appData.screenPrice + appData.servicePricesNumber + appData.servicePricesPercent;

        // Цена с учетом отката
        appData.servicePercentPrice = appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
    },

    // Настройка ползунка отката
    setupRollbackInput: () => {
        if (rangeInput && rangeValueSpan) {
            rangeInput.addEventListener('input', (event) => {
                const value = +event.target.value;  // приводим к числу
                rangeValueSpan.textContent = value; // показываем значение
                appData.rollback = +value; // сохраняем откат

                // Если расчёт уже был, пересчитываем цену
                if (appData.isCalculated) {
                    appData.addPrices();
                    totalInput5.value = appData.servicePercentPrice;
                }
            });

            // Устанавливаем начальное значение на странице
            rangeValueSpan.textContent = rangeInput.value;
        } else {
            console.error("Не удалось найти элементы для ползунка или значения");
        }
    },

    logger: () => {
        console.log('Стоимость всех дополнительных услуг:', appData.allServicePrices);
        console.log('Скидка:', appData.getRollbackMessage(appData.fullPrice));
        console.log(`Стоимость за вычетом отката посреднику ${appData.servicePercentPrice} рублей`);
        console.log(appData.screens);
        console.log(appData.services);
    }
}

// Запуск приложения
appData.init();
