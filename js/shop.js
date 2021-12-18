const items = document.getElementById("items")
const prod = document.getElementById("prod")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("templateCard").content
const templateTotal = document.getElementById("templateTotal").content
const templateCart = document.getElementById("templateCart").content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse (localStorage.getItem("carrito"))
        workCart()
    }
})

items.addEventListener("click", e => {
    addCart(e)
})

prod.addEventListener("click", e => {
    btnAction(e)
})

const fetchData = async () => {
    try{
        const res = await fetch("../js/stock.json")
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error){
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
    //console.log(producto)
    templateCard.querySelector("h5").textContent = producto.title;
    templateCard.querySelector("p").textContent = producto.precio;
    templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
    templateCard.querySelector(".comprar").dataset.id = producto.id
    
    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
})
    items.appendChild(fragment)
}

const addCart = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains("comprar"))
    if (e.target.classList.contains("comprar")){
        setCarrito(e.target.parentElement)
    
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector(".comprar").dataset.id,
        tittle: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    workCart()
    //console.log(carrito)
}

const workCart  = () =>{
    //console.log(carrito)
    prod.innerHTML = ""
    Object.values(carrito).forEach(producto =>{
        templateCart.querySelector("th").textContent = producto.id
        templateCart.querySelectorAll("td")[0].textContent = producto.tittle
        templateCart.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCart.querySelector(".btnPlus").dataset.id = producto.id
        templateCart.querySelector(".btnMns").dataset.id = producto.id
        templateCart.querySelector("span").textContent = producto.cantidad * producto.precio
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    prod.appendChild(fragment)
    workFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const workFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = "<th scope='row' colspan='5'>" + "Carrito vacío - comience a comprar!" +"</th> "
        return
    }
    const totalFinal = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const totalPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    //console.log(totalPrecio)
    templateTotal.querySelectorAll("td")[0].textContent = totalFinal
    templateTotal.querySelector("span").textContent = totalPrecio
    const clone = templateTotal.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEmpty = document.getElementById("emptyCart")
    btnEmpty.addEventListener("click", () => {
        carrito = {}
        workCart()
    })
}

const btnAction = e => {
    //console.log(e.target)
    if (e.target.classList.contains("btnPlus")){
        //console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
        workCart()
    }
    if (e.target.classList.contains("btnMns")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        workCart()
}
    e.stopPropagation()
}

function success (){
    swal("Gracias por tu compra", "Recibiras un correo de confirmación", "success");
    carrito = {}
    workCart()
}

