/* id pintar HTML */
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");

/* Templates id */
const templateCard = document.getElementById("template-card").content;
const templateCarrito = document.getElementById("template-carrito").content;
const templateFooter = document.getElementById("template-footer").content;

//fragment
const fragment = document.createDocumentFragment();
// objeto de carrito
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
  }
  pintarCarrito();
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

const fetchData = async () => {
  try {
    const response = await fetch("api.json");
    const data = await response.json();

    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  data.forEach((element) => {
    templateCard.querySelector("h5").textContent = element.title;
    templateCard.querySelector("p").textContent = element.precio;
    templateCard.querySelector("img").setAttribute("src", element.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = element.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

//al objeto carrito le añadimos propiedades y las seteamos
const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };
  //si el producto existe le aumenta 1
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  //hace una copia
  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

//pintar carrito
const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    (templateCarrito.querySelector("th").textContent = producto.id),
      (templateCarrito.querySelectorAll("td")[0].textContent = producto.title),
      (templateCarrito.querySelectorAll("td")[1].textContent =
        producto.cantidad),
      (templateCarrito.querySelector(".btn-info").dataset.id = producto.id),
      (templateCarrito.querySelector(".btn-danger").dataset.id = producto.id),
      (templateCarrito.querySelector("span").textContent =
        producto.cantidad * producto.precio);

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();


  //localStorage
  localStorage.setItem('carrito',JSON.stringify(carrito))

};

pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.values(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">
            Carrito vacío - comience a comprar!
        </th>`;

    return;
  }
  const totalPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  const totalCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  (templateFooter.querySelectorAll("td")[0].textContent = totalCantidad),
    (templateFooter.querySelector("span").textContent = totalPrecio);

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
  const vaciarCarrito = document.getElementById("vaciar-carrito");

  vaciarCarrito.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAccion = (e) => {
  //Aumentar
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...producto };
    }
    pintarCarrito();
  }

  e.stopPropagation();
};
