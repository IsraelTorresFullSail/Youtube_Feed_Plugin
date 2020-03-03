// Variables
const list = [];
let pageList = [];
let currentPage = 1;
let numberPerPage = 9;
let numberOfPages = 0;

// Read API Key
console.log = function(){};
let key = '';
fetch('./apikey.txt')
  .then(response => response.text())
  .then(text => {key = text});

// Create Video List - Fetch API
function makeList(cPage) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLMyG0cG_i99XcJI09OLsBQHlzrIgh2efK&key=${key}`;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const option = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    }
    
    fetch( apiUrl, option)
        .then( response => {
            if(response.ok) {
                return response.json();
            } else {
                throw response;
            }
        })
        .then((data) => {
            console.log(data)
                let result = ''
                let id = data.items[0].snippet.resourceId.videoId;
                //load the 1st video in the playlist into the main feed
                document.getElementById('youtube_main').innerHTML = `<iframe width="860" height="615" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

                //load all videos in the playlist
                let videosArray = data.items;
                
                videosArray.forEach(item => {
                    result =`
                        <div class="video">
                            <iframe width="460" height="215" src="https://www.youtube.com/embed/${item.snippet.resourceId.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            <h3>${item.snippet.title}</h3>
                            <h4>${item.snippet.channelTitle}</h4>
                        </div>
                    `

                    list.push(result);
                })
                
                // Calculate number of pages
                numberOfPages = Math.ceil(videosArray.length / numberPerPage);

                // Create page list
                let begin = ((cPage - 1) * numberPerPage);
                let end = begin + numberPerPage;
                pageList = list.slice(begin, end);
                drawList();    
                check();   
              
        })
        .catch( err => {
            console.log(err);
        })
        
}

function nextPage() {
    currentPage +=1;
    makeList(currentPage);
}

function previousPage() {
    currentPage -=1;
    makeList(currentPage);
}

function firstPage() {
    currentPage = 1;
    makeList(currentPage);
}

function lastPage() {
    currentPage = numberOfPages;
    makeList(currentPage);
}

function drawList() {
    document.getElementById("list").innerHTML = "";
    for (r = 0; r < pageList.length; r++) {
        document.getElementById("list").innerHTML += pageList[r] + "";
    }
}

function check() {
    console.log(currentPage)
    console.log(numberOfPages)
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function load() {
    makeList(currentPage);
}
    
window.onload = load;
  
  