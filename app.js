export default function appSrc(express, zombie) {
    const app = express();

    app
        .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
        next();
      })


        .use('/login/', (req, res) => res.send('itmo307702'))

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