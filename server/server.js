require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const helmet = require("helmet");

const DIR = 'dist';
const PORT = process.env.PORT || 8080;

const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const app = express();



//HTTPS redirect middleware
function ensureSecure(req, res, next) {
  //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
  if (req.get('X-Forwarded-Proto') == 'https' || req.hostname == 'localhost') {
    //Serve Vue App by passing control to the next middleware
    next();
  } else if (req.get('X-Forwarded-Proto') != 'https' && req.get('X-Forwarded-Port') != '443') {
    //Redirect if not HTTP with original request URL
    res.redirect('https://' + req.hostname + req.url);
  }
}
//attach middleware to app
app.use('*', ensureSecure);

app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://forms.gle/1NihixR6mueJdiEt7","https://code.jquery.com/ui/1.10.4/jquery-ui.js"],
      connectSrc: ["'self'","https://s3.amazonaws.com/corewebsite-media-uploads", "https://s3.amazonaws.com/core-thread/", "https://s3-us-west-2.amazonaws.com/core-weblibrary/libraries/core-logo.svg.html","https://www.google-analytics.com", "https://core-studio.gitbook.io/thread"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://use.fontawesome.com","https://code.jquery.com"],
      imgSrc: ["'self'", "https://*", "data:"],
      scriptSrcAttr: ["'unsafe-hashes'", "'unsafe-inline'"],
      frameAncestors: [
          "self",
          "https://spark.thorntontomasetti.com"
      ]
    },
  }));


app.use(express.static(DIR));

app.use(cookieParser());
app.use(bodyParser.json({
  limit: '500mb'
}));
app.use(bodyParser.urlencoded({
  limit: '500mb',
  extended: true
}));

app.use("/", require('./routes'));

const base = path.join(__dirname, '../');
const indexFilePath = path.join(base, '/dist/index.html');
app.use('/*', (req, res) => res.sendFile(indexFilePath));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});