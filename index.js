import express from 'express'
import fs from 'fs'
import crypto from 'crypto'
import http from 'http'
import zombie from 'zombie'



import appSrc from './app.js';

const app = appSrc(fs, express, crypto, http, zombie);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Стартуем!');
});