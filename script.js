
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

    let divMetalData = document.createElement("div")
    let h1 = document.createElement("h1")
    h1.textContent = `${name}/${symbol}`

    let h2 = document.createElement("h2")
    h2.dataset.symbol = symbol
    console.log(h2.dataset.symbol);
    h2.textContent = await chargePrice(symbol, h2);

    divMetalData.appendChild(h1);
    divMetalData.appendChild(h2);
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
    const priceElements = document.querySelectorAll("h2[data-symbol]");
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



