const words = 'the be of and a to in he have it that for they with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line'.split(' ');
const wordsCount = words.length;
const gameTime = 15 *1000;
window.timer = null;
window.gameStart = null;
function addClass(el,name){
    el.className += ' ' +name;
}
function removeClass(el,name){
    el.className = el.className.replace(name,'');
}
function randomWord(){
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex -1];
}
function formatWord(word){

    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
function newGame(){
    gameKeys();
    
    document.getElementById('words').innerHTML = '';
    for(let i = 0; i<198; i++){
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = gameTime/1000 + '';
    window.timer = null;
}

function getWpm(){
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0,lastTypedWordIndex);
    const correctWords = typedWords.filter(word =>{
        const letters = [...word.children];
        
        const incorrectLetters = letters.filter(letter=> letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;

    });
    return correctWords.length /gameTime * 60000;
}
function gameOver(){
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const result = getWpm();
    
    document.getElementById('info').innerHTML = `WPM: ${result}`;

}


function gameKeys(){
 document.getElementById('game').addEventListener('keydown', e => {
    const key = e.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key!==' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    
    var originalAudio = document.getElementById('audio');
    originalAudio.load();
    originalAudio.play();
    if(document.querySelector('#game.over')){
        return;
    }

    // console.log({key, expected});

    if(!window.timer && isLetter)
    {
        window.timer = setInterval(() => {
            if(!window.gameStart){
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime-window.gameStart;
            const sPassed = Math.round(msPassed/1000);
            const sLeft = (gameTime/1000) -sPassed;
            if(sLeft <=0){
                gameOver();
                return;

            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
        
    }
    

    if(isLetter){
        if(currentLetter){
            addClass(currentLetter, key === expected? 'correct': 'incorrect');
            removeClass(currentLetter, 'current');
            if(currentLetter.nextSibling){
             addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }
    if(isSpace){
        if(expected !== ' '){
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');

            });
        }
    
     removeClass(currentWord, 'current');
     addClass(currentWord.nextSibling, 'current');
     if(currentLetter){
        removeClass(currentLetter, 'current');
     }
     addClass(currentWord.nextSibling.firstChild, 'current');
    }
    if(isBackspace){
        if(currentLetter && isFirstLetter){
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if(currentLetter && !isFirstLetter){
            
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if(!currentLetter){
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    // spawn in more words
    if(currentWord.getBoundingClientRect().top > 220){
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin -35) + 'px';
    }

    // moves the cursor 
    const nextWord = document.querySelector('.word.current');
    const nextLetter = document.querySelector('.letter.current');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    
 });
}
document.getElementById('game').addEventListener('keydown', e => {
    const key = e.key;
    const tabButtonPress = key === 'Tab';
    const enterButtonPress = key === 'Enter';
    if(key === tabButtonPress){
        if(key === enterButtonPress){
            gameOver;
            newGame;
        }
        if(key === !enterButtonPress){
            return;
        }
    }
});
document.getElementById('newGameBtn').addEventListener('click',() =>{
 gameOver();
 newGame();
});
newGame();
