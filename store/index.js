export const state = () => ({
  products: []
});

export const getters = {
  order: (state) => {
    const order = [];
    state.products.forEach((item) => {
      order.push({
        title: item.title,
        pricePer: item.pricePer,
        priceTitle: item.priceTitle,
        count: item.count
      });
    });
    return order;
  },

  catalog: (state) => {
    return state.catalog;
  },

  price: (state) => {
    let price = 0;
    state.products.forEach((item) => {
      price += item.count * item.pricePer;
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
  },

  updateItem(state, item) {
    if (item.count === 0) {
      ///delete item from products
    } else {
      // find item in array and replace value
    }
    state.products.includes(state.products.find((el) => el._id === item._id));
  }
};

export const actions = {};
