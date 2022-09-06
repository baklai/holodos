module.exports = class Action {
  constructor(bot) {
    this.bot = bot;
    this.actions = [];
  }

  getAction(id) {
    return this.actions.find((item) => item.id === id);
  }

  setAction(id, cb) {
    if (this.getAction(id)) this.deleteAction(id);
    this.actions.push({ id, cb, obj: {}, paginate: { page: 1, pages: 1 } });
    return this.getAction(id);
  }

  setActionType(id, cb) {
    const action = this.getAction(id);
    if (action) {
      action.cb = cb;
    }
  }

  deleteAction(id) {
    const index = this.actions.findIndex((item) => {
      return item.id === id;
    });
    if (index >= 0) this.actions.splice(index, 1);
    return true;
  }
};
