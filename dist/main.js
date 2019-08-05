// logo appears after animation
let button = document.getElementById('button');
let name = document.getElementById('name');
let birth_year = document.getElementById('birth_year');
let films = document.getElementById('films');
let species = document.getElementById('species');
let height = document.getElementById('height');
let stop = document.getElementById('skip-btn');
let intro = document.querySelector('.crawl');

window.onload = () => {
    intro.style.animation = 'crawl 20s linear'; // 20s

    stop.addEventListener('click', () => {
        intro.style.animationTimingFunction = 'step-end';
        intro.style.animation = 'stop .1s';
        // intro.style.animation = '';
        // intro.style.animation = '0s';

        stop.style.display = 'none';
    });
};

document.querySelector('.crawl').addEventListener('animationend', () => {
    stop.style.display = 'none';
    document.querySelector('.container').classList.remove('hidden');
    document.querySelector('.container').classList.add('box');

    document.querySelector('.fade').classList.remove('fade');

    //
    document.querySelector('.star-wars').display = 'none';

    // getSections();
});

let response, sections, section, characters, option, selected, selectedText;
document.onreadystatechange = function() {
    if (document.readyState == 'complete') {
        getSections();
    }
};

function getSections() {
    let httpRequest = new XMLHttpRequest(); // create request object

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                response = JSON.parse(httpRequest.responseText);

                sections = document.getElementById('sections');
                // sections.innerHTML = `<option value="">Select option...</option>`;

                for (let element in response) {
                    section = document.createElement('li');
                    section.innerHTML = element;

                    section.setAttribute('section', JSON.stringify(element));

                    sections.appendChild(section);

                    // clicks on each li = section; show content of people, planets, films, species...
                    // section.addEventListener('click', clear, true);
                    section.addEventListener('click', showContent);
                }
            }
        }
    };

    httpRequest.open('GET', 'https://swapi.co/api/');

    httpRequest.send();
}

// clear

function clear(event) {
    selected = event.target;
    selected.removeChild(selected.childNodes[1]);
    // selected.innerHTML = '';
}

// show content of people, planets, films, species...

function showContent(event) {
    let filmlist = document.getElementById('filmlist');
    filmlist.innerHTML = '';

    selectedText = event.target.textContent;

    let httpRequest = new XMLHttpRequest(); // create request object

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                response = JSON.parse(httpRequest.responseText);

                characters = document.createElement('select');
                characters.setAttribute('id', 'characters');
                characters.setAttribute('size', '4');

                sections = document.querySelector('.query-container');
                sections.appendChild(characters);
                // sections write on top of previous ones; remove it first

                characters.previousElementSibling.innerHTML = '';
                // characters.innerHTML = `<option value="">Select option...</option>`;
                // characters.innerHTML = '';
                response.results.forEach(element => {
                    option = document.createElement('option');

                    switch (selectedText) {
                        case 'films':
                            option.innerHTML = element.title;
                            break;
                        default:
                            option.innerHTML = element.name;
                            break;
                    }

                    option.setAttribute('character', JSON.stringify(element));
                    option.setAttribute('films', JSON.stringify(element.films));

                    characters.appendChild(option);

                    // click on each character name = option
                    option.addEventListener('click', showInfo);
                    option.addEventListener('click', showFilms);
                });
            }
        }
    };

    // httpRequest.open('GET', 'https://swapi.co/api/');
    // httpRequest.open('GET', 'https://swapi.co/api/people/');
    httpRequest.open('GET', `https://swapi.co/api/${selectedText}/`);

    httpRequest.send();
}

function showInfo(event) {
    selected = event.target;
}

function showFilms(event) {
    selected = event.target;

    let films = JSON.parse(selected.getAttribute('films'));

    // sections = JSON.parse(selected.selectedOptions[0].getAttribute("sections"));
    // let films = JSON.parse(selected.selectedOptions[0].getAttribute("films"));

    // let films = JSON.parse(selected.options[selected.selectedIndex].getAttribute("films"));

    let filmlist = document.getElementById('filmlist');
    filmlist.innerHTML = '';

    films.forEach(elementURL => {
        let httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                film = JSON.parse(httpRequest.responseText);

                li = document.createElement('li');
                li.innerHTML = `Episode ${film.episode_id} - ${film.title}`;
                // li.innerHTML = film;
                filmlist.appendChild(li);
            }
        };

        httpRequest.open('GET', elementURL);
        httpRequest.send();
    });
}
