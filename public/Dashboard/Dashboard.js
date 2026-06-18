let accDetail = document.getElementById("accDetail");
let money = document.getElementById("amtInput");
const sendBtn = document.getElementById("send");
const upiBtn = document.getElementById("upi");
const accBtn = document.getElementById("accTrans");
const topupBtn = document.getElementById("topup");
const billsBtn = document.getElementById("bills");
const inputs = document.getElementById("inputs");
const accDetailBreak = document.getElementById("accDetailBreak");
let message = document.getElementById("message");
const billsOption = document.getElementById("billsOptions");
const viewAllBtn = document.getElementById("veiw");
const recentBox = document.getElementById("rcntBox");
const amountSent = document.getElementById("amtSent");
const amountReceived = document.getElementById("amtReceived");
const topups = document.getElementById("topups");
const successToast = document.getElementById("successToast");
const profileBtn = document.getElementById("profile");
const profileMenu = document.getElementById("profileMenu");
const logoutOption = document.getElementById("logoutOption");
const balanceAmount = document.getElementById("amt");

let selectedPaymentMode = "upi";
let toastTimer;
let dashboardTransactions = getAllTransactions();
const balanceStorageKey = "sadakPeAccountBalance";
let accountBalance = getStoredBalance();

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

function getStoredBalance()
{
    const savedBalanceValue = localStorage.getItem(balanceStorageKey);
    const savedBalance = Number(savedBalanceValue);

    if(savedBalanceValue !== null && Number.isFinite(savedBalance))
    {
        return savedBalance;
    }

    localStorage.setItem(balanceStorageKey, "1000");
    return 1000;
}

function saveBalance()
{
    localStorage.setItem(balanceStorageKey, String(accountBalance));
}

function renderBalance()
{
    balanceAmount.textContent = currencyFormatter.format(accountBalance);
}

function renderMonthlySummary()
{
    const currentDate = new Date();
    const currentMonthTransactions = dashboardTransactions.filter(function(transaction)
    {
        const transactionDate = new Date(transaction.createdAt);

        return transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear();
    });

    const monthlySummary = currentMonthTransactions.reduce(function(summary, transaction)
    {
        if(transaction.category === "topup")
        {
            summary.topups += transaction.amount;
        }
        else if(transaction.type === "debit")
        {
            summary.sent += transaction.amount;
        }
        else if(transaction.type === "credit")
        {
            summary.received += transaction.amount;
        }

        return summary;
    }, {
        sent: 0,
        received: 0,
        topups: 0
    });

    amountSent.textContent = currencyFormatter.format(monthlySummary.sent);
    amountReceived.textContent = currencyFormatter.format(monthlySummary.received);
    topups.textContent = currencyFormatter.format(monthlySummary.topups);
}

function renderRecentTransactions()
{
    recentBox.innerHTML = "";

    dashboardTransactions.slice(0, 4).forEach(function(transaction)
    {
        const isTopup = transaction.category === "topup";
        const isCredit = transaction.type === "credit";
        const amountClass = isTopup
            ? "topupAmount"
            : isCredit
                ? "creditAmount"
                : "debitAmount";
        const amountSign = isCredit ? "+" : "-";
        const title = isTopup
            ? "Wallet Top-up"
            : isCredit
                ? transaction.sender
                : transaction.receiver;
        const subtitle = isTopup
            ? "Added to wallet"
            : isCredit
                ? "Money credited"
                : transaction.note;

        recentBox.innerHTML +=
        `
        <a class="recentTransaction"
            href="../Transaction-Page/Transaction.html?transaction=${encodeURIComponent(transaction.id)}">
            <div class="transactionInfo">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(subtitle)} · ${escapeHtml(transaction.date)}</span>
            </div>
            <span class="${amountClass}">
                ${amountSign} ${currencyFormatter.format(transaction.amount)}
            </span>
        </a>
        `;
    });
}

function refreshDashboardTransactions()
{
    dashboardTransactions = getAllTransactions();
    renderRecentTransactions();
    renderMonthlySummary();
}

function setSelectedButton(activeButton)
{
    [upiBtn, accBtn, topupBtn, billsBtn].forEach(function(button)
    {
        button.classList.remove("selectedButton");
        button.classList.add("unselectedButton");
    });

    activeButton.classList.remove("unselectedButton");
    activeButton.classList.add("selectedButton");
}

