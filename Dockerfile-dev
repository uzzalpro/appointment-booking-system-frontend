# Step 1: Use the official Node.js v20.10 image
FROM node:20.10

# Step 2: Set the working directory
WORKDIR /src

# Step 3: Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Set the environment (development for npm start)
ENV NODE_ENV=development

# Step 7: Copy the environment file
COPY .env .env

# Step 8: Expose the React development server port (3000 by default)
# EXPOSE 3000
EXPOSE 4173

# Step 9: Start the development server
CMD ["npm", "start"]