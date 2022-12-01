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

// Fisher–Yates shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

$(document).ready(() => {
  async function getDataForSection(
    section,
    cardsNum,
    fetchUrls,
    sectionTitle,
    showTopic
  ) {
    // Get data from fetchUrls list
    const dataAll = fetchUrls.map(async (url) => {
      const data = await fetchData(url).catch((error) => console.log(error));
      return data.response.results;
    });
    const rawResults = await Promise.all(dataAll);
    // Concat data array
    const concatResults = rawResults.reduce(
      (acc, res) => acc.concat([...res]),
      []
    );
    // Shuffle results
    const results = shuffleArray(concatResults);

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
      [
        getSectionUrl('uk-news'),
        getSectionUrl('politics'),
        getSectionUrl('world'),
        getSectionUrl('society'),
      ],
      'Headlines',
      'show'
    );

    getDataForSection(
      '[data-id="topic1"]',
      4,
      [getSectionUrl('uk-news')],
      'UK News',
      'no'
    );

    getDataForSection(
      '[data-id="topic2"]',
      8,
      [getSectionUrl('commentisfree')],
      'Opinion',
      'opinion'
    );

    getDataForSection(
      '[data-id="topic3"]',
      4,
      [getQueryUrl('Editorial OR Letters')],
      'Editorial & Letters',
      'show'
    );

    getDataForSection(
      '[data-id="topic4"]',
      8,
      [getSectionUrl('sport'), getSectionUrl('football')],
      'Sport',
      'show'
    );

    getDataForSection(
      '[data-id="topic5"]',
      4,
      [getQueryUrl('climate crisis')],
      'Climate crisis',
      'show'
    );

    getDataForSection(
      '[data-id="topic6"]',
      8,
      [
        getSectionUrl('artanddesign'),
        getSectionUrl('film'),
        getSectionUrl('music'),
        getSectionUrl('culture'),
      ],
      'Culture',
      'show'
    );
  }

  // Weather from OpenWeatherMap
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

  function printWeatherDesc(data) {
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

  function printWeatherData(data) {
    printCity(data);
    printTemp(data);
    printPressure(data);
    printWeatherDesc(data);
    printIcon(data);
  }

  function printDate() {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date();
    $(`[data-id="date-day"]`).text(weekday[d.getDay()]);
    $(`[data-id="date-date"]`).text(
      `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`
    );
  }

  // Activate the webpage
  async function activateApp() {
    getDataForAllSections();
    const weather = await getWeather('london').catch((error) =>
      console.log(error)
    );
    printWeatherData(weather);
    printDate();
  }

  activateApp();
});
