"use strict";angular.module("freestateApp",["ngAnimate","ngCookies","ngTouch","ui.router","textAngular","foundation"]).config(["$urlRouterProvider","$locationProvider","$stateProvider",function(a,b,c){a.otherwise("/"),c.state("root",{url:"/",templateUrl:"views/main.html"}).state("about",{url:"/about",templateUrl:"views/about.html"}),b.html5Mode({enabled:!1,requireBase:!1})}]).run([function(){FastClick.attach(document.body)}]),angular.module("freestateApp").controller("MainCtrl",["ModalFactory","$timeout","$interval","textAngularManager","$scope",function(a,b,c,d,e){var f=this;f.init=function(){f.limit=!1,f.showToolbar=!1,f.enableWriting=!1,f.counterStarted=!1,f.text="Click the plus button to create a new document.",f.timer=5,f.editMode=!1;var a=angular.element(window).outerHeight(),c=angular.element(".bar-top").outerHeight(),d=angular.element(".bar-bottom").outerHeight(),e=a-(c+d)+18;b(function(){angular.element(".page-container").css("min-height",e),angular.element(".page-container [text-angular] .ta-scroll-window > .ta-bind").css("min-height",e-70)},250)},f.startCreateProcess=function(){var c=new a({"class":"small dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/timerSet.html",contentScope:{step:1,closeModal:function(a){c.deactivate(),b(function(){c.destroy()},1e3),a&&(f.limit=a,f.initWritingContainer())}}});c.activate()},f.initWritingContainer=function(){if(angular.element(".page-container").css("min-height",angular.element(".page-container").outerHeight()+8),f.enableWriting=!0,f.text="Start typing to begin...",f.editor=d.retrieveEditor("text-editor"),"time"===f.limit.type){var a=60*f.limit.value.min*1e3+3600*f.limit.value.hrs*1e3,b=f.msToTime(a);f.hourCounter=b.hrs,f.minuteCounter=b.min,f.secondCounter=b.sec}else"words"===f.limit.type&&(f.wordCount=0,f.beginWritingByWordCount())},f.stoppedWriting=function(){f.enableWriting!==!0||""===f.text||f.editMode||(f.detonate=b(function(){f.text="<p></p>",f.timer=5,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1),d.refreshEditor("text-editor"),c.cancel(f.eraseTimer),b.cancel(f.detonate)},5e3),f.eraseTimer=c(function(){f.timer=f.timer-1;var a=angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity");a-=.2,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",a)},1e3))},f.destroyTimers=function(){(f.detonate||f.eraseTimer)&&(f.timer=5,angular.element("[text-angular] .ta-scroll-window > .ta-bind").css("opacity",1)),f.detonate&&b.cancel(f.detonate),f.eraseTimer&&c.cancel(f.eraseTimer),f.enableWriting===!0&&f.counterStarted===!1&&"time"===f.limit.type&&f.beginWritingByTime()},f.beginWritingByTime=function(){f.hourCounter="",f.minuteCounter="",f.secondCounter="",f.finished=!1;var a=f.limit.value.hrs,d=f.limit.value.min,e=60*d*1e3+3600*a*1e3,g=c(function(){e-=1e3;var a=f.msToTime(e);f.hourCounter=a.hrs,f.minuteCounter=a.min,f.secondCounter=a.sec},1e3),h=b(function(){f.hourCounter=!1,f.minuteCounter=!1,f.secondCounter=!1,c.cancel(g),b.cancel(h),f.done()},e);f.counterStarted=!0},f.beginWritingByWordCount=function(){f.counterStarted=!0,f.countWatcher=e.$watch(function(){return f.editor.scope.wordcount},function(a){a>=f.limit.value&&(f.countWatcher(),f.done())})},f.done=function(){f.destroyTimers(),f.finished=!0,f.showToolbar=!0,f.counterStarted=!1,f.editMode=!0,f.limit=!1;var c=new a({"class":"tiny dialog",overlay:!0,overlayClose:!0,templateUrl:"views/modals/finished.html",contentScope:{closeModal:function(){c.deactivate(),b(function(){c.destroy()},1e3)}}});c.activate()},f.msToTime=function(a){var b=a%1e3;a=(a-b)/1e3;var c=a%60;a=(a-c)/60;var d=a%60,e=(a-d)/60;return{hrs:e,min:d,sec:c}},f.init()}]),angular.module("freestateApp").controller("SetupCtrl",["$scope",function(a){this.init=function(){this.timeLimit={min:0,hrs:0},this.wordLimit=0,this.buttonText="BEGIN",this.limit={}},this.validifyTime=function(){var a=this.timeLimit;a.min<0||a.hrs<0||0===a.hrs&&0===a.min?this.buttonText="Time only goes forward...":this.buttonText="BEGIN"},this.limitByTime=function(){var b=this.timeLimit;return b.min<0||b.hrs<0||0===b.hrs&&0===b.min?(this.buttonText="Time only goes forward...",!1):(this.limit.type="time",this.limit.value=b,a.closeModal(this.limit),void 0)},this.validifyWords=function(){this.wordLimit<=0?this.buttonText="That doesn't make sense...":this.buttonText="BEGIN"},this.limitByWords=function(){return this.wordLimit<=0?(this.buttonText="That doesn't make sense...",!1):(this.limit.type="words",this.limit.value=this.wordLimit,a.closeModal(this.limit),void 0)},this.init()}]),angular.module("freestateApp").run(["$templateCache",function(a){a.put("views/about.html","About page"),a.put("views/main.html",'<div class="page-container"> <div name="text-editor" text-angular ng-model="main.text" ng-class="main.showToolbar ? \'showToolbar\' : \'\'" ng-change="main.stoppedWriting()" ng-keyup="main.destroyTimers()"></div> <div class="editor-overlay" ng-hide="main.enableWriting"></div> </div>'),a.put("views/modals/finished.html",'<div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-check-circle-o"></i></h1> <h3>You did it!</h3> <p>Switching to edit mode so you can format your writing.</p> </div> </div> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a>'),a.put("views/modals/timerSet.html",'<div ng-controller="SetupCtrl as setup"> <div class="grid-block vertical" ng-show="step === 1"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-hourglass"></i></h1> <h3>Limit by time or word count?</h3> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <ul class="button-group expand"> <li> <a class="text-center" ng-click="step = \'time\'"> <i class="fa fa-clock-o"></i><br> Time </a> </li> <li> <a class="text-center" ng-click="step = \'words\'"> <i class="fa fa-pencil-square-o"></i><br> Word Count </a> </li> </ul> </div> </div> </div> </div> <form ng-show="step === \'time\'" ng-submit="setup.limitByTime()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-clock-o"></i></h1> <h3>Limit by Time</h3> </div> </div> <div class="grid-block"> <div class="grid-block"> <div class="grid-content text-center"> <label>Hours: <input type="number" value="0" ng-model="setup.timeLimit.hrs" ng-change="setup.validifyTime()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Minutes: <input type="number" value="0" ng-model="setup.timeLimit.min" ng-change="setup.validifyTime()"> </label> </div> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand">{{setup.buttonText}}</button> </div> </div> </div> </form> <form ng-show="step === \'words\'" ng-submit="setup.limitByWords()"> <div class="grid-block vertical"> <div class="grid-block"> <div class="grid-content text-center"> <h1><i class="fa fa-pencil-square-o"></i></h1> <h3>Limit by Words</h3> </div> </div> <div class="grid-block"> <div class="grid-content text-center"> <label>Number of words: <input type="number" value="0" ng-model="setup.wordLimit" ng-change="setup.validifyWords()"> </label> </div> </div> <div class="grid-block"> <div class="grid-content"> <button class="button expand">{{setup.buttonText}}</button> </div> </div> </div> </form> <a class="go-back" ng-click="step = 1" ng-show="step !== 1"><i class="fa fa-arrow-circle-o-left"></i></a> <a zf-close="" class="close-modal"><i class="fa fa-close"></i></a> </div>')}]);