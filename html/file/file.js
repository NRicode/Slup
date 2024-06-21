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
    xhr.open('POST', '/upload', true);

    xhr.onload = function() {

        if (xhr.status === 200) {

            let res = JSON.parse(xhr.responseText);
            document.getElementById("uploadForm").style.display = "none";
            document.getElementById("finishForm").style.display = "block";
            document.getElementById("fileLink").innerHTML = res.siteName + "/" + res.unique

			let context = new AudioContext();
			let oscillator = context.createOscillator();
			oscillator.type = "sine";
			oscillator.frequency.value = 600;
			oscillator.connect(context.destination);
			oscillator.start();
			// Beep for 500 milliseconds
			setTimeout(function () {
				oscillator.stop();
			}, 500);

        } else {

            console.log('Error uploading file.');

        }
    };

		xhr.upload.onprogress = function(event) {

        if (event.lengthComputable) {

            var percentComplete = (event.loaded / event.total) * 100;
			document.getElementById("progressCount").innerHTML = parseFloat(percentComplete).toFixed(2) + '%';

        }

    };


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
