var fireRequest = true

$ ( document ).ready( function () {
	console.log('dom is ready')

	$ ( '#deletelist' ).on ( "keyup",function (){
		var inputLetters = {
			userinput: $ ('#deletelist') .val( )
		}

		$('#allMessages').empty()

		console.log('oo')

		if(fireRequest) {
			fireRequest = false
			$.post ('/searching', inputLetters, function(data){
				console.log(data)

				for (message in data){
					console.log(data[message].title)
					$ ( '#allMessages' ).append( '<div class="messageAppend">' + data[message].title + " " + 
						data[message].body + '</div>' )
				}
				$ ( '.messageAppend' ) .click( function() { 
					$('#deletelist').val($(this).text()) 
					console.log($(this).text())
				})
			})
			setTimeout(function(){
				fireRequest = true
			}, 300)
		}
	})

})
