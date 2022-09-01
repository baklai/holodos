module.exports = {
  async ['paginate'](ctx) {
    switch (ctx.data.key) {
      case 'prev':
        ctx.action.paginate.page =
          ctx.action.paginate.page > 1
            ? --ctx.action.paginate.page
            : ctx.action.paginate.page;
        break;
      case 'current':
        ctx.action.paginate.page = 1;
        break;
      case 'next':
        ctx.action.paginate.page =
          ctx.action.paginate.page < ctx.action.paginate.pages
            ? ++ctx.action.paginate.page
            : ctx.action.paginate.page;
        break;
    }
    this[ctx.action.type](ctx);
  }
};
