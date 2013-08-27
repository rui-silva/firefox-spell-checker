var dict = "";

/* Get the current dictionary. */
dict = self.options.dict;

/*
  For each textual element, find the wrong words and
  modify the HTML code in order for those words to
  become red.
*/
$("p,h1,h2,h3,h4,h5,h6,li").each( function( ) {
	var wrongWords = [];
	var paragraphText = $(this).text();
	paragraphText = cleanParagraph( paragraphText );
	console.log("\n\n" + paragraphText);
	var words = splitParagraph( paragraphText );
	
	/* Find the words that do not exist. */
	words.forEach( function( word ) {

		/*
		  We have to test for NaN values because it seems Firefox
		  considers <br> as a char, which doesn't have an ASCII value.
		*/
		if ( false == isWord( word ) 
		     && -1 == wrongWords.indexOf( word ) 
		     && !isNaN( word.charCodeAt() ) ) {
		    wrongWords.push( word );
		    console.log("Added wrong word: " + word + " ASCII code: " + word.charCodeAt() );
		}
	    });
	
	var paragraphHTML = $(this).html();

	/* For each wrong word, modify the html. */
	wrongWords.forEach( function( word ) {
		var regex = new RegExp("\\b" + word + "\\b", "g");
		paragraphHTML = 
		    paragraphHTML.replace( regex, "<span class='spelling-error'> " + word + " </span>" );
	    });
	
	$(this).html( paragraphHTML );	
    });

/* Make the words red! */
$(".spelling-error").css("color", "red");

/* 
   Function that returns true if the word exists, and false otherwise.
*/
function isWord( word ) {
    word = word.toLowerCase();
    /* Rules that determine if a word exists or not. */
    var pipe = [
		inDictionary,
		firstRule,
		secondRule,
		thirdRule,
		fourthRule,
		fifthRule,
		sixthRule,
    ];

    var result = false;
    pipe.some( function( rule ) {
	    if ( true == rule( word ) ) {
		result = true;
		return true;
	    }
	});

    return result;
}

/*
  Checks if a given word exists in the dictionary.
*/
function inDictionary( word ) {
    if ( dict.indexOf( " " + word + " " ) >= 0 ) {
	return true;
    } else {
	return false;
    }
}

/*
  Checks if a given word, while removing a given suffix and adding
  a new one, exists in the dictionary.
*/
function checkEnding( word, suffix, add ) {
    add = add || "";
    if ( endsWith( word, suffix ) ) {
	word = word.substring( 0, word.length - suffix.length ) + add;
	return inDictionary( word );
    } else {
	return false;
    }
}

/*
  Removes the -ing suffix and checks if the word exists.
*/
function firstRule( word ) {
    return checkEnding( word, "ing", undefined );
}

/*
  Removes the -s suffix and checks if the word exists.
*/
function secondRule( word ) {
    return checkEnding( word, "s", undefined );
}

/*
  Removes the -es, -ly, -ed suffix and checks if the word exists.
*/
function thirdRule( word ) {
    var result = false;
    ["es", "ly", "ed"].some( function( ending ) {
	    if ( true == checkEnding( word, ending, undefined ) ) {
		result = true;
		return true;
	    }
	});

    return result;
}

/*
  Removes the -ing suffix, while adding the suffix -e
  and checks if the word exists.
*/
function fourthRule( word ) {
    return checkEnding( word, "ing", "e" );
}

/*
  Removes the -ies suffix, while adding the suffix -y
  and checks if the word exists.
*/
function fifthRule( word ) {
    return checkEnding( word, "ies", "y" );
}

/*
  Removes the -s and -d suffix, on words that end with -es and -ed,
  and checks if they exist.
*/
function sixthRule( word ) {
    var result = false;
    ["es", "ed"].forEach( function(ending) {
	    if ( endsWith( word, ending ) ) {
		word = 
		    word.substring( 0, word.length - ( ending.length - 1 ) );
		if ( true == inDictionary( word ) ) {
		    result = true;
		    return true;
		}
	    } 
	});

    return result;
}

/* Checks if a given string ends with a given suffix. */
function endsWith( str, suffix ) {
    return str.indexOf( suffix, str.length - suffix.length ) !== -1;
}

function splitParagraph( paragraph ) {
    return paragraph.split(" ");
}

/*
  Cleans a paragraph:
  - Removes trailing white spaces.
  - Removes non-alphanumerical chars.
  - Removes new lines and carriage returns.
  - Removes duplicate white spaces.
*/
function cleanParagraph( paragraph ) {
    paragraph = paragraph.trim();
    paragraph = paragraph.replace(/\W/g, ' ');
    paragraph = paragraph.replace(/(\r\n|\n|\r)/gm, " ");
    paragraph = paragraph.replace(/\s+/g, ' ');

    return paragraph;
}