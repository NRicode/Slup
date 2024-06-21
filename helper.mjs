function genStr() {

    const characters = 'ABCDEFGHKLMNPQRSTUVWXYZ23456789';
    let result = '';
    const charactersLength = characters.length;
    
    result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

async function genUnique(db, callback){

    try{

        let rows;
        let unique;

        let count = 1;

        do{

            unique = genStr();
            console.log(unique);

            rows = await new Promise((resolve, reject)=>{

                db.all("SELECT * FROM links WHERE link = ?", [unique], (err, rows) => {

                    if (err) {
                        
                        reject(err)

                    } else {

                        resolve(rows)

                    }

                });

            })

        }while(rows.length > 0);

        callback(unique);

    }catch(error){

        console.log("Error querying data: ", error.message);

    }

}

function getSubDomain(hostname){

    
    if(hostname.startsWith("www.")){

        hostname = hostname.substr(4, hostname.length)

    }

    let subdomain = "";

    //at localhost
    if(hostname.endsWith("localhost")){

        subdomain = hostname.substring(0, hostname.indexOf("."));

    }else{

        if(hostname.split(".").length == 3){

            subdomain = hostname.substring(0, hostname.indexOf("."));

        }

    }

    return subdomain

}

export default {genUnique, getSubDomain}