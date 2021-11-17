let cart = [];
let modalKey;
let modalQt = 1

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem das PIZZAS
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelectorAll('.pizza-item--price span').forEach((itemPrice, indexPrice)=>{
        itemPrice.innerHTML = `${item.price[indexPrice].toFixed(2)}`;
    });
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
            if(sizeIndex === 2) {
                size.classList.add('selected');
                c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[sizeIndex].toFixed(2)}`;
            }

            size.addEventListener('click', ()=>{
                c('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
                c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price[sizeIndex].toFixed(2)}`;
            });

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);
    });

    c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }

});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = Number(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let price = pizzaJson[modalKey].price[size];

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identifier === identifier;
    });

    if(key > -1) {
        cart[key].qt += modalQt;
        cart[key].price = price * cart[key].qt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt,
            price
        });
    }

    updateCart();
    closeModal();
});
c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
});


function updateCart() {
        
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        c('.menu-openner span').innerHTML = cart.map((item)=>{
            return item.qt;
        }).reduce((acc, act)=>{
            return acc + act;
        });
        

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        let unit;
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id === cart[i].id);
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            
            
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    unit = pizzaItem.price[0];
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    unit = pizzaItem.price[1];
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    unit = pizzaItem.price[2];
                    break;
            }
                        
                        
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            subtotal += unit * cart[i].qt;
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);
            qTd = cart[i].qt;   
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
        c('.menu-openner span').innerHTML = 0;
    }
}

c('.cart--finalizar').addEventListener('click', ()=>{
    let nameItem = [];
    let qtd = [];
    let pizzas = [];
    let total;
    let qtdTotal = c('.menu-openner span').innerHTML;
    let name = c('[name="name"]').value;
    let end = c('[name="street"]').value;
    let cep = c('[name="cep"]').value;
    
    cs('.cart--item-nome').forEach((nomeItem)=>{
        return nameItem.push(nomeItem.innerHTML);
    });
    cs('.cart--item--qt').forEach((qtItem)=>{
        return qtd.push(qtItem.innerHTML);
    });
    
    total = c('.total span:last-child').innerHTML;

    nameItem.shift();
    qtd.shift();

    for(let i = 0; i <nameItem.length; i++) {
        pizzas.push(qtd[i]+' '+nameItem[i]+'\n');
    }

    confirm(
    `Confira o seu pedido, ${qtdTotal} pizza(s):
    ${pizzas}
    Total: ${total}
    Dados do Cliente:
    Nome: ${name}
    Endereço: ${end}
    CEP: ${cep}
    
    Confirme o seu pedido`
    );
    console.log(pizzas);
    console.log(total);
    console.log(cart);
});
