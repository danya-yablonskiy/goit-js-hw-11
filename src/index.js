import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '34776135-c2da03be0c2ba8614e7d82d4c';
const BASE_URL = 'https://pixabay.com/api/';

const refs = {
    formEl: document.querySelector('#search-form'),
    cardEl: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

let searchQuerry = '';
let currentPage = 1;

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore)

function onSearch(e){
resetPage();
e.preventDefault();
clearContainer();
searchQuerry = e.currentTarget.elements.searchQuery.value.trim();
const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=100&page=${currentPage}`;
if (searchQuerry === '') {
  refs.loadMoreBtn.classList.add('is-hidden');
  Notiflix.Notify.failure("Enter something.");
}
else{
  fetchImage(url).then(cards => {
    if (cards.total === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
  });
  }
  

}

const fetchImage = async (url) =>{
  const responce = await axios.get(url);
  const cards = await responce.json();
  return cards;
}
 
fetchImage().then(cards => 
  {
    refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
    currentPage +=1;
    refs.loadMoreBtn.classList.remove('is-hidden');
    console.log(cards)
}
).catch(() => {
  refs.loadMoreBtn.classList.add('is-hidden');
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
})

// function fetchImage(url){
//   return fetch(url)
//   .then(response => response.json())
//   .then(cards => 
//     {
//       refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
//       currentPage +=1;
//       refs.loadMoreBtn.classList.remove('is-hidden');
//       console.log(cards)
//       return cards;
// }
//   )
//   .catch(() => {
//     refs.loadMoreBtn.classList.add('is-hidden');
//     Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//   })
// }

function onLoadMore(){
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  fetchImage(url);
}

function renderCards(cards){
    return cards.hits.map(({webformatURL,largeImageURL,tags,likes,views,comments, downloads}) => {
return `<div class="photo-card">
<img src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/>
<div class="info">
  <p class="info-item">
    <b>Likes:${likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${downloads}</b>
  </p>
</div>
</div>`
    }).join('')
}

function clearContainer(){
  refs.cardEl.innerHTML ='';
}

function resetPage(){
  currentPage = 1;
}

