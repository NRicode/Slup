function limitText(text, limit) {
    if (text.length <= limit) {
        return text;
    } else {
        return text.substring(0, limit) + "...";
    }
}

function getFile() {

    document.getElementById("upfile").click();

}

function fileChanged(obj) {

    var file = obj.value;
    var fileName = file.split("\\");
    document.getElementById("selectFile").getElementsByTagName("span")[0].innerHTML = limitText(fileName[fileName.length - 1], 10);
    event.preventDefault();

}

function upload(){

    var fileInput = document.getElementById('upfile');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/conv', true);
		xhr.responseType = 'blob';
    xhr.onload = function() {

        if (xhr.status === 200) {

					console.log("200");
					let blob = new Blob([this.response], {type: 'application/octet-stream'});
					
					console.log(blob)
					let a = document.createElement('a');

					a.href = window.URL.createObjectURL(blob);
					a.download = 'converted.pdf'; // you can also get filename from Content-Disposition header from the response
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a)

				};

		}

    xhr.onerror = function() {

        console.error('Error occurred during upload.');

    };

    xhr.send(formData);

}

window.onload = ()=>{

    let selectFile = document.getElementsByTagName("body")[0];


    selectFile.addEventListener("dragover", function(e) {

        e.preventDefault()

    })

    selectFile.addEventListener("drop", function(e) {

        e.preventDefault();

        let file = e.dataTransfer.files[0];
        let fileName = file.name;
        document.getElementById("selectFile").getElementsByTagName("span")[0].innerHTML = limitText(fileName, 10);
				
				let dt = new DataTransfer()
				dt.items.add(file)
				document.getElementById("upfile").files = dt.files;

    });

}
