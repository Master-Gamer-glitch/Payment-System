const container = document.getElementById("transactionContainer");

const allBtn = document.getElementById("allBtn");
const sentBtn = document.getElementById("sentBtn");
const receivedBtn = document.getElementById("receivedBtn");

const timeBtn = document.getElementById("timeBtn");
const timeOptions = document.getElementById("timeOptions");

const overlay = document.getElementById("overlay");

// ===== BACKEND ENDPOINT (fill this in) =====
const GET_TRANSACTIONS_HISTORY_ENDPOINT = "";
// ===============================================

const pageTransactions = getAllTransactions();

// fetch(GET_TRANSACTIONS_HISTORY_ENDPOINT);

displayTransactions(pageTransactions);

function displayTransactions(data)
{
    container.innerHTML = "";

    data.forEach((transaction) =>
    {
        const card = document.createElement("div");
        card.classList.add("transactionCard");
        card.dataset.transactionId = transaction.id;

        let icon = "";
        let heading = "";

        if(transaction.type === "debit")
        {
            icon = `<i class="bi bi-arrow-up"></i>`;
            heading = "Sent";
        }
        else
        {
            icon = `<i class="bi bi-arrow-down"></i>`;
            heading = "Received";
        }

        card.innerHTML =
        `
        <div class="basicInfo">

            <h3>
                ${icon} ${heading} ₹${transaction.amount}
            </h3>

            <p>${escapeHtml(transaction.note)}</p>

            <p>${escapeHtml(transaction.date)}</p>

        </div>

        <div class="details">

            <button class="closeBtn">
                ✖
            </button>

            <p><strong>Sender :</strong> ${escapeHtml(transaction.sender)}</p>

            <p><strong>Receiver :</strong> ${escapeHtml(transaction.receiver)}</p>

            <p><strong>Type :</strong> ${escapeHtml(transaction.type)}</p>

            <p><strong>Amount :</strong> ₹${transaction.amount}</p>

            <p><strong>Note :</strong> ${escapeHtml(transaction.note)}</p>

            <p><strong>Date :</strong> ${escapeHtml(transaction.date)}</p>

            <p><strong>Time :</strong> ${escapeHtml(transaction.time)}</p>

        </div>
        `;

        container.appendChild(card);

        const details = card.querySelector(".details");
        const closeBtn = card.querySelector(".closeBtn");

        card.addEventListener("click", function(e)
        {
            if(e.target.classList.contains("closeBtn"))
            {
                return;
            }

            openCard(card, details);
        });

        closeBtn.addEventListener("click", function(e)
        {
            e.stopPropagation();

            closeCard(card, details);
        });
    });
}

const selectedTransactionId =
    new URLSearchParams(window.location.search).get("transaction");

if(selectedTransactionId)
{
    const selectedCard = Array.from(
        document.querySelectorAll(".transactionCard")
    ).find(card => card.dataset.transactionId === selectedTransactionId);

    if(selectedCard)
    {
        const selectedDetails = selectedCard.querySelector(".details");
        openCard(selectedCard, selectedDetails);
    }
}

async function openCard(card, details)
{
    if(card.classList.contains("activeCard") || card.dataset.animating === "true")
    {
        return;
    }

    card.dataset.animating = "true";
    card.classList.add("isAnimatingCard");

    const cards = document.querySelectorAll(".transactionCard");

    cards.forEach((item) =>
    {
        if(item !== card)
        {
            item.classList.add("blur");
        }
    });

    const rect = card.getBoundingClientRect();
    const placeholder = document.createElement("div");

    placeholder.classList.add("transactionPlaceholder");
    placeholder.style.height = rect.height + "px";
    placeholder.style.marginBottom = getComputedStyle(card).marginBottom;
    card.parentNode.insertBefore(placeholder, card);
    card.transactionPlaceholder = placeholder;

    card.style.position = "fixed";
    card.style.top = rect.top + "px";
    card.style.left = rect.left + "px";
    card.style.width = rect.width + "px";
    card.style.height = rect.height + "px";
    card.style.zIndex = "1000";
    card.style.margin = "0";
    card.style.overflow = "hidden";
    details.style.display = "block";
    card.classList.add("activeCard");

    overlay.classList.add("visible");

    document.body.style.overflow = "hidden";

    const targetLeft = (window.innerWidth - rect.width) / 2;
    const expandedHeight = Math.min(card.scrollHeight, window.innerHeight * 0.8);
    const targetTop = Math.max(20, (window.innerHeight - expandedHeight) / 2);

    const moveAnimation = card.animate(
        [
            {
                top: rect.top + "px",
                left: rect.left + "px",
                height: rect.height + "px",
                boxShadow: "0 0 15px rgba(139,92,246,0.15)"
            },
            {
                top: targetTop + "px",
                left: targetLeft + "px",
                height: expandedHeight + "px",
                boxShadow: "0 0 30px rgba(139,92,246,0.6)"
            }
        ],
        {
            duration: 420,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        }
    );

    await moveAnimation.finished;

    card.style.left = targetLeft + "px";
    card.style.top = targetTop + "px";
    card.style.height = expandedHeight + "px";
    card.style.overflowY = "auto";
    moveAnimation.cancel();

    card.classList.remove("isAnimatingCard");
    card.dataset.animating = "false";
}

