var data;
var socket = io();

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
        fiftyFiftyCounter: 0
    },
    methods: {
        start: function ( event ){
            this.questionNumber = 1
            loadQuestion(this.questionNumber);
            socket.emit('loadQuestion', app.questionNumber );
        },
        previous: function ( event ) {
            if( this.questionNumber == 1) return; 
            this.questionNumber--;
            loadQuestion(this.questionNumber);
            socket.emit('loadQuestion', app.questionNumber );
        },
        next: function ( event ) {
            if( this.questionNumber == data.questions.length ){
                alert("Fertig");
                return; 
            } 
            this.questionNumber++;
            loadQuestion(this.questionNumber);
            socket.emit('loadQuestion', app.questionNumber );
        },
        logInAnswer: function ( index,isCorrect ){
            if(this.showAnswerCounter < 4) return;
            this.isCorrectAnswer = isCorrect;
            this.loggedInAnswer = index;
            socket.emit('logInAnswer', this.loggedInAnswer );
        },
        useFiftyFifty: function( event ){
            this.isShowFiftyFifty = true;
            this.fiftyFiftyCounter++;
            socket.emit('action', 'fiftyfifty' );
        },
        solve: function( event ){
            this.isSolved = true;
            this.loggedInAnswer = -1;
            if( this.isCorrectAnswer == true){
                this.score++;
            }
            socket.emit('solve', this.score );
        },
        refreshDisplay: function (event){
            socket.emit('loadQuestion', app.questionNumber );
            socket.emit('showAnswers', this.showAnswerCounter );
            socket.emit('logInAnswer', this.loggedInAnswer );
            socket.emit('showScore', this.score );

            if( this.isShowFiftyFifty){
                socket.emit('action', 'fiftyfifty' );
            }

            if( this.isSolved){
                socket.emit('solve', this.score );
            }
        },
        showNextAnswer: function ( event ){
            this.showAnswerCounter++;
            socket.emit('showAnswers', this.showAnswerCounter );
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
    app.question = data.questions[ index - 1];
}



socket.on('loadQuestion', function(msg){
    loadQuestion( msg );
});

socket.on('logInAnswer', function(msg){
    app.loggedInAnswer = msg;
});

socket.on('showAnswers', function(msg){
    app.showAnswerCounter = msg;
});

socket.on('solve', function( msg ){
    app.isSolved = true;
    app.score = msg;
});

socket.on('showScore', function( msg ){
    app.score = msg;
});

socket.on('action', function(msg){
    switch(msg){
        case "fiftyfifty":
            app.isShowFiftyFifty = true;
        break;
        default:
            console.log("Unknown action", msg);
    }
});