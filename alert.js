'use strict'
let allBlock = true

let firstNewStart = false

let isNewStart = false

let counterNitroSmash = false

let preTurn
let stop = false

let turn = null
let coordinate = []

let preX
let preY

let w = true //повороты
let d = true //повороты
let a = true //повороты
let s = true //повороты

let w2 = false
let d2 = false
let a2 = false
let s2 = false

let modesCounter = 0
let complicationCounter = 0

let selectedMode = 'Wall - stop barrier'
let valueSpeed = 150

let counterF = false
let turnF = null

let counterShift = false
let turnShift = null

let ravageNitro //опустошение кнопки турбо 
let fillNitro //наполнение кнопки турбо
let counterFillColorNitro = 1

let ravageTime //опустошение кнопки время 
let fillTime //наполнение кнопки время
let counterFillColorTime = 0

let counterLanguage = false

class Snake {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.newSquare;

        this.textGameOver = document.querySelector('.game-over')
        this.gameContinueRecords = document.querySelector('.container-of-record')
        this.gameOverRecords = document.querySelector('.container-of-record__for-end')

        this.textRecords = document.querySelectorAll('.text-record')

        this.counterRecords = 0

        this.firstSquare = document.querySelector('.square');
        this.allNewSquare = Array.from(document.querySelectorAll('.newSquare'));

        this.buttonRight = document.querySelector('.right');
        this.buttonLeft = document.querySelector('.left');
        this.buttonDown = document.querySelector('.down');
        this.buttonStop = document.querySelector('.stop');
        this.buttonNitro = document.querySelector('.nitro');
        this.buttonTime = document.querySelector('.time');
        this.buttonLanguage = document.querySelector('.language');

        this.startCenterCircle = document.querySelector('.center-circle')

        this.buttonStopText = document.querySelector('.stopText');
        this.buttonUp = document.querySelector('.up');
        this.menu = document.querySelector('.menu')
        this.moveRight;
        this.moveLeft;
        this.moveDown;
        this.moveUp;

        this.speed = valueSpeed;

        this.complicationMenuItems = ['Easy', 'Normal', 'Hard', 'Back']
        this.mainMenuItems = ['New start', 'Modes', 'Complication']
        this.inGameMenuItems = ['Continue', 'Restart', 'Exit to main menu']
        this.modesMenuItems = ['Wall - stop barrier', 'Wall - mortal barrier', 'Wall - portal', 'Back']
        this.deathMenu = ['Restart', 'Exit to main menu']

        this.anyMenuItems = []

        this.unblockTurn = function (event) { //функция разблокирывает нажатия клавиш в игре

            if (!firstNewStart) return

            if (allBlock) return //пока не нажата стартовая Space,все клавиши не будут работать

            if (stop) return // если поставлена пауза в игре, то все клавиши не работают //
            this.menu.classList.add('normalTimeSvg')
            //up
            if (event.code == 'KeyW' || event.code == 'ArrowUp') {
                snake.buttonUp.classList.add('active')
                snake.up()
            }

            snake.buttonUp.addEventListener('transitionend', () => {
                snake.buttonUp.classList.remove('active')
            }, {
                once: true
            })
            //up

            //right
            if (event.code == 'KeyD' || event.code == 'ArrowRight') {
                snake.buttonRight.classList.add('active')
                snake.right()
            }

            snake.buttonRight.addEventListener('transitionend', () => {
                snake.buttonRight.classList.remove('active')
            }, {
                once: true
            })
            //right

            //down
            if (event.code == 'KeyS' || event.code == 'ArrowDown') {
                snake.buttonDown.classList.add('active')
                snake.down()
            }

            snake.buttonDown.addEventListener('transitionend', () => {
                snake.buttonDown.classList.remove('active')
            }, {
                once: true
            })
            //down

            //left
            if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
                console.log(turn)
                snake.buttonLeft.classList.add('active')
                snake.left()
            }

            snake.buttonLeft.addEventListener('transitionend', () => {
                snake.buttonLeft.classList.remove('active')
            }, {
                once: true
            })
            //left

            //space
            if (event.code == 'Space') {

                if (allBlock) return //пока не нажата стартовая Space,все клавиши не будут работать

                snake.buttonStop.classList.add('active')

                if (!isNewStart) snake.renderItemsMenu(snake.mainMenuItems) //при нажатии паузы в игре, рендерется уникальный список меню, при самой игре
                if (isNewStart) snake.renderItemsMenu(snake.inGameMenuItems) //при нажатии паузы в игре, рендерется уникальный список меню, при самой игре

                snake.menu.classList.add('active')

                if (snake.buttonStopText.innerHTML == 'Stop Game (Space)' && counterLanguage === false) {

                    snake.buttonStopText.innerHTML = 'Select (Space)'

                    snake.stop()

                } else if (snake.buttonStopText.innerHTML == 'Select (Space)' && counterLanguage === false) snake.buttonStopText.innerHTML = 'Stop Game (Space)'

                if (snake.buttonStopText.innerHTML == 'Стоп игра (Space)' && counterLanguage === true) {

                    snake.buttonStopText.innerHTML = 'Выбрать (Space)'

                    snake.stop()

                } else if (snake.buttonStopText.innerHTML == 'Выбрать (Space)' && counterLanguage === true) snake.buttonStopText.innerHTML = 'Стоп игра (Space)'

                if (!stop) {
                    stop = true
                    return
                }

                stop = false

                this.continueMove()
            }
            //space

