const elTemp = document.querySelector('.js-template').content;
const renderList = document.querySelector('.js-list');
const addBtn = document.querySelector('.tovarAdd');
const tovarShop = document.querySelector('.tovarShopping');
const cart = document.querySelector('.cart') ;
const savatBadge = document.querySelector('.savatcha');
const token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '';
const BASE_URL = 'http://localhost:5000/';

if (token === '' || token === 0) {
    window.location.href = '/client/login/index.html';
}

let addProduct = window.localStorage.getItem('addTovar') ? JSON.parse(window.localStorage.getItem('addTovar')) : [];
let tovars;
let rezult;
let ret;


function handleCount(addCount) {
    const badge = document.querySelector('#badge');
    if (badge) {
        badge.textContent = addCount.length > 0 ? addCount.length : "";
    }
}
handleCount(addProduct);

const handleRender = (data) => {
    let docFragment = document.createDocumentFragment();
    renderList.innerHTML = '';
    if (data?.length) {
        data.forEach((item) => {
            let clone = elTemp.cloneNode(true);
            clone.querySelector('.tovarImg').src = `http://localhost:5000/${item.product_img}`;
            clone.querySelector('.tovarName').textContent = item.product_name;
             let btn  = clone.querySelector('.tovarShopping') ;
             btn.dataset.id = item.id;
            clone.querySelector('.tovarDesc').textContent = item.product_desc.split(' ').length > 4
                ? item.product_desc.split(' ').slice(0, 4).join(' ') + '. . .'
                : item.product_desc;
            clone.querySelector('.tovarPrice').textContent = item.product_price;
            if(ret){
                btn.classList.add('d-none') ;
            }else{
                btn.classList.remove('d-none') ;
            }
            let saveBtns = clone.querySelector('#add');
            saveBtns.dataset.id = item.id;

            if (addProduct.some((tovar) => tovar.id == item.id)) {
                saveBtns.classList.add('text-warning');
                saveBtns.textContent = 'olib tashlash';
            } else {
                saveBtns.classList.remove('text-warning');
                saveBtns.textContent = 'saqlash';
            };

            docFragment.append(clone);
        });
        renderList.append(docFragment);
    } else {
        console.error('Mahsulotlar topilmadi.');
    }
};

async function getStore() {
    try {
        const req = await fetch('http://localhost:5000/order', {
            method: 'GET',
            headers: {
                authorization: token,
            }
        });
        if (req.ok) {
            const res = await req.json();
            rezult = res;
            savatBadge.textContent = rezult.length > 0 ? rezult.length : '';
        }
    } catch (error) {
        console.log(error);
    }
}

getStore();

async function handleGet() {
    const req = await fetch(`${BASE_URL}product`, {
        method: 'GET',
        headers: {
            authorization: token,
        },
    });
    if (req.ok) {
        const res = await req.json();
        if (res) {
            tovars = res;
            handleRender(tovars);
        }
    }
}

handleGet();

renderList.addEventListener('click', async (evt) => {
    if (evt.target.matches('#add')) {
        const dataId = evt.target.dataset.id;
        const result = tovars.find((item) => item.id == dataId);
        const productIndex = addProduct.findIndex((item) => item.id == dataId);
        if (productIndex > -1) {
            addProduct.splice(productIndex, 1);
            evt.target.classList.remove('text-warning');
            evt.target.textContent = 'saqlash';
        } else {
            addProduct.push(result);
            evt.target.classList.add('text-warning');
            evt.target.textContent = 'olib tashlash';
        }
        window.localStorage.setItem('addTovar', JSON.stringify(addProduct));
        handleCount(addProduct);
    };

    if (evt.target.matches('.tovarShopping')) {
        let elId = Number(evt.target.dataset.id);

        ret = rezult.find((item) => item.product_id == elId) ;
        if (ret) {
            // 
            // 
            // 
        } else {
            const dataPost = {
                product_id: elId,
            };
            try {
                const req = await fetch('http://localhost:5000/order', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        authorization: token,
                    },
                    body: JSON.stringify(dataPost),
                });
                if (req.ok) {
                    const res = await req.json();
                    rezult = res;
                    getStore();
                } else {
                    console.error('Tovarni saqlashda xatolik yuz berdi.');
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik:', error);
            }

        }


    };
});


window.addEventListener('click', (evt) => {
    if (evt.target.matches('#cherez_admin')) {
        window.location.href = '/client/admin/index.html';
    }
});




