
let API = null;
let DATASYMBOL = null;

document.addEventListener('DOMContentLoaded', async () => {

    await loadAPI()
    //await charge();
    await chargeSymbols();
    console.log(DATASYMBOL);
    chargeElements();

});

setInterval(async () => {
     await updatePrices();
    console.log("update prices");
}, 3000);


async function chargeSymbols() {
    await fetch(API.apiSymbols)
        .then(response => response.json())
        .then(data => { DATASYMBOL = data });
}

async function charge() {
    await fetch(API.apiUrl)
        .then(response => response.json())
        .then(data => { DATA = data });
}

async function chargeElements() {
    await Promise.all(DATASYMBOL.map(element => createDivMetal(element.name, element.symbol)));
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

async function loadAPI() {
    const response = await fetch('./data/api.json');
    API = await response.json();
}


async function chargePrice(symbol) {
    const response = await fetch(`${API.apiUrlPrice}${symbol}`);
    const data = await response.json();
    let price = formatPriceToUSD(data.price); 
    return price;
}

async function updatePrices() {
    console.log("i");
    const priceElements = document.querySelectorAll("p[data-symbol]");
    await Promise.all(
        Array.from(priceElements).map(async (el) => {
            const symbol = el.dataset.symbol;
            el.textContent = await chargePrice(symbol);
        })
    );
}

function formatPriceToUSD(price){

    return String(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price));

}



