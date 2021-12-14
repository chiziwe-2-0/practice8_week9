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

        .all('/code', async (req, res) => {
          let result = '';
          const reader = fs.createReadStream(import.meta.url.substring(7));
          for await (const chunk of reader) result += chunk;
          res.send(result);
        })

        .all('/sha1/:input/', (req, res) => {
          res.send(crypto.createHash('sha1').update(req.params.input).digest('hex'));
        })

        .all('/req', (req, res) => {
          res.setHeader('Content-type', 'text/plain');

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
              console.error(`Ошибка: ${e.message}`);
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