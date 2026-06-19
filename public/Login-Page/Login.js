let email = document.getElementById('email');
let pass = document.getElementById('pass');

const login = document.getElementById('login');
const login2 = document.getElementById('login2');
const register = document.getElementById('register');

let message = document.getElementById('message');

const forgot = document.getElementById('forgot');

let isLoginMode = true;
// yaha pe apna url dal diyo
const LOGIN_ENDPOINT = "";
const REGISTER_ENDPOINT = "";


login2.addEventListener('click',function()
{
    const emailValue = email.value.trim().toLowerCase();

    if(!(emailValue.endsWith("@gmail.com")))
    {
        message.textContent = "Please enter a valid email";
        message.style.color = 'red';
    }
    else if(pass.value.length < 8)
    {
        message.textContent = "Password must be atleast 8 characters";
        message.style.color = 'red';
    }

    else
    {
        if(isLoginMode)
        {
            message.textContent = "Logging in...";
            message.style.color = 'white';

            fetch(LOGIN_ENDPOINT, { method: "POST", body: JSON.stringify({ email: emailValue, password: pass.value }) });

            window.location.href = "../Dashboard/Dashboard.html";
        }
        else
        {
            message.textContent = "Registration successful";
            message.style.color = 'green';

            fetch(REGISTER_ENDPOINT, { method: "POST", body: JSON.stringify({ email: emailValue, password: pass.value }) });

            setTimeout(function()
            {
                window.location.href = "../Dashboard/Dashboard.html";
            }, 800);
        }
    }
})


register.addEventListener('click',function()
{
    isLoginMode = false;
    register.classList.remove("unselectedButton");
    register.classList.add("selectedButton");
    login.classList.remove("selectedButton");
    login.classList.add("unselectedButton");
    email.placeholder = "Register Email";
    login2.textContent = "Register";
    forgot.style.display = "none";
    message.textContent = "";
})
login.addEventListener('click',function()
{
    isLoginMode = true;
    login.classList.remove("unselectedButton");
    login.classList.add("selectedButton");
    register.classList.remove("selectedButton");
    register.classList.add("unselectedButton");
    email.placeholder = "Login Email";
    login2.textContent = "Login";
    forgot.style.display = "block";
    message.textContent = "";
})