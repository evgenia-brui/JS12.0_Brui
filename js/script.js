let money = +prompt('Ваш месячный доход?', 500), // любое число “Доход за месяц”
    income = '5', // строка с дополнительными доходом (например: фриланс)
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'бензин, подарки'), // строка (интернет, такси, коммуналка)
    deposit = confirm('Есть ли у вас депозит в банке?'), // любое булево значение
    expenses1 = prompt('Введите обязательную статью расходов', 'интернет'),
    amount1 = +prompt('Во сколько это обойдется?', 35),
    expenses2 = prompt('Введите обязательную статью расходов', 'коммуналка'),
    amount2 = +prompt('Во сколько это обойдется?', 70),
    mission = 4000, // любое число (Какую сумму хотите накопить)
    period = 12,
    expensesMonth,
    accumulatedMonth,
    targetMonth,
    budgetDay,
    statusIncome;

// Возвращает сумму всех обязательных расходов за месяц
const getExpensesMonth = amounts => amounts.reduce((amount, sum) => amount + sum, 0);

// Возвращает накопления за месяц (Доходы минус расходы)
const getAccumulatedMonth = (money, income, expensesMonth) => money + +income - expensesMonth;

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

expensesMonth = getExpensesMonth([amount1, amount2]);
accumulatedMonth = getAccumulatedMonth(money, income, expensesMonth);
targetMonth = getTargetMonth(mission, accumulatedMonth);
budgetDay = getBudgetDay(accumulatedMonth);
statusIncome = getStatusIncome(budgetDay);

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);
console.log('Расходы за месяц: ' + expensesMonth);
console.info('Возможные расходы');
console.log(addExpenses.toLowerCase().split(', '));
console.log('Цель будет достигнута за ' + targetMonth + ' мес');
console.log('Бюджет на день: ' + Math.floor(budgetDay) + ' BYN');
console.log(statusIncome);