import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import sqlite3  from 'sqlite3';

import helper from './helper.mjs';
import urlService from './urlService.mjs';
import postService from './postService.mjs';

//curl -X POST -F "file=@main.mjs" f.localhost
//todo: hide error messages from user

const siteName = "slup.xyz";
const app = express();
const port = 8000;

app.use(fileUpload());
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));

const db = new sqlite3.Database('data.db', (err) => {

    if (err) {

        console.log('Database connection error:', err.message);

    } else {

        console.log('Connected to the SQLite database.');

    }
});

db.run(`CREATE TABLE IF NOT EXISTS links (
  link TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  data TEXT NOT NULL
)`);

db.all("SELECT * FROM links", [], (err, rows)=>{

    console.log(rows);

})

app.get('/*', function (req, res, next) {

    let subdomain = helper.getSubDomain(req.hostname);

    if(subdomain == ""){

        //HANDLE MAIN PAGE
        if(req.path == "/"){

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');

            if(req.hostname == "localhost"){

                res.redirect("//" + "home.localhost");

            }else{

                res.redirect("//" + "home." + siteName);

            }

            

        }else{
        
        //HANDLE URL SHORTENING
            next();

        }

        
    }

    if(subdomain == "note"){
        
        if(req.path == "/"){

            res.sendFile(path.resolve() + "/html/note/note.html");
            return;

        }else{

            fs.stat(path.resolve() + "/html/note" + req.path, (err, stats)=>{

                if(!err){

                    res.sendFile(path.resolve() + "/html/note" + req.path);

                }

            })

        }

    }

    if(subdomain == "home"){

        if(req.path == "/"){

            res.sendFile(path.resolve() + "/html/home/index.html");
            return;

        }else{

            fs.stat(path.resolve() + "/html/home" + req.path, (err, stats)=>{

                if(!err){

                    res.sendFile(path.resolve() + "/html/home" + req.path);

                }

            })

        }

    }

    if(subdomain == "file"){
        
        if(req.path == "/"){

            res.sendFile(path.resolve() + "/html/file/file.html");
            return;

        }else{

            fs.stat(path.resolve() + "/html/file" + req.path, (err, stats)=>{

                if(!err){

                    res.sendFile(path.resolve() + "/html/file" + req.path);

                }

            })

        }

    }
    
    if(subdomain == "conv"){

        if(req.path == "/"){

            res.sendFile(path.resolve() + "/html/conv/conv.html");
            return;

        }else{

            fs.stat(path.resolve() + "/html/conv" + req.path, (err, stats)=>{

                if(!err){

                    res.sendFile(path.resolve() + "/html/conv" + req.path);

                }

            })

        }

		}

});


urlService(db, siteName, app)
postService(db, siteName, app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
