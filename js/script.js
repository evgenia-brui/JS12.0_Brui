let money;
// Запрашивает исходные данные
const start = () => {
    do {
        money = +prompt('Ваш месячный доход?');
    } while (!isNumber(money));
};

// Проверка на число
const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && n != 0;
// Проверка на пустоту
const isEmpty = s => s == null || !s || s.trim() == '';

start();

let appData = {
    budget: money,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    mission: 4000,
    period: 12,
    asking: function() {
        if (confirm('Есть ли у вас допольнительные источник заработка?')) {
            let itemIncome, cashIncome;
            do {
                itemIncome = prompt('Какой у вас дополнительные заработок?', 'Фриланс');
            } while (isEmpty(itemIncome) || isNumber(itemIncome));
            do {
                cashIncome = +prompt('Сколько в месяц вы на этом зарабатываете?', 150);
            } while (!isNumber(cashIncome));
            appData.income[itemIncome] = cashIncome;
        }
        for (let i = 0; i < 2; i++) {
            let expensText, expensValue;
            do {
                expensText = prompt('Введите обязательную статью расходов', 'интернет');
            } while (isEmpty(expensText) || isNumber(expensText));
            do {
                expensValue = +prompt('Во сколько это обойдется?', 35);
            } while (!isNumber(expensValue));
            appData.expenses[expensText] = expensValue;
        }
        let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'бензин, подарки'); // строка (интернет, такси, коммуналка)
        appData.addExpenses = addExpenses.toLowerCase().split(', ');
        appData.deposit = confirm('Есть ли у вас депозит в банке?'); // любое булево значение
    },
    // Возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth: () => {
        appData.expensesMonth = Object.values(appData.expenses).reduce((amount, sum) => amount + sum, 0);
    },
    // Возвращает накопления за месяц (Доходы минус расходы)
    getBudget: () => {
        appData.budgetMonth = appData.budget - appData.expensesMonth;
        appData.budgetDay = appData.budgetMonth / 30;
    },
    // Подсчитывает за какой период будет достигнута цель
    getTargetMonth: () => Math.ceil(appData.mission / appData.budgetMonth),
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
    calcSavedMoney: () => appData.budgetMonth * appData.period
};

appData.asking();
appData.getExpensesMonth();
appData.getBudget();
appData.getInfoDeposit();

console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log(appData.getTargetMonth() < 0 ? 'Цель не будет достигнута' : `Цель будет достигнута за ${appData.getTargetMonth()} мес`);
console.log(appData.getStatusIncome());

console.log(appData.addExpenses.map(expens => expens[0].toUpperCase() + expens.slice(1)).join(', '));

//console.log(appData);
console.log('Наша программа включает в себя данные:');
for (let property in appData) {
    console.log(property + ': ' + appData[property]);
}