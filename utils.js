// Import/Require Packages

import fs from "fs";

// Cash In Commission Percentage and Condition

const cashInCommission = {
    "percents": 0.03,
    "max": {
        "amount": 5,
        "currency": "EUR"
    }
};

// Cash Out Commission Percentage and Condition for Natural Person

const cashOutCommissionForNaturalPerson = {
    "percents": 0.3,
    "week_limit": {
        "amount": 1000,
        "currency": "EUR"
    }
};

// Cash Out Commission Percentage and Condition for Legal Person

const cashOutCommissionForLegalPerson = {
    "percents": 0.3,
    "min": {
        "amount": 0.5,
        "currency": "EUR"
    }
};

// Json Data Reader from file Stream

export const jsonReader = (filePath) => {
    try {
        const jsonString = fs.readFileSync(filePath);
        return JSON.parse(jsonString);
    } catch (err) {
        console.log(err);
        return;
    }
}

// Calculating the first day of the week according to the given date (starting from Monday to Sunday)

const getFirstDayOfTheWeek = (date, days) => {
    const gdate = new Date(date);
    return `${gdate.getFullYear()}-${gdate.getMonth() + 1 < 10 ? '0' + (gdate.getMonth() + 1) : gdate.getMonth() + 1}-${gdate.getDate() - days < 10 ? '0' + (gdate.getDate() - days) : gdate.getDate() - days}`;
}

// Get weekly cash out total amount for specific user

export const getWeeklyCashoutTotal = (transactionDataList, date, user_id, index, previousDays) => {
    let totalCashAmount = 0;
    if (index > 0) {
        for (let i = 0; i < index; i++) {
            if (transactionDataList[i].date >= getFirstDayOfTheWeek(date, previousDays) && transactionDataList[i].date <= date && transactionDataList[i].user_id === user_id && transactionDataList[i].type === 'cash_out') {
                totalCashAmount += transactionDataList[i].operation.amount;
            }
        }
    }
    return totalCashAmount;
}

// Calculating Cashin Commission by checking user type according to given condition

export const calculateCashinCommission = (depositAmount) => {
    if (depositAmount != '' && depositAmount != null && !isNaN(depositAmount)) {
        let cashInCommissionAmount = 0;
        const tempCommissionAmount = depositAmount * (cashInCommission.percents / 100);
        cashInCommissionAmount = tempCommissionAmount > cashInCommission.max.amount ? cashInCommission.max.amount : tempCommissionAmount;
        return cashInCommissionAmount;
    } else {
        return 0;
    }
}

// Calculating Cashout Commission by checking user type and users last transactions within the week according to given condition

export const calculateCashoutCommission = (userType, creditAmount, transactionWithinCurrentWeek) => {
    const week_limit_amount = cashOutCommissionForNaturalPerson.week_limit.amount;
    const min_amount = cashOutCommissionForLegalPerson.min.amount;
    let cashOutCommissionAmount = 0;
    if ((creditAmount != '' && creditAmount != null && transactionWithinCurrentWeek != '' && transactionWithinCurrentWeek != null) || (transactionWithinCurrentWeek == 0 || creditAmount == 0)) {
        if (userType === 'juridical') {
            const tempCommissionAmount = creditAmount * (cashOutCommissionForLegalPerson.percents / 100);
            cashOutCommissionAmount = tempCommissionAmount > min_amount ? tempCommissionAmount : min_amount;
        } else if (userType === 'natural') {
            // Checking whether the user have transaction amount exceeded within the week
            if (transactionWithinCurrentWeek == 0) {
                const exceededAmount = creditAmount > week_limit_amount ? creditAmount - week_limit_amount : 0;
                cashOutCommissionAmount = exceededAmount * (cashOutCommissionForNaturalPerson.percents / 100);
            } else {
                if (transactionWithinCurrentWeek > week_limit_amount) {
                    cashOutCommissionAmount = creditAmount * (cashOutCommissionForNaturalPerson.percents / 100);
                } else {
                    const weeklyCreditAmount = creditAmount + transactionWithinCurrentWeek;
                    const exceededAmount = weeklyCreditAmount > week_limit_amount ? weeklyCreditAmount - week_limit_amount : 0;
                    cashOutCommissionAmount = exceededAmount * (cashOutCommissionForNaturalPerson.percents / 100);
                }
            }
        }
        else {
            cashOutCommissionAmount = 0;
        }
    }
    return cashOutCommissionAmount;
}

// Export functions to access from other file

// module.exports = { jsonReader, getWeeklyCashoutTotal, calculateCashinCommission, calculateCashoutCommission };

