function onMessage(request, sender, sendResponse) {
  switch (request.method) {
    case 'getList':
      console.info('Start getList function.');
      sendResponse({ response: getList() });
      break;
    default:
      console.log('Sorry, we are out of ' + expr + '.');
  }
}

function downloadJSON(
  content,
  fileName = 'products.json',
  contentType = 'text/plain'
) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

async function fetchJSON(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    alert(`Ok! ${json.message}!`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getList() {
  try {
    const catalogList = document.querySelectorAll(
      'div.catalog-list > article.catalog-item'
    );
    const category = document
      .querySelector('div.catalog-page__content > h1.page-title')
      .textContent.trim();
    const products = [];
    catalogList.forEach((element, index) => {
      try {
        const img = element.querySelector(
          'div.catalog-item__photo > a > picture > img'
        ).src;
        const title = element.querySelector(
          'div.catalog-item__info > div.catalog-item__title > a'
        ).innerText;
        const pricePer = element.querySelector(
          'div.catalog-item__bottom > div.catalog-item__product-price > data'
        ).value;
        const priceTitle = element
          .querySelector(
            'div.catalog-item__bottom > div.catalog-item__product-price > data > abbr'
          )
          .innerText.replace(/\s+/g, '')
          .trim();

        products.push({
          img,
          title,
          pricePer,
          priceTitle
        });
      } catch (err) {
        console.error(`Bad item: ${index}`);
      }
    });

    const url = 'http://localhost:8080/category';

    await fetchJSON(url, { title: category, items: products });

    console.info('Ok! Get List and Send!');
  } catch (err) {
    console.error(err);
  }
}

browser.runtime.onMessage.addListener(onMessage);
