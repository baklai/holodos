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
          price: val.price,
          priceTitle: val.priceTitle,
          counter: val.counter
        });
      });

      holodos.push({
        category: item.category,
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
        price += val.counter * val.price;
      });
    });
    return price.toFixed(2);
  }
};

export const mutations = {
  pushHolodos(state, item) {
    state.holodos.push(item);
  },

  setCatalog(state, item) {
    state.catalog = item;
  }
};

export const actions = {};
