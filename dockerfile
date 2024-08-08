FROM node:22-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Chỉ định cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]