            //Nitro
            if (event.code == 'KeyF') {

                if (counterF === true) return
                counterF = true
                snake.buttonNitro.classList.add('active')
                snake.nitro()

                counterFillColorNitro = 1
                let moveDown
                let moveUp

                ravageNitro = function () {
                    turnF = 'ravageNitro'
                    moveDown = setInterval(() => {

                        document.querySelector('.background-nitro').style.transform = `scaleY(${counterFillColorNitro})`
                        counterFillColorNitro = counterFillColorNitro - 0.001
                        if (counterFillColorNitro <= 0) {
                            counterFillColorNitro = 0
                            clearInterval(moveDown)
                            snake.stopNitro()
                            fillNitro()
                        }

                        if (stop) {
                            clearInterval(moveDown)
                            return
                        }

                    }, 5)

                }

                fillNitro = function () {
                    turnF = 'fillNitro'
                    moveUp = setInterval(() => {
                        counterFillColorNitro = counterFillColorNitro + 0.001
                        document.querySelector('.background-nitro').style.transform = `scaleY(${counterFillColorNitro})`
                        if (counterFillColorNitro >= 1) {
                            counterFillColorNitro = 1
                            clearInterval(moveUp)
                            snake.buttonNitro.classList.remove('active')
                            counterF = false

                            return
                        }

                        if (stop) {
                            clearInterval(moveUp)
                            return
                        }
                    }, 5)
                }

                ravageNitro()
            }
            //Nitro

