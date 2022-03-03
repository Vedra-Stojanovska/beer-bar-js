//get elements from html
let containerDiv = document.getElementById("container");
let divImage = document.getElementById("img");
let heading = document.getElementById("heading");
//create a class for the beers
class Beer {
  constructor(
    name,
    desc,
    image,
    alcohol,
    bitterness,
    prodDate,
    tagline,
    foodPairing
  ) {
    this.name = name;
    this.desc = desc;
    this.image = image;
    this.alcohol = alcohol;
    this.bitterness = bitterness;
    this.prodDate = prodDate;
    this.tagline = tagline;
    this.foodPairing = foodPairing;
  }
  showValues() {
    heading.innerHTML = `${this.name} <p>"${this.tagline}"</p>`;
    divImage.innerHTML = `<img src="${this.image}" alt="" />`;
    containerDiv.innerHTML += `<p>${this.desc}</p><p>Brewed: ${this.prodDate}</p>
    <p>Alcohol: ${this.alcohol}%</p>
    <p>Bitterness: ${this.bitterness} IBU</p></div>
    <h2>Food Pairing</h2>`;
    for (let i = 0; i < this.foodPairing.length; i++) {
      containerDiv.innerHTML += `<ul class="foods"> 
      <li class="listFoods">${this.foodPairing[i]}</li>
    </ul>`;
    }
  }
}
//fetch the data
let fetchData = async () => {
  return (await fetch("https://api.punkapi.com/v2/beers/random")).json();
};

//use the data
let useData = async () => {
  let values = await fetchData();
  let beer = new Beer(
    values[0].name,
    values[0].description,
    values[0].image_url,
    values[0].abv,
    values[0].ibu,
    values[0].first_brewed,
    values[0].tagline,
    values[0].food_pairing
  );
  beer.showValues();
};

useData();
