import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import http from 'http';
import zombie from 'zombie';
import axios from 'axios';

import appSrc from './app.js';

const app = appSrc(fs, express, MongoClient, crypto, http, zombie, axios);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Стартуем!');
});
