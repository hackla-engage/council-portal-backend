#!/bin/sh
export NODE_ENV=development
export ENGAGE_TEST=false
npx sequelize-cli db:migrate
npm run start