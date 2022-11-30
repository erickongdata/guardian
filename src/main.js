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
  Culture: '#eacca0',
  Arts: '#eacca0',
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
      if (showTopic === 'yes') {
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
    }
  }

  function getQueryUrl(querySearchTerm) {
    return `https://content.guardianapis.com/search?q=${querySearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${apiKey}`;
  }

  function getSectionUrl(sectionSearchTerm) {
    return `https://content.guardianapis.com/search?section=${sectionSearchTerm}&order-by=newest&show-fields=thumbnail%2Cbyline&api-key=${apiKey}`;
  }

  getDataForSectionLarge(
    '[data-id="headline"]',
    getQueryUrl('uk%20news'),
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

  // getAllData();
});