function showToast(text, type)
{
    successToast.textContent = text;
    successToast.classList.remove("success", "error");
    successToast.classList.add(type);
    successToast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function()
    {
        successToast.classList.remove("show");
    }, 2500);
}

function showSuccessToast(text)
{
    showToast(text, "success");
}

function showErrorToast(text)
{
    showToast(text, "error");
}

profileBtn.addEventListener("click", function(e)
{
    e.stopPropagation();
    profileMenu.classList.toggle("show");
});

profileMenu.addEventListener("click", function(e)
{
    e.stopPropagation();
});

document.addEventListener("click", function()
{
    profileMenu.classList.remove("show");
});

logoutOption.addEventListener("click", function()
{
    window.location.href = "../Login-Page/index.html";
});

upiBtn.addEventListener('click',function()
{
    selectedPaymentMode = "upi";
    setSelectedButton(upiBtn);
    inputs.style.display = "block";
    accDetail.style.display = "inline-block";
    accDetailBreak.style.display = "block";
    billsOption.style.display = "none";
    sendBtn.style.display = "block";
    sendBtn.textContent = "Send";
    accDetail.placeholder = "Enter UPI ID";
    money.placeholder = "Enter the amount to send";

    message.textContent = "";
})
accBtn.addEventListener('click',function()
{
    selectedPaymentMode = "account";
    setSelectedButton(accBtn);
    inputs.style.display = "block";
    accDetail.style.display = "inline-block";
    accDetailBreak.style.display = "block";
    billsOption.style.display = "none";
    sendBtn.style.display = "block";
    sendBtn.textContent = "Send";
    accDetail.placeholder = "Enter Account Number";
    money.placeholder = "Enter the amount to send";

    message.textContent = "";

})
topupBtn.addEventListener('click',function()
{
    selectedPaymentMode = "topup";
    setSelectedButton(topupBtn);
    inputs.style.display = "block";
    accDetail.style.display = "none";
    accDetailBreak.style.display = "none";
    billsOption.style.display = "none";
    sendBtn.style.display = "block";
    sendBtn.textContent = "Top-Up";
    money.placeholder = "Enter top-up amount";

    message.textContent = "";
})
billsBtn.addEventListener('click',function()
{
    selectedPaymentMode = "bills";
    setSelectedButton(billsBtn);
    inputs.style.display = "none";
    billsOption.style.display = "block";
    sendBtn.style.display = "none";
    
    billsOption.style.display = "flex";

    message.textContent = "";

})

sendBtn.addEventListener('click',function()
{
    const amount = Number(money.value);
    const receiverDetail = accDetail.value.trim();

    if(selectedPaymentMode !== "topup" && receiverDetail.length == 0)
    {
        message.textContent = "Please enter valid receiver details";
        message.style.color = "red";
    }
    else if(amount <= 0)
    {
        message.textContent = "Please Enter a valid amount.";
        message.style.color = "red";
    }
    else if(selectedPaymentMode !== "topup" && amount > accountBalance)
    {
        message.textContent = "";
        showErrorToast("Insufficient balance");
    }
    else
    {
        const now = new Date();
        const date = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(now);
        const time = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).format(now);
        const isTopup = selectedPaymentMode === "topup";
        const newTransaction = {
            id: `${selectedPaymentMode}-${Date.now()}`,
            sender: "Dhruv",
            receiver: isTopup ? "Dhruv" : receiverDetail,
            amount: amount,
            type: isTopup ? "credit" : "debit",
            category: isTopup ? "topup" : "payment",
            note: isTopup
                ? "Wallet Topup"
                : selectedPaymentMode === "account"
                    ? "Account Transfer"
                    : "UPI Payment",
            date: date,
            time: time,
            createdAt: now.toISOString()
        };

        saveNewTransaction(newTransaction);
        accountBalance = isTopup
            ? accountBalance + amount
            : accountBalance - amount;
        saveBalance();
        renderBalance();
        refreshDashboardTransactions();

        accDetail.value = "";
        money.value = "";
        message.textContent = "";
        showSuccessToast(
            isTopup
                ? "Top-up successful"
                : "Money sent successfully"
        );
    }
})

viewAllBtn.addEventListener('click', function()
{
    window.location.href = "../Transaction-Page/Transaction.html";
})

renderBalance();
renderRecentTransactions();
renderMonthlySummary();
