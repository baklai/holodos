export const state = () => ({
  holodos: [],
  catalog: null
});

export const getters = {
  holodos: (state) => {
    return state.holodos;
  },

  data: (state) => {
    const holodos = [];
    state.holodos.forEach((item) => {
      let products = [];
      item.products.forEach((val) => {
        products.push({
          title: val.title,
          price: val.pricePer,
          priceTitle: val.priceTitle,
          orderedQuantity: val.orderedQuantity
        });
      });

      holodos.push({
        category: item.title,
        products: products
      });
    });
    return holodos;
  },

  catalog: (state) => {
    return state.catalog;
  },

  price: (state) => {
    let price = 0;
    state.holodos.forEach((item) => {
      item.products.forEach((val) => {
        price += val.orderedQuantity * val.pricePer;
      });
    });
    return price.toFixed(2);
  }
};

export const mutations = {
  pushHolodos(state, item) {
    state.holodos.push(item);
  },

  setCategory(state, item) {
    state.catalog = item;
  }
};

export const actions = {};
