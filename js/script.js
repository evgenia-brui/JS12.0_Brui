let money,
    income = 'фриланс', // строка с дополнительными доходом (например: фриланс)
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'бензин, подарки'), // строка (интернет, такси, коммуналка)
    deposit = confirm('Есть ли у вас депозит в банке?'), // любое булево значение
    expenses = [],
    amounts = [],
    mission = 4000, // любое число (Какую сумму хотите накопить)
    period = 12,
    expensesMonth,
    accumulatedMonth,
    targetMonth,
    budgetDay,
    statusIncome;

// Проверка на число
const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

// Запрашивает исходные данные
const start = () => {
    do {
        money = prompt('Ваш месячный доход?');
    } while (!isNumber(money));
};

// Возвращает сумму всех обязательных расходов за месяц
const getExpensesMonth = () => {
    for (let i = 0; i < 4; i++) {
        expenses[i] = prompt('Введите обязательную статью расходов', 'интернет');
        do {
            // без плюса prompt записывает естественно строку и тогда reduce складывает строки (даже с +amount) o_O
            // но с плюсом prompt пребразовывает пустую строку в "число" и пропускает дальше
            amounts[i] = +prompt('Во сколько это обойдется?', 35);
        } while (!isNumber(amounts[i]));
    }
    return amounts.reduce((amount, sum) => amount + sum, 0);
};

// Возвращает накопления за месяц (Доходы минус расходы)
const getAccumulatedMonth = (money, expensesMonth) => money - expensesMonth;

// Подсчитывает за какой период будет достигнута цель
const getTargetMonth = (mission, accumulatedMonth) => Math.ceil(mission / accumulatedMonth);

// Дневной бюджет
const getBudgetDay = accumulatedMonth => accumulatedMonth / 30;

// Уровень дохода
const getStatusIncome = budgetDay => {
    if (budgetDay >= 1200) {
        return 'У вас высокий уровень дохода';
    } else if (budgetDay >= 600) {
        return 'У вас средний уровень дохода';
    } else if (budgetDay >= 0) {
        return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
        return 'Что-то пошло не так';
    }
};

// Выводит в консоль тип переменной
const showTypeOf = variable => console.log(variable, typeof variable);

start();
expensesMonth = getExpensesMonth();
accumulatedMonth = getAccumulatedMonth(money, expensesMonth);
targetMonth = getTargetMonth(mission, accumulatedMonth);
budgetDay = getBudgetDay(accumulatedMonth);
statusIncome = getStatusIncome(budgetDay);

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);
console.log('Расходы за месяц: ' + expensesMonth);
console.info('Возможные расходы');
console.log(addExpenses.toLowerCase().split(', '));
console.log(targetMonth < 0 ? 'Цель не будет достигнута' : `Цель будет достигнута за ${targetMonth} мес`);
console.log('Бюджет на день: ' + Math.floor(budgetDay) + ' BYN');
console.log(statusIncome);