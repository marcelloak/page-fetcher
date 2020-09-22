const request = require('request');
const fs = require('fs');
const readline = require('readline');

const fetcher = () => {
  const url = process.argv[2];
  const path = process.argv[3];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  request(url, (error, response, body) => {
    if (error !== null || response.statusCode !== 200) {
      console.log("Error:", error);
      console.log("Status Code:", response && response.statusCode);
      process.exit();
    } 
    fs.readFile(path, (err, data) => {
      if (data === null) {
        console.log("File path invalid.");
        process.exit();
      }
      if (data) {
        rl.question('Overwrite? Y/N ', (answer) => {
          if (answer !== "Y" && answer !== "y") {
            console.log('File already there.')
            process.exit();
          }
          else {
            console.log('File overwritten.');
            fs.writeFile(path, body, () => {
              console.log(`Downloaded and saved ${body.length} bytes to ${path}.`)
            });
          }
          rl.close();
        });
      }
      else {
        fs.writeFile(path, body, () => {
          console.log(`Downloaded and saved ${body.length} bytes to ${path}.`)
          process.exit();
        });
      }
    });
  });
}

fetcher();