FROM nginx:1.27-alpine-slim

# 安全：删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制预构建的静态文件（由 CI 提前 build 好）
COPY .vitepress/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/robots.txt || exit 1
