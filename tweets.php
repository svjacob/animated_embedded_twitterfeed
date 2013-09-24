<?PHP
/*----------------------------------
*Please rename file as include, I only put ".php" for code colour formatting on this Gist.

PHP TWITTER REQUEST INCLUDE by Steven Jacob

Version Log: 1.0.3 - Fully Functional Ordered Twitter Stream from Two Users in PHP

Special Thanks to Lucas Rizoli for advice and enlightening white board diagrams.

*INCREBIDLY IMPORTANT NOTE:
IT IS VERY SIMPLE TO ADD USERNAMES TO THE PHP FILE AND MORE TWEETS WILL BE PULLED
BUT IF YOU WANT THE FUNCTIONALITY OF THE JAVASCRIPT INCLUDE TO WORK WELL. (WHICH IS SUPPOSED TO CHECK FOR OUTDATED TWEETS IN THE PHP CACHE AND REPLACE THEM) THEN MAKE SURE YOU MAKE THE CORRESPONDING CHANGES HERE AS WELL; WHETHER ITS CHANGE OF USERNAME, MORE USERS, MORE TWEET COUNTS. OTHERWISE THE REPLACE FUNCTION MAY END UP FAULTY.

YOU HAVE BEEN WARNED.
----------------------------------*/

//Core Parameters
$limit = 2; //Amount of Tweets you want per User
$accounts = array("github", "mootools"); //Array of Users to pull Tweets from
$tweetCount = 0; //Overall tweet array counter
$ten_minutes = time()-600;//600 defines 10 minutes


//Extracts relevant data and puts them in array
foreach($accounts as $username){

	$cache = dirname(__FILE__).'\cache\twitter'.$username.'.txt';
	$cache_time = filemtime($cache); 

	if($cache_time>$ten_minutes){//Make sure you test this false checker
		$twitterResponse = file_get_contents($cache, true);
	}
	else{
		$twitterResponse = file_get_contents("https://api.twitter.com/1/statuses/user_timeline.json?exclude_replies=true&screen_name=".$username."&count=2", true);
		if(empty($twitterResponse)){ //This check determines whether the return from filegetcontents is empty(error)
		if(empty($cache))//Checks if the cache is empty or non-existent too!
		$twitterResponse = false; //Then it display the down image
		$twitterResponse = file_get_contents($cache, true); //But if the cache is still there, we still have tweets! :)
		}
		else{
			$cachefile = fopen($cache, 'wb');
			fwrite($cachefile, $twitterResponse);
			fclose($cachefile);
		}
	}
	$twitterJSONResponse = json_decode($twitterResponse, TRUE);
	foreach($twitterJSONResponse as $tweet){
		//Linkify Function
		$tweet_text = $tweet['text'];
		//Replaces all URLS with a clickable link
		$tweet_text = preg_replace("/(http:\/\/|(www\.))(([^\s<]{4,68})[^\s<]*)/", '<a href="http://$2$3" target="_blank">$1$2$4</a>', $tweet_text);
		//Replaces all @Users to clickable link
		$tweet_text = preg_replace("/@(\w+)/", "<a href=\"http://www.twitter.com/\\1\" target=\"_blank\">@\\1</a>", $tweet_text);
		//Replaces all #Trend to clickable link
		$tweet_text = preg_replace("/#(\w+)/", "<a href=\"http://search.twitter.com/search?q=\\1\" target=\"_blank\">#\\1</a>", $tweet_text);
		//First array holds the profile picture
		$userTweets[$tweetCount][0] = "<img id = \"tweet-image\" src=\"".$tweet['user']['profile_image_url']."\">";
		//Second array holds the username and the linkified tweet itself
		$userTweets[$tweetCount][1] = "<strong><a href = \"http://www.twitter.com/".$username."\">".$tweet['user']['name']."</a></strong><br/>".$tweet_text."<br/>";
		//Third array holds the UNIX Timestamp which will be needed to sort the tweets
		$userTweets[$tweetCount][2] = strtotime($tweet['created_at']); 
		//Last array holds a nicely formatted version of the date
		$userTweets[$tweetCount][3] = "<span>".date('M d, Y', strtotime($tweet['created_at']))." ".date('g:ia', strtotime($tweet['created_at']))."</span>";
		//Increases the index of the tweet as the foreach function goes on
		$tweetCount++;
	}
}

//A function for the sort style based on the UNIX Timestamp
function DateSort($a,$b){
	$a = ($a[2]);
	$b = ($b[2]);
	if ($a == $b) {
		return 0;
	} else { 
		if($a>$b) {
			return -1;
		} else {
			return 1;
		}
	}
}
//Sorts the tweets
usort($userTweets, "DateSort");

//If the twitter response was false display Twitter Stream Unavailable image
if($twitterResponse == FALSE){
echo ("<img id=\"downimage\" align=\"left\" src=\"/images/TwitterStreamDown.png\" alt=\"Twitter Stream is currently unavailable\">");
}
//Otherwise echo out proper divs and elements needed from the tweet array
else{
	for($tweetCount = 0; $tweetCount < count($userTweets); $tweetCount++){
	echo ("<div id = \"".$userTweets[$tweetCount][2]."\" class = \"article-listing small clearfix\">
	<div id = \"profile-pic\">");
	echo ($userTweets[$tweetCount][0]);
	echo ("</div><div class = \"tweet\">");
	echo ($userTweets[$tweetCount][1]);
	echo ($userTweets[$tweetCount][3]);
	echo ("</div>");
	echo ("</div>");
	}
}
?>