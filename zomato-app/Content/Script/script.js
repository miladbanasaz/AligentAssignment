//Global variables
var apiUrl = 'https://developers.zomato.com/api/v2.1/';
var userKey = '970aa2d51e2ee8c58a094ef32a2aad2b';
var categoryArr = [];
var cuisineArr = [];




window.onload= function() {
    
    //TODO implement all of api calls in one function then call it :  Done
    //TODO using handlebar would be better for templating in page
    //TODO clean your code: get rid of on neccessary comments and block of codes
    //Loading gif
    loadinFetchGif(true);
    
//Get list of Categories
async function getListOfCategory(){
    try{
        const url = apiUrl + "categories";
let  categoryResponse = await publicFetchMethod(url);
if(categoryResponse.ok){
let result = await categoryResponse.json();
if(document.readyState === "complete")
initializeCategories(result);
}
    }
    catch(error){
        console.log(error);
    }
}
//Get List of Cuisines
async function getListOfCuisines(){
    try{
        const optionsRequest = {
            city_id : 297
        }
        const url = apiUrl + `cuisines?${Object.keys(optionsRequest)[0]}=${optionsRequest.city_id}`;
        let  cuisinerespone = await publicFetchMethod(url);
        if(cuisinerespone.ok){
            let result = await cuisinerespone.json();
            initializeCuisines(result);
        }
    }
    catch(error){
        console.log(error)
    }
}

//get list of resturants at first Stage
 async function getInitialresturantsList() {
    
    const optionsRequest = {
        entity_id : 297,
        entity_type : "city",
        start : 0,
        count: 100
    };
  
    const url = apiUrl +  `search?${Object.keys(optionsRequest)[0]}=${optionsRequest.entity_id}&${Object.keys(optionsRequest)[1]}=${optionsRequest.entity_type}&${Object.keys(optionsRequest)[3]}=${optionsRequest.count}`;
    try {
        
          let  response = await publicFetchMethod(url);
          if(response.ok) {
            
      let result = await response.json();
      //create aside details
      getInitialResturants(result);
      
      loadinFetchGif(false);
      
    }
    else{
        handleErrorInFetching();
        
    }
    }
    catch(error) {
        handleErrorInFetching();  
        console.log(error);
        
    }
}



getInitialresturantsList();
getListOfCategory();
getListOfCuisines();

  setTimeout(() => {
    addClickEventAsideLIs();
    
  }, 1500); 
  setTimeout(() => {
    addClickEventCategoryCheckBoxes();
    
  }, 1500);  
  setTimeout(() => {
    addClickEventCuisineCheckBoxes();
    
  }, 1500);  

    
    
}
//TODO there is a console error for declaration, but it doesn'y matter to functionality
const handleErrorInFetching = () => {
    let resultTitleAside = document.getElementsByClassName("error-handling")[0];
    resultTitleAside.innerHTML = "Error in getting data";
    let imgSrcError = document.querySelector(".restaurent-img");
    imgSrcError.src = "Content/Images/no_image.jpg";  
    let CUSINES = document.querySelector(".restaurent-CUSINES");
    CUSINES.innerHTML = "----";
    let phone_numbers = document.querySelector(".restaurent-phone_numbers");
    phone_numbers.innerHTML = "----";
    loadinFetchGif(false);
};
//adding Click Event to each li Child
const addClickEventAsideLIs = () =>{
    const liList = document.querySelectorAll('.restaurent-list  li');    
    liList.forEach((item)=> {
        item.addEventListener('click', (e) =>{
        let restaurentID = e.target.getAttribute('data-id');
        getRestaurentDetailInformation(restaurentID);
        })
    });
};
//adding Click Event to each check box of category
const addClickEventCategoryCheckBoxes = () =>{
    const categoryCheckBoxes = document.querySelector('.category-container'); 
    var checkboxesCategoryAll = categoryCheckBoxes.querySelectorAll('input[type="checkbox"]');  
    checkboxesCategoryAll.forEach((item)=> {
        item.addEventListener('click', (e) =>{
        let categoryID = e.target.getAttribute('id');
        let checked = e.target.checked;
        getRestaurentDetailInformationByFilter(categoryID,0,checked);
        })
    });
};
//adding Click Event to each check box of Cuisine
const addClickEventCuisineCheckBoxes = () =>{
    const cuisineCheckBoxes = document.querySelector('.cuisine-container'); 
    var checkboxesCuisineAll = cuisineCheckBoxes.querySelectorAll('input[type="checkbox"]');  
    checkboxesCuisineAll.forEach((item)=> {
        item.addEventListener('click', (e) =>{
        let cuisineID = e.target.getAttribute('id');
        let checked = e.target.checked;
        getRestaurentDetailInformationByFilter(cuisineID,1,checked);
        })
    });
};
//Fetching detail information of each restaurent
 async function getRestaurentDetailInformation(id) {
    const idForFetching = id;
        const request ={
            res_id : idForFetching
        };
        const url = apiUrl + `restaurant?${Object.keys(request)[0]}=${request.res_id}`;
    try{
        loadinFetchGif(true);
       let response = await fetch(url,{
        method : 'get',
        headers : {
            "Content-Type" : 'application/json',
            'user-key' : userKey
        }   
       }).then(resp => resp.json())
        .then(data =>{ 
            
            let defaultRestaurent = {
                name : data.name,
                imgURL : data.photos[0].photo.url,
                address : data.location.address,
                delivery:"",//TODO
                cuisines : data.cuisines,
                phone_numbers : data.phone_numbers,
                openingHours : ""//TODO
            }
            
            
            
            
                fillDetailSectionByDefault.call(this,defaultRestaurent);
            
        })
        .catch(error => console.log(error)) 
        
       }
    catch(error){

    }
};
//Filter
async function getRestaurentDetailInformationByFilter(id,type,isChecked){
    
    let cuisineSTR ="cuisines";
    let categorySTR = "category";

    //TODO change it from global
    // let categoryArr = []; 
    // let cuisineArr = [];

    //Adding selected checkbox of arrays
    if(type === 0 && isChecked && !categoryArr.includes(id)){
        categoryArr.push(id);
        
    }else if(type === 1 && isChecked  && !cuisineArr.includes(id)){
        cuisineArr.push(id)
        
    }
    //Removing  checkboxes from arrays if they are unchecked,
    if(type === 0 && !isChecked && categoryArr.includes(id)){
        
        let index = categoryArr.indexOf(id);
        if (index !== -1) categoryArr.splice(index, 1);
        
    }else if(type === 1 && !isChecked  && cuisineArr.includes(id)){
        
        let index = cuisineArr.indexOf(id);
        if (index !== -1) cuisineArr.splice(index, 1);
        
    }
    //TODO check if none of them was checked
    const reqEntityID = {
        entity_id : 297
    }
    //Checking what filters end-user has selected
    let catLength = categoryArr.length;
    let cuisLength = cuisineArr.length;
    let senderSTr ="";
     if(catLength > 0 && cuisLength > 0){
         senderSTr = `&cuisines="${cuisineArr.join("'")}"&category="${categoryArr.join("'")}"`;
     }
     else if(catLength > 0 && !(cuisLength > 0)){
        senderSTr = `&category="${categoryArr.join("'")}"`;
     }
     else if(!(catLength > 0) && cuisLength > 0){
        senderSTr = `&cuisines="${cuisineArr.join("'")}"`;
     }
    let url = apiUrl +`search?${Object.keys(reqEntityID)[0]}=${reqEntityID.entity_id}${senderSTr}`;
    
    try{
    loadinFetchGif(true);
    
    let  filteredResponce = await publicFetchMethod(url);
    if(filteredResponce.ok){
        
        let result = await filteredResponce.json();
        let ExistingResUL = document.querySelector('.restaurent-list');
        ExistingResUL.innerHTML= '';
        getInitialResturants(result);
        }
    }
    catch(error){
        console.log(error);
    }
    setTimeout(() => {
        loadinFetchGif(false);
    }, 1000);
    setTimeout(() => {
        addClickEventAsideLIs();
        
      }, 1500); 
   
}
const loadinFetchGif = show => {
    let loader = document.getElementById('loading');
    if(show){
        
        loader.style.display ='block';
    }
    else{
        
        loader.style.display ='none';
    }
} 

