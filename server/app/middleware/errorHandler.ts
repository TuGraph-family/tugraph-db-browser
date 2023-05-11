module.exports = () => {
  return async function errorHandler(ctx, next) {
    // 检查是否登录
    if (!ctx.request.header.authorization && ctx.request.url !== '/login') {
      ctx.status = 401;
      ctx.body = { success: false, errorMessage: '未登录', data: null };
      return;
    }
    try {
      await next();
    } catch (err: any) {
      // 统一处理异常，返回格式化的错误信息
      ctx.body = {
        success: false,
        code: err.status || -1,
        errorMessage: err.errorMessage || '未知错误',
        data: null,
      };
      // 设置响应状态码
      ctx.status = 200;
    }
  };
};
