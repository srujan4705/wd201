// const fs = require("fs");
// // fs.writeFile(
// //     "sample.txt",
// //     "Hello World. Welcome to Node.js FIle System module.",
// //     (err) =>{
// //         if (err) throw err;
// //      console.log("File created!");

// //     }
// // );

// fs.readFile("sample.txt", (err,data) =>{
//     console.log(data.toString());
// });
// const http  = require("http");
// const fs = require("fs");
// const server = http.createServer((req,res) =>
// {   
//     const stream = fs.createReadStream("sample.txt");
//     stream.pipe();
//     // fs.readFile("sample.txt",(err, data) => {
//     //     res.end(data)
//     // })
// });
// server.listen(3000);
// const args = require("minimist")(process.argv.slice(2));
// console.log(args);
const http = require("http");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
let homeContent;
let projectContent;
let registrationcontent;
const port = argv.port || 3000;

fs.readFile("home.html",(err, home) => {
    if(err) {
        throw err;
    }
    homeContent = home;
});
 
fs.readFile("project.html", (err, project) => {
    if(err){
        throw err;
    }
    projectContent = project;
});
fs.readFile("registration.html",(err,registrationpage) => {
    if(err) {
        throw err;
    }
    registrationcontent = registrationpage;
});

const server = http
    .createServer((request, response) => {
        let url = request.url;
        response.writeHeader(200, {"content-Type": "text/html"});
        switch (url) {
            case "/project":
                response.write(projectContent);
                response.end();
                break;
            case "/registration":
                response.write(registrationcontent);
                response.end();
                break;

            default:
                response.write(homeContent);
                response.end();
                break;
        }
        response.end()
    });
    server.listen(port,() => {
        console.log(`Server is running at http://localhost:/${port}`);
    });
