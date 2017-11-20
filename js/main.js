window.onload = () => {
    
    const file = document.getElementById('thefile');
    const audio = document.getElementById('audio');
    
    // Store tracks 
    let tracks = [];

    function addTrackToArray(trackName, src) {
        const existElement = tracks.some((elem) => {
            return elem.name === trackName;
        });

        // Identity verification
        if (existElement) {
            return false;
        }
        else {
            tracks.push({
                name: trackName.trim(),
                localSRC: src // path to file on your computer 
            });
        }
        
        return true;
    }

    function addTrackToList(trackName) {
        $('#music-list').append(`<li>${ trackName }<span class="glyphicon glyphicon-remove"></span></li>`);   
    }

    function addErrorOnPage() {
        alert('This track is in the list !');
    }

    function findTrackInArray(trackName) {
        let track = tracks.find((elem) => {
            return elem.name === trackName.trim();
        });

        changeTrackSrc(track.localSRC);
    }

    function changeTrackSrc(src) {
        audio.src = src;
    }

    function deleteTrackFromArray(trackName) {
        tracks = tracks.filter((elem) => {
            return elem.name !== trackName;
        });
    }

    function findTrackInList() {
        $('#music-list').click((event) => {
            const target = event.target;
            
            if (target.tagName === 'LI') {
                findTrackInArray(target.textContent);
            }
        });
    }

    function deleteTrackFromList() {
        // Delegation of events
        $('#music-list li').click((event) => {
            const target = event.target;
        
            if (target.tagName === 'SPAN') {
                
                $(target.parentNode).remove();

                deleteTrackFromArray(target.parentNode.textContent);
            }
        });
    }

    // Main function 
    function init() {

        const files = file.files;
        audio.src = URL.createObjectURL(files[0]);
        
        if (addTrackToArray(files[0].name, audio.src)) {
            addTrackToList(files[0].name);
        }
        else {
            addErrorOnPage();
        }
        
        findTrackInList();
        
        deleteTrackFromList();        

        doVisualEffect();

        audio.load();
        audio.play(); 
    }

    function doVisualEffect() {
        
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();

        let canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let ctx = canvas.getContext('2d');

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        let bufferLength = analyser.frequencyBinCount;

        let dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        let barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                
                // For colors effects, changing colors
                let r = barHeight + (25 * (i / bufferLength));
                let g = 250 * (i / bufferLength);
                let b = 50;

                ctx.fillStyle = `rgb( ${ r } , ${ g } , ${ b } )`;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        renderFrame(); 
    }
  
    file.onchange = () => {
        init();
    };

};
