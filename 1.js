$().ready(function() {

	// ���������� �� ���������� ������ (true)
	function isShipsLife(a, n) {
		flag = false;
		for (var i = 0; i < n; ++i)
			for (var j = 0; j < n; ++j)
				if (a[i][j] == 1) flag = true;
		return flag;
	}

	// �������� �� ������������� �������
	// ����������� ������ �����
	function isShipDead(a, td, whoCell, i, j, n) {
		// ������ �������:
		// �����
		var SHIP_LIVE = 1
		// �����������
		var SHIP_HIT = 2
		// �����������
		var SHIP_DEAD = 3
		// ��������� �������, �� �� ��� ���������
		var NOT_HIT = 4;
	
		// ���� ������� �� ��� ������, ���� ��� ��������
		if (a[i][j] == NOT_HIT) return true;
		
		// ���� ����
		if (a[i][j] == 0) {
			a[i][j] = NOT_HIT;
			td.css('background-image', 'url(1.gif)');
			return false;
		}	
	
		// ������� ������
		if (a[i][j] == SHIP_LIVE) {
			a[i][j] = SHIP_HIT;
			td.css('background', 'red'); 
		}
		
		// �������� ������������ ��� ������� ��� ���	
		// ���������� ���� ������ �������
		var topSide = 0;
		if (i) topSide = a[i - 1][j];
		
		var bottomSide = 0;
		if (i + 1 < n) bottomSide = a[i + 1][j];
		
		var leftSide = 0;
		if (j) leftSide = a[i][j - 1];
		
		var rightSide = 0;
		if (j + 1 < n) rightSide = a[i][j + 1];
		
		// ���� ����
		if (!topSide && !bottomSide && !leftSide && !rightSide) {
			a[i][j] = SHIP_DEAD;
			td.css('background', 'grey'); 
			return true;
		}	

		
		// �������� �������������� �������
		// ����� ������ �������
		// ���� �����
		var iBegin = i, jBegin = j, xBegin = i, yBegin = j, xEnd, yEnd;
		while (a[iBegin][jBegin] != 0) {
			if (a[iBegin][jBegin] == NOT_HIT) break;
			xBegin = iBegin;
			if (! iBegin) break;
			--iBegin;
		}
		
		// ���� �����
		iBegin = i, jBegin = j;
		while (a[iBegin][jBegin] != 0) {
			if (a[iBegin][jBegin] == NOT_HIT) break;
			yBegin = jBegin;
			if (! jBegin) break;
			--jBegin;
		}
		
		// ����� ����� �������
		// ���� ����
		iEnd = i, jEnd = j, xEnd = i;
		while (a[iEnd][jEnd] != 0) {
			if (a[iEnd][jEnd] == NOT_HIT) break;
			xEnd = iEnd;
			if (iEnd == n - 1) break;
			++iEnd;
		}		
		
		// ���� ������
		iEnd = i, jEnd = j, yEnd = j;
		while (a[iEnd][jEnd] != 0) {
			if (a[iEnd][jEnd] == NOT_HIT) break;
			yEnd = jEnd;
			if (jEnd == n - 1) break;
			++jEnd;
		}		
		
		// ������� ������� ������ �������
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
		
		// ���� ��� ������ ������, �� ������� ����
		// ����� ��������� � ������ � � �����
		if (shipLen == countHeat) {
			if (yBegin == yEnd) {
				for (var k = xBegin; k <= xEnd; ++k) {
					a[k][j] = SHIP_DEAD;
					td = $(document.getElementById(whoCell + k + '' + j)); 
					td.css('background', 'grey'); 
				}
				return true;
			} else {
				for (var k = yBegin; k <= yEnd; ++k) {
					a[i][k] = SHIP_DEAD;
					td = $(document.getElementById(whoCell + i + '' + k)); 
					td.css('background', 'grey'); 
				}		
				return true;
			}			
		}
		
		// ���� �����
		if (a[i][j] == SHIP_HIT) return true;
		
	}
	
	function getRandAndFreeField(ships) {
		var manShips = ships
		var i, j;
		while (true) {
			var x = Math.floor(Math.random() * n);
			var y= Math.floor(Math.random() * n);
			// ���� ��������� ���������� �� ������� ������ � �� ������ ������� � �� ����������, � ������� �������� �����
			if (manShips[0][x][y] != 2 && manShips[0][x][y] != 3 && manShips[0][x][y] != 4) {
				i = x;
				j = y;
				break;
			}
		}

		return [i, j];
	}
	
	function compStep(ships) {
		var t = getRandAndFreeField(manShips);
		var i = t[0];
		var j = t[1];
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
		if (get == '') get = "�������";
        return get;
}

	var log = new Array(10);
	init(log, 10);
	var global = 0;
	
	function init(a, n) {
		for (var i = 0; i < n; ++i) {
			a[i] = new Array(n);
			for (var j = 0; j < n; ++j)
				a[i][j] = 0;
		}
	}

	// ������� ������ (k = 1), �� (k = 0)
	function rotate(a, n, k) {
        var c = new Array(n);
        init(c, n);     
		if (k)
			// ������
			for (var i = 0; i < n; ++i)
				for (var j = 0; j < n; ++j)
					c[i][j] = a[j][n - i - 1];        
		else
			// ��
			for (var i = 0; i < n; ++i)
				for (var j = 0; j < n; ++j)
					c[i][j] = a[n - j - 1][i];		
        return c;
	}
 
	
	function insertShipInMap(ship, full, vertical, i, n, isRotate) {	
		ship[i][vertical] = 1;
		full[i][vertical] = 1;
		// ��������� ���� ��� ������������� ������ �������
		// ���� ������� �� � ������ ����, ��
		if (vertical)
			full[i][vertical - 1] = 1;
		// ���� ������� �� � ������� ����, ��
		if (vertical != n - 1)
			full[i][vertical + 1] = 1;
	}	
	
	function isFreeFields(ship, full, count, k, begin, vertical, i, n, isRotate) {				
		var isFree = true;
		for (var j = begin; j < count[k] + begin; ++j) 
			if (full[j][vertical]) isFree = false;
		if (isFree) {	
			var marker = false;
			
			// ��� ������������
			if (k > 5) 
				marker = true;
			// ��� ��������� ��������� ��������
			else {
				// ��������� ����
				var leftUpCorner = 0;
				if (vertical && begin) leftUpCorner = full[begin - 1][vertical - 1];
				
				var leftDownCorner = 0;
				if (vertical && (begin + count[k] - 1 != n - 1)) leftDownCorner = full[begin + count[k]][vertical - 1];
				
				var rightUpCorner = 0;
				if (begin && (vertical != n - 1)) rightUpCorner = full[begin - 1][vertical + 1];
				
				var rightDownCorner = 0;
				if ((vertical != n - 1) && (begin + count[k] - 1 != n - 1)) rightDownCorner = full[begin + count[k]][vertical + 1];
				
				// ���������� ���� �� � ����� �������
				var topSide = 0;
				if (begin) topSide = full[begin - 1][vertical];
				
				var bottomSide = 0;
				if (begin + count[k] - 1 != n - 1) bottomSide = full[begin + count[k]][vertical];
				
				// ���� ���� ������� �� � ��������� ���� ��� �������������:
				// ���� ������� � ������ ���� � ��� ������ ���� (������� � ������) � ��� ������� �� ������� (����. � ����.) ��������, ��
				if (
					!rightUpCorner && !rightDownCorner && !topSide && !bottomSide
				) marker = true;
				// ���� � ������� ���� � ��� ����� ���� (������� � ������) � ��� ������� �� ������� (����. � ����.) ��������, ��
				if (
					!marker && (vertical == (n - 1)) && begin && (begin + count[k] - 1 != n - 1)
					&& !leftUpCorner && !leftDownCorner
					&& !topSide && !bottomSide
				) marker = true;
				// ���� � ����� � ��� ������ ���� � ����. ���� �� ������� ��������, ��
				if (
					!marker && !begin 
					&& !leftDownCorner
					&& !rightDownCorner
					&& !bottomSide
				) marker = true;
				// ���� � ���� � ��� ������� ���� � ����. ���� �� ������� ��������, ��
				if (
					!marker && (begin + count[k] - 1) == (n - 1) 
					&& !leftUpCorner 
					&& !rightUpCorner
					&& !topSide
				) marker = true;
				// ���� ������� � ������� ����� ���� � ������ ������ ���� � ����. ���� �� ������� ��������, ��
				if (
					!marker && !begin && !vertical 
					&& !rightDownCorner
					&& !bottomSide
				) marker = true;
				// ���� � ������� ������ ���� � ����� ������ ���� � ����. ���� �� ������� ��������, ��
				if (
					!marker && !begin && (vertical == n - 1) 
					&& !leftDownCorner
					&& !bottomSide
				) marker = true;
				// ���� � ������ ����� ���� � ������ ������� ���� � �����. ���� �� ������� ��������, ��
				if (
					!marker && (begin + count[k] - 1 == n - 1) && !vertical
					&& !rightUpCorner
					&& !topSide
				) marker = true;
				// ���� � ������ ������ ���� � ����� ������� ���� � �����. ���� �� ������� ��������, ��
				if (
					!marker && (begin + count[k] - 1 == n - 1) && (vertical == n - 1) 
					&& !leftUpCorner
					&& !topSide
				) marker = true;
				// ���� ������� �� �������� �� ������ ���� ����� � ��� ������ ���� � �����. � ����. ���� �� ������� ��������, ��
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
						
					// ��������� ���� ��� ������������� ������ �������:
					// ���� ������� �� � �����, ��
					if (begin)
						full[begin - 1][vertical] = 1;
					// ���� ������� �� � ����, ��
					if ((count[k] + begin - 1) != (n - 1))
						full[count[k] + begin][vertical] = 1;
						
					// ���� �� � ������ ���� � �� � �����, ��
					if (vertical && begin)
						full[begin - 1][vertical - 1] = 1;
					// ���� �� � ������� ���� � �� � �����, ��
					if (vertical != (n - 1) && begin)
						full[begin - 1][vertical + 1] = 1;
					// ���� �� � ������ ���� � �� � ����, ��
					if (vertical && ((begin + count[k] - 1) != (n - 1)))
						full[begin + count[k]][vertical - 1] = 1;
					// ���� �� � ������� ���� � �� � ����, ��
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
			// ������ ��������
			 var count = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 0];
			// �������� ��� ������� �� ������� count
			 var k = [0];
			 // ����: �������� ������� (0) ��� ��������� (1)
			 var isRotate = false;
			 
			 // �������������� ������ ��������� �����
			init(ship1, n);
			init(full1, n);
			
			while (count[k]) {
				// ������� �������� ��� �������: �������������� (0) ��� ������������ (1)
				 var position = Math.floor(Math.random() * 2);
				 // var position = 0;
				 var horizontal = -1;
				 var vertical = -1;
				
				if (position) 
					vertical = Math.floor(Math.random() * n);
				else
					horizontal = Math.floor(Math.random() * n);
				
				var endOfBegin = n - count[k];

				var begin = Math.floor(Math.random() * (endOfBegin + 1));
				var isBuild = 0;

				// ����� ����� ������ ���� ��� ��������� count[k]-��������� �������
				for (var i = begin; i <= endOfBegin; ++i) {
					// ���� ������������ �������
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
					// ���� �������������� �������
					} else {
						//��������� ��� ������� � ������� �������, � ������� ����� ���������� ���� ����
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
	 
	 
	 // ����������� �����
	 var n = 10;
	 // ����� �������� ������ � ����������
	 var ship1 = new Array(n);
	 var ship2 = new Array(n);
	 // ����� ����������� ���� ��� �������� �������� ������ � ����������
	 var full1 = new Array(n);
	 var full2 = new Array(n);	 
	 
	// ������ ������� ��� ������ � ����������
	var manShips = createShipMap(ship1, full1);
	var compShips = createShipMap(ship2, full2);
	
	// �������� �������� � ���������� ��� � HTML-���
	s = window.location.href;
	s = getParam(s);
	s = decodeURI(s);
	document.getElementById('manName').innerHTML = s;
	
	// ���������� ������� ��������
	for (var i = 0; i < n; ++i) 
		for (var j = 0; j < n; ++j)
			if (manShips[0][i][j] == 1) {
				var td = $(document.getElementById('cellMan' + i + '' + j)); 
				td.css('background', 'green'); 
			}
	
	// ���������� �� ���������� ������
	var shipManLife = isShipsLife(manShips[0], n), shipCompLife = isShipsLife(compShips[0], n);
	
	// ������ ��� �������� ��������� �������, 1 - �������, 0 - ���������
	var whoFirst = Math.floor(Math.random() * 2);
	if (!whoFirst) compStep(compShips[0]);
	
	// �������� �� ����� ������� � �����������
	// ��������� � ����� � � ������� ��������� ��������
	var cellCompClass = '.tcellComp';
	$(cellCompClass).click(function(e) { 		
		var td = $(e.target);
		
		// ������� ����� ������
		var regExp = /(\d+)$/g;
		var arrExp = regExp.exec(td.attr('id'));
		var idTd = arrExp[1];
		
		// ���� ���� ���������� �������
		if (shipManLife && shipCompLife) {
			var i = parseInt(idTd[0], 10);
			var j = parseInt(idTd[1], 10);
			
			// ������ ���� ����� �� ����� � ������ � �������
			// ��������� ������� �� ����� ���������� ���� ��� ������
			if (! isShipDead(compShips[0], td, "cellComp", i, j, n)) {
				cellCompClass = '';
				// �������� �������� ����������
				compStep(compShips[0]);
				cellCompClass = '.tcellComp';
			}
		
			shipManLife = isShipsLife(manShips[0], n);
			shipCompLife = isShipsLife(compShips[0], n);
		} else 
			if (shipManLife)
				alert(s + " �������!");
			else
				alert("��������� �������!")
					
	});				
});