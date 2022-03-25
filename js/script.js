const API_KEY = '589998a1eb8e47b7b814560a7c1bbf16';

const selectElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news__list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

const choices = new Choices(selectElem, {
  searchEnabled: true,
  allowHTML: true,
  itemSelectText: '',
});

const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
const declOfNumWordOnly = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const getData = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    }
  });
  const data = await response.json();
  return data;
};

getDateCorrectFormat = (isoDate) => {
  const date = new Date(isoDate);
  const fullDate = date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const fullTime = date.toLocaleString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return `<span class="news__date">${fullDate}</span>&nbsp;${fullTime}`
};

const getImage = (url) => new Promise((resolve) => {
  const image = new Image(270, 200);
  image.addEventListener('load', () => {
    resolve(image)
  });

  image.src = url || './img/no-photo.jpg';
  image.className = 'news__image';

  return image;
});

const renderCard = (data) => {
  newsList.textContent = '';
  data.forEach(async (news) => {
    const {
      url,
      urlToImage,
      title,
      description,
      publishedAt,
      author,
      source,
    } = news;
    const card = document.createElement('li');
    card.className = 'news__item';

    const image = await getImage(urlToImage);
    // card.append(image);

    card.innerHTML = `
      <a href="${url}" class="news__link" target="_blank">
        <div class="news__image_wrapper">
        <img src="${image.src}" alt="${title}"
            class="news__image" width="270" height="200">
        </div>
        <h3 class="news__title">
          ${title}
        </h3>
      </a>
      <p class="news__description">${description ? description : ''}</p>
      <div class="news__footer">
        <time class="news__datetime" datetime="${publishedAt}">
          ${getDateCorrectFormat(publishedAt)}
        </time>
        <div class="news__author">${author ? author : source.name ? source.name : ''}</div>
      </div>
    `;

    newsList.append(card);
  });
};

const loadNews = async () => {
  // newsList.innerHTML = `<li class="preload"></li>`
  const preload = document.createElement('li');
  preload.className = 'preload';
  newsList.append(preload);

  const country = localStorage.getItem('country') || 'ru';
  choices.setChoiceByValue(country);

  const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100`);
  renderCard(data.articles);
};

const loadSearch = async (value) => {
  const data = await getData(`https://newsapi.org/v2/everything?q=${value}&pageSize=100`);
  title.innerHTML = `По вашему запросу &laquo;${value}&raquo; ${declOfNumWordOnly(data.articles.length, ['найден', 'найдено', 'найдено'])} ${declOfNum(data.articles.length, ['результат', 'результата', 'результатов'])}`;
  choices.setChoiceByValue('');
  renderCard(data.articles);
};

selectElem.addEventListener('change', (event) => {
  const value = event.detail.value;
  localStorage.setItem('country', value);
  loadNews();
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  loadSearch(formSearch.search.value);
  formSearch.reset();
});

loadNews();