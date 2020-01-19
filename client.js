var data;
var socket = io();
var audio;

var app = new Vue({
    el: '#app',
    data: {
        question: {"text": 'Das grüne Quiz'},
        questionNumber: 0,
        loggedInAnswer: -1,
        isSolved: false,
        showAnswerCounter: 0,
        score: 0,
        isCorrectAnswer: false,
        questionsTotalCount: 0,
        isShowFiftyFifty: false,
        isShowImage: false,
        isPlayingSound: false,
        fiftyFiftyCounter: 0
    },
    methods: {
        start: function ( event ){
            this.questionNumber = 1
            loadQuestion(this.questionNumber);
            socket.emit('action',{'action':'loadQuestion','number':app.questionNumber})
        },
        previous: function ( event ) {
            if( this.questionNumber == 1) return; 
            this.questionNumber--;
            loadQuestion(this.questionNumber);
            socket.emit('action',{'action':'loadQuestion','number':app.questionNumber})
        },
        next: function ( event ) {
            if( this.questionNumber == data.questions.length ){
                alert("Fertig");
                return; 
            } 
            this.questionNumber++;
            loadQuestion(this.questionNumber);
            socket.emit('action',{'action':'loadQuestion','number':app.questionNumber})
        },
        logInAnswer: function ( index,isCorrect ){
            if(this.showAnswerCounter < 4) return;
            this.isCorrectAnswer = isCorrect;
            this.loggedInAnswer = index;
            socket.emit('action',{'action':'logInAnswer','number':this.loggedInAnswer})
        },
        useFiftyFifty: function( event ){
            this.isShowFiftyFifty = true;
            this.fiftyFiftyCounter++;
            socket.emit('action',{'action':'fiftyfifty'})
        },
        solve: function( event ){
            this.isSolved = true;
            this.loggedInAnswer = -1;
            if( this.isCorrectAnswer == true){
                this.score++;
            }
            socket.emit('action',{'action':'solve','number':this.score})
        },
        refreshDisplay: function (event){
            socket.emit('action',{'action':'loadQuestion','number':app.questionNumber})
            socket.emit('action',{'action':'showAnswers','number':this.showAnswerCounter})
            socket.emit('action',{'action':'logInAnswer','number':this.loggedInAnswer})
            socket.emit('action',{'action':'showScore','number':this.score})

            if( this.isShowFiftyFifty){
                socket.emit('action',{'action':'fiftyfifty'})
            }

            if( this.isSolved){
                socket.emit('action',{'action':'solve','number':this.score})
            }
        },
        showNextAnswer: function ( event ){
            this.showAnswerCounter++;
            socket.emit('action',{'action':'showAnswers','number':this.showAnswerCounter})
        },
        playSound () {
            if(this.isPlayingSound ){
                audio.pause();
                this.isPlayingSound = false;
                return;
            }

            if(this.question.soundfile) {
              audio = new Audio(this.question.soundfile);
              this.isPlayingSound = true;
              audio.play();
              audio.addEventListener('ended', () => {
                this.isPlayingSound = false;
              })
            }
        },
        showImage(){
            this.isShowImage = true;
            socket.emit('action',{'action':'showImage'})
        }
      }
})


$.getJSON("data.json", function( json ) {
    data = json;
    app.questionsTotalCount = data.questions.length;
});


function loadQuestion( index ){
    app.loggedInAnswer = -1;
    app.isSolved = false;
    app.showAnswerCounter = 0;
    app.isCorrectAnswer = false;
    app.isShowFiftyFifty = false;
    app.isShowImage = false;
    app.question = data.questions[ index - 1];
}


socket.on('action', function( msg ){
    switch( msg.action ){
        case "loadQuestion":
            loadQuestion( msg.number );
        break;
        case "logInAnswer":
            app.loggedInAnswer = msg.number;
        break;
        case "showAnswers":
            app.showAnswerCounter = msg.number;
        break;
        case "fiftyfifty":
            app.isShowFiftyFifty = true;
        break;
        case "solve":
            app.isSolved = true;
            app.score = msg.number;
        break;
        case "showScore":
            app.score = msg.number;
        break;
        case "showImage":
            app.isShowImage = true;
        break;

        default:
            console.log("action not defined", msg);
    }
   
});

