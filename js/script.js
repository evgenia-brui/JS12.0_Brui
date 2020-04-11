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
    btnCalculate = document.getElementById('start');

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
        appData.budget = +salaryAmount.value;

        appData.getExpenses();
        appData.getIncome();
        appData.getExpensesMonth();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.getBudget();
        appData.getInfoDeposit();
        appData.showResult();

        periodSelect.addEventListener('input', appData.showResult);
    },
    showResult: function() {
        budgetMonth.value = appData.budgetMonth;
        budgetDay.value = Math.floor(appData.budgetDay);
        expensesMonth.value = appData.expensesMonth;
        additionalExpenses.value = appData.addExpenses.join(', ');
        additionalIncome.value = appData.addIncome.join(', ');
        targetMonth.value = Math.ceil(appData.getTargetMonth());
        incomePeriod.value = appData.calcPeriod();
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
        expensesItems.forEach(function(item) {
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if (itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = +cashExpenses;
            }
        });
    },
    getIncome: function() {
        incomeItem.forEach(function(item) {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if (itemIncome !== '' && cashIncome !== '') {
                appData.income[itemIncome] = cashIncome;
            }
        });

        for (let key in appData.income) {
            appData.incomeMonth += +appData.income[key];
        }
    },
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItems.value.split(',');
        addExpenses.forEach(function(item) {
            if (!isEmpty(item)) {
                appData.addExpenses.push(item.trim());
            }
        });
    },
    getAddIncome: function() {
        additionalIncomes.forEach(function(item) {
            let itemValue = item.value.trim();
            if (!isEmpty(itemValue)) {
                appData.addIncome.push(itemValue);
            }
        });
    },
    // Возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth: () => {
        appData.expensesMonth = Object.values(appData.expenses).reduce((amount, sum) => amount + sum, 0);
    },
    // Возвращает накопления за месяц (Доходы минус расходы)
    getBudget: () => {
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = appData.budgetMonth / 30;
    },
    // Подсчитывает за какой период будет достигнута цель
    getTargetMonth: () => Math.ceil(targetAmount.value / appData.budgetMonth),
    // Возвращает уровень дохода
    getStatusIncome: () => {
        if (appData.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (appData.budgetDay >= 600) {
            return 'У вас средний уровень дохода';
        } else if (appData.budgetDay >= 0) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Что-то пошло не так';
        }
    },
    getInfoDeposit: () => {
        if (appData.deposit) {
            do {
                appData.percentDeposit = +prompt('Какой годовой процент?', 14);
            } while (!isNumber(appData.percentDeposit));
            do {
                appData.moneyDeposit = +prompt('Какая сумма заложена?', 10000);
            } while (!isNumber(appData.moneyDeposit));
        }
    },
    selectPeriod: () => periodAmount.textContent = periodSelect.value,
    calcPeriod: () => appData.budgetMonth * periodSelect.value,
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
    btnCalculate.disabled = false;
});
btnCalculate.addEventListener('click', appData.start);
btnPlusExpenses.addEventListener('click', appData.addExpensesBlock);
btnPlusIncome.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', appData.selectPeriod);
calcForm.addEventListener('input', appData.validate);

//console.log(appData.getTargetMonth() < 0 ? 'Цель не будет достигнута' : `Цель будет достигнута за ${appData.getTargetMonth()} мес`);
console.log(appData);