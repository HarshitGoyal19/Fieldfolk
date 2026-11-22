/* ---------- LOGIN (both login pages) ---------- */
function login(event, role) {
  event.preventDefault();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (password.length < 6) {
    msg.textContent = "Password must be at least 6 characters.";
    return false;
  }
  if (role === "buyer") {
    window.location.href = "buyer.html";
  } else {
    window.location.href = "seller.html";
  }
  return false;
}

/* ---------- BUYER PAGE ---------- */
const produce = [
  { id: 1, product: "Basmati Rice", category: "Grains", farmer: "Harpreet Singh", location: "Amritsar", contact: "98000 11111", quantity: 500, unit: "kg", price: 95, available: "ready now" },
  { id: 2, product: "Wheat", category: "Grains", farmer: "Gurmeet Kaur", location: "Patiala", contact: "98000 22222", quantity: 1200, unit: "kg", price: 28, available: "ready now" },
  { id: 3, product: "Tomatoes", category: "Vegetables", farmer: "Ravi Kumar", location: "Jalandhar", contact: "98000 33333", quantity: 150, unit: "kg", price: 35, available: "from 5 Dec" },
  { id: 4, product: "Kinnow", category: "Fruits", farmer: "Simran Gill", location: "Hoshiarpur", contact: "98000 44444", quantity: 300, unit: "kg", price: 60, available: "from 15 Dec" },
  { id: 5, product: "Milk", category: "Dairy", farmer: "Balwinder Singh", location: "Moga", contact: "98000 55555", quantity: 80, unit: "litres", price: 55, available: "daily" }
];

const orders = [
  { product: "Wheat", farmer: "Gurmeet Kaur", quantity: 100, status: "accepted" },
  { product: "Tomatoes", farmer: "Ravi Kumar", quantity: 20, status: "pending" },
  { product: "Basmati Rice", farmer: "Harpreet Singh", quantity: 50, status: "completed" }
];

function showProduce() {
  const text = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  let html = "";

  for (let i = 0; i < produce.length; i++) {
    const p = produce[i];
    const nameMatches = p.product.toLowerCase().includes(text);
    const categoryMatches = category === "All" || p.category === category;

    if (nameMatches && categoryMatches) {
      html += `<article class="card" data-category="${p.category}">
        <h3>${p.product}</h3>
        <span class="price">₹${p.price} per ${p.unit}</span>
        <small>${p.quantity} ${p.unit} available, ${p.available}</small>
        <small>Farmer: ${p.farmer}, ${p.location}</small>
        <small>Contact: ${p.contact}</small>
        <label for="qty${p.id}">Quantity (${p.unit})</label>
        <input type="number" id="qty${p.id}" min="1" max="${p.quantity}" value="1">
        <button onclick="requestOrder(${p.id})">Request order</button>
      </article>`;
    }
  }

  if (html === "") {
    html = "<p>No produce matches. Try another name or category.</p>";
  }
  document.getElementById("produceList").innerHTML = html;
}

function requestOrder(id) {
  const msg = document.getElementById("orderMsg");
  const quantity = Number(document.getElementById("qty" + id).value);
  let item = null;

  for (let i = 0; i < produce.length; i++) {
    if (produce[i].id === id) {
      item = produce[i];
    }
  }

  if (quantity < 1 || quantity > item.quantity) {
    msg.className = "msg";
    msg.textContent = `Enter a quantity between 1 and ${item.quantity} ${item.unit}.`;
  } else {
    orders.push({ product: item.product, farmer: item.farmer, quantity: quantity, status: "pending" });
    msg.className = "msg ok";
    msg.textContent = `Request sent: ${quantity} ${item.unit} of ${item.product}.`;
    showOrders();
  }
}

function showOrders() {
  let rows = "";
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    rows += `<tr><td>${o.product}</td><td>${o.farmer}</td><td>${o.quantity}</td>
      <td><span class="status ${o.status}">${o.status}</span></td></tr>`;
  }
  document.getElementById("orderRows").innerHTML = rows;
}

/* ---------- SELLER PAGE ---------- */
const farmer = { name: "Harpreet Singh", location: "Amritsar, Punjab", contact: "98000 11111" };

const myListings = [
  { product: "Basmati Rice", category: "Grains", quantity: 500, price: 95, available: "Ready now" },
  { product: "Mustard Greens", category: "Vegetables", quantity: 90, price: 30, available: "2026-12-05" }
];

const requests = [
  { buyer: "Anita Traders", product: "Basmati Rice", quantity: 50, status: "pending" },
  { buyer: "City Kitchen", product: "Basmati Rice", quantity: 120, status: "accepted" },
  { buyer: "Meera Stores", product: "Mustard Greens", quantity: 15, status: "completed" }
];

function showProfile() {
  document.getElementById("profileInfo").innerHTML =
    `<dt>Name</dt><dd>${farmer.name}</dd>
     <dt>Location</dt><dd>${farmer.location}</dd>
     <dt>Contact</dt><dd>${farmer.contact}</dd>`;
}

function showListings() {
  let rows = "";
  for (let i = 0; i < myListings.length; i++) {
    const l = myListings[i];
    rows += `<tr><td>${l.product}</td><td>${l.category}</td><td>${l.quantity} kg</td>
      <td>₹${l.price}/kg</td><td>${l.available}</td></tr>`;
  }
  document.getElementById("listingRows").innerHTML = rows;
}

function addListing(event) {
  event.preventDefault();
  myListings.push({
    product: document.getElementById("product").value.trim(),
    category: document.getElementById("newCategory").value,
    quantity: Number(document.getElementById("quantity").value),
    price: Number(document.getElementById("price").value),
    available: document.getElementById("available").value
  });
  showListings();
  event.target.reset();
  const msg = document.getElementById("listingMsg");
  msg.className = "msg ok";
  msg.textContent = "Listing added.";
  return false;
}

function showRequests() {
  let rows = "";
  for (let i = 0; i < requests.length; i++) {
    const r = requests[i];
    let action = "None";
    if (r.status === "pending") {
      action = `<button onclick="updateRequest(${i}, 'accepted')">Accept</button>`;
    } else if (r.status === "accepted") {
      action = `<button onclick="updateRequest(${i}, 'completed')">Mark completed</button>`;
    }
    rows += `<tr><td>${r.buyer}</td><td>${r.product}</td><td>${r.quantity} kg</td>
      <td><span class="status ${r.status}">${r.status}</span></td><td>${action}</td></tr>`;
  }
  document.getElementById("requestRows").innerHTML = rows;
}

function updateRequest(index, newStatus) {
  requests[index].status = newStatus;
  showRequests();
}
