const formEl = document.querySelector('#formEl');
const elEmail = document.querySelector('#email');
const elPassword = document.querySelector('#password');
const my_alert = document.querySelector('#my_alert');
const alertCloseButton = my_alert.querySelector('.btn-close');

let errs = true;

let token = window.localStorage.getItem('token') ;
if(token) { window.location.href = '/client/index.html' } ;

function handleAlert(errs) { if (errs) { my_alert.classList.add('d-none'); } else { my_alert.classList.remove('d-none'); }; };

alertCloseButton.addEventListener('click', () => {
    handleAlert(true);
});

handleAlert(errs);

formEl.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    errs = Boolean(elEmail.value.trim() && elPassword.value.trim());
    handleAlert(errs);

    if(errs){
        let user = {
            email : elEmail.value.trim(),
            password : elPassword.value.trim(),
        };
        try {
            const req = await fetch('http://localhost:5000/user/login', {
                method : 'POST',
                headers : {
                    'Content-type':'application/json',
                },
                body : JSON.stringify(user)
            });
            if(req.ok){
                const res = await req.json() ;
                console.log(res);
                window.localStorage.setItem('token', res.token) ;
                window.location = '/client/index.html';
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        throw('barcha inputlar majburiy') ;
    }
});



