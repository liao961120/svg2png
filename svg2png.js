var SVGs = [];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.convert').forEach(item => item.style.display = 'none');

    // Preload image
    document.querySelector('input#uploads').onchange = function() {
        // Clean up
        document.querySelectorAll('li').forEach(item => item.parentNode.removeChild(item));
        document.querySelectorAll('.download').forEach(item => item.style.display = 'none');
        document.querySelectorAll('.convert').forEach(item => item.style.display = 'none');
        SVGs = [];

        // Save local image blobs and info
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

            // load img to get height & width
            var img = document.createElement('img');
            img.src = URL.createObjectURL(files[i]);
            img.linkID = link.id;
            img.style.display = 'none';
            img.onload = function() {
                SVGs.push({linkID: this.linkID, width: this.width, height: this.height, dataURL: this.src});
            };
            document.querySelector('body').append(img)
        };

        // Show convert button
        document.querySelectorAll('.convert').forEach(item => item.style.display = 'inline');
    };

    // Convert image to svg
    document.querySelector('#convert').onclick = () => {
        // Read Scale factor
        var DPI = parseFloat(document.querySelector('input#DPI').value);  
        if (!document.querySelector('input#DPI').value)
            DPI = 96;

        // Render svgs
        for (let j=0; j < SVGs.length; ++j) {
            // Set canvas size
            var canvas = document.querySelector('#canvas');
            var SF = DPI/96;
            canvas.width = Math.ceil(SVGs[j].width * SF);
            canvas.height = Math.ceil(SVGs[j].height * SF);

            // Render svg to canvas
            canvg(canvas, SVGs[j].dataURL, {
                ignoreDimensions: true,
                scaleWidth: SVGs[j].width * SF,
                scaleHeight: SVGs[j].height * SF,
                ignoreClear: false,
                renderCallback: function() {
                    // Save as png
                    canvas.toBlob(function(blob) {
                        var url = URL.createObjectURL(blob);
                        document.querySelector(`#${SVGs[j].linkID}`).href = url;
                    });
                }
            });
            console.log(SVGs[j].dataURL, )
        };//endfor

        // Show download button
        document.querySelectorAll('.download').forEach(item => item.style.display = 'inline');
    };

    // batch download
    document.querySelector('#download').onclick = () => {
        document.querySelectorAll('.downloadLink').forEach(item => item.click());
    };
});