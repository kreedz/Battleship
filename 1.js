$().ready(function() {

	// существуют ли нетронутые палубы (true)
	function isShipsLife(a, n) {
		flag = false;
		for (var i = 0; i < n; ++i)
			for (var j = 0; j < n; ++j)
				if (a[i][j] == 1) flag = true;
		return flag;
	}

	// проверка на потопленность корабля
	// закрашиваем ячейки карты
	function isShipDead(a, td, whoCell, i, j, n) {
		// палуба корабля:
		// живая
		var SHIP_LIVE = 1,
			// повреждённая
			SHIP_HIT = 2,
			// потопленная
			SHIP_DEAD = 3,
			// произведён выстрел, но не был попадания
			NOT_HIT = 4;
	
		// если стрелям по тем местам, куда уже стреляли
		if (a[i][j] == NOT_HIT) return true;
		
		// если мимо
		if (a[i][j] == 0) {
			a[i][j] = NOT_HIT;
			td.css('background-image', 'url(1.gif)');
			return false;
		}
	
		// корабль ранили
		if (a[i][j] == SHIP_LIVE) {
			a[i][j] = SHIP_HIT;
			td.css('background', 'red');
		}
		
		// проверим однопалубный это корабль или нет
		// определяем поля вокруг корабля
		var topSide = 0;
		if (i) topSide = a[i - 1][j];
		
		var bottomSide = 0;
		if (i + 1 < n) bottomSide = a[i + 1][j];
		
		var leftSide = 0;
		if (j) leftSide = a[i][j - 1];
		
		var rightSide = 0;
		if (j + 1 < n) rightSide = a[i][j + 1];
		
		// если убит
		if (!topSide && !bottomSide && !leftSide && !rightSide) {
			a[i][j] = SHIP_DEAD;
			td.css('background', 'grey');
			return true;
		}

		
		// проверка многопалубного корабля
		// поиск начала корабля
		// ищем вверх
		var iBegin = i, jBegin = j, xBegin = i, yBegin = j, xEnd, yEnd;
		while (a[iBegin][jBegin] != 0) {
			if (a[iBegin][jBegin] == NOT_HIT) break;
			xBegin = iBegin;
			if (! iBegin) break;
			--iBegin;
		}
		
		// ищем влево
		iBegin = i, jBegin = j;
		while (a[iBegin][jBegin] != 0) {
			if (a[iBegin][jBegin] == NOT_HIT) break;
			yBegin = jBegin;
			if (! jBegin) break;
			--jBegin;
		}
		
		// поиск конца корабля
		// ищем вниз
		iEnd = i, jEnd = j, xEnd = i;
		while (a[iEnd][jEnd] != 0) {
			if (a[iEnd][jEnd] == NOT_HIT) break;
			xEnd = iEnd;
			if (iEnd == n - 1) break;
			++iEnd;
		}		
		
		// ищем вправо
		iEnd = i, jEnd = j, yEnd = j;
		while (a[iEnd][jEnd] != 0) {
			if (a[iEnd][jEnd] == NOT_HIT) break;
			yEnd = jEnd;
			if (jEnd == n - 1) break;
			++jEnd;
		}		
		
		// считаем раненые палубы корабля
		var countHeat = 0, shipLen = 0;
		if (yBegin == yEnd) {
			shipLen = xEnd - xBegin + 1;
			for (var k = xBegin; k <= xEnd; ++k)
				if (a[k][j] == SHIP_HIT)
					++countHeat;
		} else {
			shipLen = yEnd - yBegin + 1;
			for (var k = yBegin; k <= yEnd; ++k)
				if (a[i][k] == SHIP_HIT)
					++countHeat;
		}
		
		// если все палубы ранены, то корабль мёртв
		// внесём изменения в массив и в карту
		if (shipLen == countHeat) {
			if (yBegin == yEnd) {
				for (var k = xBegin; k <= xEnd; ++k) {
					a[k][j] = SHIP_DEAD;
					td = $(document.getElementById(whoCell + k + '' + j));
					td.css('background', 'grey');
				}
				return true;
			} else {
				for (var k = yBegin; k <= yEnd; ++k){
					a[i][k] = SHIP_DEAD;
					td = $(document.getElementById(whoCell + i + '' + k));
					td.css('background', 'grey');
				}
				return true;
			}
		}
		
		// если ранен
		if (a[i][j] == SHIP_HIT) return true;
		
	}
	
	function getRandAndFreeField(ships) {
		var manShips = ships,
			i, j;
		while (true) {
			var x = Math.floor(Math.random() * n),
				y = Math.floor(Math.random() * n);
			// если выбранная координата не раненая палуба и не убитый корабль и не координата, в которую стреляли ранее
			if (manShips[0][x][y] != 2 && manShips[0][x][y] != 3 && manShips[0][x][y] != 4) {
				i = x;
				j = y;
				break;
			}
		}

		return [i, j];
	}
	
	function compStep(ships) {
		var t = getRandAndFreeField(manShips),
			i = t[0],
			j = t[1];
		td = $(document.getElementById('cellMan' + i + '' + j));

		while (isShipDead(manShips[0], td, "cellMan", i, j, n)) {
			t = getRandAndFreeField(manShips);
			i = t[0];
			j = t[1];
			td = $(document.getElementById('cellMan' + i + '' + j));
		};
	}
	
	function getParam(a) {
		get = a;
		l = get.length;
		x = get.indexOf('?');
		get = get.substr(x + 5, l - x + 5);
		if (get == '') get = "Player";
		return get;
}

	var log = new Array(10),
		global = 0;
	init(log, 10);
	
	function init(a, n) {
		for (var i = 0; i < n; ++i) {
			a[i] = new Array(n);
			for (var j = 0; j < n; ++j)
				a[i][j] = 0;
		}
	}

	// поворот против (k = 1), по (k = 0)
	function rotate(a, n, k) {
		var c = new Array(n);
		init(c, n);
		if (k)
			// против
			for (var i = 0; i < n; ++i)
				for (var j = 0; j < n; ++j)
					c[i][j] = a[j][n - i - 1];
		else
			// по
			for (var i = 0; i < n; ++i)
				for (var j = 0; j < n; ++j)
					c[i][j] = a[n - j - 1][i];
		return c;
	}
 
	
	function insertShipInMap(ship, full, vertical, i, n, isRotate) {
		ship[i][vertical] = 1;
		full[i][vertical] = 1;
		// запретные зоны для строительства вокруг корабля
		// если корабль не у левого края, то
		if (vertical)
			full[i][vertical - 1] = 1;
		// если корабль не у правого края, то
		if (vertical != n - 1)
			full[i][vertical + 1] = 1;
	}	
	
	function isFreeFields(ship, full, count, k, begin, vertical, i, n, isRotate) {				
		var isFree = true;
		for (var j = begin; j < count[k] + begin; ++j) 
			if (full[j][vertical]) isFree = false;
		if (isFree) {	
			var marker = false;
			
			// для однопалубных
			if (k > 5) 
				marker = true;
			// для остальных требуется проверка
			else {
				// определям углы
				var leftUpCorner = 0;
				if (vertical && begin) leftUpCorner = full[begin - 1][vertical - 1];
				
				var leftDownCorner = 0;
				if (vertical && (begin + count[k] - 1 != n - 1)) leftDownCorner = full[begin + count[k]][vertical - 1];
				
				var rightUpCorner = 0;
				if (begin && (vertical != n - 1)) rightUpCorner = full[begin - 1][vertical + 1];
				
				var rightDownCorner = 0;
				if ((vertical != n - 1) && (begin + count[k] - 1 != n - 1)) rightDownCorner = full[begin + count[k]][vertical + 1];
				
				// определяем поля за и перед кораблём
				var topSide = 0;
				if (begin) topSide = full[begin - 1][vertical];
				
				var bottomSide = 0;
				if (begin + count[k] - 1 != n - 1) bottomSide = full[begin + count[k]][vertical];
				
				// если углы корабля не в запретной зоне для строительства:
				// если корабль у левого края и два правых угла (верхний и нижний) и две стороны за кораблём (верх. и нижн.) свободны, то
				if (
					!rightUpCorner && !rightDownCorner && !topSide && !bottomSide
				) marker = true;
				// если у правого края и два левых угла (верхний и нижний) и две стороны за кораблём (верх. и нижн.) свободны, то
				if (
					!marker && (vertical == (n - 1)) && begin && (begin + count[k] - 1 != n - 1)
					&& !leftUpCorner && !leftDownCorner
					&& !topSide && !bottomSide
				) marker = true;
				// если у верха и два нижних угла и нижн. поле за кораблём свободны, то
				if (
					!marker && !begin 
					&& !leftDownCorner
					&& !rightDownCorner
					&& !bottomSide
				) marker = true;
				// если у низа и два верхних угла и верх. поле за кораблём свободны, то
				if (
					!marker && (begin + count[k] - 1) == (n - 1) 
					&& !leftUpCorner 
					&& !rightUpCorner
					&& !topSide
				) marker = true;
				// если корабль в верхнем левом углу и правый нижний угол и нижн. поле за кораблём свободны, то
				if (
					!marker && !begin && !vertical 
					&& !rightDownCorner
					&& !bottomSide
				) marker = true;
				// если в верхнем правом углу и левый нижний угол и нижн. поле за кораблём свободны, то
				if (
					!marker && !begin && (vertical == n - 1) 
					&& !leftDownCorner
					&& !bottomSide
				) marker = true;
				// если в нижнем левом углу и правый верхний угол и верхн. поле за кораблём свободны, то
				if (
					!marker && (begin + count[k] - 1 == n - 1) && !vertical
					&& !rightUpCorner
					&& !topSide
				) marker = true;
				// если в нижнем правом углу и левый верхний угол и верхн. поле за кораблём свободны, то
				if (
					!marker && (begin + count[k] - 1 == n - 1) && (vertical == n - 1) 
					&& !leftUpCorner
					&& !topSide
				) marker = true;
				// если корабль не касается ни одного края карты и все четыре угла и верхн. и нижн. поля за кораблём свободны, то
				if (
					!marker && begin && vertical && (begin + count[k] - 1 != n - 1) && (vertical != n - 1)
					&& !leftUpCorner && !rightUpCorner && !leftUpCorner
					&& !leftDownCorner
					&& !topSide
					&& !bottomSide
				) marker = true;
			}
			
			if (marker) {
				if (isFree) {
					for (var j = begin; j < count[k] + begin; ++j)
						insertShipInMap(ship, full, vertical, j, n, isRotate);
						
					// запретные зоны для строительства вокруг корабля:
					// если корабль не у верха, то
					if (begin)
						full[begin - 1][vertical] = 1;
					// если корабль не у низа, то
					if ((count[k] + begin - 1) != (n - 1))
						full[count[k] + begin][vertical] = 1;
						
					// если не у левого края и не у верха, то
					if (vertical && begin)
						full[begin - 1][vertical - 1] = 1;
					// если не у правого края и не у верха, то
					if (vertical != (n - 1) && begin)
						full[begin - 1][vertical + 1] = 1;
					// если не у левого края и не у низа, то
					if (vertical && ((begin + count[k] - 1) != (n - 1)))
						full[begin + count[k]][vertical - 1] = 1;
					// если не у правого края и не у низа, то
					if ((vertical != (n - 1)) && ((begin + count[k] - 1) != (n - 1)))
						full[begin + count[k]][vertical + 1] = 1;
					//++k[0];
					//flag[0] = 0;
					return 1;
				}
			}
		}
		return 0;
	}	
	 
	function createShipMap(ship1, full1) {
			// палубы кораблей
			var count = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 0],
				// итератор для прохода по массиву count
				k = [0],
				// флаг: исходная матрица (0) или повёрнутая (1)
				isRotate = false;
			
			// инициализируем нулями созданные карты
			init(ship1, n);
			init(full1, n);
			
			while (count[k]) {
				// выбрать случайно вид корабля: горизонтальный (0) или вертикальный (1)
				var position = Math.floor(Math.random() * 2),
					horizontal = -1,
					vertical = -1;
				
				if (position) 
					vertical = Math.floor(Math.random() * n);
				else
					horizontal = Math.floor(Math.random() * n);
				
				var endOfBegin = n - count[k],
					begin = Math.floor(Math.random() * (endOfBegin + 1)),
					isBuild = 0;

				// поиск места сверху вниз для постройки count[k]-палубного корабля
				for (var i = begin; i <= endOfBegin; ++i) {
					// если вертикальный корабль
					if (position) {
						if (isRotate) {
							ship1 = rotate(ship1, n, isRotate);
							full1 = rotate(full1, n, isRotate);
							isRotate = !isRotate;
						}
						if (isFreeFields(ship1, full1, count, k, begin, vertical, i, n, isRotate)) {
							++k[0];
							break;
						}
					// если горизонтальный корабль
					} else {
						//повернуть все матрицы и вызвать функцию, в которой будет предыдущий блок кода
						if (!isRotate) {
							ship1 = rotate(ship1, n, isRotate);
							full1 = rotate(full1, n, isRotate);
							isRotate = !isRotate;
						}
						if (isFreeFields(ship1, full1, count, k, begin, horizontal, i, n, isRotate)) {
							++k[0];
							break;
						}
					}
				}
			}
		return [ship1, full1];
	}
	
	// размерность карты
	var n = 10,
		// карта кораблей игрока и компьютера
		ship1 = new Array(n),
		ship2 = new Array(n),
		// карта недоступных мест для создания кораблей игрока и компьютера
		full1 = new Array(n),
		full2 = new Array(n);
	 
	// создаём корабли для игрока и компьютера
	var manShips = createShipMap(ship1, full1),
		compShips = createShipMap(ship2, full2);
	
	// получаем параметр и встраиваем его в HTML-код
	s = window.location.href;
	s = getParam(s);
	s = decodeURI(s);
	document.getElementById('manName').innerHTML = s;
	
	// показываем корабли человека
	for (var i = 0; i < n; ++i) 
		for (var j = 0; j < n; ++j)
			if (manShips[0][i][j] == 1) {
				var td = $(document.getElementById('cellMan' + i + '' + j)); 
				td.css('background', 'green'); 
			}
	
	// существуют ли нетронутые палубы
	var shipManLife = isShipsLife(manShips[0], n),
		shipCompLife = isShipsLife(compShips[0], n),
		// первый ход совершат случайная сторона, 1 - человек, 0 - компьютер
		whoFirst = Math.floor(Math.random() * 2);
	if (!whoFirst) compStep(compShips[0]);
	
	// выстрелы по карте игроком и компьютером
	// изменения в карте и в массиве координат кораблей
	var cellCompClass = '.tcellComp';
	$(cellCompClass).click(function(e) {
		var td = $(e.target),
			// вытащим число ячейки
			regExp = /(\d+)$/g,
			arrExp = regExp.exec(td.attr('id')),
			idTd = arrExp[1];
		
		// если есть нетронутые корабли
		if (shipManLife && shipCompLife) {
			var i = parseInt(idTd[0], 10),
				j = parseInt(idTd[1], 10);
			
			// меняем цвет палуб на карте и данные в массиве
			// запрещаем нажатие на карте компьютера если был промах
			if (! isShipDead(compShips[0], td, "cellComp", i, j, n)) {
				cellCompClass = '';
				// ответные действия компьютера
				compStep(compShips[0]);
				cellCompClass = '.tcellComp';
			}
		
			shipManLife = isShipsLife(manShips[0], n);
			shipCompLife = isShipsLife(compShips[0], n);
		} else
			if (shipManLife)
				alert(s + " won!");
			else
				alert("Computer won!")
	});
});
