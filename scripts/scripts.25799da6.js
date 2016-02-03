"use strict";angular.module("freestateApp",["ngAnimate","ngCookies","ui.router","textAngular","foundation","angulartics","angulartics.google.analytics"]).config(["$urlRouterProvider","$locationProvider","$stateProvider",function(a,b,c){a.otherwise("/"),c.state("root",{url:"/",templateUrl:"views/main.html"}).state("about",{url:"/about",templateUrl:"views/about.html"}),b.html5Mode({enabled:!1,requireBase:!1})}]).run(["ModalFactory","$timeout",function(a,b){if(FastClick.attach(document.body),window.mobilecheck===!0){var c=new a({"class":"tiny dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/homescreen.html",contentScope:{closeModal:function(){c.deactivate(),b(function(){c.destroy()},1e3)}}});c.activate()}}]),angular.module("freestateApp").controller("MainCtrl",["ModalFactory","$timeout","$interval","textAngularManager","$scope","$analytics",function(a,b,c,d,e,f){var g=this;g.init=function(){g.limit=!1,g.showToolbar=!1,g.enableWriting=!1,g.counterStarted=!1,g.text='<h3 class="text-center"><b>Welcome to FreeState</b></h3><h5 class="text-center">Improve your writing flow.</h5><hr/><p>Set a writing goal for yourself, then set an expiration timer. If you stop writing, the expiration timer starts. If you don\'t start writing again, your work will be erased and you will start over.</p><hr><p>When you\'re ready, click the &nbsp;<i class="fa fa-plus-square"></i>&nbsp; button to begin.</p><p><small><i>Special thanks to <a href="http://www.hailoverman.com/flowstate" target="_blank">FlowState</a> for the app idea, but $15 is way too expensive.</i></small></p>',g.timer=0,g.editMode=!1,g.wordCount=0;var a=angular.element(window).outerHeight(),c=angular.element(".bar-top").outerHeight(),d=angular.element(".bar-bottom").outerHeight(),e=a-(c+d)+18;b(function(){angular.element(".page-container").css("min-height",e),angular.element(".page-container [text-angular] .ta-scroll-window > .ta-bind").css("min-height",e-73)},250)},g.startCreateProcess=function(){var c=new a({"class":"small dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/timerSet.html",contentScope:{step:1,closeModal:function(a){c.deactivate(),b(function(){c.destroy()},1e3),a&&(g.limit=a,g.initWritingContainer())}}});c.activate()},g.initWritingContainer=function(){if(f.eventTrack("Started Writing Session"),angular.element(".page-container").css("min-height",angular.element(".page-container").outerHeight()+8),g.enableWriting=!0,g.text="Start typing to begin...",g.editor=d.retrieveEditor("text-editor"),g.timer=g.limit.expiry,g.editor.scope.displayElements.text.click(function(){g.editor.scope.displayElements.text.html(""),"words"===g.limit.type&&(g.wordCount=g.limit.value),g.editor.scope.displayElements.text.off("click")}),"time"===g.limit.type){var a=60*g.limit.value.min*1e3+3600*g.limit.value.hrs*1e3,b=g.msToTime(a);g.hourCounter=b.hrs,g.minuteCounter=b.min,g.secondCounter=b.sec}else"words"===g.limit.type&&(g.wordCount=g.limit.value,g.beginWritingByWordCount())},g.stoppedWriting=function(){g.enableWriting!==!0||""===g.text||"<p></p>"===g.text||g.editMode||(g.detonate=b(function(){f.eventTrack("TIME UP Cleared Document"),d.refreshEditor("text-editor"),g.editor.scope.displayElements.text.html(""),g.timer=g.limit.expiry,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1),c.cancel(g.eraseTimer),b.cancel(g.detonate)},1e3*g.limit.expiry),g.eraseTimer=c(function(){g.timer=g.timer-1;var a=angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity");a-=1/g.limit.expiry,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",a)},1e3))},g.destroyTimers=function(){(g.detonate||g.eraseTimer)&&(g.timer=g.limit.expiry,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1)),g.detonate&&b.cancel(g.detonate),g.eraseTimer&&c.cancel(g.eraseTimer),g.enableWriting===!0&&g.counterStarted===!1&&"time"===g.limit.type&&g.beginWritingByTime()},g.beginWritingByTime=function(){g.hourCounter="",g.minuteCounter="",g.secondCounter="",g.finished=!1;var a=g.limit.value.hrs,d=g.limit.value.min,e=60*d*1e3+3600*a*1e3,f=c(function(){e-=1e3;var a=g.msToTime(e);g.hourCounter=a.hrs,g.minuteCounter=a.min,g.secondCounter=a.sec},1e3),h=b(function(){g.hourCounter=!1,g.minuteCounter=!1,g.secondCounter=!1,c.cancel(f),b.cancel(h),g.done()},e);g.counterStarted=!0},g.beginWritingByWordCount=function(){g.counterStarted=!0,g.wordCount=g.limit.value,g.countWatcher=e.$watch(function(){return g.editor.scope.wordcount},function(a){a&&(g.wordCount=g.limit.value-a),g.wordCount<=0&&(g.countWatcher(),g.done())})},g.done=function(){f.eventTrack("Finished Document",{label:g.text}),g.destroyTimers(),g.finished=!0,g.showToolbar=!0,g.counterStarted=!1,g.editMode=!0,g.limit=!1,g.wordCount=0;var c=new a({"class":"tiny dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/finished.html",contentScope:{closeModal:function(){c.deactivate(),b(function(){c.destroy()},1e3)}}});c.activate()},g.msToTime=function(a){var b=a%1e3;a=(a-b)/1e3;var c=a%60;a=(a-c)/60;var d=a%60,e=(a-d)/60;return{hrs:e,min:d,sec:c}},g.init()}]),angular.module("freestateApp").controller("SetupCtrl",["$scope",function(a){this.init=function(){this.expiry=0,this.timeLimit={min:0,hrs:0},this.wordLimit=0,this.buttonText="BEGIN",this.limit={}},this.validifyTime=function(){var a=this.timeLimit;a.min<0||a.hrs<0||0===a.hrs&&0===a.min||!a.hrs&&!a.min?this.buttonText="Time only goes forward...":this.buttonText="Next"},this.limitByTime=function(){var b=this.timeLimit;return b.min<0||b.hrs<0||0===b.hrs&&0===b.min||!b.hrs&&!b.min?(this.buttonText="Time only goes forward...",!1):(this.limit.type="time",this.limit.value=b,this.buttonText="BEGIN",a.step="expire",void 0)},this.validifyWords=function(){this.wordLimit<=0||!this.wordLimit?this.buttonText="That doesn't make sense...":this.buttonText="Next"},this.limitByWords=function(){return this.wordLimit<=0||!this.wordLimit?(this.buttonText="That doesn't make sense...",!1):(this.limit.type="words",this.limit.value=this.wordLimit,this.buttonText="BEGIN",a.step="expire",void 0)},this.validifyExpiry=function(){var a=this.expiry;0>a||0===a||!a?this.buttonText="Time only goes forward...":this.buttonText="BEGIN"},this.setExpirationTime=function(){var b=this.expiry;return 0>b||0===b||!b?(this.buttonText="Time only goes forward...",!1):(this.limit.expiry=b,void a.closeModal(this.limit))},this.init()}]),angular.module("freestateApp").directive("stopEvent",function(){return{restrict:"A",link:function(a,b,c){b.on(c.stopEvent,function(a){a.stopPropagation()})}}}),angular.module("freestateApp").run(["$templateCache",function(a){a.put("views/main.html",'<div class="page-container" stop-event="touchend"> <div name="text-editor" text-angular ng-model="main.text" ng-class="main.showToolbar ? \'showToolbar\' : \'\'" ng-change="main.stoppedWriting()" ng-keyup="main.destroyTimers()"></div> <div class="editor-overlay" ng-hide="main.enableWriting"></div> </div>'),a.put("views/modals/finished.html",'<div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-check-circle-o"></i></h1> <h3>You did it!</h3> <p>Switching to edit mode so you can format your writing.</p> </div> </div> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a>'),a.put("views/modals/homescreen.html",'<div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-mobile-phone"></i></h1> <h3>Like it? Pin it!</h3> <p>Pin this app to your homescreen to use it like a native application!</p> <a zf-close="" class="button expand">Got it.</a> </div> </div> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a>'),a.put("views/modals/timerSet.html",'<div ng-controller="SetupCtrl as setup"> <div class="grid-block vertical step" ng-show="step === 1"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-hourglass"></i></h1> <h3>Set Your Goal</h3> <p><i>Time or word count?</i></p> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <ul class="button-group expand"> <li> <a class="text-center" ng-click="step = \'time\'" analytics-on="click" analytics-event="Limit by Time"> <i class="fa fa-clock-o"></i><br> Time </a> </li> <li> <a class="text-center" ng-click="step = \'words\'" analytics-on="click" analytics-event="Limit by Word Count"> <i class="fa fa-pencil-square-o"></i><br> Word Count </a> </li> </ul> </div> </div> </div> </div> <form class="step" ng-show="step === \'time\'" ng-submit="setup.limitByTime()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-clock-o"></i></h1> <h3>Time</h3> <p><i>How long would you like to write for?</i></p> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <label>Hours: <input ng-pattern="/^[0-9]*$/" type="number" value="0" ng-model="setup.timeLimit.hrs" ng-change="setup.validifyTime()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Minutes: <input ng-pattern="/^[0-9]*$/" type="number" value="0" ng-model="setup.timeLimit.min" ng-change="setup.validifyTime()"> </label> </div> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand" analytics-on="click" analytics-event="Set Time" analytics-label="{{setup.timeLimit}}">{{setup.buttonText}}</button> </div> </div> </div> </form> <form class="step" ng-show="step === \'words\'" ng-submit="setup.limitByWords()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-pencil-square-o"></i></h1> <h3>Words</h3> <p><i>How many words would you like to write?</i></p> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Number of words: <input ng-pattern="/^[0-9]*$/" type="number" value="0" ng-model="setup.wordLimit" ng-change="setup.validifyWords()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand" analytics-on="click" analytics-event="Set Time" analytics-label="{{setup.wordLimit}}">{{setup.buttonText}}</button> </div> </div> </div> </form> <form class="step" ng-show="step === \'expire\'" ng-submit="setup.setExpirationTime()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-bomb"></i></h1> <h3>Set Expiration Countdown</h3> <p><i>Your work will be erased if you stop writing for {{setup.expiry}} seconds.</i></p> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <label>Seconds: <input ng-pattern="/^[0-9]*$/" type="number" value="0" ng-model="setup.expiry" ng-change="setup.validifyExpiry()"> </label> </div> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand" analytics-on="click" analytics-event="Set Countdown" analytics-label="{{setup.expiry}}">{{setup.buttonText}}</button> </div> </div> </div> </form> <a class="go-back" ng-click="step = 1" ng-show="step !== 1"><i class="fa fa-arrow-circle-o-left"></i></a> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a> </div>')}]);