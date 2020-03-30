const money = +prompt('Ваш месячный доход?', 500), // любое число “Доход за месяц”
    income = '5', // строка с дополнительными доходом (например: фриланс)
    addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'бензин, подарки'), // строка (интернет, такси, коммуналка)
    deposit = confirm('Есть ли у вас депозит в банке?'), // любое булево значение
    expenses1 = prompt('Введите обязательную статью расходов', 'интернет'),
    amount1 = +prompt('Во сколько это обойдется?', 35),
    expenses2 = prompt('Введите обязательную статью расходов', 'коммуналка'),
    amount2 = +prompt('Во сколько это обойдется?', 70),
    mission = 4000, // любое число (Какую сумму хотите накопить)
    period = 12; // число от 1 до 12 (месяцев)

console.info('Тип данных значений переменных money, income, deposit');
console.log('type money: ' + typeof money);
console.log('type income: ' + typeof income);
console.log('type deposit: ' + typeof deposit);

console.info('Длина строки addExpenses');
console.log(addExpenses.length);

console.info('Период равен ' + period + ' месяцев');
console.info('Цель накопить ' + mission + ' BYN');

console.info('Привести строку addExpenses к нижнему регистру и разбить строку на массив');
console.log(addExpenses.toLowerCase().split(', '));

const budgetMonth = money - (amount1 + amount2);
console.log('Бюджет на месяц: ' + budgetMonth + ' BYN');

const budgetDay = budgetMonth / 30;
console.log('Бюджет на день: ' + Math.floor(budgetDay) + ' BYN');

const missionComplete = Math.ceil(mission / budgetMonth);
console.log('Цель будет достигнута за ' + missionComplete + ' мес');

let yourIncomeLevel = '';
if (budgetDay >= 1200) {
    yourIncomeLevel = 'У вас высокий уровень дохода';
} else if (budgetDay >= 600) {
    yourIncomeLevel = 'У вас средний уровень дохода';
} else if (budgetDay >= 0) {
    yourIncomeLevel = 'К сожалению у вас уровень дохода ниже среднего';
} else {
    yourIncomeLevel = 'Что-то пошло не так';
}

console.log(yourIncomeLevel);