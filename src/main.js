import './styles/index.scss';

const apiKey = import.meta.env.VITE_API_KEY;

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
  Opinion: '#ff7f0f',
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
    return `https://content.guardianapis.com/search?q=${querySearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${apiKey}`;
  }

  function getQueryUrl(querySearchTerm) {
    return `https://content.guardianapis.com/search?q=${querySearchTerm}&show-fields=thumbnail%2Cbyline&api-key=${apiKey}`;
  }

  function getSectionUrl(sectionSearchTerm) {
    return `https://content.guardianapis.com/search?section=${sectionSearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${apiKey}`;
  }

  // Get data for different sections
  getDataForSection(
    '[data-id="headline"]',
    8,
    getQueryUrlNew('uk news'),
    'Latest News',
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
    getQueryUrlNew('Editorial OR Letters'),
    'Editorial & Letters',
    'show'
  );

  getDataForSection(
    '[data-id="topic3"]',
    8,
    getQueryUrl(
      'sport AND (football OR rugby OR cricket OR hockey OR boxing OR cycling OR formula 1)'
    ),
    'Sport',
    'show'
  );

  getDataForSection(
    '[data-id="topic4"]',
    8,
    getSectionUrl('culture'),
    'Culture',
    'show'
  );

  // getAllData();
});