async function closeCard(card, details)
{
    if(card.dataset.animating === "true")
    {
        return;
    }

    card.dataset.animating = "true";
    card.classList.add("isAnimatingCard");
    card.style.overflow = "hidden";
    card.style.overflowY = "hidden";

    const current = card.getBoundingClientRect();
    const destination = card.transactionPlaceholder.getBoundingClientRect();

    const returnAnimation = card.animate(
        [
            {
                top: current.top + "px",
                left: current.left + "px",
                height: current.height + "px",
                boxShadow: "0 0 30px rgba(139,92,246,0.6)"
            },
            {
                top: destination.top + "px",
                left: destination.left + "px",
                height: destination.height + "px",
                boxShadow: "0 0 15px rgba(139,92,246,0.15)"
            }
        ],
        {
            duration: 300,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards"
        }
    );

    await returnAnimation.finished;
    card.style.visibility = "hidden";

    const cards = document.querySelectorAll(".transactionCard");
    cards.forEach((item) =>
    {
        item.classList.remove("blur");
    });

    returnAnimation.cancel();
    overlay.classList.remove("visible");
    document.body.style.overflow = "auto";
    card.classList.remove("activeCard");
    card.classList.remove("isAnimatingCard");

    card.style.position = "";
    card.style.top = "";
    card.style.left = "";
    card.style.width = "";
    card.style.height = "";
    card.style.zIndex = "";
    card.style.margin = "";
    card.style.overflow = "";
    card.style.overflowY = "";
    details.style.display = "";
    card.dataset.animating = "false";

    if(card.transactionPlaceholder)
    {
        card.transactionPlaceholder.remove();
        card.transactionPlaceholder = null;
    }

    requestAnimationFrame(() =>
    {
        card.style.visibility = "";
    });
}

overlay.addEventListener("click", function()
{
    const activeCard = document.querySelector(".activeCard");

    if(activeCard)
    {
        const details = activeCard.querySelector(".details");

        closeCard(activeCard, details);
    }
});

timeBtn.addEventListener("click", function()
{
    if(timeOptions.style.display === "block")
    {
        timeOptions.style.display = "none";
    }
    else
    {
        timeOptions.style.display = "block";
    }
});

function removeActiveFilter()
{
    allBtn.classList.remove("activeFilter");
    sentBtn.classList.remove("activeFilter");
    receivedBtn.classList.remove("activeFilter");
}

allBtn.addEventListener("click", function()
{
    removeActiveFilter();

    allBtn.classList.add("activeFilter");

    displayTransactions(pageTransactions);
});

sentBtn.addEventListener("click", function()
{
    removeActiveFilter();

    sentBtn.classList.add("activeFilter");

    const sentTransactions =
        pageTransactions.filter(
            transaction => transaction.type === "debit"
        );

    displayTransactions(sentTransactions);
});

receivedBtn.addEventListener("click", function()
{
    removeActiveFilter();

    receivedBtn.classList.add("activeFilter");

    const receivedTransactions =
        pageTransactions.filter(
            transaction => transaction.type === "credit"
        );

    displayTransactions(receivedTransactions);
});

fetch(GET_TRANSACTIONS_HISTORY_ENDPOINT)
.then(response => response.json())
.then(data =>
{
    displayTransactions(data);
});