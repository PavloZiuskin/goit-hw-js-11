import axios from 'axios';
import { refs } from './jsmodules/refsFunction';
import { fetchApi } from './jsmodules/fetchFunction';
import {
  createGalleryCards,
  loadMoreCards,
} from './jsmodules/createGalleryCard';
import { Notify } from 'notiflix';

refs.form.addEventListener('submit', onSearchSubmit);
refs.btnMore.addEventListener('click', onLoadMoreClikc);

let clikcMore = 1;
let perPage = 40;

function onSearchSubmit(e) {
  e.preventDefault();

  refs.btnMore.classList.add('visually-hidden');
  const eTarget = e.currentTarget.elements;
  const val = refs.input.value;
  if (val === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  fetchApi(eTarget.searchQuery.value)
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.btnMore.classList.add('visually-hidden');
      }
      createGalleryCards(data.hits);
      console.log(data);
    })
    .catch(err => Notify.warning(err));
  refs.btnMore.classList.remove('visually-hidden');
}

function onLoadMoreClikc(e) {
  if (refs.input.value === '') {
    clikcMore = 1;
  }
  perPage += 40;
  clikcMore += 1;
  fetchApi(refs.input.value, clikcMore)
    .then(data => {
      if (perPage > data.totalHits) {
        refs.btnMore.classList.add('visually-hidden');
      }
      loadMoreCards(data.hits);
      console.log(data);
    })
    .catch(err => Notify.failure(`Sorry, ${err}`));
}
