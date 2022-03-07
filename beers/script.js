//get the inputs from the html
let image = document.getElementById("image");
let container = document.getElementById("container");
let nextButtons = document.getElementById("next");
let prevButtons = document.getElementById("prev");
let sortButtonName = document.getElementById("sort");
let sortButtonAbv = document.getElementById("sortAlcohol");
let sortButtonIbu = document.getElementById("sortBitterness");
let buttonsShowValues = document.querySelectorAll(".buttonsShow");
let searchValue = document.getElementById("searchInput");
let searchButton = document.getElementById("searchBtn");

//create a class of beers
class Beer {
  constructor({ name, description, image_url, abv, ibu, first_brewed }) {
    this.name = name;
    this.desc = description;
    this.image = image_url;
    this.alcohol = abv;
    this.bitterness = ibu;
    this.prodDate = first_brewed;
  }
  static create(response) {
    return new Beer(response);
  }
  showData() {
    container.innerHTML += `<div class="card" id="card"><p>Alcohol: ${this.alcohol}</p><p>Bitterness: ${this.bitterness}</p>
    <h4>${this.name}</h4> <img src="${this.image}" alt="" />
    <p>Production Date: ${this.prodDate}</p></div>`;
  }
  searchData() {
    if (searchValue.value == this.name) {
      container.innerHTML = "";
      this.showData();
      searchValue.value = "";
    }
  }
}
//object to store the data
let storageData = {
  url: "https://api.punkapi.com/v2/beers?per_page=80",
  data: [],
};
//function to tell where the data needs to be stored
let storeData = (value) => {
  storageData.data = value;
  return storageData;
};
//bool value to change the page
let changePage = true;
//function to fetch the data and parse it into objects
let getData = async (url) => {
  return (await fetch(url)).json();
};
//where the page will start
let currentPage = -1;
//function to let the user change how many values he wants to see on the page
let changeBeersPage = (items) => {
  buttonsShowValues.forEach((button) => {
    button.addEventListener("click", (e) => {
      container.innerHTML = "";
      //pagination on the items
      let loopStart = parseInt(e.target.innerText) * currentPage;
      let paginatedItems = items.slice(
        loopStart,
        loopStart + parseInt(e.target.innerText)
      );
      paginatedItems.forEach((value) => {
        value.showData();
      });
      //sort out the beers
      sortOutBeersName(paginatedItems);
      sortOutBeersAlcohol(paginatedItems);
      sortOutBeersBitterness(paginatedItems);
    });
  });
};
//sort out beers by name
let sortOutBeersName = (items) => {
  sortButtonName.addEventListener("click", () => {
    container.innerHTML = "";
    items
      .sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }
        a.name + " " + b.name;
      })
      .forEach((value) => {
        value.showData();
      });
  });
};
//sort out beers by alcohol
let sortOutBeersAlcohol = (items) => {
  sortButtonAbv.addEventListener("click", () => {
    container.innerHTML = "";
    items
      .sort((a, b) => {
        return parseInt(a.alcohol) - parseInt(b.alcohol);
      })
      .forEach((value) => {
        value.showData();
      });
  });
};
//sort out beers by bitterness
let sortOutBeersBitterness = (items) => {
  sortButtonIbu.addEventListener("click", () => {
    container.innerHTML = "";
    items
      .sort((a, b) => {
        return a.bitterness - b.bitterness;
      })
      .forEach((value) => {
        value.showData();
      });
  });
};
//use the provided data from the api
let useData = async (url) => {
  //try and catch blocks
  try {
    let values = await getData(url);
    storeData(values);
    //create classes for each beer
    let beers = storageData.data.map((value) => Beer.create(value));
    //if change page is true, increment the current page, else decrement it so the next and prev button work
    if (changePage == true && currentPage < 15) {
      currentPage++;
    } else if (changePage == false && currentPage > 0) {
      currentPage--;
    }
    //calling the function changeBeersPage so that the user can choose how many values he wants to see
    changeBeersPage(beers);
    //max values shown when we firstly open the page or refresh it
    let max = 5;
    //pagination
    let loopStart = max * currentPage;
    let paginatedItems = beers.slice(loopStart, loopStart + max);
    paginatedItems.forEach((value) => {
      value.showData();
    });
    searchButton.addEventListener("click", () => {
      beers.forEach((value) => {
        value.searchData();
      });
    });
    //call the functions to sort out the beers
    sortOutBeersName(paginatedItems);
    sortOutBeersAlcohol(paginatedItems);
    sortOutBeersBitterness(paginatedItems);
  } catch (e) {
    throw new Error();
  }
};
//next button
nextButtons.addEventListener("click", async (e) => {
  changePage = true;
  container.innerHTML = "";
  let values = await useData(storageData.url);
});
//prev button
prevButtons.addEventListener("click", async () => {
  changePage = false;
  container.innerHTML = "";
  let values = await useData(storageData.url);
});
//call the function
useData(storageData.url);
