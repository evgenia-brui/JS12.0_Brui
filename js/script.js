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

    start() {
        console.log('start');
        const _this = this;
        this.budget = +salaryAmount.value;
    
        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpInc('addIncome', 'array');
        this.getAddExpInc('addExpenses');
        this.getBudget();
        this.getInfoDeposit();
        this.showResult();
    
        const dataInputText = calcForm.querySelectorAll('.data input[type="text"]');
        const dataInputTextArray = Array.prototype.slice.call(dataInputText);
        dataInputTextArray.forEach((input) => {
            input.setAttribute('readonly', true);
        });
        btnCalculate.style.display = 'none';
        btnCancel.style.display = 'block';
    
        periodSelect.addEventListener('input', _this.showResult.bind(_this));
        btnPlusExpenses.removeEventListener('click', _this.addExpensesBlock);
        btnPlusIncome.removeEventListener('click', _this.addIncomeBlock);
    }
    reset() {
        console.log('reset');
        const _this = this;
        const calcFormInputs = calcForm.querySelectorAll('input');
        const calcFormInputsArray = Array.prototype.slice.call(calcFormInputs);
        calcFormInputsArray.forEach((input) => {
            input.value = '';
            input.removeAttribute('readonly');
        });
        btnCalculate.style.display = 'block';
        btnCancel.style.display = 'none';
        btnCalculate.disabled = true;
        btnPlusExpenses.style.display = 'block';
        btnPlusIncome.style.display = 'block';
        btnPlusExpenses.addEventListener('click', _this.addExpensesBlock);
        btnPlusIncome.addEventListener('click', _this.addIncomeBlock);
        expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems.forEach((item, key) => {
            if (key !== 0) {
                item.remove();
            }
        });
        incomeItems = document.querySelectorAll('.income-items');
        incomeItems.forEach((item, key) => {
            if (key !== 0) {
                item.remove();
            }
        });
        periodSelect.value = 1;
        periodAmount.textContent = periodSelect.value;
        //periodSelect.removeEventListener('input', _this.showResult.bind(_this));
        periodSelect.removeEventListener('input', _this.showResult);
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
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
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
    getInfoDeposit() {
        if (this.deposit) {
            do {
                this.percentDeposit = +prompt('Какой годовой процент?', 14);
            } while (!isNumber(this.percentDeposit));
            do {
                this.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
            } while (!isNumber(this.moneyDeposit));
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
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') == 'Наименование') {
            target.value = target.value.replace(/[^а-яА-ЯёЁ\-,\s\.:]/g, '');
        }
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') == 'Сумма') {
            target.value = target.value.replace(/[^\d]/g, '');
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
        btnPlusExpenses.addEventListener('click', _this.addExpIncBlock);
        btnPlusIncome.addEventListener('click', _this.addExpIncBlock);
        periodSelect.addEventListener('input', _this.selectPeriod);
        calcForm.addEventListener('input', _this.validate);
    }
};

const appData = new AppData();
appData.eventsListeners();
console.log(appData);