            //Time
            if (event.code == 'ShiftLeft') {

                if (counterFillColorTime < 1) return

                snake.buttonTime.classList.add('active')
                snake.timeStart()

                let moveDown

                ravageTime = function () {
                    turnShift = 'ravageTime'
                    moveDown = setInterval(() => {

                        document.querySelector('.background-time').style.transform = `scaleY(${counterFillColorTime})`
                        counterFillColorTime = counterFillColorTime - 0.001
                        if (counterFillColorTime <= 0) {
                            counterFillColorTime = 0
                            clearInterval(moveDown)
                            snake.timeStop()
                            snake.timeFirstFill()
                        }

                        if (stop) {
                            clearInterval(moveDown)
                            return
                        }

                    }, 10)

                }

                ravageTime()
            }
            //Time
        }

        //продолжение движения после паузы
        this.continueMove = function () {

            if (turnF === 'ravageNitro') ravageNitro() //опустошение кнопки F
            if (turnF === 'fillNitro') fillNitro() //заполнение кнопки F

            if (turnShift === 'ravageTime') ravageTime() //опустошение кнопки F
            if (turnShift === 'fillTime') snake.timeFirstFill() //заполнение кнопки F

            //стоя у стенки запрещать движение назад после кнопки "Продолжить"
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (this.x + this.firstSquare.offsetWidth >= document.body.offsetWidth - this.firstSquare.offsetWidth && (turn != 'press down' && turn != 'press up' && turn != 'press left')) return
                if (this.x <= 0 && (turn != 'press down' && turn != 'press up' && turn != 'press right')) return
                if (this.y + this.firstSquare.offsetHeight >= document.body.offsetHeight - this.firstSquare.clientTop && (turn != 'press left' && turn != 'press right' && turn != 'press up')) return
                if (this.y <= 0 && (turn != 'press left' && turn != 'press right' && turn != 'press down')) return
            }
            //стоя у стенки запрещать движение назад после кнопки "Продолжить"

            if (turn == 'press right') {
                turn = null
                snake.right()
            } else if (turn == 'press left') {
                turn = null
                snake.left()
            } else if (turn == 'press down') {
                turn = null
                snake.down()
            } else if (turn == 'press up') {
                turn = null
                snake.up()
            }
        }
        //продолжение движения после паузы

        this.renderItemsMenu = function (arr) {

            this.menu.innerHTML = ''
            snake.anyMenuItems = []

            arr.forEach((element, ind) => {
                let div = document.createElement('li');
                div.className = 'menu-item'

                if (ind === 0) div.className = 'menu-item active'

                div.innerHTML = `${element}`;

                if (div.innerHTML === 'Wall - stop barrier' || div.innerHTML === 'Wall - mortal barrier' || div.innerHTML === 'Wall - portal') div.className = 'menu-item modes'

                if (ind === 0 && div.innerHTML === 'Wall - stop barrier') div.className = 'menu-item active modes'

                if (div.innerHTML === 'Easy' || div.innerHTML === 'Normal' || div.innerHTML === 'Hard') div.className = 'menu-item complication'

                if (ind === 0 && div.innerHTML === 'Easy') div.className = 'menu-item active complication'

                this.menu.append(div)

                if (counterLanguage) snake.language()

                this.anyMenuItems.push(div)
            });
        }

        this.switchItemsMenu = function (turn) {

            for (let i = 0; i <= this.anyMenuItems.length; i++) {

                if (this.anyMenuItems[i].classList.contains('active')) {

                    if (turn === 'up') {
                        if (i == 0) return
                        this.anyMenuItems[i - 1].classList.add('active')
                    }

                    if (turn === 'down') {
                        if (i + 1 == this.anyMenuItems.length) return
                        this.anyMenuItems[i + 1].classList.add('active')
                    }

                    this.anyMenuItems[i].classList.remove('active')
                    return
                }
            }
        }

        this.getRandomInRange = function (min, max) {
            for (;;) {
                let numb = Math.floor(Math.random() * (max - min + 1) + min)
                if (numb % this.firstSquare.offsetWidth === 0 && numb % this.firstSquare.offsetHeight === 0) return numb
                else continue
            }
        }

        this.createNewSquare = function () {
            outer: for (;;) {
                this.newSquare = document.createElement('span')
                this.newSquare.className = 'newSquare'

                const maxByWidth = body.offsetWidth - this.firstSquare.offsetWidth - body.clientLeft * 2
                const maxByHeight = body.offsetHeight - this.firstSquare.offsetHeight - this.firstSquare.clientTop

                const coordinateNewSquare = `translate(${this.getRandomInRange(0, maxByWidth)}px, ${this.getRandomInRange(0, maxByHeight)}px)`

                for (let key of this.allNewSquare) {
                    if (key.style.transform === coordinateNewSquare || coordinateNewSquare === this.firstSquare.style.transform) {
                        continue outer
                    }
                }

                this.newSquare.style.transform = coordinateNewSquare
                body.prepend(this.newSquare)
                return
            }
        }

        this.eatingCube = function () {
            if (this.firstSquare.getBoundingClientRect().left == this.newSquare.getBoundingClientRect().left && this.firstSquare.getBoundingClientRect().top == this.newSquare.getBoundingClientRect().top) {
                this.firstSquare.before(this.newSquare)
                this.allNewSquare.push(this.newSquare)
                this.newSquare.classList.add('brown')
                this.createNewSquare()
                this.speed = this.speed - 1
                this.counterRecords++
                this.textRecords.forEach(el => {
                    el.innerHTML = `X ${this.counterRecords}`
                })
            }
        }

        this.flex = function () {
            coordinate = []

            for (let i = 0; i < this.allNewSquare.length; i++) {
                coordinate.push(this.allNewSquare[i].style.transform)
            }

            for (let i = 0; i < this.allNewSquare.length; i++) {

                if (i === 0) {
                    this.allNewSquare[i].style.transform = `translate(${preX}px,${preY}px)`
                    continue
                }

                this.allNewSquare[i].style.transform = coordinate[i - 1]
            }
        }

        this.openDeathMenu = function () {
            this.stop()
            this.menu.classList.add('active')
            this.renderItemsMenu(this.deathMenu)
            snake.buttonStop.classList.add('active')

            snake.menu.classList.add('active')

            this.textGameOver.classList.add('active')

            if (snake.buttonStopText.innerHTML == 'Stop Game (Space)') {

                snake.buttonStopText.innerHTML = 'Select (Space)'

                snake.stop()

            } else if (snake.buttonStopText.innerHTML == 'Select (Space)')snake.buttonStopText.innerHTML = 'Stop Game (Space)' 
            else if (snake.buttonStopText.innerHTML == 'Стоп игра (Space)') {

                snake.buttonStopText.innerHTML = 'Выбрать (Space)'

                snake.stop()

            } else if (snake.buttonStopText.innerHTML == 'Выбрать (Space)') snake.buttonStopText.innerHTML = 'Стоп игра (Space)'

            if (!stop) {
                stop = true
                return
            }

            stop = false

        }

        this.right = function () {
            w2 = false
            s2 = false
            d2 = true

            if ((turn === 'press left' && this.allNewSquare.length > 0) || turn === 'press right') return

            //запрещать ли поворот вправо стоя у стенки справа
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (this.x + this.firstSquare.offsetWidth >= document.body.offsetWidth - this.firstSquare.offsetWidth) {
                    return
                }
            }
            //запрещать ли поворот вправо стоя у стенки справа

            if (d === false) return

            turn = 'press right'

            this.stop()

            w = false
            s = false
            this.moveRight = setInterval(() => {

                //врезаться в себя
                for (let i = 0; i < this.allNewSquare.length; i++) {
                    if (this.firstSquare.getBoundingClientRect().left == this.allNewSquare[i].getBoundingClientRect().left - this.firstSquare.offsetWidth && this.firstSquare.getBoundingClientRect().top == this.allNewSquare[i].getBoundingClientRect().top) {
                        w = true
                        s = true
                        this.openDeathMenu()
                        return
                    }
                }
                //врезаться в себя

                preX = this.x
                preY = this.y
                this.x = this.x + this.firstSquare.offsetWidth
                this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                this.eatingCube()
                this.flex()

                w = true
                s = true

                if (w2) this.up()
                if (s2) this.down()

                //ограничитель
                if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                    if (this.x + this.firstSquare.offsetWidth >= document.body.offsetWidth - this.firstSquare.offsetWidth) {
                        counterNitroSmash = true
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`

                        if (!w2 && !s2) this.stop()
                        clearInterval(this.moveRight)
                        return
                    } else counterNitroSmash = false
                } else if (selectedMode === 'Wall - mortal barrier' || selectedMode === 'Стена - смертельный барьер') {
                    if (this.x + this.firstSquare.offsetWidth >= document.body.offsetWidth) {
                        this.openDeathMenu()
                        return
                    }

                } else if (selectedMode === 'Wall - portal' || selectedMode === 'Стена - портал') {
                    if (this.x + this.firstSquare.offsetWidth >= document.body.offsetWidth) {
                        this.x = 0
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                        return
                    }
                }
                //ограничитель

            }, this.speed)
        }

        this.left = function () {

            w2 = false
            s2 = false
            a2 = true
            if ((turn === 'press right' && this.allNewSquare.length > 0) || turn === 'press left') return

            //запрещать ли поворот влево стоя у стенки слева
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (this.x <= 0) return
            }
            //запрещать ли поворот влево стоя у стенки слева

            if (a === false) return


            w = false
            s = false

            turn = 'press left'


            this.stop()

            this.moveLeft = setInterval(() => {

                //врезаться в себя
                for (let i = 0; i < this.allNewSquare.length; i++) {
                    if (this.firstSquare.getBoundingClientRect().left == this.allNewSquare[i].getBoundingClientRect().left + this.firstSquare.offsetWidth && this.firstSquare.getBoundingClientRect().top == this.allNewSquare[i].getBoundingClientRect().top) {
                        w = true
                        s = true
                        this.openDeathMenu()
                        return
                    }
                }
                //врезаться в себя

                preX = this.x
                preY = this.y
                this.x = this.x - this.firstSquare.offsetWidth
                this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                this.eatingCube()
                this.flex()

                w = true
                s = true

                if (w2) this.up()
                if (s2) this.down()

                //ограничитель
                if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                    if (this.x <= 0) {
                        this.x = 0
                        counterNitroSmash = true
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`

                        if (!w2 && !s2) this.stop()
                        clearInterval(this.moveLeft)
                        return
                    } else counterNitroSmash = false
                } else if (selectedMode === 'Wall - mortal barrier' || selectedMode === 'Стена - смертельный барьер') {
                    if (this.x < 0) {
                        this.openDeathMenu()
                        return
                    }
                } else if (selectedMode === 'Wall - portal' || selectedMode === 'Стена - портал') {
                    if (this.x < 0) {
                        this.x = document.body.offsetWidth - this.firstSquare.offsetWidth - body.clientLeft / 2
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                        return
                    }
                }

                //ограничитель

            }, this.speed)
        }

        this.down = function () {
            s2 = true
            a2 = false
            d2 = false

            if (((turn === 'press up' && this.allNewSquare.length > 0) || turn === 'press down')) return

            //запрещать ли поворот вниз стоя у стенки снизу
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (this.y + this.firstSquare.offsetHeight >= document.body.offsetHeight - this.firstSquare.clientTop) return
            }
            //запрещать ли поворот вниз стоя у стенки снизу

            if (s === false) return

            a = false
            d = false

            turn = 'press down'

            this.stop()

            this.moveDown = setInterval(() => {

                //врезаться в себя
                for (let i = 0; i < this.allNewSquare.length; i++) {

                    if (this.firstSquare.getBoundingClientRect().left == this.allNewSquare[i].getBoundingClientRect().left && this.firstSquare.getBoundingClientRect().top == this.allNewSquare[i].getBoundingClientRect().top - this.firstSquare.offsetHeight) {
                        a = true
                        d = true
                        this.openDeathMenu()
                        return
                    }
                }
                //врезаться в себя

                preX = this.x
                preY = this.y
                this.y = this.y + this.firstSquare.offsetHeight
                this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                this.eatingCube()
                this.flex()

                a = true
                d = true

                if (d2) this.right()
                if (a2) this.left()

                //ограничитель
                if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                    if (this.y + this.firstSquare.offsetHeight >= document.body.offsetHeight - this.firstSquare.clientTop) {
                        counterNitroSmash = true
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`

                        if (!d2 && !a2) this.stop()
                        clearInterval(this.moveDown)
                        return
                    } else counterNitroSmash = false
                } else if (selectedMode === 'Wall - mortal barrier' || selectedMode === 'Стена - смертельный барьер') {
                    if (this.y >= document.body.offsetHeight - this.firstSquare.clientTop) {
                        this.openDeathMenu()
                        return
                    }
                } else if (selectedMode === 'Wall - portal' || selectedMode === 'Стена - портал') {
                    if (this.y > document.body.offsetHeight - this.firstSquare.offsetHeight) {
                        this.y = 0
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                        return
                    }
                }
                //ограничитель

            }, this.speed)
        }

        this.up = function () {
            w2 = true
            d2 = false
            a2 = false
            if ((turn === 'press down' && this.allNewSquare.length > 0) || turn === 'press up') return

            //запрещать ли поворот вверх стоя у стенки сверху
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (this.y <= 0) return
            }
            //запрещать ли поворот вверх стоя у стенки сверху

            if (w === false) return

            a = false
            d = false

            turn = 'press up'

            this.stop()

            this.moveUp = setInterval(() => {

                //врезаться в себя
                for (let i = 0; i < this.allNewSquare.length; i++) {
                    if (this.firstSquare.getBoundingClientRect().left == this.allNewSquare[i].getBoundingClientRect().left && this.firstSquare.getBoundingClientRect().top == this.allNewSquare[i].getBoundingClientRect().top + this.firstSquare.offsetHeight) {
                        a = true
                        d = true
                        this.openDeathMenu()
                        return
                    }
                }
                //врезаться в себя

                preX = this.x
                preY = this.y
                this.y = this.y - this.firstSquare.offsetHeight
                this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                this.eatingCube()
                this.flex()

                a = true
                d = true

                if (d2) this.right()
                if (a2) this.left()

                //ограничитель
                if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                    if (this.y <= 0) {
                        this.y = 0
                        counterNitroSmash = true
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`

                        if (!d2 && !a2) this.stop()
                        clearInterval(this.moveUp)
                        return
                    } else counterNitroSmash = false
                } else if (selectedMode === 'Wall - mortal barrier' || selectedMode === 'Стена - смертельный барьер') {
                    if (this.y < 0) {
                        this.openDeathMenu()
                        return
                    }
                } else if (selectedMode === 'Wall - portal' || selectedMode === 'Стена - портал') {
                    if (this.y < 0) {
                        this.y = document.body.offsetHeight - this.firstSquare.offsetHeight - 3
                        this.firstSquare.style.transform = `translate(${this.x}px,${this.y}px)`
                        return
                    }
                }
                //ограничитель

            }, this.speed)
        }

        this.stop = function () {
            clearInterval(this.moveRight)
            clearInterval(this.moveLeft)
            clearInterval(this.moveDown)
            clearInterval(this.moveUp)
        }

        this.nitro = function () {
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при полном топливе
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (counterNitroSmash && turn === 'press up' && (d === true || a === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press right' && (w === true || s === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press down' && (d === true || a === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press left' && (w === true || s === true)) {
                    this.speed /= 2
                    return
                }
            }
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива

            this.speed /= 2
            if (turn === 'press right') {
                turn = null
                this.right()
            } else if (turn === 'press left') {
                turn = null
                this.left()
            } else if (turn === 'press up') {
                turn = null
                this.up()
            } else if (turn === 'press down') {
                turn = null
                this.down()
            }

        }

        this.stopNitro = function () {
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (counterNitroSmash && turn === 'press up' && (d === true || a === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press right' && (w === true || s === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press down' && (d === true || a === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press left' && (w === true || s === true)) {
                    this.speed *= 2
                    return
                }
            }
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива

            this.speed *= 2
            if (turn === 'press right') {
                turn = null
                this.right()
            } else if (turn === 'press left') {
                turn = null
                this.left()
            } else if (turn === 'press up') {
                turn = null
                this.up()
            } else if (turn === 'press down') {
                turn = null
                this.down()
            }
        }

        this.timeStart = function () {
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при полном топливе
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (counterNitroSmash && turn === 'press up' && (d === true || a === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press right' && (w === true || s === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press down' && (d === true || a === true)) {
                    this.speed *= 2
                    return
                } else if (counterNitroSmash && turn === 'press left' && (w === true || s === true)) {
                    this.speed *= 2
                    return
                }
            }
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива

            this.speed *= 2
            if (turn === 'press right') {
                turn = null
                this.right()
            } else if (turn === 'press left') {
                turn = null
                this.left()
            } else if (turn === 'press up') {
                turn = null
                this.up()
            } else if (turn === 'press down') {
                turn = null
                this.down()
            }

        }

        this.timeStop = function () {
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива
            if (selectedMode === 'Wall - stop barrier' || selectedMode === 'Стена - стопорный барьер') {
                if (counterNitroSmash && turn === 'press up' && (d === true || a === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press right' && (w === true || s === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press down' && (d === true || a === true)) {
                    this.speed /= 2
                    return
                } else if (counterNitroSmash && turn === 'press left' && (w === true || s === true)) {
                    this.speed /= 2
                    return
                }
            }
            //стоя у стенки запрещать движение назад после кнопки "Нитро" при окончании топлива

            this.speed /= 2
            if (turn === 'press right') {
                turn = null
                this.right()
            } else if (turn === 'press left') {
                turn = null
                this.left()
            } else if (turn === 'press up') {
                turn = null
                this.up()
            } else if (turn === 'press down') {
                turn = null
                this.down()
            }
        }

        this.timeFirstFill = function () {
            turnShift = 'fillTime'
            let moveUp = setInterval(() => {
                counterFillColorTime = counterFillColorTime + 0.001
                document.querySelector('.background-time').style.transform = `scaleY(${counterFillColorTime})`
                if (counterFillColorTime >= 1) {
                    counterFillColorTime = 1
                    clearInterval(moveUp)
                    this.buttonTime.classList.remove('active')
                    return
                }

                if (stop) {
                    clearInterval(moveUp)
                    return
                }
            }, 18)
        }

        this.language = function () {

            if (counterLanguage === true) {
                document.querySelectorAll('span').forEach(el => {
                    if (el.innerHTML === 'Stop Game (Space)') el.innerHTML = 'Стоп игра (Space)'
                    if (el.innerHTML === 'Select (Space)') el.innerHTML = 'Выбрать (Space)'
                    if (el.innerHTML === 'Nitro (F)') el.innerHTML = 'Азот (F)'
                    if (el.innerHTML === 'Lang (en) (press E)') el.innerHTML = 'Язык (ru) (жми E)'
                    if (el.innerHTML === 'Game Over') el.innerHTML = 'Игра окончена'
                    if (el.innerHTML === 'Slow time (LShift)') el.innerHTML = 'Замедлить время (LShift)'
                })

                document.querySelectorAll('li').forEach(el => {
                    if (el.innerHTML === 'Easy') el.innerHTML = 'Легкий'
                    if (el.innerHTML === 'Normal') el.innerHTML = 'Нормальный'
                    if (el.innerHTML === 'Hard') el.innerHTML = 'Сложный'
                    if (el.innerHTML === 'Back') el.innerHTML = 'Назад'
                    if (el.innerHTML === 'New start') el.innerHTML = 'Новый старт'
                    if (el.innerHTML === 'Modes') el.innerHTML = 'Режимы'
                    if (el.innerHTML === 'Complication') el.innerHTML = 'Сложность'
                    if (el.innerHTML === 'Continue') el.innerHTML = 'Продолжить'
                    if (el.innerHTML === 'Restart') el.innerHTML = 'Начать заново'
                    if (el.innerHTML === 'Exit to main menu') el.innerHTML = 'Выйти в главное меню'
                    if (el.innerHTML === 'Wall - stop barrier') el.innerHTML = 'Стена - стопорный барьер'
                    if (el.innerHTML === 'Wall - mortal barrier') el.innerHTML = 'Стена - смертельный барьер'
                    if (el.innerHTML === 'Wall - portal') el.innerHTML = 'Стена - портал'
                })
            } else if (counterLanguage === false) {
                document.querySelectorAll('span').forEach(el => {
                    if (el.innerHTML === 'Стоп игра (Space)') el.innerHTML = 'Stop Game (Space)'
                    if (el.innerHTML === 'Выбрать (Space)') el.innerHTML = 'Select (Space)'
                    if (el.innerHTML === 'Азот (F)') el.innerHTML = 'Nitro (F)'
                    if (el.innerHTML === 'Язык (ru) (жми E)') el.innerHTML = 'Lang (en) (press E)'
                    if (el.innerHTML === 'Игра окончена') el.innerHTML = 'Game Over'
                    if (el.innerHTML === 'Замедлить время (LShift)') el.innerHTML = 'Slow time (LShift)'
                })

                document.querySelectorAll('li').forEach(el => {
                    if (el.innerHTML === 'Легкий') el.innerHTML = 'Easy'
                    if (el.innerHTML === 'Нормальный') el.innerHTML = 'Normal'
                    if (el.innerHTML === 'Сложный') el.innerHTML = 'Hard'
                    if (el.innerHTML === 'Назад') el.innerHTML = 'Back'
                    if (el.innerHTML === 'Новый старт') el.innerHTML = 'New start'
                    if (el.innerHTML === 'Режимы') el.innerHTML = 'Modes'
                    if (el.innerHTML === 'Сложность') el.innerHTML = 'Complication'
                    if (el.innerHTML === 'Продолжить') el.innerHTML = 'Continue'
                    if (el.innerHTML === 'Начать заново') el.innerHTML = 'Restart'
                    if (el.innerHTML === 'Выйти в главное меню') el.innerHTML = 'Exit to main menu'
                    if (el.innerHTML === 'Стена - стопорный барьер') el.innerHTML = 'Wall - stop barrier'
                    if (el.innerHTML === 'Стена - смертельный барьер') el.innerHTML = 'Wall - mortal barrier'
                    if (el.innerHTML === 'Стена - портал') el.innerHTML = 'Wall - portal'
                })
            }
        }


        //ПЕРВЫЙ КЛИК SPACE
        this.firstClickSpaceDown = function (event) {

            if (allBlock === false) return

            if (event.code === 'Space') {
                document.querySelector('.button').classList.add('active')
                snake.renderItemsMenu(snake.mainMenuItems)
                this.menu.classList.add('active')

                this.menu.addEventListener('transitionend', () => { //разблокирование всех клавиш произойдёт, когда откроется главное первое меню
                    allBlock = false
                    body.classList.add('normalTimeBorder')
                }, {
                    once: true
                })

                document.querySelector('.button').addEventListener('transitionend', () => {
                    document.querySelector('.button').classList.remove('active')
                    document.querySelector('.wrap').classList.add('invisible')
                    body.classList.add('pressSpace')
                }, {
                    once: true
                })
            }
        }
        //ПЕРВЫЙ КЛИК SPACE

    }
}

let snake = new Snake()

for (let key in snake) {
    if (typeof snake[key] == 'function') {
        snake[key] = snake[key].bind(snake);
    }
}

document.addEventListener('keydown', function (event) {

    //нажимается при любых условиях после первого Space
    //press to 'E'
    if (event.code == 'KeyE') {
        if (allBlock) return //пока не нажата стартовая Space,все клавиши не будут работать

        if (!counterLanguage) counterLanguage = true
        else counterLanguage = false
        snake.buttonLanguage.classList.add('active')
        snake.language()
    }

    snake.buttonLanguage.addEventListener('transitionend', () => {
        snake.buttonLanguage.classList.remove('active')
    }, {
        once: true
    })
    //press to 'E'
    //нажимается при любых условиях после первого Space

    // если меню в игре активно то все клавиши действуют только на меню
    if (snake.menu.classList.contains('active')) {

        // анимация белого фона у кнопки Stop, когда открыто меню
        if (event.code == 'Space') {

            snake.buttonStop.classList.add('white-color-animation')

            snake.buttonStop.addEventListener('animationend', () => {
                snake.buttonStop.classList.remove('white-color-animation')
            }, {
                once: true
            })
        }
        // анимация белого фона у кнопки Stop, когда открыто меню

        //press to 'Continue'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Continue' || item.innerHTML === 'Продолжить')) {
                if (event.code == 'Space') {
                    snake.menu.classList.remove('active')
                    snake.buttonStop.classList.remove('active')
                    if (counterLanguage === true) snake.buttonStopText.innerHTML = 'Стоп игра (Space)'
                    else snake.buttonStopText.innerHTML = 'Stop Game (Space)'

                    stop = false
                    snake.continueMove()
                    return
                }
            }
        }
        //press to 'Continue'


        //press to 'Restart'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Restart' || item.innerHTML === 'Начать заново')) {
                if (event.code == 'Space') {
                    snake.speed = valueSpeed
                    snake.menu.classList.remove('active')
                    snake.buttonStop.classList.remove('active')

                    if (counterLanguage === true) snake.buttonStopText.innerHTML = 'Стоп игра (Space)'
                    else snake.buttonStopText.innerHTML = 'Stop Game (Space)'

                    snake.x = 0
                    snake.y = 0
                    snake.firstSquare.style.transform = `translate(0px, 0px)`

                    snake.allNewSquare.forEach((el) => {
                        el.remove()
                    })

                    snake.allNewSquare = []
                    snake.newSquare.remove()
                    snake.createNewSquare()
                    turn = null

                    w = null
                    d = null
                    s = null
                    a = null

                    w2 = null
                    d2 = null
                    s2 = null
                    a2 = null

                    stop = false

                    snake.counterRecords = 0
                    snake.textRecords.forEach(el => {
                        el.innerHTML = `X ${snake.counterRecords}`
                    })

                    snake.textGameOver.classList.remove('active')

                    counterFillColorNitro = 1
                    counterF = false
                    turnF = null
                    document.querySelector('.background-nitro').style.transform = `scaleY(${counterFillColorNitro})`
                    snake.buttonNitro.classList.remove('active')

                    counterFillColorTime = 0
                    snake.buttonTime.classList.remove('active')
                    turnShift = null

                    snake.timeFirstFill()

                    return
                }
            }
        }
        //press to 'Restart'


        //press to 'Exit to main menu'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Exit to main menu' || item.innerHTML === 'Выйти в главное меню')) {
                if (event.code == 'Space') {
                    snake.x = 0
                    snake.y = 0
                    snake.firstSquare.style.transform = `translate(0px, 0px)`

                    snake.allNewSquare.forEach((el) => {
                        el.remove()
                    })

                    snake.allNewSquare = []

                    if (snake.newSquare) snake.newSquare.remove()

                    snake.firstSquare.classList.add('invisible')
                    turn = null

                    snake.renderItemsMenu(snake.mainMenuItems)

                    snake.counterRecords = 0
                    snake.textRecords.forEach(el => {
                        el.innerHTML = `X ${snake.counterRecords}`
                    })

                    snake.gameContinueRecords.classList.remove('active')
                    snake.gameOverRecords.classList.remove('active')

                    snake.textGameOver.classList.remove('active')

                    counterFillColorNitro = 1
                    counterF = false
                    turnF = null
                    document.querySelector('.background-nitro').style.transform = `scaleY(${counterFillColorNitro})`
                    snake.buttonNitro.classList.remove('active')

                    counterFillColorTime = 0
                    turnShift = null
                    document.querySelector('.background-time').style.transform = `scaleY(${counterFillColorTime})`
                    snake.buttonTime.classList.remove('active')

                    return
                }
            }
        }
        //press to 'Exit to main menu'


        //press to 'New start'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'New start' || item.innerHTML === 'Новый старт')) {
                if (event.code == 'Space') {

                    if (allBlock) return //пока не нажата стартовая Space,все клавиши не будут работать

                    isNewStart = true
                    snake.allNewSquare.forEach((el) => {
                        el.remove()
                    })

                    snake.speed = valueSpeed
                    snake.allNewSquare = []

                    snake.firstSquare.classList.remove('invisible')
                    snake.createNewSquare()
                    turn = null

                    w = null
                    d = null
                    s = null
                    a = null

                    w2 = null
                    d2 = null
                    s2 = null
                    a2 = null

                    stop = false

                    snake.menu.classList.remove('active')
                    snake.buttonStop.classList.remove('active')

                    if (counterLanguage === true) snake.buttonStopText.innerHTML = 'Стоп игра (Space)'
                    else snake.buttonStopText.innerHTML = 'Stop Game (Space)'

                    snake.counterRecords = 0
                    snake.textRecords.forEach(el => {
                        el.innerHTML = `X ${snake.counterRecords}`
                    })

                    snake.gameContinueRecords.classList.add('active')
                    snake.gameOverRecords.classList.add('active')

                    snake.buttonNitro.classList.remove('active')

                    counterFillColorTime = 0
                    snake.buttonTime.classList.remove('active')
                    turnShift = null

                    snake.timeFirstFill()

                    firstNewStart = true
                    return
                }
            }
        }
        //press to 'New start'


        //press to 'Modes'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Modes' || item.innerHTML === 'Режимы')) {
                if (event.code == 'Space') {
                    snake.renderItemsMenu(snake.modesMenuItems)
                    snake.anyMenuItems[modesCounter].classList.add('selected')
                    return
                }
            }
        }
        //press to 'Modes'


        //press to items of mode
        snake.anyMenuItems.map((elem, ind) => {
            if (elem.classList.contains('modes') && elem.classList.contains('active')) {
                if (event.code == 'Space') {
                    snake.anyMenuItems.map(el => el.classList.remove('selected'))
                    elem.classList.add('selected')
                    let colorWall
                    if (ind === 0) colorWall = 'green'
                    if (ind === 1) colorWall = 'red'
                    if (ind === 2) colorWall = 'blue'
                    body.style.borderColor = colorWall
                    modesCounter = ind
                    selectedMode = elem.innerHTML
                    return
                }
            }
        })
        //press to items of mode


        //press to 'Complication'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Complication' || item.innerHTML === 'Сложность')) {
                if (event.code == 'Space') {
                    snake.renderItemsMenu(snake.complicationMenuItems)
                    snake.anyMenuItems[complicationCounter].classList.add('selected')
                    return
                }
            }
        }
        //press to 'Complication'


        //press to items of complication
        snake.anyMenuItems.map((elem, ind) => {
            if (elem.classList.contains('complication') && elem.classList.contains('active')) {
                if (event.code == 'Space') {
                    snake.anyMenuItems.map(el => el.classList.remove('selected'))
                    elem.classList.add('selected')
                    complicationCounter = ind
                    if (ind === 0) valueSpeed = 150
                    if (ind === 1) valueSpeed = 110
                    if (ind === 2) valueSpeed = 80
                    return
                }
            }
        })
        //press to items of complication


        //press to 'Back'
        for (let item of snake.anyMenuItems) {
            if (item.classList.contains('active') && (item.innerHTML === 'Back' || item.innerHTML === 'Назад')) {
                if (event.code == 'Space') {
                    snake.renderItemsMenu(snake.mainMenuItems)
                    return
                }
            }
        }
        //press to 'Back'


        // up button in game menu
        if (event.code == 'KeyW' || event.code == 'ArrowUp') {

            snake.buttonUp.classList.add('active')

            snake.buttonUp.addEventListener('transitionend', () => {
                snake.buttonUp.classList.remove('active')
            }, {
                once: true
            })

            snake.switchItemsMenu('up')
        }
        // up button in game menu


        // down button in game menu
        if (event.code == 'KeyS' || event.code == 'ArrowDown') {

            snake.buttonDown.classList.add('active')

            snake.buttonDown.addEventListener('transitionend', () => {
                snake.buttonDown.classList.remove('active')
            }, {
                once: true
            })

            snake.switchItemsMenu('down')
        }
        //down button in game menu




    }
    // если меню в игре активно то все клавиши действуют только на меню

    snake.unblockTurn(event)

    snake.firstClickSpaceDown(event)
});