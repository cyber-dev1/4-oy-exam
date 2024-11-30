const formEl = document.querySelector('#formEl');
const elName = document.querySelector('#name');
const elEmail = document.querySelector('#email');
const elPhone = document.querySelector('#phone');
const elPassword = document.querySelector('#password');
const my_alert = document.querySelector('#my_alert');
const alertCloseButton = my_alert.querySelector('.btn-close');

let errs = true;

let token = window.localStorage.getItem('token') ;

if(token){ window.location.href = "/client/index.html" } ;

function handleAlert(errs) { if (errs) { my_alert.classList.add('d-none') ; } else { my_alert.classList.remove('d-none'); }; };

alertCloseButton.addEventListener('click', () => {
    handleAlert(true);
});

handleAlert(errs);

formEl.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    errs = Boolean(elName.value.trim() && elEmail.value.trim() && elPassword.value.trim() && elPhone.value.trim());
    handleAlert(errs);

    if(errs){
        let user = {
            user_name : elName.value.trim(),
            phone : elPhone.value.trim(),
            email : elEmail.value.trim() ,
            password : elPassword.value.trim() ,
        }
        try {
            const req = await fetch('http://localhost:5000/user/register', {
                method : 'POST',
                headers : {
                    "Content-type" : "application/json" ,
                },
                body : JSON.stringify(user) ,
            }); 
            if(req.ok){
                const res = await req.json() ;
                window.localStorage.setItem('token', res.token) ;
                window.location.href = '/client/index.html' ;
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        throw('barcha inputlar majburiy') ;
    }
});
