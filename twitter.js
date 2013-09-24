<script type = "text/javascript">
/*----------------------------------
*Please rename file as include, I only put ".js" for code colour formatting on this Gist.

JS TWITTER REQUEST INCLUDE by Steven Jacob

Version Log: 1.0.3 - Fully Functional Ordered Twitter Stream from Two Users that UPDATES Outdate Tweets from PHP

Special Thanks to Lucas Rizoli for advice and enlightening white board diagrams.

*INCREBIDLY IMPORTANT NOTE:
PLEASE READ INCREDIBLY IMPORTANT NOTE IN THE PHP TWITTER INCLUDE
YOU HAVE BEEN WARNED.
----------------------------------*/


//-----------------------------------
//	GLOBAL VARIABLES
//-----------------------------------


tweetArray = new Array(); 
var i = 0;

//-----------------------------------
//	END OF GLOBAL VARIABLES 
//-----------------------------------


//-----------------------------------
//	DOMREADY INITIALIZATION
//-----------------------------------


window.addEvent('domready', function()
{

$('container').setStyle('overflow', 'hidden');

var requestOne = new RequestTwitter //First Request
({
data:
{
	screen_name: 'github',
	count: 2 //Ask for two tweets from github
}
}).addEvents({
	onFailure: function() //Only this Request will display a fail or not, because if the first one fails it doesn't even send the second one
	{
		if($('#tweetzone .article-listing')) //Only display the sorry message, ontop of some tweets, not the down image
		{
		new Element('div#sorry', {html: "<span>Sorry, the most recent tweets were not available, please try again later.</span>"}).inject('tweetzone', 'top');
		}
           $('tweetzone').fireEvent('startScroll');
	}
});


var requestTwo = new RequestTwitter //Second Request
({
data:
{
	screen_name: 'mootools', 
	count: 2 //Ask for two tweets from mootools
}
});

var sortTweetAndCheck = function(array) //Sorts the array
{
	tweetArray.sort(function(a, b) 
	{
		var dateA = new Date(a.date) , dateB = new Date(b.date)
		return dateB-dateA //Orders array in descending order by comparing Tweet corresponding time stamp.
	});


	if($('downimage'))
	{
		$('downimage').fade('out');
		$('downimage').dispose();
		injector(); //Inject JS tweets onto the page

	}
	else if($$('#tweetzone .article-listing'))
	replaceTweets();
};

var injector = function()
{
	for (var x = 0; x < tweetArray.length; x++) 
	{
	tweetArray[x].tweet.inject('tweetzone', 'top');//Puts the html from each tweet array into the DIV and Done!
	}
    $('tweetzone').fireEvent('startScroll');
};

var replaceTweets = function()
{

	var divTweet = $$('#tweetzone .article-listing').get('id');
	for (var i = 0; i < divTweet.length; i++) //This might not consider all cases, test this out.
	{
		if(divTweet[0] < tweetArray[i].date)//Compares UNIX Stamp of both PHP Tweets and Javascript Tweets
		{
			tweetArray[i].tweet.inject(divTweet[0], 'before');//Replace it with the one correlated to tweetArray
			$(divTweet[(divTweet.length)-1]).dispose(); //Remove that specific outdated tweet
			divTweet.pop();
		}
	}
    $('tweetzone').fireEvent('startScroll');
};


//-------------------------------------
//	END OF REQUESTS AND SORT FUNCTION
//-------------------------------------


//-------------------------------------
//	EVENT TRIGGER AND LISTENERS
//-------------------------------------
requestOne.send(); //Sends the request 
requestOne.addEvent('toggle', function(){requestTwo.send()}); //Listens for RequestOne success to trigger RequestTwo
requestTwo.addEvent('toggle', sortTweetAndCheck);

/* Scroller */

$('tweetzone').addEvent('startScroll', function(){
    var EternaScroll = new Class({
        initialize: function(element, options) {
            this.element = document.id(element);
            offset = -this.element.getScrollSize().y;

            //clone children to appear to be in a seamless loop
            this.element.getChildren().each(function(child) {
                child.clone(true,true).inject($(element), 'bottom');
            });

            var tweenScroll = new Fx.Tween(element, {
                transition: 'linear',
                duration: 20000,
                property: 'top',
                onComplete: function() {
                    this.element.setStyle('top', 0);
                    this.start(offset);
                }
            });

            //pause scrolling while mouse is over element
            $(element).addEvents({
                mouseenter: function() { tweenScroll.pause(); },
                mouseleave: function() { tweenScroll.resume(); }
            });

            tweenScroll.start(offset);
        }
    });

    new EternaScroll('tweetzone');
});



//-------------------------------------
//	END OF EVENT TRIGGER AND LISTENERS
//-------------------------------------
});
</script>