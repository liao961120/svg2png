var SVGs = [];


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.convert').forEach(item => item.style.display = 'none');

    // Preload image
    // Get uploaded files
    document.querySelector('input#uploads').onchange = function() {
        var files = this.files;
        for (let i=0; i < files.length; ++i) {
            
            // Write download link
            var filename = files[i].name.split('.').slice(0, -1).join('.')
            var li = document.createElement('li');
            var link = document.createElement('a');
            li.append(link);
            document.querySelector('.download-links').append(li);
            link.target = '_blank';
            link.download = `${filename}.png`;
            link.innerHTML = `${filename}.png`;
            link.id = filename.replace(/ +/g, '-');
            link.className = 'downloadLink';
            // Release objectURL for next loop
            link.onload = function() {
                URL.revokeObjectURL(this.src);
            }

            // load img to get aspect ratio
            var img = document.createElement('img');
            img.src = URL.createObjectURL(files[i]);
            img.linkID = link.id;
            img.style.display = 'none';
            img.onload = function() {
                SVGs.push({linkID: this.linkID, width: this.width, height: this.height, dataURL: this.src})
            };
            document.querySelector('body').append(img)
        };

    // Show convert button
    document.querySelectorAll('.convert').forEach(item => item.style.display = 'inline');
    };

    // Convert image to svg
    document.querySelector('#convert').onclick = () => {
        // Read Scale factor
        var SF = parseFloat(document.querySelector('input#SF').value);  
        if (!document.querySelector('input#SF').value)
            SF = 1;

        // Render svgs
        for (let j=0; j < SVGs.length; ++j) {
            // Render svg to canvas
            // Get chart aspect ratio

            // Set canvas size
            canvas = document.querySelector('#canvas');
            canvas.width = SVGs[j].width * SF;
            canvas.height = SVGs[j].height * SF;

            canvg(canvas, SVGs[j].dataURL, {
                ignoreDimensions: true,
                scaleWidth: canvas.width,
                scaleHeight: canvas.height
            });

            // Save as png
            var img = canvas.toDataURL("image/png");
            document.querySelector(`#${SVGs[j].linkID}`).href = img;

            // Show download button
            document.querySelectorAll('.download').forEach(item => item.style.display = 'inline');
        }
    };

    // batch download
    document.querySelector('#download').onclick = () => {
        document.querySelectorAll('.downloadLink').forEach(item => item.click());
    };
});