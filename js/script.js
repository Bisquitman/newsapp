const API_KEY = '589998a1eb8e47b7b814560a7c1bbf16';

const selectElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news__list');

const choices = new Choices(selectElem, {
  searchEnabled: true,
  allowHTML: true,
  itemSelectText: '',
});

const getData = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    }
  });
  const data = await response.json();
  return data;
};

const renderCard = (data) => {
  newsList.textContent = '';
  data.forEach((news) => {
    const {
      url,
      urlToImage,
      title,
      description,
      publishedAt,
      author,
    } = news;
    const card = document.createElement('li');
    card.className = 'news__item';

    card.innerHTML = `
      <a href="${url}" class="news__link" target="_blank">
        <div class="news__image_wrapper">
          <img src="${urlToImage ? urlToImage : './img/no-photo.jpg'}" alt="${title}"
            class="news__image" width="270" height="200">
        </div>
        <h3 class="news__title">
          ${title}
        </h3>
      </a>
      <p class="news__description">${description ? description : `Подробности читайте <a href="${url}" target="_blank">на сайте</a>.`}</p>
      <div class="news__footer">
        <time class="news__datetime" datetime="${publishedAt}"><span
            class="news__date">${publishedAt}</span>&nbsp;10:15</time>
        <div class="news__author">${author ? author : ''}</div>
      </div>
    `;

    newsList.append(card);
  });
};

const loadNews = async () => {
  const data = await getData('https://newsapi.org/v2/top-headlines?country=ru&language=ru');
  renderCard(data.articles);
};

loadNews();
