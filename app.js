export default function appSrc(fs, express, crypto, http, zombie) {
    const app = express();

    app
        .use(function(req, res, next) {
          res.header("charset", "utf-8");
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
          next();
      })

        .use('/login/', (req, res) => res.send('chtest'))

        .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))
        .get('/sha1/:input/', (req, res) => {
            const { input } = req.params;
            res.setHeader('content-type', 'text/plain');
            res.send(crypto.createHash('sha1').update(input).digest('hex'));
        })
        .get('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let { addr } = req.query;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });

        })
        .post('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let addr = req.body.addr;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        })

        .use('/test/', async(req, res) => {
            const page = new zombie();
            await page.visit(req.query.URL);
            await page.pressButton('#bt');
            const result = await page.document.querySelector('#inp').value;
            res.send(result);
            console.log(result);
        })

        .all('*', (req, res) => res.send('chtest'));

    return app;
  }