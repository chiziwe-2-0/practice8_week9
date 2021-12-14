export default function appSrc(fs, express, crypto, http, zombie) {
    const app = express();

    app
        .use(function(req, res, next) {
          res.header("charset", "utf-8");
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
          next();
      })

        .use('/login/', (req, res) => res.send('itmo307702'))

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
          let addr = req.body.addr;
          let data = ''
          if (url)
              http.get(addr, {headers: {'Content-Type': 'text/plain'}}, response => {
                  response.setEncoding('utf8')
                  response.on('data', chunk => data += chunk)
                  response.on('end', () => res.send(data))
              })
          else
              res.send('Данных нет!')
        })

        .use('/test/', async(req, res) => {
            const page = new zombie();
            await page.visit(req.query.URL);
            await page.pressButton('#bt');
            const result = await page.document.querySelector('#inp').value;
            res.send(result);
            console.log(result);
        })

        .all('*', (req, res) => res.send('itmo307702'));

    return app;
  }