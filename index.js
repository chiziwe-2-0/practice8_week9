import express from 'express';
import zombie from 'zombie';

import appSrc from './app.js';

const app = appSrc(express, zombie);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Старт!');
});