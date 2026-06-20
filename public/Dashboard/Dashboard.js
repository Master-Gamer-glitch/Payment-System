let accDetail = document.getElementById("accDetail");
let money = document.getElementById("amtInput");
const sendBtn = document.getElementById("send");
const upiBtn = document.getElementById("upi");
const topupBtn = document.getElementById("topup");
const inputs = document.getElementById("inputs");
const accDetailBreak = document.getElementById("accDetailBreak");
let message = document.getElementById("message");
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

let selectedPaymentMode = "send";
let toastTimer;
let dashboardTransactions = [];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

// ===== BACKEND ENDPOINTS =====
const GET_BALANCE_ENDPOINT = "/api/auth/me";
const UPDATE_BALANCE_ENDPOINT = "/api/transactions/topup";
const GET_TRANSACTIONS_ENDPOINT = "/api/transactions/history";
const CREATE_TRANSACTION_ENDPOINT = "/api/transactions/send";
const LOGOUT_ENDPOINT = "/api/auth/logout";
// ===============================================

// Fetch user data (balance and name) on startup
async function fetchUserData() {
    try {
        const response = await fetch(GET_BALANCE_ENDPOINT);
        if (!response.ok) {
            // If not logged in, redirect to login page
            window.location.href = "../Login-Page/index.html";
            return;
        }
        const data = await response.json();
        const user = data.user;

        document.getElementById("username").textContent = user.name;
        balanceAmount.textContent = currencyFormatter.format(user.balance);
    } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "../Login-Page/index.html";
    }
}

// Fetch transaction history from backend
async function fetchTransactions() {
    try {
        const response = await fetch(GET_TRANSACTIONS_ENDPOINT);
        if (response.ok) {
            const data = await response.json();
            dashboardTransactions = data.history || [];
            renderRecentTransactions();
            renderMonthlySummary();
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
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
        const isTopup = transaction.type === "credit" && transaction.note === "Account Top-up";
        if(isTopup)
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
        const isTopup = transaction.type === "credit" && transaction.note === "Account Top-up";
        const isCredit = transaction.type === "credit";
        const amountClass = isTopup
            ? "topupAmount"
            : isCredit
                ? "creditAmount"
                : "debitAmount";
        const amountSign = isCredit ? "+" : "-";
        
        let title = "";
        let subtitle = "";

        if (isTopup) {
            title = "Wallet Top-up";
            subtitle = "Added to wallet";
        } else if (isCredit) {
            title = "Money Received";
            subtitle = transaction.note || "Received from user";
        } else {
            title = "Money Sent";
            subtitle = transaction.note || "Sent to user";
        }

        const dateObj = new Date(transaction.createdAt);
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(dateObj);

        recentBox.innerHTML +=
        `
        <a class="recentTransaction"
            href="../Transaction-Page/Transaction.html?transaction=${encodeURIComponent(transaction._id)}">
            <div class="transactionInfo">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(subtitle)} · ${escapeHtml(formattedDate)}</span>
            </div>
            <span class="${amountClass}">
                ${amountSign} ${currencyFormatter.format(transaction.amount)}
            </span>
        </a>
        `;
    });
}

function setSelectedButton(activeButton)
{
    [upiBtn, topupBtn].forEach(function(button)
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

function showSuccessToast(text) {
    showToast(text, "success");
}
function showErrorToast(text) {
    showToast(text, "error");
}

// Global functions for toast alert popups
window.showSuccessToast = showSuccessToast;
window.showErrorToast = showErrorToast;

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

logoutOption.addEventListener("click", async function()
{
    try {
        await fetch(LOGOUT_ENDPOINT, { method: "POST" });
        window.location.href = "../Login-Page/index.html";
    } catch (e) {
        window.location.href = "../Login-Page/index.html";
    }
});

upiBtn.addEventListener('click',function()
{
    selectedPaymentMode = "send";
    setSelectedButton(upiBtn);
    inputs.style.display = "block";
    accDetail.style.display = "inline-block";
    accDetailBreak.style.display = "block";
    sendBtn.style.display = "block";
    sendBtn.textContent = "Send";
    accDetail.placeholder = "Enter Receiver Email";
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
    sendBtn.style.display = "block";
    sendBtn.textContent = "Top-Up";
    money.placeholder = "Enter top-up amount";
    message.textContent = "";
})

sendBtn.addEventListener('click', async function()
{
    const amount = Number(money.value);
    const receiverDetail = accDetail.value.trim();

    if(selectedPaymentMode === "send")
    {
        if(receiverDetail.length == 0)
        {
            message.textContent = "Please enter receiver email";
            message.style.color = "red";
            return;
        }
        if(amount <= 0)
        {
            message.textContent = "Please Enter a valid amount.";
            message.style.color = "red";
            return;
        }

        try {
            const response = await fetch(CREATE_TRANSACTION_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverEmail: receiverDetail,
                    amount: amount,
                    note: "Money Transfer"
                })
            });
            const data = await response.json();
            if (!response.ok) {
                showErrorToast(data.message || "Transfer failed");
                return;
            }
            showSuccessToast("Money sent successfully");
            accDetail.value = "";
            money.value = "";
            message.textContent = "";
            await initDashboard();
        } catch (error) {
            showErrorToast("Server error during transfer");
        }
    }
    else if(selectedPaymentMode === "topup")
    {
        if(amount <= 0)
        {
            message.textContent = "Please Enter a valid amount.";
            message.style.color = "red";
            return;
        }

        try {
            const response = await fetch(UPDATE_BALANCE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount })
            });
            const data = await response.json();
            if (!response.ok) {
                showErrorToast(data.message || "Top-up failed");
                return;
            }
            showSuccessToast("Top-up successful");
            money.value = "";
            message.textContent = "";
            await initDashboard();
        } catch (error) {
            showErrorToast("Server error during top-up");
        }
    }
})

viewAllBtn.addEventListener('click', function()
{
    window.location.href = "../Transaction-Page/Transaction.html";
})

function escapeHtml(value)
{
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function initDashboard() {
    await fetchUserData();
    await fetchTransactions();
}

// Initial dashboard load
initDashboard();