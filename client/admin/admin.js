const elTemp = document.querySelector('.js-template').content;
const renderList = document.querySelector('.js-list');
const changeForm = document.querySelector('.changeForm');
const addBtn = document.querySelector('.addBtns');
const adminForm = document.querySelector('.adminForm');
const addFile = document.querySelector('.addFile');
const addName = document.querySelector('.addName');
const addDesc = document.querySelector('.addDesc');
const addPrice = document.querySelector('.addPrice');
const elItem = document.querySelector('.elItem');
const delBtn = document.querySelector('.delBtns');
const edites = document.querySelector('.editeBtn');

let changeImg = document.querySelector('.changeImg');
let changeName = document.querySelector('.changeName');
let changeDesc = document.querySelector('.changeDesc');
let changePrice = document.querySelector('.changePrice');

let added = window.localStorage.getItem('addTovar') ? JSON.parse(window.localStorage.getItem('addTovar')) : [];
const token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '';

if (token == '' || token == 0) { window.location.href = '/client/login/index.html' };

let produc;
let globalId;

const handleRender = (data) => {
    let docFragment = document.createDocumentFragment();
    renderList.innerHTML = '';
    if (data?.length) {
        data.forEach((item) => {
            let clone = elTemp.cloneNode(true);

            clone.querySelector('.tovarImg').src = `http://localhost:5000/${item.product_img}`;
            clone.querySelector('.tovarName').textContent = item.product_name;
            clone.querySelector('.tovarDesc').textContent = item.product_desc.split(' ').length > 4 ? item.product_desc.split(' ').slice(0, 4).join(' ') + '. . .' : item.product_desc;
            clone.querySelector('.tovarPrice').textContent = item.product_price;
            clone.querySelector('.delete').dataset.id = item.id;
            let edbtn = clone.querySelector('.edite')
            edbtn.dataset.id = item.id;

            docFragment.append(clone);
        });
        renderList.append(docFragment);
    } else {
        throw ('data not found')
    }
}


async function handleGet() {
    const req = await fetch('http://localhost:5000/product', {
        method: 'GET',
        headers: {
            authorization: token,
        }
    })
    if (req.ok) {
        const res = await req.json();
        if (res) {
            produc = res;
            handleRender(produc);
            footer_box.classList.remove('d-none');
        } else {
            footer_box.classList.add('d-none');
        }
    }
};

handleGet();


adminForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    try {
        if (addName.value.trim() && addDesc.value.trim() && addPrice.value.trim() && addFile.files[0]) {
            let formData = new FormData();
            formData.append("product_name", addName.value);
            formData.append("product_desc", addDesc.value);
            formData.append("product_img", addFile.files[0]);
            formData.append("product_price", addPrice.value);
            const req = await fetch('http://localhost:5000/product', {
                method: 'POST',
                headers: {
                    authorization: token,
                },
                body: formData,
            });
            if (req.ok) {
                addDesc.value = '';
                addPrice.value = '';
                addFile.value = '';
                addName.value = '';
                const res = await req.json();
                handleGet();
            }
        }
    } catch (error) {
        console.log(error);
    }

});

changeForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    let finds = produc.find((item) => item.id == globalId) ;
    if (changeName.value.length < 0 || changeDesc.value.length < 0 || changePrice.value.length < 0 || changeImg.files[0]) {
        const changeData = new FormData();
        changeData.append('product_name', changeName.value);
        changeData.append('product_desc', changeDesc.value);
        changeData.append('product_img', changeImg.files[0]);
        changeData.append('product_price', changePrice.value);
        try {
            const req = await fetch(`http://localhost:5000/product/${globalId}`, {
                method: 'PUT',
                headers: {
                    authorization: token,
                },
                body: changeData,
            });
            console.log(req);
    
            if (req.ok) {
                const res = await req.json();
                handleGet();
                changeName.value = '';
                changeDesc.value = '' ;
                changePrice.value = '' ;
                changeImg.value = '' ;
                handleRender(produc);
            }
        } catch (error) {
            console.log(error);
        }
        
    }else{
        
    }
})

renderList.addEventListener('click', async (evt) => {
    if (evt.target.matches('#delet')) {
        let finId = evt.target.dataset.id;
        try {
            const req = await fetch(`http://localhost:5000/product/${finId}`, {
                method: 'DELETE',
                headers: {
                    authorization: token,
                },
            });
            if (req.ok) {
                let idx = added.findIndex((item) => item.id == finId);
                added.splice(idx, 1);
                window.localStorage.setItem('addTovar', JSON.stringify(added));
                handleGet();
            };
            
        } catch (error) {
            console.log(error);
        }
    };
    if (evt.target.matches('.edite')) {
        let id = evt.target.dataset.id;
        globalId = evt.target.dataset.id;
        let find = produc.find((item) => item.id == id);
        changeDesc.value = find.product_desc;
        changeName.value = find.product_name;
        changePrice.value = find.product_price;
    };
});

window.addEventListener('click', (evt) => {
    if (evt.target.matches('#cherez_admin')) {
        window.location.href = '/client/index.html';
    };
})














