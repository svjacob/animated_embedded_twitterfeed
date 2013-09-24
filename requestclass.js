/*----------------------------------
TWITTER REQUEST CLASS by Steven Jacob

Version Log: 1.0.3 - Fully Functional Ordered Twitter Stream from Two Users

Resources:  - http://mootools.net/docs/more/Request/Request.JSONP
            - https://github.com/mootools/mootools-more/blob/master/Source/Request/Request.JSONP.js
            - https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
            - Luis Carlos: http://jsfiddle.net/Ciul/WB973/
            - David Walsh: http://davidwalsh.name/mootools-twitter-plugin

Special Thanks to Lucas Rizoli for advice and enlightening white board diagrams.
----------------------------------*/

var RequestTwitter = new Class({

Extends: Request.JSONP,
Implements: [Options, Events],

//------------------------------------
// OPTIONS AND DATA FOR DEFAULT CLASS
//------------------------------------
options: 
{
    log: true,
    timeout: 3000,
    linkify: true,

    data: 
    {
        screen_name: null,
        count: null,
    },
},
//----------------------------------------
// END: OPTIONS AND DATA FOR DEFAULT CLASS
//----------------------------------------

//----------------------------------
//  FUNCTIONS FOR REQUEST CLASS
//----------------------------------

initialize: function (options) //Appends User Defined Data and Options Members to Default Ones
{
    //http://keen.twopipes.com/gimme.php?a=500 - Use this URL for Testing Various HTTP Server Codes
    this.options.url = 'https://api.twitter.com/1/statuses/user_timeline.json?exclude_replies=true', 
    this.parent(options);
    this.updateData(Object.append(this.options.data, options.data));
},

updateData: function (newdata) //Used for the purpose of the function above
{
    this.setOptions({
        data: Object.append(this.options.data, newdata)
    });
},

stampClean: function(timestamp) //Takes twitter JSON element 'created_at' and formats it for display
{
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", 
    "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

    var amPm = "";
    var year = timestamp.getFullYear();
    var hourEST = timestamp.getHours();

        if (hourEST > 11) //Determines AM or PM
        {
            amPm = "PM";
        }

        else
        {
            amPm = "AM";
        }

    var modHour = hourEST % 12; //Converts 24 hour clock to 12 hours

    var hour = 0;

        if (modHour == 0)
        {
            hour = 12;
        }

        else
        {
            hour = modHour;
        }

    minuteCheck = ["0","1","2","3","4","5","6","7","8","9"]
    for (var x = 0; x < minuteCheck.length; x++) //If any of the Minutes value is 01 02 or 00 (which comes out as 1,2,0) or something it needs to check and add in an extra zero.
    {
    if(timestamp.getMinutes() == minuteCheck[x])
    return monthNames[timestamp.getMonth()] + " " + timestamp.getDate() + ", " + year + " " + hour + ":" + "0" + timestamp.getMinutes()  + " " + amPm;
    }
    return monthNames[timestamp.getMonth()] + " " + timestamp.getDate() + ", " + year + " " + hour + ":" + timestamp.getMinutes() + " " + amPm;
},

//----------------------------------
//END OF FUNCTIONS FOR REQUEST CLASS
//----------------------------------

//-----------------------------------
//SUCCESSFUL REQUEST PROCEDURE
//-----------------------------------

success: function(data) 
{
    if (this.options.linkify) //Gets the actual tweet text and formats the links to clickable hyperlinks
    {
        data[0].each(function(tweet)
        {
            tweet.text = this.linkify(tweet.text);
        }, this);
    }

    data[0].each(function(tweet)
    {
        //Think about combining the two following statements.
        var timestamp = new Date(tweet.created_at) //Gets timestamp from created_at element in Tweet
        var newtimestamp = this.stampClean(timestamp); //Calls clean function to formate date
        var ts = Math.round((new Date(tweet.created_at)).getTime()/1000);
        var container = new Element ('div#'+ts+'.article-listing.small.clearfix');
        var profilePic = new Element ('div#profile-pic').inject(container);
        var tweetImage = new Element ('img#tweet-image', {'src': tweet.user.profile_image_url.replace("\\", ''),'alt': tweet.user.name,'align': "left"}).inject(profilePic);
        var tweetText = new Element ('div.tweet', {html: '<strong><a href = \"http://www.twitter.com/' + this.options.screen_name + '\">'+ tweet.user.name + '</a></strong><br/>' + tweet.text + '<br/><span>' + newtimestamp + '</span>'}).inject(container);
        
        tweetArray[i] = {tweet: container, date: ts}; //Puts all tweets and its associated time into an array.
        i++;

    }, this);

    this.parent(data);
    this.fireEvent('toggle'); //Fires a sort function after successfully processing the JSON response
},

//-----------------------------------
//END OF SUCCESSFUL REQUEST PROCEDURE
//-----------------------------------
//-----------------------------------
//LINKIFY FUNCTION 
//-----------------------------------

linkify: function (text) 
{
    return text.replace(/(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi, '<a href="$1">$1</a>').replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>').replace(/(^|\W)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>');
}

//----------------------------------
//END OF LINKIFY FUNCTION
//----------------------------------
});