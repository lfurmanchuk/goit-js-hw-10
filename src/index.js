import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const inputEl = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(evt) {
  const name = evt.target.value;
  clearContent();
  if (name === '') {
    return;
  }
  fetchCountries(name.trim())
    .then(countries => {
      clearContent();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length > 1 && countries.length < 10) {
        clearContent();
        showListCountries(countries);
      }
      if (countries.length === 1) {
        clearContent();
        showMarkupCountry(countries);
      }
    })
    .catch(error => {
      clearContent();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkupCountryDescription(country) {
  const languagesList = Object.values(country[0].languages);
  return `<div class="countryName"><img class="flag" src="${
    country[0].flags.svg
  }" alt="${country[0].name.official}flag">
<h1 class="country">${country[0].name.official}</h1></div>
<p><b>Capital:</b> ${country[0].capital[0]}</p>
<p><b>Population:</b> ${country[0].population}</p>
<p><b>Languages:</b> ${languagesList.join(', ')}</p>`;
}

function markupCountriesList(countries) {
  return countries
    .map(
      country => `<li class="description-country">
  <img class="small-flag" src="${country.flags.svg}" alt="${country.name.official}flag">
  <span>${country.name.official}</span>
</li>`
    )
    .join('');
}

function showListCountries(countries) {
  clearContent();
  const markup = markupCountriesList(countries);
  countriesListEl.innerHTML = markup;
}

function showMarkupCountry(country) {
  clearContent();
  const markup = renderMarkupCountryDescription(country);
  countryInfoEl.innerHTML = markup;
}

function clearContent() {
  countriesListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}