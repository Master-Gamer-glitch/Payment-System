let email = document.getElementById('email');
let pass = document.getElementById('pass');

const login = document.getElementById('login');
const login2 = document.getElementById('login2');
const register = document.getElementById('register');

let message = document.getElementById('message');

const forgot = document.getElementById('forgot');

let isLoginMode = true;
// yaha pe apna url dal diyo
const LOGIN_ENDPOINT = "/api/auth/login";
const REGISTER_ENDPOINT = "/api/auth/register";


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

            fetch(LOGIN_ENDPOINT, { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailValue, password: pass.value }) 
            })
            .then(res => {
                if(res.ok) {
                    window.location.href = "../Dashboard/Dashboard.html";
                } else {
                    res.json().then(data => {
                        message.textContent = data.message || "Login failed";
                        message.style.color = 'red';
                    }).catch(() => {
                        message.textContent = "Login failed";
                        message.style.color = 'red';
                    });
                }
            })
            .catch(err => {
                message.textContent = "Network error";
                message.style.color = 'red';
            });
        }
        else
        {
            message.textContent = "Registering...";
            message.style.color = 'white';

            fetch(REGISTER_ENDPOINT, { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: emailValue.split('@')[0], email: emailValue, password: pass.value }) 
            })
            .then(res => {
                if(res.ok) {
                    message.textContent = "Registration successful";
                    message.style.color = 'green';
                    setTimeout(function()
                    {
                        window.location.href = "../Dashboard/Dashboard.html";
                    }, 800);
                } else {
                    res.json().then(data => {
                        message.textContent = data.message || "Registration failed";
                        message.style.color = 'red';
                    }).catch(() => {
                        message.textContent = "Registration failed";
                        message.style.color = 'red';
                    });
                }
            })
            .catch(err => {
                message.textContent = "Network error";
                message.style.color = 'red';
            });
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

forgot.addEventListener("click", function(e){
    e.preventDefault();
    alert("tch tch tch... ham kuch ni kr skte lol naya acc banao :)");
})