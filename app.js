export default function appSrc(fs, express, MongoClient, crypto, http, zombie, axios) {
  const app = express();

  const wp = {
    id: 1,
    title: {
    rendered: "itmo307702",
    },
  };


    app
        .use(function(req, res, next) {
          res.header("charset", "utf-8");
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS,DELETE");
          next();
      })

        .use('/login', (req, res) => res.send('itmo307702'))

        .all('/code', async (req, res) => {
          let result = '';
          const reader = fs.createReadStream(import.meta.url.substring(7));
          for await (const chunk of reader) result += chunk;
          res.send(result);
        })

        .all('/sha1/:input', (req, res) => {
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

        .post('/insert', async (req, res, next) => {
          const body = req.body;
          const url = body.URL.replace(' ', '+');

          const mongoClient = new MongoClient(url);

          try {
              await mongoClient.connect();
              const db = mongoClient.db();
              const collection = db.collection('users');
              await collection.insertOne({
                  login: body.login,
                  password: body.password,
              });
          } catch (err) {
              console.log(err);
          } finally {
              await mongoClient.close();
          }
          next();
        })

        .use('/test', async(req, res) => {
            const page = new zombie();
            await page.visit(req.query.URL);
            await page.pressButton('#bt');
            const result = await page.document.querySelector('#inp').value;
            res.send(result);
            console.log(result);
        })

        .all("/wordpress", async (req, res) => {
          const content = req.query.content;
          const URL1 = 'http://51.250.18.54/wp-json/jwt-auth/v1/token';
          const URL2 = 'http://51.250.18.54/wp-json/wp/v2/posts/';

          const response = await axios
              .post(
                  URL1,
                  {
                      username: "admin",
                      password: "WoID3229"
                  }
                  );
          const token = response.data.token;
          const wp_response = await axios
              .post
                  (URL2,
                  {
                      title: "itmo307702",
                      content,
                      status: "publish"
                  },
                  {
                      headers: { Authorization: `Bearer ${token}` },
                  });
          res.send(wp_response.data.id);
        })

        /**
        .all("/wordpress/", (r) => {
          r.res.set(headersJSON).send(wp);
        })
        .all("/wordpress/wp-json/wp/v2/posts/", (r) => {
          r.res.set(headersJSON).send([wp]);
        })

         */

        .all("/render", async (req, res) => {
          const { addr } = req.query;
          const { random2, random3 } = req.body;

          http.get(addr, (r, b = '') => {
            r.on("data", (d) => (b += d)).on("end", () => {
              fs.writeFileSync("pugs/index.pug", b);
              res.render("index", { login: 'itmo307702', random2, random3 });
            });
          });
        })

        .all("*", (req, res) => res.send('itmo307702'))
  
        .set("view engine", "pug");

    return app;
  }
