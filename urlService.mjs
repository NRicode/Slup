import path from "path"
import fs from "fs"

import ejs from "ejs"
import helper from "./helper.mjs"

function urlService(db, siteName, app){

    app.get('/*', function (req, res) {
        
        let subdomain = helper.getSubDomain(req.hostname);

        //need this check of it will interferes with note. subdomain POST request
        //e.g each time note. do POST request, the request reaches here as well
        if(subdomain != ""){
    
            return;
    
        }
    
        if(req.path == "/favicon.ico"){
    
            return;
    
        }
    
        let dirPath = "./uploads" + req.path;
        let link = req.path.slice(1)
    
        db.all("SELECT * FROM links WHERE link = ?", [link], (err, rows) => {
    
            if(rows.length == 1){
    
                if(rows[0].type == "file"){
    
                    console.log("file download requested...")
                    fs.readdir(dirPath, (err, files) => {
                
                        if(err){
    
                            console.log("get file error", err);
    
                        }
    
                        let downloadPath = dirPath + "/" + files[0];
                        res.download(downloadPath);
    
                    });
    
                }else if(rows[0].type == "link"){
    
                    console.log("redirect...");
                    
                    if(rows[0].data.startsWith("http")){
                        
                        res.redirect(rows[0].data);
                    
                    }else{
    
                        res.redirect("//" + rows[0].data);
    
                    }
    
                }else if(rows[0].type == "note"){

                    fs.readFile(path.resolve() + "/uploads/" + link + "/note.html", 'utf8', (err, data) => {

                        if (err) {

                            console.error('Error reading note file:', err);
                            return;

                        }

                        ejs.renderFile("./html/note/noteTemplate.ejs", {data: data}, function(err, str){

                            if(err) return;
                            res.send(str);

                        })


                    });

                }
    
            }else{
    
                //add new link short url
                if(link.includes(".")){
    
                    console.log("generating url link...")
                    console.log(link);
                    helper.genUnique(db, (unique)=>{
    
                        db.run("INSERT INTO links VALUES(?, 'link', ?)", [unique, link], (err)=>{
                            
                            ejs.renderFile("./html/url/url.ejs", {data: siteName + "/" + unique}, function(err, str){
                                
                                res.send(str);

                            });
    
                            setTimeout(()=>{
                            
                                console.log("deleting url link...")
    
                                db.run("DELETE FROM links WHERE link = ?", [unique], (err)=>{
        
                                    if(err){
                                        
                                         console.log("error deleting link", err);
                                        
                                    }
        
                                })
                    
                            }, 30000);
    
                        })
    
                    })    
    
                }else{
    
                    //try to get nonexistent link
                    res.send("File / link not found or already expired");
    
                }
    
    
            }
    
        })
    
    });

}

export default urlService