let fillDetailSectionByDefault = firstRestaurent => {
    if(firstRestaurent.imgURL === "" || firstRestaurent.imgURL === null)
    {
        imgSrc.src = "Content/Images/no_image.jpg";
    }
    let imgSrc = document.querySelector(".restaurent-img");
    
    imgSrc.src = firstRestaurent.imgURL;
        let title = document.querySelector(".resturant-name");
        title.innerHTML = firstRestaurent.name;
        let address = document.querySelector(".restaurent-address");
        address.innerHTML = firstRestaurent.address;
        let CUSINES = document.querySelector(".restaurent-CUSINES");
        CUSINES.innerHTML = firstRestaurent.cuisines;
        let phone_numbers = document.querySelector(".restaurent-phone_numbers");
        phone_numbers.innerHTML = firstRestaurent.phone_numbers;    
        setTimeout(() => {
            loadinFetchGif(false);
        }, 1000);
    
    };

//Category
//Method to passing selected list of categorie to function to create
const initializeCategories = categorResult => {
    let arrCategory = [];
    arrCategory=categorResult.categories;
    arrCategory.forEach(element => {
        let categoryDetail = {
            id: element.categories.id,
            name: element.categories.name
        };
        generateCategoryList(categoryDetail);
    });

};
//create category checkboxes and append to a div
const generateCategoryList = catDetail => {

    const categoriesContainer = document.querySelector('.category-container');
    let categoryLabel = document.createElement('label');
    categoryLabel.appendChild(document.createTextNode(`${catDetail.name}`));
    categoryLabel.setAttribute('class','checkbox-container')
    let categoryInput = document.createElement('input');
    categoryInput.setAttribute('type','checkbox');
    categoryInput.setAttribute('id',`${catDetail.id}`);
    categoryInput.classList.add("categoryCheckbox");
    categoryLabel.appendChild(categoryInput);
    let categorySpan = document.createElement('span');
    categorySpan.setAttribute('class','checkmark');
    categoryLabel.appendChild(categorySpan);
    categoriesContainer.appendChild(categoryLabel);
};
//CUISINES
//Initialize cuisines
const initializeCuisines = causineResult => {
    let arrCuisines = [];
    arrCuisines=causineResult.cuisines;
    arrCuisines.forEach(element => {
        let cuisineDetail = {
            cuisine_id: element.cuisine.cuisine_id,
            cuisine_name: element.cuisine.cuisine_name
        };
        generateCuisinesList(cuisineDetail);
    });

};
//Generate cuisine in DOM for filtering
const generateCuisinesList = cuisDetail => {
    const cuisineContainer = document.querySelector('.cuisine-container');
    let cuisineLabel = document.createElement('label');
    cuisineLabel.appendChild(document.createTextNode(`${cuisDetail.cuisine_name}`));
    cuisineLabel.setAttribute('class','checkbox-container')
    let cuisineInput = document.createElement('input');
    cuisineInput.setAttribute('type','checkbox');
    cuisineInput.setAttribute('id',`${cuisDetail.cuisine_id}`);
    cuisineInput.classList.add("cuisineCheckbox");
    cuisineLabel.appendChild(cuisineInput);
    let cuisineSpan = document.createElement('span');
    cuisineSpan.setAttribute('class','checkmark');
    cuisineLabel.appendChild(cuisineSpan);
    cuisineContainer.appendChild(cuisineLabel);
 
};



