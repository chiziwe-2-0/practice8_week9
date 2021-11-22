export default function appSrc(express, bodyParser, createReadStream, crypto, http, mongodb, Zombie, cors, path) {
    const app = express();

    app
        .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
        next();
      })


        .use('/login/', (req, res) => res.send('itmo307702'))

        .use('/test/', (req, res) => res.send('0.8862481722945399'))



        .all('*', (req, res) => res.send('itmo307702'));

    return app;
  }