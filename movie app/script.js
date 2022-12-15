// const base_url = `https://api.themoviedb.org/3`

// const Api_key = `api_key= de5f5f9edffdec0ae753c636978722c3`

// const api_url = base_url + `/discover/movie?sort_by=popularity.desc&` + Api_key;


const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = `https://image.tmdb.org/t/p/w500`

const searchURL = BASE_URL + '/search/movie?'+ API_KEY;

const genres =  [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]


  const main = document.getElementById('main')
  const form = document.getElementById('form')
  const search = document.getElementById('search')
  const tagsE1 = document.getElementById('tags')

  const prev = document.getElementById('prev')
  const next = document.getElementById('next')
  const current = document.getElementById('current')

  var currentPage = 1;
  var nextPage = 2;
  var prevPage = 3;
  var lasturl = '';
  var totalPages = 100;


// show movie in dom based on genre
  // const tagsE1 = document.getElementById('tags')
  var selectedGenre = []
  var setGenre = () => {
    tagsE1.innerHTML = null;

    genres.forEach(genre => {
        const t = document.createElement('div')
            t.classList.add('tag')
            t.id = genre.id
            t.innerText = genre.name

            t.addEventListener('click', () => {
                if(selectedGenre.length == 0){
                    selectedGenre.push(genre.id)
                }else {
                    if(selectedGenre.includes(genre.id)){
                        selectedGenre.forEach((id,idx) => {
                            selectedGenre.splice(idx,1)
                        })
                    }else{
                        selectedGenre.push(genre.id)
                    }
                }
                console.log(selectedGenre);
                getMovies(API_URL+'&with_genres='+ encodeURI(selectedGenre.join(',')) )
                highlightSection()
            })
            tagsE1.append(t)
    })
  }
  setGenre()


  let highlightSection = () => {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.classList.remove("highlight")
    })
    clearBtn()
    if(selectedGenre!=0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add('highlight')
        })
    }
  }


  let clearBtn= () => {
    let clearbtn = document.getElementById('clear')
    if(clearbtn){
        clearbtn.classList.add('highlight')
    }else {
        let clear = document.createElement('div')
        clear.classList.add('tag', 'highlight')
        clear.id = 'clear'
        clear.innerText = 'Clear x'
        clear.addEventListener('click', () => {
            selectedGenre = []
            setGenre()
            getMovies(API_URL)
        })
        tagsE1.append(clear)
    }

    
  }

  // fetch url
let getMovies = (url) =>{
  lasturl = url;
    fetch(url).then(res => res.json()).then(data =>{
        console.log(data)

        if(data.results.length!==0){
            showMovies(data.results)
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

          if(currentPage <= 1){
            prev.classList.add("disabled")
            next.classList.remove("disabled")
          }else if (currentPage >= totalPages){
            next.classList.add("disabled")
            prev.classList.remove("disabled")
          }else {
            prev.classList.remove("disabled")
            next.classList.remove("disabled")
          }

          tagsE1.scrollIntoView({behaviour : "smooth"})
        }else{
            main.innerHTML='<h1>No results found</h1>'
            main.style.color='white'
        }
    })
}


// show movie in dom based on popularity
getMovies(API_URL)
// let main = document.getElementById('main')

let showMovies = (data) => {

    main.innerHTML=null;

    data.forEach (movie => {
        const {title, poster_path,vote_average, overview, id} = movie;
        const movieE1 = document.createElement('div')
        movieE1.classList.add('movie')
        movieE1.innerHTML = `
        <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/>
                <button class="know-more" id="${id}">KNOW MORE</button>
            </div>
    `

    main.appendChild(movieE1)

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie)
    })
    })
    
}

const overlayContent = document.getElementById("overlay-content")

/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + `/movie/`+ id + `/videos?`+ API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
        document.getElementById("myNav").style.width = "100%";

        if(videoData.results.length>0){
          var embed = []
          var dots = []
          videoData.results.forEach((video, idx) => {
            let {name,key,site} = video;
            if(site = "YouTube"){
              embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class= "embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              `)

              dots.push(`
                <span class = "dot">${idx + 1}</span>
              `)
            }
            
          })

          var content = `
          <h1 class="no-result">${movie.original_title}</h1>

          <br/>

          ${embed.join('')}

          <br/>

          <div class = "dots">${dots.join('')}</div>


          `
         
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos()
        } else {
          overlayContent.innerHTML = '<h1>No results found</h1>'
          overlayContent.style.color = 'white'
        }
    }
  })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}
var activeSlide = 0
var totalVideos = 0
let showVideos = () => {
  let embedClasses = document.querySelectorAll(".embed")
  let dots = document.querySelectorAll(".dot")

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add("show")
      embedTag.classList.remove("hide")
    } else {
      embedTag.classList.remove("show")
      embedTag.classList.add("hide")
    }
  })

  dots.forEach((dot, indx)=> {
    if(activeSlide == indx){
      dot.classList.add("active")
    }else{
      dot.classList.remove("active")

    }
  })
}

let leftArrow = document.getElementById("left-arrow")
let rightArrow = document.getElementById("right-arrow")

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide-- ;
  } else { 
     activeSlide = totalVideos - 1;
  }
  showVideos()
})


  rightArrow.addEventListener('click', () => {
    if(activeSlide < (totalVideos - 1)){
      activeSlide ++ ;
    } else { 
       activeSlide = 0;
    }
    showVideos()
})


// set color by rating
let getColor= (vote) => {
    if(vote>=8){
        return 'green'
    }else if(vote>=5){
        return 'orange'
    }else{
        return 'red'
    }
}


// const form = document.getElementById('form')
// const search = document.getElementById('search')


// show results as per movie name
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value;
    selectedGenre = []
    setGenre()
    if(searchTerm){
        getMovies(searchURL+'&query='+ searchTerm)
    }else{
        getMovies(API_URL)
        alert(' oyeee Movie ka name to likhde yaaaaaraaa 🤦‍♀️ ')
    }

})




// var pageCall = (page) => {
//   let urlSplit = lastUrl.split("?")
//   let queryParams = urlSplit[1].split("&")
//   let key = queryParams[queryParams.length - 1].split("=")
//   if(key[0] != 'page'){
//     let url = lastUrl + '&page=' + page
//     getMovies(url)
//   }
// }


prev.addEventListener('click', () => {
  if( prevPage > 0){
    pageCall(prevPage)
  }
})

next.addEventListener('click', () => {
  if( nextPage <= totalPages){
    pageCall(nextPage)
  }
})


function pageCall(page){
  let urlSplit = lasturl.split('?');
  console.log('urlsplit',urlSplit);
  let queryParams = urlSplit[1].split('&');
  console.log('queryparams',queryParams);
  let key = queryParams[queryParams.length -1].split('=');
  console.log('key', key);
  if(key[0] != 'page'){
    console.log("lasturl", lasturl);
    let url = lasturl + '&page='+page
    console.log('url', url)
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    console.log("a", a);
    queryParams[queryParams.length -1] = a;
    console.log("a2", a);

    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}