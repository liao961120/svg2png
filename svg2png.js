document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.download').forEach(item => item.style.display = 'none');

    // Get uploaded files
    document.querySelector('input#uploads').onchange = function() {
        var files = this.files;
        for (i=0; i < files.length; ++i) {
            
            // Write download link
            var filename = files[i].name.split('.').slice(0, -1).join('.')
            var li = document.createElement('li');
            var link = document.createElement('a');
            li.append(link);
            document.querySelector('.download-links').append(li);
            link.target = '_blank';
            link.download = `${filename}.png`;
            link.innerHTML = `${filename}.png`;
            link.className = 'downloadLink';

            // Render svg to canvas
            canvg(document.querySelector('#canvas'), URL.createObjectURL(files[i]));
            // Save as png
            canvas = document.querySelector('#canvas');
            var img = canvas.toDataURL("image/png");
            link.href = img;
            
            // Release objectURL for next loop
            link.onload = function() {
                URL.revokeObjectURL(this.src);
            }
        };
        
        // batch download
        document.querySelector('#download').onclick = () => {
            document.querySelectorAll('.downloadLink').forEach(
                item => item.click()
            );
        };
    
    // Show download button
    document.querySelectorAll('.download').forEach(item => item.style.display = 'inline');
    };
});