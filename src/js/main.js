let API = null;
let DATASYMBOL = null;
let CURRENCYS = null;

const container = document.querySelector(".container");

document.addEventListener('DOMContentLoaded', async () => {
    await loadAPI();
    await Promise.all([
        chargeCurrencies(),
        chargeSymbols()
    ]);

    console.log(CURRENCYS);

    await chargeElements();
});

setInterval(updatePrices, 3000);


// ---------- FETCH HELPERS ----------
async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}


// ---------- LOADERS ----------
async function loadAPI() {
    API = await fetchJSON('../public/data/api.json');
}

async function chargeCurrencies() {
    CURRENCYS = await fetchJSON(API.apiCurrencies);
}

async function chargeSymbols() {
    DATASYMBOL = await fetchJSON(API.apiSymbols);
}
// ---------- UI ----------
async function chargeElements() {
    await Promise.all(
        DATASYMBOL.map(({ name, symbol }) =>
            createDivMetal(name, symbol)
        )
    );
}

async function createDivMetal(name, symbol) {

    let container = document.querySelector(".container");

    let divMetal = document.createElement("div");
    divMetal.classList.add("metal");
    divMetal.classList.add(name.toLowerCase());

    let divMetalData = document.createElement("div");
    divMetal.classList.add("metalData");

    let titleText = document.createElement("p");
    titleText.classList.add("titleText");
    titleText.textContent = `${name}/${symbol}`

    let priceText = document.createElement("p")
    divMetal.classList.add("priceText");
    priceText.dataset.symbol = symbol
    priceText.textContent = await chargePrice(symbol);

    divMetalData.appendChild(titleText);
    divMetalData.appendChild(priceText);
    divMetal.appendChild(divMetalData);
    container.appendChild(divMetal);
    container.appendChild
}

// ---------- PRICES ----------
async function chargePrice(symbol) {
    const data = await fetchJSON(`${API.apiUrlPrice}${symbol}`);
    return formatPriceToUSD(data.price);
}

async function updatePrices() {
    const priceElements = document.querySelectorAll("[data-symbol]");

    await Promise.all(
        [...priceElements].map(async (el) => {
            el.textContent = await chargePrice(el.dataset.symbol);
        })
    );
}


// ---------- FORMAT ----------
function formatPriceToUSD(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}