import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
  input: document.querySelector('.search-write'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.btnMore.addEventListener('click', onLoadMoreButtonClick);
let clikcMore = 1;
let perPage = 40;

let simpleL = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function onFormSubmit(e) {
  e.preventDefault();
  clikcMore = 1;
  perPage = 40;

  refs.btnMore.classList.add('visually-hidden');
  const eTarget = e.currentTarget.elements;
  const val = eTarget.searchQuery.value.trim();

  if (val === '') {
    Notify.warning('Sorry, please entre a correct word');
    return;
  }
  try {
    const { hits, totalHits } = await fetchApi(val, clikcMore);

    if (hits.length === 0) {
      clearGalleryMarkup();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    clearGalleryMarkup();
    loadMoreCards(hits);
    simpleL.refresh();
    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.btnMore.classList.remove('visually-hidden');
  } catch {
    console.error(error);
  }
}

async function onLoadMoreButtonClick() {
  clikcMore += 1;
  perPage += 40;
  const val = refs.input.value.trim();
  try {
    const { hits, totalHits } = await fetchApi(val, clikcMore);

    if (perPage > totalHits) {
      refs.btnMore.classList.add('visually-hidden');
      Notify.warning(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }

    loadMoreCards(hits);
    simpleL.refresh();
  } catch {
    console.error(error);
  }
}

async function fetchApi(searchValue, pagestore) {
  const GET_API = 'https://pixabay.com/api/?';
  const KEY_API = '33081721-c69091c559654a3cd3e6be9dd';
  const OPTIONS_SEARCH =
    'image_type=photo&orientation=horizontal&safesearch=true';
  const response = await axios.get(
    `${GET_API}key=${KEY_API}&q=${searchValue}&${OPTIONS_SEARCH}&per_page=40&page=${pagestore}`
  );
  return response.data;
}

function loadMoreCards(cards) {
  const loadMarkup = cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}">
    <img class="js-img" src="${webformatURL}" alt="${tags}" loading="lazy" /> 
  </a>
  <div class="info">
    <p class="info-item">
    Likes
      <b>${likes}</b>
    </p>
    <p class="info-item">
    Views
      <b>${views}</b>
    </p>
    <p class="info-item">
    Comments
      <b>${comments}</b>
    </p>
    <p class="info-item">
    Downkoad
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', loadMarkup);
}
function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}
