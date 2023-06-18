function randBingo(type){
	const seed = Math.floor(Math.random() * 999999);
	location.href='../index.html?t=' + type + '&s=' + seed;
}
