function findVideos() {
	let videos = document.querySelectorAll( `.video` );

	videos.forEach( ( video ) => setupVideo( video ) );
}

function setupVideo( video ) {
	let link = video.querySelector( `.video__link` );
	let button = video.querySelector( `.video__button` );
	let id = parseURL( link );

	button.addEventListener( `click`, () => {
		let iframe = createIframe( id );

		link.remove();
		button.remove();
		video.appendChild( iframe );
	} );

	link.removeAttribute( `href` );
	video.classList.add( `video--enabled` );
}

function parseURL( link ) {
	let regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)\/*/i;
	let url = link.href;
	let match = url.match( regexp );

	return match[ 1 ];
}

function createIframe( id ) {
	let iframe = document.createElement( `iframe` );

	iframe.setAttribute( `allowfullscreen`, `` );
	iframe.setAttribute( `allow`, `autoplay` );
	iframe.setAttribute( `src`, generateURL( id ) );
	iframe.classList.add( `video__media` );

	return iframe;
}

function generateURL( id ) {
	let query = `?rel=0&showinfo=0&autoplay=1`;

	return `https://www.youtube.com/embed/` + id + query;
}

findVideos();
