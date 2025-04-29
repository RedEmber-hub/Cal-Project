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
    init() {
        this.addTitle();
        this.checkFormValidity();

        // Клик по "Рассчитать"
        btnCalculate.addEventListener('click', appData.start.bind(appData));

        // Клик по "+"
        btnPlus.addEventListener('click', appData.addScreenBlock.bind(appData));

        // Проверка формы при вводе данных
        document.addEventListener('input', (e) => {
            if (e.target.closest('.screen')) {
                this.checkFormValidity();
            }
        });

        // Проверка формы при изменении select
        document.addEventListener('change', (e) => {
            if (e.target.closest('.screen')) {
                this.checkFormValidity();
            }
        });

        // Настройка ползунка
        this.setupRollbackInput();
    },

    // Запуск расчётов
    start() {
        this.checkFormValidity();
        this.addScreens();
        this.addServices();

        this.addPrices();
        // appData.getServicePercentPrices(); // цена со скидкой
        this.showResult();
        // appData.logger();
        this.isCalculated = true; // ← добавили флаг

        // Блокируем все input и select после расчета
        const allLeftInputs = document.querySelectorAll('.screen input[type="text"], .screen select, .other-items input[type="text"], .other-items select');
        allLeftInputs.forEach(elem => {
            elem.disabled = true;
        });

        // Скрываем кнопку "Рассчитать" и показываем кнопку "Сброс"
        btnCalculate.style.display = 'none';
        btnReset.style.display = 'block';
    },

    // Проверка заполненности полей для включения кнопки "Рассчитать"
    checkFormValidity() {
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
    addTitle() {
        document.title = title.textContent;
    },

    // Вывод результатов в форму справа
    showResult() {
        totalInput1.value = this.screenPrice;
        totalInput2.value = this.totalScreensCount;
        totalInput3.value = this.servicePricesPercent + this.servicePricesNumber;
        totalInput4.value = this.fullPrice;
        totalInput5.value = this.servicePercentPrice;
    },

    // Добавление информации о каждом экране
    addScreens() {
        this.screens = [];
        const screenBlocks = document.querySelectorAll('.screen');

        screenBlocks.forEach((screen, index) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;
            const count = +input.value;

            this.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: count
            })
        })

        console.log(this.screens);
    },

    // Добавление данных о доп. услугах
    addServices() {
        otherItemsPercent.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                this.servicesPercent[label.textContent] = +input.value;
            }
        })

        otherItemsNumber.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                this.servicesNumber[label.textContent] = +input.value;
            }
        })
    },

    // Добавление нового блока экрана
    addScreenBlock() {
        const cloneScreen = screenBlocks[0].cloneNode(true);

        screenBlocks[screenBlocks.length - 1].after(cloneScreen);

        screenBlocks = document.querySelectorAll('.screen');
        this.checkFormValidity();
    },

    // Проверка: строка содержит хотя бы одну букву?
    isText(str) {
        return typeof str === 'string' && str.trim() !== '' && /[a-zA-Zа-яА-Я]/.test(str);
    },

    // Подсчёт всех цен
    addPrices() {
        this.screenPrice = 0;
        this.servicePricesNumber = 0;
        this.servicePricesPercent = 0;
        this.totalScreensCount = 0;

        // Складываем стоимость экранов
        for (let screen of this.screens) {
            this.screenPrice += +screen.price;
            this.totalScreensCount += screen.count;
        }

        // Складываем фиксированные услуги
        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key];
        }

        // Складываем процентные услуги
        for (let key in this.servicesPercent) {
            this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100);
        }

        // Общая сумма
        this.fullPrice = this.screenPrice + this.servicePricesNumber + this.servicePricesPercent;

        // Цена с учетом отката
        this.servicePercentPrice = this.fullPrice - (this.fullPrice * (this.rollback / 100));
    },

    // Настройка ползунка отката
    setupRollbackInput() {
        if (rangeInput && rangeValueSpan) {
            rangeInput.addEventListener('input', (event) => {
                const value = +event.target.value;  // приводим к числу
                rangeValueSpan.textContent = value; // показываем значение
                this.rollback = +value; // сохраняем откат

                // Если расчёт уже был, пересчитываем цену
                if (this.isCalculated) {
                    this.addPrices();
                    totalInput5.value = this.servicePercentPrice;
                }
            });

            // Устанавливаем начальное значение на странице
            rangeValueSpan.textContent = rangeInput.value;
        } else {
            console.error("Не удалось найти элементы для ползунка или значения");
        }
    },

    logger() {
        console.log('Стоимость всех дополнительных услуг:', this.allServicePrices);
        console.log('Скидка:', this.getRollbackMessage(this.fullPrice));
        console.log(`Стоимость за вычетом отката посреднику ${this.servicePercentPrice} рублей`);
        console.log(this.screens);
        console.log(this.services);
    }
}

// Запуск приложения
appData.init();
