const productItems = document.getElementsByClassName('product-item');

const products = [];

Array.from(productItems).forEach((element) => {
  element.addEventListener('click', () => {
    element.classList.toggle('product-item-select');
    const index = products.indexOf(element.outerText);
    if (index === -1) {
      products.push(element.outerText);
    } else {
      products.splice(index, 1);
    }
  });
});
