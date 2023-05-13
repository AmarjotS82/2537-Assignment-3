const setup = async () => {

   let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
   console.log(response.data.results);

   pokemonData = response.data.results;

   showPage(1);

   $('body').on('click', '.pokeCard', async function (e) {
      const pokemonName = $(this).attr('pokeName')
       console.log("pokemonName: ", pokemonName);
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
       console.log("res.data: ", res.data);
      const types = res.data.types.map((type) => type.type.name)
       console.log("types: ", types);
      $('.modal-body').html(`
          <div style="width:200px">
          <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
          <div>
          <h3>Abilities</h3>
          <ul>
          ${res.data.abilities.map((pokemon) => `<li>${pokemon.ability.name}</li>`).join('')}
          </ul>
          </div>
  
          <div>
          <h3>Stats</h3>
          <ul>
          ${res.data.stats.map((pokemon) => `<li>${pokemon.stat.name}: ${pokemon.base_stat}</li>`).join('')}
          </ul>
  
          </div>
  
          </div>
            <h3>Types</h3>
            <ul>
            ${types.map((type) => `<li>${type}</li>`).join('')}
            </ul>
        
          `)
      $('.modal-title').html(`
          <h2>${res.data.name.toUpperCase()}</h2>
          <h5>${res.data.id}</h5>
          `)
      });


   
    $("body").on("click",".pageBtn", async function(e){
      const currPage = parseInt($(this).attr("pageNum"));
      console.log("Page Clicked: " + currPage);
      showPage(currPage);
    });
   
};

async function showPage(currentPageNum){
   var numPerPage = 10;

   var numOfBtnPerPage = 5;

   var totalPages = Math.ceil(pokemonData.length / numPerPage); 
  
   if(currentPageNum< 1){
      currentPageNum = 1
    } else if(currentPageNum>totalPages){
      currentPageNum =totalPages
    }

    var startBtnNum = Math.max(1,Math.ceil(currentPageNum - Math.floor(numOfBtnPerPage/2)));

   var endBtnNum = Math.max(numOfBtnPerPage,Math.ceil(currentPageNum + Math.floor(numOfBtnPerPage/2)));

    $("#pokemon").empty();
   
   for(let i= ((currentPageNum -1)*numPerPage ); i< ((currentPageNum -1)*numPerPage) + numPerPage && i<pokemonData.length ;i++){
      console.log("i " + i);
      let innerResponse = await axios.get(`${pokemonData[i].url}`);
      let thisPokemon = innerResponse.data;
      $("#pokemon").append(`
      <div class="pokeCard card" pokeName=${thisPokemon.name}>
      <h3>${thisPokemon.name}</h3> 
      <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">
         More
      </button>
      </div>  
      `
      );
   }
   $("#pagination").empty();

   if(currentPageNum > 1){
    $("#pagination").append(` <button type ="button" class="btn btn-primary pageBtn" id = "prevPage" 
    pageNum = "${currentPageNum-1}">Prev</button> `)
   }
   
    console.log("T: " + totalPages);
    console.log("S: " + startBtnNum);
    console.log("E: " + endBtnNum);
    for(let i = startBtnNum; i <= endBtnNum; i++){
      var active = "";
      if(i == currentPageNum){
         active = "active";
      } 
      if(i<=totalPages){
        $("#pagination").append(`<button type="button" class="btn btn-primary pageBtn ${active}" id = "${i}" pageNum = "${i}">${i}</button>`);
      }
      
     
    }

    if(currentPageNum < totalPages){
      $("#pagination").append(` <button type ="button" class="btn btn-primary pageBtn" id = "nextPage" 
      pageNum = "${currentPageNum+1}">Next</button>`)
    }
};


$(document).ready(setup);