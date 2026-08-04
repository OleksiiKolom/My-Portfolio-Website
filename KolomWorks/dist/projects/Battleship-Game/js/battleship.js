//Об'єкт виду оновлює інформацію на ігровому полі
var view = {

    //Метод виводить повідомлення для користувача
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    //Метод додає влучання на ігрове поле
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    //Метод додає промах на ігрове поле
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


//В об'єкті моделі зберігається поточний стан гри
var model = {

    //Розмір сітки ігрового поля
    boardSize: 7,

    //Кількість кораблів у грі
    numShips: 3,

    //Кількість втоплених кораблів (на початку гри становить нуль)
    shipsSunk: 0,

    //Розмір кораблів (кількість клітин, що займає корабель)
    shipLength: 3,

    //Позиції кораблів і координати влучань
    ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] } ],
    
    //Метод генерує позиції для кораблів з кількістю кораблів,
    //визначеним властивістю numShips
    generateShipLocations: function() {
        var locations;

        //Для кожного корабля генерується набір позицій, тобто займаних клітин
        for (let i = 0; i < this.numShips; i++) {
            
            //Генеруємо новий набір позицій корабля
            do {
                locations = this.generateShip();
            }
            //Якщо є перекриття із другими кораблями, повторюємо генерацію позицій
            while (this.collision(locations));

            //Отримані позиції без перекриттів зберігаються у властивості locations
            this.ships[i].locations = locations;
        }
    },


    //Метод генерує координати корабля у довільному місці ігрового поля,
    //без врахування перекриття іншими кораблями
    generateShip: function () {

        //Генеруємо число 0 або 1 для змінної, що зберігає напрямок корабля
        var direction = Math.floor(Math.random() * 2);

        var row, col;

        //Генеруємо початкову позицію для горизонтального корабля
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        //Генеруємо початкову позицію для вертикального корабля
        else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        //Масив зберігає згенеровані координати корабля
        var newShipLocatios = [];

        for (var i = 0; i < this.shipLength; i++) {

            //Визначаємо позиції для горизонтального корабля
            if (direction == 1) {
                newShipLocatios.push(row + "" + (col + i));
            }

            //Визначаємо позиції для вертекального корабля
            else {
                newShipLocatios.push((row + i) + "" + col);
            }
        }

        //Коли всі позиції згенеровані метод вертає масив
        return newShipLocatios;
    },
    
    //Метод перевіряє чи не перекривається корабель із іншими кораблями
    collision: function (locations) {

        //Виконати для кожного корабля
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];

            //Виконати для кожної позиції корабля
            for (var j = 0; j < locations.length; j++) {

                //Якщо хоча б одна з позицій масива locations нового корабля
                //зустрічається із позицієй масива locations існуючого корабля
                //вернути true (перекриття є)
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }

        //Перекриття відсутні
        return false;
    },

    //Метод для виконання пострілу і перевірки результата (влучення чи промах)
    fire: function (guess) {

        //Цикл для перевірки кожного корабля
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            
            //Якщо є влучення
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");

                //Перевіряємо чи потоплен корабель після влучання
                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }

        //Якщо немає влучення
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    
    //Метод перевірає чи втоплений корабель
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {

            //Якщо хоч одна клітина корабля немає влучення,то корабель не втоплений
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
};


//Функція перевіряє введені координати на валідність і 
//повертає їх, якщо перевірка не пройдена, функція вертає null
//Також функція преоброзує координату літери на цифру
function parseGuess(guess) {

    //Масив координат літер, які є у грі (координати строк)
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    //Якщо координати порожні, а бо їх кількість не дорівнює двум 
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.")
    }

    //Перевіряємо на валідність введені координати
    else {

        //Перетворює букву на цифру і зберігає її (перша координата, координата строки)
        var row = alphabet.indexOf(guess.charAt(0));

        //Зберігає другу координату (координата стовпця)
        var column = guess.charAt(1);

        //Якщо хоча б одна з координат не є числом
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board!");
        }

        //Якщо хоча б одна з координат менше нуля, або більше за розмір ігрового поля
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        }

        //Якщо координати прошйли перевірку, функція вертаю строки із координатами
        else {
            return row + column;
        }
    }

    //Якщо координати не прошйли перевірку, функція вертаю null
    return null;
}

//Об'єкт контроллера зв'язує всі остальні компоненти,
//отримуючи координати пострілу (guess), 
//обробляя їх і передаю моделі 
var controller = {

    //Кількість пострілов
    guesses: 0,

    //Обработка координат пострілу і передача їх моделі.
    //Перевіряє умову завершення гри
    processGuess: function (guess) {

        //Зберігає вже валідні координати пострілу
        var location = parseGuess(guess);

        //Якщо координати валідні
        if (location) {
            this.guesses++;
            var hit = model.fire(location);

            //Якщо є влучання і кількість кораблів дорівнює кількості потоплених кораблів
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleShips, in " +
                    this.guesses + " guesses!");
            }
        }
    }
};

//Обробник кнопки Fire! отримує дані з форми та передає їх контролеру
function handleFireButton() {

    //Поле введення координат на HTML-сторінці
    var guessInput = document.getElementById("guessInput");

    //Отримаємо координати з поля, які ввів користувач
    var guess = guessInput.value;

    //Передаємо контролеру координати для їх обробку
    controller.processGuess(guess);

    //Після введення координат і передачі їх контролеру, 
    //видаляє поточні координати у полі для вводу наступних координат 
    guessInput.value = "";
}

//Обробник натискання клавіш; викликається при кожному натисканні клавіші у полі input сторінки
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");

    //Якщо користувач натиснув Enter - імітуємо натискання на кнопку Fire!
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

//Перша функція, що визивається программою.
//Функція визивається і чекає поки користувач не натисне кнопку Fire!.
//Після цього визиває обробник кнопки Fire!
function init() {

    //Спрацює коли користувач натисне кнопку Fire!.
    //Після цього визиває обробник
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    //При кожному натисканні клавіші у полі input визиваємо обробник,
    //який перевіряє, чи не натиснув Enter
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

//Після повної загрузки сторінки - визиваємо функцію init (запускаємо гру)
window.onload = init;