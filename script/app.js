'use strict ';
const $ = document;
const searchInput = $.querySelector('#search');
const searchBtn = $.querySelector('.search-btn');
const result = $.querySelector('.result');
const partOfSpeechArr = new Set([]);
const synonymArr = [];
let wordDeterminer = '';



const searchWord = async function () {
    try {
        const wordMeaning = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput.value}`)
        const response = await wordMeaning;

        if (response.ok) {
            const data = await response.json();

            // partOfSpeech
            data[0].meanings.forEach(obj => {
                partOfSpeechArr.add(obj.partOfSpeech)
            });
            partOfSpeechArr.forEach((value) => wordDeterminer += `${value}, `);

            // synonyms
            data[0].meanings.forEach((obj) => {
                synonymArr.push(obj.synonyms)
            });
            const synonym = synonymArr.flat().slice(-3);

            result.innerHTML = '';
            result.insertAdjacentHTML('beforeend', `
            <div class="details">
                    <h2 class="word">${data[0].word}</h2>
                    <p class="word-determiner text">${wordDeterminer.slice(0, -2)}</p>
                    <div class="pronunciation">
                        <p class="phonetic text">${data[0].phonetic}</p>
                        <div class="sound-pronunciation">
                            <audio class="sound" src="${data[0].phonetics[0].audio}"></audio>
                            <i class="fa fa-volume-up" onclick="playPronunciation(this)"></i>
                        </div>
                    </div>
                    <div class="${synonym.length === 0 ? 'hidden' : ''}">
                        <span class="box">Synonym</span>
                        <p class="synonym">${synonym.join(', ')}</p>
                    </div>
                    <div>
                        <span class="box">Definition</span>
                        <p class="meaning">
                           ${data[0].meanings[0].definitions[0].definition}
                        </p>
                    </div>
                </div> 
            `);
            wordDeterminer = '';
        } else {
            throw new Error(`Word Is Not Found!`)

        };
    }
    catch (err) {
        if (searchInput.value === '') {
            alert('Please type a word!')
        } else {
            alert('Word Is Not Found! Try Again:)')
        }
    }
};

// generate sound of pronunciation 
function playPronunciation(element) {
    const audio = element.parentElement.querySelector('.sound');
    audio.play();
};

// event listenners
searchBtn.addEventListener('click', searchWord);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchWord();
});
window.addEventListener('load', () => searchInput.focus());





