"use strict";angular.module("freestateApp",["ngAnimate","ngCookies","ui.router","textAngular","foundation","angulartics","angulartics.google.analytics"]).config(["$urlRouterProvider","$locationProvider","$stateProvider",function(a,b,c){a.otherwise("/"),c.state("root",{url:"/",templateUrl:"views/main.html"}).state("about",{url:"/about",templateUrl:"views/about.html"}),b.html5Mode({enabled:!1,requireBase:!1})}]).run([function(){FastClick.attach(document.body)}]),angular.module("freestateApp").controller("MainCtrl",["ModalFactory","$timeout","$interval","textAngularManager","$scope","$analytics",function(a,b,c,d,e,f){var g=this;g.init=function(){g.limit=!1,g.showToolbar=!1,g.enableWriting=!1,g.counterStarted=!1,g.text="Click the plus button to create a new document.",g.timer=5,g.editMode=!1;var a=angular.element(window).outerHeight(),c=angular.element(".bar-top").outerHeight(),d=angular.element(".bar-bottom").outerHeight(),e=a-(c+d)+18;b(function(){angular.element(".page-container").css("min-height",e),angular.element(".page-container [text-angular] .ta-scroll-window > .ta-bind").css("min-height",e-70)},250)},g.startCreateProcess=function(){var c=new a({"class":"small dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/timerSet.html",contentScope:{step:1,closeModal:function(a){c.deactivate(),b(function(){c.destroy()},1e3),a&&(g.limit=a,g.initWritingContainer())}}});c.activate()},g.initWritingContainer=function(){if(f.eventTrack("Started Writing Session"),angular.element(".page-container").css("min-height",angular.element(".page-container").outerHeight()+8),g.enableWriting=!0,g.text="Start typing to begin...",g.editor=d.retrieveEditor("text-editor"),"time"===g.limit.type){var a=60*g.limit.value.min*1e3+3600*g.limit.value.hrs*1e3,b=g.msToTime(a);g.hourCounter=b.hrs,g.minuteCounter=b.min,g.secondCounter=b.sec}else"words"===g.limit.type&&(g.wordCount=0,g.beginWritingByWordCount())},g.stoppedWriting=function(){g.enableWriting!==!0||""===g.text||g.editMode||(g.detonate=b(function(){f.eventTrack("TIME UP Cleared Document"),g.text="<p></p>",g.timer=5,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1),d.refreshEditor("text-editor"),c.cancel(g.eraseTimer),b.cancel(g.detonate)},5e3),g.eraseTimer=c(function(){g.timer=g.timer-1;var a=angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity");a-=.2,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",a)},1e3))},g.destroyTimers=function(){(g.detonate||g.eraseTimer)&&(g.timer=5,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1)),g.detonate&&b.cancel(g.detonate),g.eraseTimer&&c.cancel(g.eraseTimer),g.enableWriting===!0&&g.counterStarted===!1&&"time"===g.limit.type&&g.beginWritingByTime()},g.beginWritingByTime=function(){g.hourCounter="",g.minuteCounter="",g.secondCounter="",g.finished=!1;var a=g.limit.value.hrs,d=g.limit.value.min,e=60*d*1e3+3600*a*1e3,f=c(function(){e-=1e3;var a=g.msToTime(e);g.hourCounter=a.hrs,g.minuteCounter=a.min,g.secondCounter=a.sec},1e3),h=b(function(){g.hourCounter=!1,g.minuteCounter=!1,g.secondCounter=!1,c.cancel(f),b.cancel(h),g.done()},e);g.counterStarted=!0},g.beginWritingByWordCount=function(){g.counterStarted=!0,g.countWatcher=e.$watch(function(){return g.editor.scope.wordcount},function(a){a>=g.limit.value&&(g.countWatcher(),g.done())})},g.done=function(){f.eventTrack("Finished Document",{label:g.text}),g.destroyTimers(),g.finished=!0,g.showToolbar=!0,g.counterStarted=!1,g.editMode=!0,g.limit=!1;var c=new a({"class":"tiny dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/finished.html",contentScope:{closeModal:function(){c.deactivate(),b(function(){c.destroy()},1e3)}}});c.activate()},g.msToTime=function(a){var b=a%1e3;a=(a-b)/1e3;var c=a%60;a=(a-c)/60;var d=a%60,e=(a-d)/60;return{hrs:e,min:d,sec:c}},g.init()}]),angular.module("freestateApp").controller("SetupCtrl",["$scope",function(a){this.init=function(){this.timeLimit={min:0,hrs:0},this.wordLimit=0,this.buttonText="BEGIN",this.limit={}},this.validifyTime=function(){var a=this.timeLimit;a.min<0||a.hrs<0||0===a.hrs&&0===a.min?this.buttonText="Time only goes forward...":this.buttonText="BEGIN"},this.limitByTime=function(){var b=this.timeLimit;return b.min<0||b.hrs<0||0===b.hrs&&0===b.min?(this.buttonText="Time only goes forward...",!1):(this.limit.type="time",this.limit.value=b,a.closeModal(this.limit),void 0)},this.validifyWords=function(){this.wordLimit<=0?this.buttonText="That doesn't make sense...":this.buttonText="BEGIN"},this.limitByWords=function(){return this.wordLimit<=0?(this.buttonText="That doesn't make sense...",!1):(this.limit.type="words",this.limit.value=this.wordLimit,a.closeModal(this.limit),void 0)},this.init()}]),angular.module("freestateApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="page-container"> <p>I made this because I saw an app at the top of Product Hunt today called FlowState. I loved the idea of it, but it was being sold for $15.00. I challenged myself to build the same thing using OSS in a day, and this is the result.</p> <p><a href="http://ethanmay.github.io/freestate" analytics-on="click" analytics-event="Go to repo" target="_blank">Check out the repo here.</a></p> </div>'),a.put("views/main.html",'<div class="page-container"> <div name="text-editor" text-angular ng-model="main.text" ng-class="main.showToolbar ? \'showToolbar\' : \'\'" ng-change="main.stoppedWriting()" ng-keyup="main.destroyTimers()"></div> <div class="editor-overlay" ng-hide="main.enableWriting"></div> </div>'),a.put("views/modals/finished.html",'<div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-check-circle-o"></i></h1> <h3>You did it!</h3> <p>Switching to edit mode so you can format your writing.</p> </div> </div> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a>'),a.put("views/modals/timerSet.html",'<div ng-controller="SetupCtrl as setup"> <div class="grid-block vertical" ng-show="step === 1"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-hourglass"></i></h1> <h3>Limit by time or word count?</h3> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <ul class="button-group expand"> <li> <a class="text-center" ng-click="step = \'time\'" analytics-on="click" analytics-event="Limit by Time"> <i class="fa fa-clock-o"></i><br> Time </a> </li> <li> <a class="text-center" ng-click="step = \'words\'" analytics-on="click" analytics-event="Limit by Word Count"> <i class="fa fa-pencil-square-o"></i><br> Word Count </a> </li> </ul> </div> </div> </div> </div> <form ng-show="step === \'time\'" ng-submit="setup.limitByTime()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-clock-o"></i></h1> <h3>Limit by Time</h3> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <label>Hours: <input type="number" value="0" ng-model="setup.timeLimit.hrs" ng-change="setup.validifyTime()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Minutes: <input type="number" value="0" ng-model="setup.timeLimit.min" ng-change="setup.validifyTime()"> </label> </div> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand" analytics-on="click" analytics-event="Set Time" analytics-label="{{setup.timeLimit}}">{{setup.buttonText}}</button> </div> </div> </div> </form> <form ng-show="step === \'words\'" ng-submit="setup.limitByWords()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-pencil-square-o"></i></h1> <h3>Limit by Words</h3> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Number of words: <input type="number" value="0" ng-model="setup.wordLimit" ng-change="setup.validifyWords()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand" analytics-on="click" analytics-event="Set Time" analytics-label="{{setup.wordLimit}}">{{setup.buttonText}}</button> </div> </div> </div> </form> <a class="go-back" ng-click="step = 1" ng-show="step !== 1"><i class="fa fa-arrow-circle-o-left"></i></a> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a> </div>')}]);