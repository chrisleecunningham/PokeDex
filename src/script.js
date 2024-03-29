
let pokemonRepository = (function () {

    // empty array to load from api
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20';


//adds pokemon with .push, if object
function add(pokemon) {
    if (
    typeof pokemon === 'object' &&
   'name' in pokemon
) {
    pokemonList.push(pokemon);
} else {
    console.log('pokemon is not correct');
}
}

function getAll() {
    return pokemonList;
}

function addListItem (pokemon) {
    let pokemonList = document.querySelector('.pokemon-list');
    let listPokemon = document.createElement('li');
    $('li').addClass('group-list-item');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('button-class');
    button.setAttribute('aria-label', pokemon.name);
    listPokemon.appendChild(button);
    pokemonList.appendChild(listPokemon);
    button.addEventListener('click', function() {
    showDetails(pokemon);
   });
}

//load a list of pokemon from api. Promise fetch function.
function loadList() {
    return fetch(apiUrl).then (function (response) {
        // convert response to json
        return response.json();
    }).then (function (json) {
        json.results.forEach(function (item) {
            let pokemon = {
                name: item.name,
                detailsUrl: item.url
            };
            // add function which pushes pokemon if it is object, and has name
            add(pokemon);
        });
        // if any error occurs, it will be cought right here
    }) .catch(function (e) {
        console.error (e);
    })
}

//load pokemon details - promise (image, height, type)
function loadDetails(item) {
    // defining url from json results and then fetching those details
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
        // details coming from api (all the info on each pokemon) after selecting which detail is needed (sprites, height, types-array)
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      // any errors will be cought here
    }).catch(function (e) {
      console.error(e);
    });
  }

  // info to log when pokemon is clicked. Execute loadDetails and pass pokemon as parameter and then executes
function showDetails (item) {
    pokemonRepository.loadDetails(item).then (function () {
        let modalContainer = document.querySelector ('#modal-container');

            modalContainer.innerHTML = '';

            let modal = document.createElement('div');
            modal.classList.add ('modal');

            let sprite = document.createElement('img');
            sprite.classList.add ('sprite');
            sprite.src = item.imageUrl;

            let closeButtonElement = document.createElement ('button');
            closeButtonElement.classList.add('modal-close');
            closeButtonElement.innerText = 'X';
            closeButtonElement.addEventListener ('click', hideModal)

            let titleElement = document.createElement ('h1');
            titleElement.innerText =  (item.name);

            let contentElement = document.createElement ('p');

            // variable declared as empty string to be used to store the names of the types
            let pokemonTypes = '';

            // for loop used to iterate through the item.types object.
            for (let i = 0; i < item.types.length; i++) {
                //name of the current type is concatenated to the typeNames variable (appending to the end of the string)
                pokemonTypes += item.types[i].type.name;
                //if i is less than length - 1, a comma and space are added to typeNames (to avoid adding comma after las type)
                if (i < item.types.length - 1) {
                    pokemonTypes += ', ';
                }
            }

            // value of typeNames is then assigned to the innertext property of contentElement.
            contentElement.innerText =('Height: ' + item.height + '\n' +  '\n' + 'Types: ' + pokemonTypes);


            modal.appendChild (closeButtonElement);
            modal.appendChild (titleElement);
            modal.appendChild (contentElement);
            modalContainer.appendChild (modal);
            modal.appendChild (sprite);


            modalContainer.classList.add('is-visible');


        function hideModal (){
            modalContainer.classList.remove ('is-visible');
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
              hideModal();
            }
          });

        modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
        });

        document.querySelector ('button.button-class').addEventListener('click', () => {
            showDetails ('Modal Title', 'Modal Content');
        });

    });

}


// all functions to return
return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    };
})();

// function that goes through the list of pokemon and displays them on index
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
});
