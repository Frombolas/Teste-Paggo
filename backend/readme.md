This is a NestJS API Rest

## Getting Started

First, create the .env file at the root of the project, containing the information of 
```bash
DATABASE_URL="Your link" 
JWT_SECRET="Your Jwt_Secret"
GROQ_API_KEY=["Get Api Key Groq"](https://console.groq.com/keys)
```

After that, install the dependencies.
```bash
npm install
```
Create the prisma instance and perform the migrations
```bash
npx prisma generate
npx prisma migrate dev
```
Finally, run the project locally on port 3000.
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001)  with your browser to see the result.
