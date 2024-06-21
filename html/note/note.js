function share(){

    let xhr = new XMLHttpRequest();
    xhr.open("POST", '/note', true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            let res = JSON.parse(xhr.responseText);

            if(window.location.hostname == "note.localhost" || window.location.hostname == "www.note.localhost"){

                window.location.href = "//localhost/" + res.unique;

            }else{

                let url = "//" + res.siteName + "/" + res.unique;
                window.location.href = url;

            }
        }

    };

    let data = $('#summernote').summernote('code');
    xhr.send(JSON.stringify({data}));
    
}
