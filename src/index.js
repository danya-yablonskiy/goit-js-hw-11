import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '34776135-c2da03be0c2ba8614e7d82d4c';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', { 
  captionDelay: 250,
});


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
const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
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
else{
  Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
}
  })
}
}
// Ось це працює, але чим відрізняється від закоментованого нижче?
async function fetchImage(url){
  try {
    const response = await axios(url);
    const cards = response.data;
    refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
    currentPage +=1;
    refs.loadMoreBtn.classList.remove('is-hidden');
    lightbox.refresh();
    return cards;
  } catch{
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}


// ============================================================================================
// 1_Питання: Чому ось це працює тільки коли на 75 стрічці повертаємо не просто response, а response.data, 
// звідки береться ця дата, але не працює кнопка loadmore????

// function onSearch(e){
// resetPage();
// e.preventDefault();
// clearContainer();
// searchQuerry = e.currentTarget.elements.searchQuery.value.trim();
// const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
// if (searchQuerry === '') {
//   refs.loadMoreBtn.classList.add('is-hidden');
//   Notiflix.Notify.failure("Enter something.");
// }
// else{
//   fetchImage(url).then(cards => {
//     if (cards.total === 0) {
//       refs.loadMoreBtn.classList.add('is-hidden');
//       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//     }else{
//     refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
//     currentPage +=1;
//     refs.loadMoreBtn.classList.remove('is-hidden');
//     console.log(cards);
//     }
//   }).catch(()=>{
//   refs.loadMoreBtn.classList.add('is-hidden');
//   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//   })
//   }
// }

// const fetchImage = async (url) =>{
//   const response = await axios.get(url);
//   return response;
// }
// ==================================================================================================
// 2_Питання: Чому ось це не працює???
// const fetchImage = async (url) =>{
//   const response = await axios.get(url);
//   return response;
// }
 
// fetchImage().then(cards => 
//   {
//     refs.cardEl.insertAdjacentHTML('beforeend', renderCards(cards));
//     currentPage +=1;
//     refs.loadMoreBtn.classList.remove('is-hidden');
//     console.log(cards)
// }
// ).catch(() => {
//   refs.loadMoreBtn.classList.add('is-hidden');
//   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
// })

// ========================================================================================

// Без асинхронної функції - працює!!!
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
<a class='gallery__link' href='${largeImageURL}'><img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/></a>
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

