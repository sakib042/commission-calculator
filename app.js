// import from utils

const { jsonReader, getWeeklyCashoutTotal, calculateCashinCommission, calculateCashoutCommission } = require("./utils.js");

const inputFileLink = process.argv.slice(2).toString();
const transactionData = jsonReader(inputFileLink);

// Feeding the given input to calculate the commission

transactionData.forEach((element, index) => {
    calculateCommission(element, index);
});

// Differentiate transaction type for each transaction and calculate commision accordingly

function calculateCommission(elm, index) {
    const { date, user_id, user_type, type, operation } = elm;
    const day = new Date(date).getDay();
    const { amount, currency } = operation;
    if (currency === 'EUR') {
        let commission = 0;
        if (type === 'cash_in') {
            commission = calculateCashinCommission(amount);
        } else {
            //Checking which day of the week it is and pass parameter to calculate current weeks withdraw amount and requested credit amount nad user type
            switch (day) {
                case 0:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 6));
                    break;
                case 1:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 0));
                    break;
                case 2:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 1));
                    break;
                case 3:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 2));
                    break;
                case 4:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 3));
                    break;
                case 5:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 4));
                    break;
                case 6:
                    commission = calculateCashoutCommission(user_type, amount, getWeeklyCashoutTotal(transactionData, date, user_id, index, 5));
                    break;
                default:
                    commission = 0;
                    console.log('Invalid day of the week.!');
                    break;
            }
        }
        console.log(commission.toFixed(2));
    } else {
        console.log('Invalid Currency.!');
    }
}