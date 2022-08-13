export const state = () => ({
  products: []
});

export const getters = {
  products: (state) => {
    return state.products.reduce(function (arr, item) {
      (arr[item.category.title] = arr[item.category.title] || []).push({
        img: item.img,
        title: item.title,
        pricePer: item.pricePer,
        priceTitle: item.priceTitle,
        count: item.count
      });
      return arr;
    }, {});
  },

  order: (state) => {
    return state.products.reduce(function (arr, item) {
      (arr[item.category.title] = arr[item.category.title] || []).push({
        title: item.title,
        pricePer: item.pricePer,
        priceTitle: item.priceTitle,
        count: item.count
      });
      return arr;
    }, {});
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
  products(state, item) {
    const index = state.products.findIndex((el) => el.id === item.id);
    if (index >= 0) {
      state.products.splice(index, 1);
    }
    if (item.count > 0) {
      state.products.push({
        id: item.id,
        img: item.img,
        title: item.title,
        pricePer: item.pricePer,
        priceTitle: item.priceTitle,
        category: item.category,
        count: item.count
      });
    }
    if (state.products.length > 0) {
      Telegram.WebApp.MainButton.show();
    } else {
      Telegram.WebApp.MainButton.hide();
    }
  }
};

export const actions = {
  loadItems({ commit }) {
    axios
      .get('Your API link', {
        headers: {
          'Ocp-Apim-Subscription-Key': 'your key'
        }
      })
      .then((response) => response.data)
      .then((items) => {
        console.log(items);
        commit('SET_Items', items);
      });
  }
};
