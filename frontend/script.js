const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const uploadBtn = document.getElementById('upload');
const gallery = document.getElementById('gallery');
let capturedImages = [];

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => console.error('Camera access denied!', error));

// Capture Photo
captureBtn.addEventListener('click', () => {
    if (capturedImages.length < 25) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        capturedImages.push(canvas);
        gallery.appendChild(canvas);
    } else {
        alert('Maximum 25 photos reached!');
    }
});

// Upload Photos
uploadBtn.addEventListener('click', async () => {
    if (capturedImages.length === 0) return alert('No images to upload!');

    const formData = new FormData();
    capturedImages.forEach((canvas, index) => {
        canvas.toBlob(blob => {
            formData.append('photos', blob, `photo${index}.png`);
        });
    });

    setTimeout(async () => {
        const response = await fetch('http://192.168.254.115:3000/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) alert('Upload successful!');
    }, 1000);
});
