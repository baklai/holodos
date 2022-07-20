export const state = () => ({
  holodos: []
});

export const getters = {
  holodos: (state) => {
    return state.holodos;
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
  holodos(state, item) {
    state.holodos.push(item);
  }
};

export const actions = {};
