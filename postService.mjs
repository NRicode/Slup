import helper from "./helper.mjs"
import fs from 'fs';
import mammoth from 'mammoth';
import pdf from 'html-pdf';
import path from 'path';

function postService(db, siteName, app){

    app.post('/upload', function (req, res) {

        console.log("generating file link...");
        helper.genUnique(db, (unique)=>{

            if(!req.files.file){

                console.log("file upload aborted");
                return;

            }

            db.run("INSERT INTO links VALUES(?, 'file', '')", [unique], (err)=>{

                if(err){

                    console.log("insert link error", err);

                }

                fs.mkdirSync("./uploads/" + unique);
                let fPath = "./uploads/" + unique + "/" + req.files.file.name;

                req.files.file.mv(fPath, function(err) {
    
                    if (err) {
            
                        return res.status(500).send();
            
                    }
                    
                    res.status(200).send(JSON.stringify({unique: unique, siteName: siteName}));
            
                    setTimeout(()=>{
                        
                        console.log("deleting file...")
                        fs.rm("./uploads/" + unique, { recursive: true, force: true }, (err)=>{
                            
                            if(err){
                            
                                console.log("error deleting directory", err)
                            
                            }

                            db.run("DELETE FROM links WHERE link = ?", [unique], (err)=>{

                                if(err){
                                
                                    console.log("error deleting link", err);
                                
                                }

                            })

                        });
            
                    }, 30000);
            
                });

            })

        })

    });

    app.post('/note', function (req, res) {

        console.log("generating note link...");
        helper.genUnique(db, (unique)=>{

            db.run("INSERT INTO links VALUES(?, 'note', '')", [unique], (err)=>{

                if(err){

                    console.log("insert link error", err);

                }

                fs.mkdirSync("./uploads/" + unique);
                let fPath = "./uploads/" + unique + "/note.html";

                fs.writeFile(fPath, req.body.data, (err) => {

                    if (err) {
            
                        return res.status(500).send();
            
                    }

                    res.status(200).send(JSON.stringify({unique: unique, siteName: siteName}));

                    setTimeout(()=>{
                        
                        console.log("deleting note...")
                        fs.rm("./uploads/" + unique, { recursive: true, force: true }, (err)=>{
                            
                            if(err){
                            
                                console.log("error deleting directory", err)
                            
                            }

                            db.run("DELETE FROM links WHERE link = ?", [unique], (err)=>{

                                if(err){
                                
                                    console.log("error deleting link", err);
                                
                                }

                            })

                        });
            
                    }, 30000);

                })

            })


        })

    })


    app.post('/conv', function (req, res) {
				
				console.log("req received")
				if(!req.files.file){

						console.log("file upload aborted");
						return;

				}

				let fPath = "./uploads/" + req.files.file.name;
				req.files.file.mv(fPath, function(err) {

					mammoth.convertToHtml({path: fPath}).then((result)=>{

						let html = result.value;
						let fileName = new Date().getTime().toString() + ".pdf";
						pdf.create(html, {childProcessOptions: {env: {OPENSSL_CONF: '/dev/null',}}}).toFile("./uploads/" + fileName, (err, convRes)=>{
							
							console.log(err);
							fs.unlinkSync(fPath);
							let pdfPath = path.resolve('uploads/' + fileName);
							res.sendFile(pdfPath, (err)=>{
								
								fs.unlinkSync(pdfPath);

							});

						})				

					})

				})

		})

}

export default postService
