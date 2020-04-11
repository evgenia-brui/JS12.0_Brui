"use strict";

let calcForm = document.querySelector('.calc'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    incomeAmount = document.querySelector('.income-amount'),
    btnPlusIncome = document.getElementsByTagName('button')[0],
    additionalIncomes = document.querySelectorAll('.additional_income-item'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
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
    incomeItem = document.querySelectorAll('.income-items'),
    periodAmount = document.querySelector('.period-amount'),
    inputName = document.querySelectorAll('[placeholder="Наименование"]'),
    inputSum = document.querySelectorAll('[placeholder="Сумма"]'),
    btnCalculate = document.getElementById('start'),
    btnCancel = document.getElementById('cancel');

// Проверка на число
const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && n != 0;
// Проверка на пустоту
const isEmpty = s => s == null || !s || s.trim() == '';

let appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    start: function() {
        this.budget = +salaryAmount.value;

        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        this.getInfoDeposit();
        this.showResult();

        const dataInputText = calcForm.querySelectorAll('.data input[type="text"]');
        const dataInputTextArray = Array.prototype.slice.call(dataInputText);
        dataInputTextArray.forEach(function (input) {
            input.setAttribute('readonly', true);
        });
        btnCalculate.style.display = 'none';
        btnCancel.style.display = 'block';

        periodSelect.addEventListener('input', this.showResult.bind(appData));
    },
    reset: function() {
        const calcFormInputs = calcForm.querySelectorAll('input');
        const calcFormInputsArray = Array.prototype.slice.call(calcFormInputs);
        calcFormInputsArray.forEach(function (input) {
            input.value = '';
            input.removeAttribute('readonly');
        });
        btnCalculate.style.display = 'block';
        btnCancel.style.display = 'none';
        btnCalculate.disabled = true;
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
    },
    showResult: function() {
        budgetMonth.value = this.budgetMonth;
        budgetDay.value = Math.floor(this.budgetDay);
        expensesMonth.value = this.expensesMonth;
        additionalExpenses.value = this.addExpenses.join(', ');
        additionalIncome.value = this.addIncome.join(', ');
        targetMonth.value = this.getTargetMonth();
        incomePeriod.value = this.calcPeriod();
    },
    addExpensesBlock: function() {
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        cloneExpensesItem.querySelectorAll('input')[0].value = '';
        cloneExpensesItem.querySelectorAll('input')[1].value = '';
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnPlusExpenses);
        expensesItems = document.querySelectorAll('.expenses-items');
        if (expensesItems.length === 3) {
            btnPlusExpenses.style.display = 'none';
        }
        inputName = document.querySelectorAll('[placeholder="Наименование"]');
        inputSum = document.querySelectorAll('[placeholder="Сумма"]');
    },
    addIncomeBlock: function() {
        let cloneIncomeItem = incomeItem[0].cloneNode(true);
        cloneIncomeItem.querySelectorAll('input')[0].value = '';
        cloneIncomeItem.querySelectorAll('input')[1].value = '';
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, btnPlusIncome);
        incomeItem = document.querySelectorAll('.income-items');
        if (incomeItem.length === 3) {
            btnPlusIncome.style.display = 'none';
        }
        inputName = document.querySelectorAll('[placeholder="Наименование"]');
        inputSum = document.querySelectorAll('[placeholder="Сумма"]');
    },
    getExpenses: function() {
        expensesItems.forEach((item) => {
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                this.expenses[itemExpenses] = +cashExpenses;
            }
        });
    },
    getIncome: function() {
        incomeItem.forEach((item) => {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if (itemIncome !== '' && cashIncome !== '') {
                this.income[itemIncome] = cashIncome;
            }
        });

        for (let key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    },
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItems.value.split(',');
        addExpenses.forEach((item) => {
            if (!isEmpty(item)) {
                this.addExpenses.push(item.trim());
            }
        });
    },
    getAddIncome: function() {
        additionalIncomes.forEach((item) => {
            let itemValue = item.value.trim();
            if (!isEmpty(itemValue)) {
                this.addIncome.push(itemValue);
            }
        });
    },
    // Возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth: function() {
        this.expensesMonth = Object.values(this.expenses).reduce((amount, sum) => amount + sum, 0);
    },
    // Возвращает накопления за месяц (Доходы минус расходы)
    getBudget: function() {
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = this.budgetMonth / 30;
    },
    // Подсчитывает за какой период будет достигнута цель
    getTargetMonth: function() {
        return Math.ceil(targetAmount.value / this.budgetMonth);
    },
    // Возвращает уровень дохода
    getStatusIncome: function() {
        if (this.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay >= 600) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay >= 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что-то пошло не так';
        }
    },
    getInfoDeposit: function() {
        if (this.deposit) {
            do {
                this.percentDeposit = +prompt('Какой годовой процент?', 14);
            } while (!isNumber(this.percentDeposit));
            do {
                this.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
            } while (!isNumber(this.moneyDeposit));
        }
    },
    selectPeriod: function() {
        periodAmount.textContent = periodSelect.value;
    },
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;
    },
    validate: (event) => {
        const target = event.target;
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') == 'Наименование') {
            target.value = target.value.replace(/[^а-яА-ЯёЁ\-,\s\.:]/g, '');
        }
        if (target.hasAttribute('placeholder') && target.getAttribute('placeholder') == 'Сумма') {
            target.value = target.value.replace(/[^\d]/g, '');
        }
    },
};

btnCalculate.disabled = true;
salaryAmount.addEventListener('input', function () {
    btnCalculate.disabled = salaryAmount.value != '' ? false : true;
});
btnCalculate.addEventListener('click', appData.start.bind(appData));
btnCancel.addEventListener('click', appData.reset.bind(appData));
btnPlusExpenses.addEventListener('click', appData.addExpensesBlock);
btnPlusIncome.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', appData.selectPeriod);
calcForm.addEventListener('input', appData.validate);

//console.log(appData.getTargetMonth() < 0 ? 'Цель не будет достигнута' : `Цель будет достигнута за ${appData.getTargetMonth()} мес`);
//console.log(appData);