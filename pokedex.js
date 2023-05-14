//Bugs: Filter doesn't go back once unchecked
//      extra buttons when go straight to last page like fighting click 5 (Done)
//    Filter 2 typees not just 1

const setup = async () => {

   let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
  // console.log("res: " + response.data.results);
  
  pokemonData = response.data.results;
  //console.log("frPd: " + pokemonData);
   
   const filterTypes = [];
   showPage(1,filterTypes);
  //checkbox filter
   
  $("body").on("click","#pokeTypesFilter input",async function(e){

    
    let filterType = $(this).attr("value");
    
    if ($(this).is(':checked')){
      console.log("checked: " + filterType);
      filterTypes.push(filterType);
    }else{
      console.log(" not checked: " + filterType);
      if(filterTypes.indexOf(filterType) > 0){
        filterType = filterTypes[filterTypes.indexOf(filterType)-1];
      }
      console.log(" after: " + filterType);
      filterTypes.pop();
    
      
    }
    //empty array
     console.log("arrlen: " + filterTypes.length);
     if(filterTypes.length == 0){

      pokemonData = response.data.results;
     }else{
      console.log("array: " + filterTypes);
      console.log("ft: "+ filterType);
      const typeRes = await axios.get(`https://pokeapi.co/api/v2/type/${filterType}`);
     // console.log("res: " + typeRes);
      //console.log("resD: " + typeRes.data);
      const types = typeRes.data.pokemon.map((filterTypes) => filterTypes.pokemon);
  
      pokemonData =types;
  
      let newerPokemon810 = 0
     for(let k =0; k < pokemonData.length; k++){
      let innerResponse = await axios.get(`${pokemonData[k].url}`);
      let thisPokemon = innerResponse.data;
      if(thisPokemon.id > 810){
        newerPokemon810++;
      }
     }
  
     pokemonData.length = pokemonData.length - newerPokemon810;
     }
    // if(filterTypes.length > 2){
    //   filterTypes.splice(0,3);
    // }
    
      
    
    
    
   
   
    showPage(1,filterTypes);
  });
   

   
  //Modal when click on more
   $('body').on('click', '.pokeCard', async function (e) {
      const pokemonName = $(this).attr('pokeName')
       console.log("pokemonName: ", pokemonName);
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      console.log("res: ", res);
       console.log("res.data: ", res.data);
      const types = res.data.types.map((pokemon) => pokemon.type.name)
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


   //Page button and next/prev buttons
    $("body").on("click",".pageBtn", async function(e){
      const currPage = parseInt($(this).attr("pageNum"));
      console.log("Page Clicked: " + currPage);
      showPage(currPage,filterTypes);
    });
    
    
   
};

async function showPage(currentPageNum,filterTypes){
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
   $("#totalHeader").empty();

  
    $("#pokemon").empty();
   //console.log("shPd: " + pokemonData);
  // console.log("pLen: " + pokemonData.length);
   let currPokemonNum = 0;
   for(let i= ((currentPageNum -1)*numPerPage ); i< ((currentPageNum -1)*numPerPage) + numPerPage && i<pokemonData.length ;i++){
      //console.log("i " + i);
      let innerResponse = await axios.get(`${pokemonData[i].url}`);
      let thisPokemon = innerResponse.data;
      //console.log("iR: " + innerResponse);
   
     // console.log("index: " + thisPokemon.id);
   //  console.log("typArr: " + filterTypes);
    // console.log("Pktyp: " +  thisPokemon.types.map((pokemon) => pokemon.type.name));
     let type = thisPokemon.types.map((pokemon) => pokemon.type.name);
     
    // console.log(type);
    // console.log(type.toString());
    // console.log("TypM: " + filterTypes.includes(type.toString()));

     console.log("lTy: " + filterTypes);
    //  if(filterTypes.length == 0){
    //   ListofTypes = await axios.get(`https://pokeapi.co/api/v2/type`);
    //   for(let i =0; i< (ListofTypes.data.results).length-2 ; i++){
        
    //     filterTypes[i] = ListofTypes.data.results[i].name;
    //   }
    //  }
     //console.log(filterTypes.toString());
      if(thisPokemon.id <= 810  ){

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
        currPokemonNum++;
  
      }
       
   }

   $("#totalHeader").append(`
   <h1>Showing ${currPokemonNum}  of ${pokemonData.length} pokemon</h1>
   `)

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
      console.log("Out: " + totalPages);
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