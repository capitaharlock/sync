# Stage 1
# using full image in stage 1 to as we need tools such as openssl to generate base64 encoded credentials
# in this stage we will use buildkit to securely pass secrets then set npm config and install dependencies
# credentials are needed to access the private npm registry for pwc appkit packages

FROM node:18 as appkitbuilder

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# opt out of nextjs telemetry
RUN export NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=ARTIFACTORY_USERNAME \
    --mount=type=secret,id=ARTIFACTORY_API_KEY \
    AUTH_TOKEN=$(echo -n $(cat /run/secrets/ARTIFACTORY_USERNAME):$(cat /run/secrets/ARTIFACTORY_API_KEY) | openssl base64 -A | sed 's/ //g') && \
    npm config set "@appkit4:registry=https://artifacts-west.pwc.com/artifactory/api/npm/g00020-pwc-gx-digital-appkit-npm/" && \
    npm config set "//artifacts-west.pwc.com/artifactory/api/npm/g00020-pwc-gx-digital-appkit-npm/:_auth=$AUTH_TOKEN" && \
    npm install

# Stage 2
# using alpine image to reduce size, then utilize node_modules from stage 1 to build and run the app
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the node_modules from stage 1.
COPY --from=appkitbuilder /app/node_modules /app/node_modules

# Copy the rest of the app code
COPY package.json ./
COPY src ./src
COPY public ./public
COPY .eslintrc.json ./
COPY globals.d.ts ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./

# opt out of nextjs telemetry
RUN export NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "start"]