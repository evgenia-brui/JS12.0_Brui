"use strict";

const calcForm = document.querySelector('.calc'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    incomeAmount = document.querySelector('.income-amount'),
    btnPlusIncome = document.getElementsByTagName('button')[0],
    additionalIncomes = document.querySelectorAll('.additional_income-item'),
    expensesTitle = document.querySelector('.expenses-title'),
    btnPlusExpenses = document.getElementsByTagName('button')[1],
    additionalExpensesItems = document.querySelector('.additional_expenses-item'),
    checkboxDeposit = document.querySelector('#deposit-check'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    budgetMonth = document.querySelector('.budget_month-value'),
    budgetDay = document.getElementsByClassName('budget_day-value')[0],
    expensesMonth = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncome = document.getElementsByClassName('additional_income-value')[0],
    additionalExpenses = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriod = document.getElementsByClassName('income_period-value')[0],
    targetMonth = document.getElementsByClassName('target_month-value')[0],
    periodAmount = document.querySelector('.period-amount'),
    btnCalculate = document.getElementById('start'),
    btnCancel = document.getElementById('cancel');

let inputName = document.querySelectorAll('[placeholder="Наименование"]'),
    inputSum = document.querySelectorAll('[placeholder="Сумма"]'),
    incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');

// Проверка на число
const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && n != 0;
// Проверка на пустоту
const isEmpty = s => s == null || !s || s.trim() == '';

class AppData {
    constructor() {
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
    }
    // Установлены ли куки и проверка на целостность кук
    isCookie() {
        let isLoad;
        let allCookie = {};
        document.cookie.split('; ').map((cookie) => {
            allCookie[cookie.split('=')[0]] = cookie.split('=')[1];
            if (cookie.split('=')[0] === 'isLoad') {
                isLoad = cookie.split('=')[1];
            }
        });
        // здесь проверим на соответсвие кук и localStorage
        let keys = Object.keys(localStorage);
        for (let key of keys) {
            if (localStorage.getItem(key) != allCookie[key]) {
                this.reset();
                return false;
            }
        }
        return isLoad ? true : false;
    }
    // Запишем куки и localStorage
    setCookie() {
        let date = new Date(Date.now() + 86400e3); // +1 день от текущей даты
        date = date.toUTCString();

        const resultInput = calcForm.querySelectorAll('.result input[type="text"]');
        const resultInputArray = Array.prototype.slice.call(resultInput);
        resultInputArray.forEach((input) => {
            const name = input.className.split(' ')[1];
            document.cookie = name + '=' + input.value + '; path=/; expires=' + date;
            localStorage.setItem(name, input.value);
        });

        document.cookie = name + 'isLoad=true; path=/; expires=' + date;
    }
    // Достанем данные из кук
    getCookie() {
        document.cookie.split('; ').map((cookie) => {
            if (cookie.split('=')[0] !== 'isLoad') {
                document.querySelector('.' + cookie.split('=')[0]).value = cookie.split('=')[1];
            }
        });
        this.lockForm();
        periodSelect.disabled = true;
    }
    // Удаляем куки и localStorage
    removeCookie() {
        let date = new Date(Date.now()); // текущий момент, чтобы куки удалились
        date = date.toUTCString();
        document.cookie.split('; ').map((cookie) => {
            document.cookie = cookie.split('=')[0] + '=' + cookie.split('=')[1] + '; path=/; expires=' + date;
        });
        localStorage.clear();
    }
    // Расчитаем все и заблокируем форму
    start() {
        console.log('start');
        const _this = this;
        this.budget = +salaryAmount.value;
    
        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpInc('addIncome', 'array');
        this.getAddExpInc('addExpenses');
        this.getInfoDeposit();
        this.getBudget();
        this.showResult();
        this.setCookie();
        this.lockForm();
        periodSelect.disabled = false;
    }
    // Сбрасываем форму до первоначального состояния
    reset() {
        console.log('reset');
        const _this = this;
        this.unlockForm();
        this.removeCookie();
        btnPlusExpenses.style.display = 'block';
        btnPlusIncome.style.display = 'block';

        expensesItems = document.querySelectorAll('.expenses-items');
        incomeItems = document.querySelectorAll('.income-items');
        const count = (item, key) => {
            if (key !== 0) {
                item.remove();
            }
        };
        expensesItems.forEach(count);
        incomeItems.forEach(count);

        checkboxDeposit.checked = false;
        this.depositHandler();

        periodSelect.value = 1;
        periodAmount.textContent = periodSelect.value;
        periodSelect.disabled = true;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
    }
    // Блокируем форму
    lockForm() {
        const dataInputText = calcForm.querySelectorAll('.data input[type="text"]');
        const dataInputTextArray = Array.prototype.slice.call(dataInputText);
        dataInputTextArray.forEach((input) => {
            input.setAttribute('disabled', true);
        });

        btnCalculate.style.display = 'none';
        btnCancel.style.display = 'block';

        btnPlusIncome.disabled = true;
        btnPlusExpenses.disabled = true;
        checkboxDeposit.disabled = true;
    }
    // Разблокируем форму
    unlockForm() {
        const dataInputText = calcForm.querySelectorAll('.data input');
        const dataInputTextArray = Array.prototype.slice.call(dataInputText);
        dataInputTextArray.forEach((input) => {
            input.value = '';
            input.removeAttribute('disabled');
        });

        const resultInputText = calcForm.querySelectorAll('.result input');
        const resultInputTextArray = Array.prototype.slice.call(resultInputText);
        resultInputTextArray.forEach((input) => {
            input.value = '';
        });

        btnCalculate.style.display = 'block';
        btnCancel.style.display = 'none';

        btnCalculate.disabled = true;
        btnPlusIncome.disabled = false;
        btnPlusExpenses.disabled = false;
        checkboxDeposit.disabled = false;
        periodSelect.disabled = true;
    }
    showResult() {
        console.log('showResult');
        budgetMonth.value = this.budgetMonth;
        budgetDay.value = Math.floor(this.budgetDay);
        expensesMonth.value = this.expensesMonth;
        additionalExpenses.value = this.addExpenses.join(', ');
        additionalIncome.value = this.addIncome.join(', ');
        targetMonth.value = this.getTargetMonth();
        incomePeriod.value = this.calcPeriod();
    }
    addExpIncBlock() {
        let classElem = 'income';
        this.className.split(' ').map((item) => {
            if (item.indexOf('_add') > 0) {
                classElem = item.split('_')[0];
            }
        });
        let items = classElem === 'income' ? incomeItems : expensesItems;
        let btn = classElem === 'income' ? btnPlusIncome : btnPlusExpenses;
        const cloneItem = items[0].cloneNode(true);
        cloneItem.querySelectorAll('input')[0].value = '';
        cloneItem.querySelectorAll('input')[1].value = '';
        items[0].parentNode.insertBefore(cloneItem, btn);
        items = document.querySelectorAll(`.${classElem}-items`);
        if (items.length === 3) {
            btn.style.display = 'none';
        }
        inputName = document.querySelectorAll('[placeholder="Наименование"]');
        inputSum = document.querySelectorAll('[placeholder="Сумма"]');
    }
    getExpInc() {
        expensesItems = document.querySelectorAll('.expenses-items');
        incomeItems = document.querySelectorAll('.income-items');

        const count = item => {
            const startStr = item.className.split('-')[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = item.querySelector(`.${startStr}-amount`).value;
            if (itemTitle !== '' && itemAmount !== '') {
                this[startStr][itemTitle] = +itemAmount;
            }
        };

        expensesItems.forEach(count);
        incomeItems.forEach(count);

        for (const key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
    getAddExpInc(elem, type) {
        const count = (item) => {
            let itemValue = '';
            itemValue = type === 'array' ? item.value.trim() : item.trim();
            if (!isEmpty(itemValue)) {
                this[elem].push(itemValue);
            }
        };

        if (type === 'array') {
            additionalIncomes.forEach(count);
        } else {
            const additionalExpenses = additionalExpensesItems.value.split(',');
            additionalExpenses.forEach(count);
        }
    }
    // Возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth() {
        this.expensesMonth = Object.values(this.expenses).reduce((amount, sum) => amount + sum, 0);
    }
    // Возвращает накопления за месяц (Доходы минус расходы)
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = this.budgetMonth / 30;
    }
    // Подсчитывает за какой период будет достигнута цель
    getTargetMonth() {
        return Math.ceil(targetAmount.value / this.budgetMonth);
    }
    // Возвращает уровень дохода
    getStatusIncome() {
        if (this.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay >= 600) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay >= 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что-то пошло не так';
        }
    }
    selectPeriod() {
        periodAmount.textContent = periodSelect.value;
    }
    calcPeriod() {
        return this.budgetMonth * periodSelect.value;
    }
    validate(event) {
        const target = event.target;
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') === 'Наименование') {
            target.value = target.value.replace(/[^а-яА-ЯёЁ\-,\s\.:]/g, '');
        }
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') === 'Сумма') {
            target.value = target.value.replace(/[^\d]/g, '');
        }
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') === 'Процент') {
            if (!isNumber(target.value) || target.value < 0 || target.value > 100) {
                alert('Введите корректное значение в поле проценты');
                btnCalculate.disabled = true;
            } else {
                if (salaryAmount.value != '') {
                    btnCalculate.disabled = false;
                }
            }
        }
    }
    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }
    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === 'other') {
            depositPercent.style.display = 'block';
        } else {
            depositPercent.value = valueSelect;
            depositPercent.style.display = 'none';
        }
    }
    depositHandler() {
        if (checkboxDeposit.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }
    eventsListeners() {
        console.log('eventsListeners');
        const _this = this;
        btnCalculate.disabled = true;
        salaryAmount.addEventListener('input', () => {
            btnCalculate.disabled = salaryAmount.value != '' ? false : true;
        });
        btnCalculate.addEventListener('click', _this.start.bind(_this));
        btnCancel.addEventListener('click', _this.reset.bind(_this));
        periodSelect.addEventListener('input', _this.selectPeriod);
        periodSelect.addEventListener('input', _this.showResult.bind(_this));
        periodSelect.disabled = true;
        calcForm.addEventListener('input', _this.validate);
        btnPlusExpenses.addEventListener('click', _this.addExpIncBlock);
        btnPlusIncome.addEventListener('click', _this.addExpIncBlock);
        checkboxDeposit.addEventListener('change', _this.depositHandler.bind(_this));
    }
};

const appData = new AppData();
appData.eventsListeners();

if (appData.isCookie()) {
    appData.getCookie();
}

console.log(appData);