import holodos from '~/static/holodos.json';

export const state = () => ({
  holodos: holodos,
  counter: null,
  error: null
});

export const getters = {
  holodos: (state) => {
    return state.holodos;
  },
  category: (state) => {
    return state.holodos.map((item) => {
      return item.category;
    });
  },
  products: (state) => (index) => {
    return state.holodos[index].products;
  },

  itemsOrder: (state) => {
    let dd = [];
    state.holodos.forEach((el) => {
      const products = el.products.filter((item) => item.counter > 0);
      if (products.length > 0) {
        dd.push({
          category: el.category,
          products: products
        });
      }
    });
    return dd;
  }
};

export const mutations = {
  addCounter(state, item) {
    ++state.counter;
    ++state.holodos[item.category].products[item.index].counter;
  },

  delCounter(state, item) {
    --state.counter;
    --state.holodos[item.category].products[item.index].counter;
  }
};

export const actions = {};