//Public method for calling API

async function publicFetchMethod(url){
 let result =   await fetch(url , {
        method: 'get',
        headers:{
            "Content-Type": "application/json",
            'user-key': userKey
        }
    });
    return result;
};


    
const getInitialResturants = result => {
    //TODO RegX
    //const regxFornames = RegExp('/^"\'!@#$%\^&*)(+=._-]*$/');
    //var resultexp = regxFornames.test(arrResturantResult[i].name);


    let arrResturantResult = [];
    arrResturantResult = result.restaurants;
     console.log(arrResturantResult);
    arrResturantResult.forEach((element,index) => {
        let restaurentDetail = {
            name : element.restaurant.name.replace("'", "", 'g'),
            id : element.restaurant.id
        };
        
        
        //Generate List of restaurents for aside
        
        generateResturantsLI(restaurentDetail);

        const changingUndefined = "----";
        console.log(element)
        let defaultRestaurent = {
            name : typeof(element.restaurant.name) !=="undefined" ? element.restaurant.name : changingUndefined ,
            imgURL : typeof(element.restaurant.photos) !== "undefined"
             ? element.restaurant.photos[0].photo.url 
             : changingUndefined ,
            address : typeof(element.restaurant.location.address) !== "undefined" 
            ? element.restaurant.location.address 
            : changingUndefined,
            delivery:"",//TODO
            cuisines : typeof(element.restaurant.cuisines) !== "undefined" 
            ? element.restaurant.cuisines
            : changingUndefined,
            phone_numbers : typeof(element.restaurant.phone_numbers) !== "undefined"
            ? element.restaurant.phone_numbers 
            : changingUndefined,
            openingHours : ""//TODO
        }
        if(index === 0) {
            fillDetailSectionByDefault(defaultRestaurent)
            
        };
    });
}
//Method to generate li in DOM for each restaurent and append to UL
const generateResturantsLI = resDetail => {
     const resUL = document.querySelector('.restaurent-list');
     const li = document.createElement('li');
     li.appendChild(document.createTextNode(resDetail.name));
     li.setAttribute("data-id",resDetail.id);
     resUL.appendChild(li);
    //return resUL;
}