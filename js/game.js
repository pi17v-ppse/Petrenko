// класс для представления упорядоченной пары
var pair = class pair {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	translate(x,y) {
		this.x += x;
		this.y += y;
	}
};

var dir = 'r'; // начальное направление (r, l, u, d)
var nextDir = 'r';

// конфигурация платы / дисплея
pieceSize = 32; // в пикселях
tabSize = new pair(10,20);

var snake; // массив пар
var fruit; // :пара; положение фруктов
var level = 1; // начальный уровень
var speed = 120; // начальная скорость (в мс)
var score = 0; // текущий счет
var hiscore = localStorage.getItem("hiscore") | 0; // hiscore сохраняется на локальном хранилище
//просмотреть настройки
$("#table").css("width", pieceSize*tabSize.x).css("height", pieceSize*tabSize.y);
$("#board").css("height", pieceSize*tabSize.y);

/**
 * Нарисовать змейку
 */
function render() {
	$("#snake").find(".piece").remove();
	for (var i = 0; i < snake.length; i++) {
		$("<img>", {
			'class': "piece",
			css: {
				"left": snake[i].x*pieceSize,
				"top": snake[i].y*pieceSize
			},
			src: "img/dark.png"
		}).appendTo($("#snake"));
	}
}

/**
 * Сгенерировать случайный фрукт
 */
function nextFruit() {
	$("#fruit").remove();
	var collision;
	do {
		collision = false;
		fruit = new pair(Math.floor((Math.random() * tabSize.x)), Math.floor((Math.random() * tabSize.y))); // создать следующую позицию фрукта
		for (var i = 0; !collision && i < snake.length; i++) { // проверьте, находится ли следующая позиция плода в змейке
			collision = (fruit.x == snake[i].x && fruit.y == snake[i].y);
		}
	} while (collision); // в то время как следующая позиция действительна

	// создать фруктовый элемент
	$("<img>", {
		"id": "fruit",
		css: {
			"left": fruit.x*pieceSize,
			"top": fruit.y*pieceSize
		},
		src: "img/dark.png"
	}).appendTo($("#table"));
}

/**
 * Функция передвижения змейки.
 */
function move() {
	// получить новую позицию фрагмента змеи
	var next = new pair(snake[0].x, snake[0].y);
	dir = nextDir;
	switch (dir) {
		case 'r': next.translate(1,0); break;
		case 'l': next.translate(-1,0); break;
		case 'u': next.translate(0, -1); break;
		case 'd': next.translate(0, 1); break;
		default: break;
	}
	next.x = (next.x+tabSize.x)%tabSize.x;
	next.y = (next.y+tabSize.y)%tabSize.y;

	if (next.x == fruit.x && next.y == fruit.y) { // взять фрукты
		score++; // увеличение балла
		$("#score").text(formatScore(score));
		if (score > hiscore) { // обновляет hiscore
			hiscore = score;
			localStorage.setItem("hiscore", hiscore);
			$("#hi-score").text(formatScore(hiscore));
		}

		// обновляет уровень
		level = Math.floor(score/5)+1;
		$("#level").text(level);

		nextFruit(); // создать другой фрукт
	} else {
		snake.pop(); // удаляет последний фрагмент змеи
	}

	// обнаруживать столкновение
	var collision = false;
	for (var i = 0; !collision && i < snake.length; i++) {
		if (next.x == snake[i].x && next.y == snake[i].y) {
			collision = true;
		}
	}

	snake.unshift(next); // добавить новый фрагмент змеи

	render(); // обновляет рендер змейки
	if (collision) { // игра окончена
		$("#gameover").css("color", "black");
		$("#start").prop("disabled", false);
	} else {
		setTimeout(move, speed / level); // следующий шаг движения
	}
}

/**
 * рестарт игры
 */
function init () {
	snake = [new pair(Math.floor(tabSize.x/2.), Math.floor(tabSize.y/2.))];
	nextFruit();
	render();
	score = (snake.length-1);
	$("#score").text(formatScore(score));
	$("#start").prop("disabled", true);
	$("#gameover").css("color", "#63796b");
	dir = 'r';
	nextDir = 'r';
	level = 1;
	$("#level").text(level);
	setTimeout(move, speed/level);
}

/**
 * Форматировать счёт
 * @param value счёт
 * @return счёт в виде строки
 */
function formatScore (value) {
	var size = 6;
	str = value.toString();
	for (var i = 0; i < size-value.toString().length; i++) {
		str = "0"+str;
	}
	return str;
}

// метки инициализации
$("#hi-score").text(formatScore(hiscore));
$("#score").text(formatScore(score));
$("#level").text(level);

// прослушиватель событий движения
document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 38: if (dir != 'd') nextDir = 'u'; break;
		case 87: if (dir != 'd') nextDir = 'u'; break;
		case 40: if (dir != 'u') nextDir = 'd'; break;
		case 83: if (dir != 'u') nextDir = 'd'; break;
		case 39: if (dir != 'l') nextDir = 'r'; break;
		case 68: if (dir != 'l') nextDir = 'r'; break;
		case 37: if (dir != 'r') nextDir = 'l'; break;
		case 65: if (dir != 'r') nextDir = 'l'; break;
		default: break;
	}
});
