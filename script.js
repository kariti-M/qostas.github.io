// script.js

function initializeLists() {
    const numberOfLists = document.getElementById('numberOfLists').value;
    const listNameEntries = document.getElementById('listNameEntries');
    listNameEntries.innerHTML = '';

    for (let i = 0; i < numberOfLists; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <label class="rtl-label" for="name-${i}">اسم الشخص ${i + 1}:</label>
            <input type="text" id="name-${i}" placeholder="الاسم" dir="rtl">
        `;
        listNameEntries.appendChild(div);
    }
}

function createLists() {
    const numberOfLists = document.getElementById('numberOfLists').value;
    const listContainers = document.getElementById('listContainers');
    listContainers.innerHTML = '';

    for (let i = 0; i < numberOfLists; i++) {
        const name = document.getElementById(`name-${i}`).value;
        const div = document.createElement('div');
        div.id = `person-container-${i}`;
        div.innerHTML = `
            <h3>المصاريف لـ ${name}:</h3>
            <div id="expenses-${i}"></div>
            <input type="number" id="expense-input-${i}" min="0" placeholder="المصاريف" dir="rtl">
            <button onclick="addExpense(${i})">أضف</button>
        `;
        listContainers.appendChild(div);
    }
}

function addExpense(index) {
    const expenseInput = document.getElementById(`expense-input-${index}`);
    const expenseValue = parseFloat(expenseInput.value);
    if (!isNaN(expenseValue) && expenseValue > 0) {
        const expensesDiv = document.getElementById(`expenses-${index}`);
        const p = document.createElement('p');
        p.textContent = `المصاريف: ${expenseValue.toFixed(2)}$`;
        expensesDiv.appendChild(p);
        expenseInput.value = '';
    }
}

function calculateResults() {
    const numberOfLists = document.getElementById('numberOfLists').value;
    let totalExpense = 0;
    const expenses = [];
    const names = [];

    for (let i = 0; i < numberOfLists; i++) {
        const name = document.getElementById(`name-${i}`).value;
        const expenseElements = document.querySelectorAll(`#expenses-${i} p`);
        let personTotalExpense = 0;
        expenseElements.forEach(expenseElement => {
            const expense = parseFloat(expenseElement.textContent.replace('المصاريف: ', '').replace('$', ''));
            personTotalExpense += expense;
        });
        names.push(name);
        expenses.push(personTotalExpense);
        totalExpense += personTotalExpense;
    }

    const averageExpense = totalExpense / numberOfLists;
    const balances = names.map((name, index) => ({
        name,
        balance: expenses[index] - averageExpense
    }));

    displayResults(balances);
}

function displayResults(balances) {
    const resultsContainer = document.getElementById('results');
    const balanceInfo = document.getElementById('balanceInfo');
    resultsContainer.innerHTML = '';
    balanceInfo.innerHTML = '';

    let positiveBalances = balances.filter(b => b.balance > 0);
    let negativeBalances = balances.filter(b => b.balance < 0).map(b => ({ ...b, balance: Math.abs(b.balance) }));

    while (positiveBalances.length > 0 && negativeBalances.length > 0) {
        const positive = positiveBalances[0];
        const negative = negativeBalances[0];

        const amount = Math.min(positive.balance, negative.balance);
        const p = document.createElement('p');
        p.innerHTML = `${negative.name} يجب أن يعطي ${positive.name} ${amount.toFixed(2)}$`;
        resultsContainer.appendChild(p);

        positive.balance -= amount;
        negative.balance -= amount;

        if (positive.balance === 0) {
            positiveBalances.shift();
        }
        if (negative.balance === 0) {
            negativeBalances.shift();
        }
    }

    balanceInfo.innerHTML = 'المصاريف موزعة بالتساوي بين الجميع.';
}
