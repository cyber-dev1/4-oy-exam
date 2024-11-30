const storeList = document.querySelector('.store-list');
const storeTemp = document.querySelector('.store-template').content;
const deletBtn = document.querySelector('.delBtn');
const allPrice = document.querySelector('.allPrice');
const token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '';

let addStore = [];
let prizes = [];

function handleRenderStore(data) {
    let storeFragment = document.createDocumentFragment();
    storeList.innerHTML = '';
    if (data?.length) {
        data.forEach((item) => {
            let storeClone = storeTemp.cloneNode(true);
            storeClone.querySelector('.tovarName').textContent = item.product_name;
            storeClone.querySelector('.tovarId').textContent = item.product_id;
            storeClone.querySelector('.userId').textContent = item.user_id;
            storeClone.querySelector('#del').dataset.id = item.order_id;
            storeClone.querySelector('#priceT').textContent = item.product_price;
            storeFragment.append(storeClone);
        });
        storeList.append(storeFragment);
    }
}

function handleCounts() {
    if (!prizes || !prizes.length) {
        allPrice.textContent = 0;
        return;
    }
    let all = prizes.reduce((acc, item) => acc + (Number(item.product_price) || 0), 0);

    allPrice.textContent = all;
}

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
            addStore = res;
            prizes = res;
            handleRenderStore(addStore);
            handleCounts(); 
        }
    } catch (error) {
        console.log(error);
    }
}

getStore();

storeList.addEventListener('click', async (evt) => {
    if (evt.target.matches('#del')) {
        let Id = evt.target.dataset.id;
        try {
            const req = await fetch(`http://localhost:5000/order/${Id}`, {
                method: "DELETE",
                headers: {
                    authorization: token,
                },
            });
            if (req.ok) {
                await getStore();
            }
        } catch (error) {
            console.log(error);
        }
    }
});

window.addEventListener('click', (evt) => {
    if (evt.target.matches('#sotibOlish')) {
        if (addStore.length > 0) {
            alert(`Tovar yoki tovarlar sotib olindi`);
        } else {
            alert('Xali tovar yoki tovarlar saqlanmagan');
        }
    }
});

