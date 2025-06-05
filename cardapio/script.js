const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
  updateCarModal();
  cartModal.style.display = "flex"
})

//Fechar modal do carrinho
cartModal.addEventListener("click", function(event){
   if(event.target === cartModal){
    cartModal.style.display = "none"
   }
})

closeModalBtn.addEventListener("click", function(){
   cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
//classe indenfica com . antes do no me e id usando #
  let parentButton = event.target.closest(".add-to-cart-btn")

  if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)  
  }

})

 //Função para Adicionar no carrinho

//Função para adicionar ao carrinho
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name)
  
  if(existingItem){
  //Se o tiem ja existe, aumenta apenas a quantidade em + 1.
  existingItem.quantity += 1;
  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    })

  }
  
  updateCarModal()
 
}
 
function updateCarModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item =>{
    const cartItemElement= document.createElement("div");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
        </div>

        <div>
          <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
          </button>  
        </div>
      </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)

  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency:"BRL"
  });

  cartCounter.innerHTML = cart.length;

}

//Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function (event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
  }

})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);
  
  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -= 1;
      updateCarModal();
      return;
    }

    cart.splice(index, 1);
    updateCarModal();


  }


}

//Adicionando endereço
addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }

})

//Finalizar Pedido
checkoutBtn.addEventListener("click", function(){
  
  const isOpen = checkoutRestautantOpen();
  if(!isOpen){

    Toastify({
      text: "O RESTAURANTE ESTÁ FECHADO NO MOMENTO!!",
      duration: 3000,
      close: true,
      gravity: "top", //top or buttom
      position: "center", //'left' or 'center' or 'right'
      stopOnFocus: true, //Prevents dismissing of toast on hover
      style: {
        blackground: "#ef4444",
      },
    }).showToast();
    
    return;
  }  
  
//Mensagem de Alerta para caso campo endereço esteja vazio  
  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }


  //Enviar mensagem para o Whatsapp
const carItems = cart.map((item) => {
  return(
    `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}  |`
  )

}).join("")

const message = encodeURIComponent(carItems)
const phone ="55555555555"

window.open (`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

cart = [];
updateCarModal();
})


//verifica a hora e manipular o funcionamento do restaurante
function checkoutRestautantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora< 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkoutRestautantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add(bg-gree-600)
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
