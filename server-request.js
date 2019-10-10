//const http = require("http");
const https = require("https");

const Stream = require("stream").Transform;
const fs = require("fs");

https
  .get(
    `https://api.nasa.gov/planetary/apod?api_key=bFK7yd18I97Vev2lHj6cix2m8mBzqPaxvLLnO9Nb`,
    res => {
      let data = "";

      //A chunk of data has been received
      res.on("data", chunk => {
        data += chunk;
      });

      // The whole response has been received. Print out the response.
      res.on("end", () => {
        let url = JSON.parse(data).hdurl;
        let explanation = JSON.parse(data).explanation;
        console.log(url);
        console.log(explanation);

        https.get(url, res => {
          // The response should be an image
          console.log(res.headers);
          console.log(
            res.headers["content-type"],
            res.headers["content-length"]
          );

          if (
            res.statusCode === 200 &&
            res.headers["content-type"] === "image/jpeg"
          ) {
            let img = new Stream();

            res.on("data", chunk => {
              img.push(chunk);
            });

            res.on("end", () => {
              let fileName = `${__dirname}/apod.jpg`;
              fs.writeFileSync(fileName, img.read());
            });
          }
        });
      });
    }
  )
  .on("error", err => {
    console.log(`Error: ${err.message}`);
  });
