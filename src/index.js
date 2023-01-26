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

refs.form.addEventListener('submit', onSearchSubmit);
refs.btnMore.addEventListener('click', onLoadMoreClick);
let clikcMore = 1;
let perPage = 40;

async function onSearchSubmit(e) {
  try {
    e.preventDefault();
    clikcMore = 1;

    refs.btnMore.classList.add('visually-hidden');
    const eTarget = e.currentTarget.elements;
    const val = eTarget.searchQuery.value.trim();

    if (val === '') {
      Notify.warning('Sorry, please entre a correct word');
      return;
    }

    await fetchApi(val, clikcMore)
      .then(data => {
        if (data.hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        clearGalleryMarkup();
        loadMoreCards(data.hits);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.btnMore.classList.remove('visually-hidden');
      })
      .catch(err => Notify.failure(err));
  } catch {
    console.error();
  }
}

async function onLoadMoreClick() {
  try {
    clikcMore += 1;
    perPage += 40;
    const val = refs.input.value.trim();

    await fetchApi(val, clikcMore)
      .then(data => {
        if (perPage > data.totalHits) {
          refs.btnMore.classList.add('visually-hidden');
          Notify.warning(
            'We are sorry, but you have reached the end of search results.'
          );
          return;
        }

        loadMoreCards(data.hits);
      })
      .catch(err => Notify.failure(err));
  } catch {
    console.error();
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
  let simpleL = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  simpleL.refresh();
}
function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}
