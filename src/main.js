import './styles/index.scss';

const guardianApiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

async function fetchData(url) {
  const response = await fetch(url);

  if (response.status === 200) {
    const json = await response.json();
    return json;
  }

  throw new Error(response.status);
}

const colorCode = {
  News: '#ab0613',
  Culture: '#a1845c',
  Arts: '#a1845c',
  Sport: '#0084c6',
  Lifestyle: '#bb3b80',
  Opinion: '#e05e00',
};

$(document).ready(() => {
  async function getDataForSection(
    section,
    cardsNum,
    fetchUrl,
    sectionTitle,
    showTopic
  ) {
    const data = await fetchData(fetchUrl).catch((error) => console.log(error));
    if (data === undefined) return;
    const { results } = data.response;

    // Title
    $(`${section} .section-title`).text(sectionTitle);

    // cards
    for (let i = 0; i < cardsNum; i += 1) {
      $(`${section} [class*=__title]`)
        .eq(i)
        .text(
          showTopic === 'opinion'
            ? results[i].webTitle.split(' | ')[0]
            : results[i].webTitle
        )
        .append(
          showTopic === 'opinion'
            ? `<div class="opinion-author">${results[i].fields.byline}</div>`
            : null
        );

      $(`${section} img`).eq(i).attr('src', results[i].fields.thumbnail);

      $(`${section} [class*="__inner"]`)
        .eq(i)
        .css('border-top-color', colorCode[results[i].pillarName]);

      if (showTopic === 'show') {
        $(`${section} [class*="__topic"]`)
          .eq(i)
          .text(results[i].sectionName)
          .css('color', colorCode[results[i].pillarName]);

        $(`${section} [class*="__sep"]`)
          .eq(i)
          .css('color', colorCode[results[i].pillarName]);
      } else if (showTopic === 'opinion') {
        $(`${section} [class*="__topic"]`)
          .eq(i)
          .text('')
          .prepend('<i class="fa-solid fa-quote-left"></i>');

        $(`${section} [class*="__sep"]`).eq(i).hide();
      } else {
        $(`${section} [class*="__topic"]`).eq(i).hide();

        $(`${section} [class*="__sep"]`).eq(i).hide();
      }
    }
  }

  function getQueryUrlNew(querySearchTerm) {
    return `https://content.guardianapis.com/search?q=${querySearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${guardianApiKey}`;
  }

  function getQueryUrl(querySearchTerm) {
    return `https://content.guardianapis.com/search?q=${querySearchTerm}&show-fields=thumbnail%2Cbyline&api-key=${guardianApiKey}`;
  }

  function getSectionUrl(sectionSearchTerm) {
    return `https://content.guardianapis.com/search?section=${sectionSearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${guardianApiKey}`;
  }

  // Get data for different sections
  function getDataForAllSections() {
    getDataForSection(
      '[data-id="headline"]',
      8,
      getQueryUrlNew('news'),
      'Headlines',
      'show'
    );

    getDataForSection(
      '[data-id="topic1"]',
      4,
      getSectionUrl('uk-news'),
      'UK News',
      'no'
    );

    getDataForSection(
      '[data-id="opinion"]',
      8,
      getSectionUrl('commentisfree'),
      'Opinion',
      'opinion'
    );

    getDataForSection(
      '[data-id="topic2"]',
      4,
      getQueryUrl('Editorial OR Letters'),
      'Editorial & Letters',
      'show'
    );

    getDataForSection(
      '[data-id="topic3"]',
      8,
      getQueryUrlNew(
        'sport AND (football OR rugby OR cricket OR hockey OR boxing OR cycling OR formula 1)'
      ),
      'Sport',
      'show'
    );

    getDataForSection(
      '[data-id="topic4"]',
      8,
      getQueryUrl('art OR culture OR film OR painting OR photography'),
      'Culture',
      'show'
    );
  }

  // Weather form OpenWeatherMap
  async function getWeather(city) {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherApiKey}`,
      {
        mode: 'cors',
      }
    );

    if (response.status === 200) {
      const json = await response.json();
      return json;
    }

    throw new Error(response.status);
  }

  function printCity(data) {
    $('[data-id="w-city"]').text(data.name);
  }

  function printTemp(data) {
    $('[data-id="w-temp"]').text(`${Math.round(data.main.temp - 273.15)} °C`);
  }

  function printPressure(data) {
    $('[data-id="w-pressure"]').text(`${data.main.pressure} hPa`);
  }

  function printWeather(data) {
    $('[data-id="w-weather"]').text(data.weather[0].description);
  }

  function printIcon(data) {
    function iconNumFromId(id) {
      if (id >= 200 && id <= 250) {
        return '11'; // thunderstorm
      }
      if ((id >= 300 && id <= 350) || (id >= 520 && id <= 550)) {
        return '09'; // drizzle/shower
      }
      if (id >= 500 && id <= 504) {
        return '10'; // rain
      }
      if (id === 511 || (id >= 600 && id <= 650)) {
        return '13'; // snow
      }
      if (id >= 700 && id <= 799) {
        return '50'; // atmosphere
      }
      if (id >= 800 && id <= 810) {
        const convert = {
          800: '01',
          801: '02',
          802: '03',
          803: '04',
          804: '04',
        };
        return convert[id];
      }
      return '01';
    }

    const iconNum = iconNumFromId(data.weather[0].id);
    $('[data-id="w-icon"]').css(
      'background-image',
      `url(https://openweathermap.org/img/wn/${iconNum}d@2x.png)`
    );
  }

  function printData(data) {
    printCity(data);
    printTemp(data);
    printPressure(data);
    printWeather(data);
    printIcon(data);
  }

  // Activate the webpage
  async function activateApp() {
    getDataForAllSections();
    const weather = await getWeather('london').catch((error) =>
      console.log(error)
    );
    printData(weather);
  }

  activateApp();
});
