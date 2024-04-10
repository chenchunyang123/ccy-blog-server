# 使用 Node.js 官方镜像作为基础镜像
FROM node:20.11.0

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露应用端口
EXPOSE 8080

# 安装pm2
RUN npm install pm2 -g

# 使用pm2启动
CMD ["pm2-runtime", "start", "npm", "--", "start:prod"]