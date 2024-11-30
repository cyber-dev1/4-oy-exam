let savedRender = document.querySelector('.js-list') ;
let savedTemplate = document.querySelector('.saved-template').content ;
let added = window.localStorage.getItem('addTovar') ? JSON.parse(window.localStorage.getItem('addTovar')) : [] ;

function handleRender(){
    let savedFragment = document.createDocumentFragment() ;
    savedRender.innerHTML = '';
    if(added.length){
        added.forEach((item) => {
            let saveClone = savedTemplate.cloneNode(true) ;
            saveClone.querySelector('.tovarImg').src = `http://localhost:5000/${item.product_img}` ;
            saveClone.querySelector('.tovarName').textContent = item.product_name ;
            saveClone.querySelector('.tovarDesc').textContent = item.product_desc.split(' ').length > 4 ? item.product_desc.split(' ').slice(0 , 4).join(' ') + '. . .' : item.product_desc  ;
            saveClone.querySelector('.tovarPrice').textContent = item.product_price ;
            let saveBtn = saveClone.querySelector('#add') ;
            saveBtn.dataset.id = item.id ;

            if(added.some((tovar) => tovar.id == item.id)){
                saveBtn.classList.add('text-warning') ;
                saveBtn.textContent = 'olib tashlash' ;
            }else{
                saveBtn.classList.remove('text-warning') ;
                saveBtn.textContent = 'olib tashlash' ;
            }

            savedFragment.append(saveClone) ;
        }) ;
        savedRender.append(savedFragment) ;
    }
}
handleRender() ;


savedRender.addEventListener('click', (evt) => {
    if(evt.target.textContent == 'olib tashlash'){
        let elId = evt.target.dataset.id ;
        let idx = added.findIndex((item) => item.id == elId) ;
        added.splice(idx, 1) ;
        window.localStorage.setItem('addTovar', JSON.stringify(added));
        handleRender() ;
    };
})


