import axios from 'axios';

export async function fetchApi(searchValue, page) {
  const GET_API = 'https://pixabay.com/api/?';
  const KEY_API = '33081721-c69091c559654a3cd3e6be9dd';
  const OPTIONS_SEARCH =
    '&image_type=photo&orientation=horizontal&safesearch=true';
  const response = await axios.get(
    `${GET_API}key=${KEY_API}&q=${searchValue}${OPTIONS_SEARCH}&page=${page}&per_page=40`
  );
  return response.data;
}
