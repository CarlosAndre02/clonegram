# Clonegram - An instagram clone

## Preview
### Timeline page, fed with posts from people you follow
<img alt="Timeline Page" src=".github/timeline.png">

### Create a post
<img alt="Create post modal - Initial step" src=".github/create_post-initial.png">
<img alt="Create post modal - final step" src=".github/create_post-final.png">

### Like and comment a post
<img alt="View post modal" src=".github/view_post.png">

### See other people's profiles
<img alt="User Page" src=".github/user_page.png">

## Prerequisite
- [Yarn](https://yarnpkg.com/)
- [NodeJS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [AWS S3](https://aws.amazon.com/s3/)

## Technologies

### Frontend
- React
- Relay
- ChakraUI
- Vite

### Backend
- NodeJS
- KoaJS
- GraphQL
- MongoDB
- AWS S3

## How to run

1. Clone the project
```
git clone https://github.com/CarlosAndre02/clonegram.git
```

2. Go to `packages/web` and `packages/server` and remove the `.example` suffix from the `.env` files. Then, fill in the environment variables in both packages.

3. Install the dependencies
```
yarn install
```

4. Run the server
```
yarn dev:server
```

5. Now, run the wep app
```
yarn dev:web
```
