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
  async function getDataForSectionLarge(
    section,
    fetchUrl,
    sectionTitle,
    showTopic
  ) {
    const data = await fetchData(fetchUrl).catch((error) => console.log(error));
    if (data === undefined) return;
    const { results } = data.response;

    // Title
    $(`${section} .section-title`).text(sectionTitle);

    // large card
    $(`${section} .card-large__title`)
      .text(
        showTopic === 'opinion'
          ? results[0].webTitle.split(' | ')[0]
          : results[0].webTitle
      )
      .append(
        showTopic === 'opinion'
          ? `<div class="opinion-author">${results[0].fields.byline}</div>`
          : null
      );

    $(`${section} .card-large img`).attr('src', results[0].fields.thumbnail);

    $(`${section} .card-large__inner`).css(
      'border-top-color',
      colorCode[results[0].pillarName]
    );

    if (showTopic === 'show') {
      $(`${section} .card-large__topic`)
        .text(results[0].sectionName)
        .css('color', colorCode[results[0].pillarName]);
    } else if (showTopic === 'opinion') {
      $(`${section} .card-large__topic`)
        .text('')
        .prepend('<i class="fa-solid fa-quote-left"></i>');
      $(`${section} .card-large__sep`).hide();
    } else {
      $(`${section} .card-large__topic`).hide();
      $(`${section} .card-large__sep`).hide();
    }

    // cards
    for (let i = 0; i < 3; i += 1) {
      $(`${section} .card__title`)
        .eq(i)
        .text(
          showTopic === 'opinion'
            ? results[i + 1].webTitle.split(' | ')[0]
            : results[i + 1].webTitle
        )
        .append(
          showTopic === 'opinion'
            ? `<div class="opinion-author">${
                results[i + 1].fields.byline
              }</div>`
            : null
        );

      $(`${section} .card img`)
        .eq(i)
        .attr('src', results[i + 1].fields.thumbnail);

      $(`${section} .card__inner`)
        .eq(i)
        .css('border-top-color', colorCode[results[i + 1].pillarName]);

      if (showTopic === 'show') {
        $(`${section} .card__topic`)
          .eq(i)
          .text(results[i + 1].sectionName)
          .css('color', colorCode[results[i + 1].pillarName]);
      } else if (showTopic === 'opinion') {
        $(`${section} .card__topic`)
          .eq(i)
          .text('')
          .prepend('<i class="fa-solid fa-quote-left"></i>');
        $(`${section} .card__sep`).eq(i).hide();
      } else {
        $(`${section} .card__topic`).eq(i).hide();
        $(`${section} .card__sep`).eq(i).hide();
      }
    }

    // small cards
    for (let i = 0; i < 4; i += 1) {
      if (showTopic === 'show') {
        $(`${section} .card-small__topic`)
          .eq(i)
          .text(results[i + 4].sectionName)
          .css('color', colorCode[results[i + 4].pillarName]);
      } else if (showTopic === 'opinion') {
        $(`${section} .card-small__topic`)
          .eq(i)
          .text('')
          .prepend('<i class="fa-solid fa-quote-left"></i>');
        $(`${section} .card-small__sep`).eq(i).hide();
      } else {
        $(`${section} .card-small__topic`).eq(i).hide();
        $(`${section} .card-small__sep`).eq(i).hide();
      }

      $(`${section} .card-small__title`)
        .eq(i)
        .text(
          showTopic === 'opinion'
            ? results[i + 4].webTitle.split(' | ')[0]
            : results[i + 4].webTitle
        )
        .append(
          showTopic === 'opinion'
            ? `<div class="opinion-author">${
                results[i + 4].fields.byline
              }</div>`
            : null
        );

      $(`${section} .card-small img`)
        .eq(i)
        .attr('src', results[i + 4].fields.thumbnail);

      $(`${section} .card-small`)
        .eq(i)
        .css('border-top-color', colorCode[results[i + 4].pillarName]);
    }
  }

  async function getDataForSectionSmall(
    section,
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
    for (let i = 0; i < 4; i += 1) {
      if (showTopic === 'show') {
        $(`${section} .card__topic`)
          .eq(i)
          .text(results[i].sectionName)
          .css('color', colorCode[results[i].pillarName]);
      } else {
        $(`${section} .card__topic`).eq(i).text('');
        $(`${section} .card__sep`).eq(i).hide();
      }
      $(`${section} .card__title`).eq(i).text(results[i].webTitle);

      $(`${section} .card img`).eq(i).attr('src', results[i].fields.thumbnail);

      $(`${section} .card__inner`)
        .eq(i)
        .css('border-top-color', colorCode[results[i].pillarName]);
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
  getDataForSectionLarge(
    '[data-id="headline"]',
    getQueryUrlNew('uk news'),
    'Latest News',
    'show'
  );

  getDataForSectionSmall(
    '[data-id="topic1"]',
    getSectionUrl('uk-news'),
    'UK News',
    'no'
  );

  getDataForSectionLarge(
    '[data-id="opinion"]',
    getSectionUrl('commentisfree'),
    'Opinion',
    'opinion'
  );

  getDataForSectionSmall(
    '[data-id="topic2"]',
    getQueryUrlNew('Editorial OR Letters'),
    'Editorial & Letters',
    'show'
  );

  getDataForSectionLarge(
    '[data-id="topic3"]',
    getQueryUrl(
      'sport AND (football OR rugby OR cricket OR hockey OR boxing OR cycling OR formula 1)'
    ),
    'Sport',
    'show'
  );

  getDataForSectionLarge(
    '[data-id="topic4"]',
    getSectionUrl('culture'),
    'Culture',
    'show'
  );

  // getAllData();
});
