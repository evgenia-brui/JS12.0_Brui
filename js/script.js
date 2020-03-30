const money = 500, // любое число “Доход за месяц”
    income = '5', // строка с дополнительными доходом (например: фриланс)
    addExpenses = '35, 10, 70', // строка (интернет, такси, коммуналка)
    deposit = true; // любое булево значение
    mission = 4000, // любое число (Какую сумму хотите накопить)
    period = 12; // число от 1 до 12 (месяцев)

console.info('Тип данных значений переменных money, income, deposit');
console.log('type money: ' + typeof money);
console.log('type income: ' + typeof income);
console.log('type deposit: ' + typeof deposit);

console.info('Длина строки addExpenses');
console.log(addExpenses.length);

console.info('Период равен ' + period + ' месяцев');
console.info('Цель накопить ' + mission + ' юани');

console.info('Привести строку addExpenses к нижнему регистру и разбить строку на массив');
console.log(addExpenses.toLowerCase().split(', '));

console.info('Объявить переменную budgetDay и присвоить дневной бюджет (доход за месяц / 30)');
const budgetDay = money / 30;
console.log(budgetDay);