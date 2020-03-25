#!/bin/sh
export NODE_ENV=development
export ENGAGE_TEST=true
npx sequelize-cli db:migrate
node scripts/runseed.js
npm run start