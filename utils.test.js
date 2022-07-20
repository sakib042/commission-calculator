const { jsonReader, getWeeklyCashoutTotal, calculateCashinCommission, calculateCashoutCommission } = require("./utils");

const transactionData = [
    {
        "date": "2016-01-05",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_in",
        "operation": {
            "amount": 200.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-06",
        "user_id": 2,
        "user_type": "juridical",
        "type": "cash_out",
        "operation": {
            "amount": 300.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-06",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 30000,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-07",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 1000.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-07",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 100.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-10",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 100.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-10",
        "user_id": 2,
        "user_type": "juridical",
        "type": "cash_in",
        "operation": {
            "amount": 1000000.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-01-10",
        "user_id": 3,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 1000.00,
            "currency": "EUR"
        }
    },
    {
        "date": "2016-02-15",
        "user_id": 1,
        "user_type": "natural",
        "type": "cash_out",
        "operation": {
            "amount": 300.00,
            "currency": "EUR"
        }
    }
];

// Check json data

test('get customer transaction data list', () => {
    const arrayFromJson = jsonReader('./input.json');
    expect(arrayFromJson).toStrictEqual(transactionData);
});

// Check weekly cash out amount total

test('get weekly cash out request amount', () => {
    const weeklyAmount = getWeeklyCashoutTotal(transactionData, '2016-01-07', 1, 4, 3);
    expect(weeklyAmount).toBe(31000);
});

test('get weekly cash out request amount', () => {
    const weeklyAmount = getWeeklyCashoutTotal(transactionData, '2016-01-07', 1, 5, 4);
    expect(weeklyAmount).toBe(31100);
});

test('get weekly cash out request amount', () => {
    const weeklyAmount = getWeeklyCashoutTotal(transactionData, '2016-01-05', 1, 2, 1);
    expect(weeklyAmount).toBe(0);
});

test('get weekly cash out request amount', () => {
    const weeklyAmount = getWeeklyCashoutTotal(transactionData, '2016-01-06', 2, 3, 2);
    expect(weeklyAmount).toBe(300);
});

// Check Cash in commission amount

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission(300);
    expect(cashInCommission).toBe(0.09);
});

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission(600000);
    expect(cashInCommission).toBe(5);
});

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission(null);
    expect(cashInCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission('null');
    expect(cashInCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission(0);
    expect(cashInCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashInCommission = calculateCashinCommission();
    expect(cashInCommission).toBe(0);
});


// Check Cash out commission amount

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 300, 900);
    expect(cashOutCommission).toBe(0.6);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 30000, 0);
    expect(cashOutCommission).toBe(87);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 100, 31000);
    expect(cashOutCommission).toBe(0.3);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 1000, 1100);
    expect(cashOutCommission).toBe(3);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 'fail', 'fail again');
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 'fail', '0');
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('natural', 0, '0');
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('juridical', 300, 1100);
    expect(cashOutCommission).toBe(0.90);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('juridical', 400, 0);
    expect(cashOutCommission).toBe(1.20);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission('something', 400, 0);
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission(null);
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission(null, 0, 0);
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission(0, 0, 0);
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission(0);
    expect(cashOutCommission).toBe(0);
});

test('get cash in commission amount', () => {
    const cashOutCommission = calculateCashoutCommission();
    expect(cashOutCommission).toBe(0);
});