document.addEventListener('DOMContentLoaded', () =>{

	  const grid = document.querySelector('.grid')
	  const allSquares = document.querySelectorAll('.grid div')
	  let squares =Array.from(document.querySelectorAll('.grid div'))
	  const width = 10
	  const scoreDisplay = document.querySelector('#score')
	  const gameOverDisplay = document.querySelector('#game-over')
	  const startBtn = document.querySelector('#start-button')
	  const newBtn = document.querySelector('#new-game')
	  let nextRandom =0
	  let timerId
	  let score =0
	  let ch=1
	  const colors = [
		  'orange',
		  'red',
		  'purple',
		  'blue',
		  'black'
	  ]
	  const lTetromino = [
	  	[1, width+1, width*2+1, 2],
	  	[width, width+1, width+2, width*2+2],
	  	[1, width+1, width*2+1, width*2], 
	  	[width, width*2, width*2+1, width*2+2]
	  ]

	  const zTetromino = [
	  	[0, width, width+1, width*2+1],
	  	[width+1, width+2, width*2, width*2+1],
	  	[0, width, width+1, width*2+1],
	  	[width+1, width+2, width*2, width*2+1],
	  ]

	  const tTetromino = [
    	[1,width,width+1,width+2],
    	[1,width+1,width+2,width*2+1],
    	[width,width+1,width+2,width*2+1],
    	[1,width,width+1,width*2+1]
      ]

      const oTetromino = [
    	[0,1,width,width+1],
    	[0,1,width,width+1],
    	[0,1,width,width+1],
    	[0,1,width,width+1]
      ]

      const iTetromino = [
    	[1,width+1,width*2+1,width*3+1],
    	[width,width+1,width+2,width+3],
    	[1,width+1,width*2+1,width*3+1],
    	[width,width+1,width+2,width+3]
      ]

	  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

	  let currentPosition = 4
	  let currentRotation = 0
	  // to randomly select a tetrimino and its rotation
	  let random = Math.floor(Math.random()*theTetrominoes.length)

	  let current = theTetrominoes[random][currentRotation]

	  //draw the first rotation of any tetromino randomly
	  function draw(){
	  	current.forEach(index => {
			  squares[currentPosition + index].classList.add('tetromino')
			  squares[currentPosition+index].style.backgroundColor = colors[random]
	  	})
	  }
	  draw()
	  function undraw(){
	  	current.forEach(index => {
			  squares[currentPosition + index].classList.remove('tetromino')
			  squares[currentPosition+index].style.backgroundColor = ''
	  	})
	  }
	  
	  //making the tetromino move every second
	  //timerId = setInterval(moveDown, 500)

	  //puting up key control in the tetris
	  function control(e)
	  {
	  	if(e.keyCode === 37){
	  		moveLeft()
	  	}
	  	else if(e.keyCode === 38){
	  		rotate()
	  	}
	  	else if(e.keyCode == 39){
	  		moveRight()
	  	}
	  	else if(e.keyCode == 40){
	  		moveDown()
	  	}

	  }
	  document.addEventListener('keyup', control)
	  // function to moive down
	  function moveDown() {
	  	undraw()
	  	currentPosition +=width
	  	draw()
	  	freeze()
	  }

	  //since the tetrominoes were going down forever we are using a freeze function
	  function freeze() {
	  	if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
	  		//now since we have reached the end of the div we will make the current squares as taken
	  		current.forEach(index => squares[currentPosition+index].classList.add('taken'))
	  		//now lets start a new tetromino
	  		random = nextRandom
	  		nextRandom = Math.floor(Math.random()*theTetrominoes.length)
	  		current = theTetrominoes[random][currentRotation]
	  		currentPosition = 4
	  		draw()
			displayShape()
			addScore()  
			gameOver()
	  	}
	  }

	  //function to move left tillwe reach a blockade
	  function moveLeft(){
	  	undraw();
	  	const isAtLeftEdge = current.some(index => (currentPosition+index)%width ===0)
	  	if(!isAtLeftEdge) {
	  		currentPosition -=1
	  	}
	  	if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
	  		currentPosition +=1
	  	}
	  	draw()
	  }

	  function moveRight(){
	  	undraw();
	  	const isAtRightEdge =  current.some(index => (currentPosition+index)%width === width-1)
	  	if(!isAtRightEdge){
	  		currentPosition +=1
	  	}
	  	if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
	  		currentPosition -=1
	  	}
	  	draw()
	  }

	  function rotate(){
	  	undraw();
	  	currentRotation = (currentRotation+1)%4
	  	current = theTetrominoes[random][currentRotation]
	  	draw()
	  }

	  //to show next tetrominoes in the adjacent grid
	  const displaySquares = document.querySelectorAll('.mini-grid div')
	  const displayWidth = 4
	  let displayIndex =0;

	  //the tetrominoes without rotation
	  const upNextTetrominoes =[
	   	[1, displayWidth+1, displayWidth*2+1, 2],
	   	[0, displayWidth, displayWidth+1, displayWidth*2+1],
	   	[1,displayWidth,displayWidth+1,displayWidth+2],
	   	[0,1,displayWidth, displayWidth+1],
	   	[1,displayWidth+1, displayWidth*2+1, displayWidth*3+1]
	  ]

	  //function  to display shape
	  function displayShape(){
	  	//first we have to remove every trace of .tetromino in the mini grid
	  	displaySquares.forEach( square => {
			  square.classList.remove('tetromino')
			  square.style.backgroundColor = ''
	  	}) 
	  	upNextTetrominoes[nextRandom].forEach(index => {
			  displaySquares[displayIndex + index].classList.add('tetromino')
			  displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom]
	  	})
	  }

	  //putting functionality to start button
	  startBtn.addEventListener('click', () => {
	  	if(timerId) {
	  		clearInterval(timerId)
	  		timerId = null
		}
		else{
			draw()
			timerId = setInterval(moveDown, 500)
			nextRandom = Math.floor(Math.random()*theTetrominoes.length)
			displayShape()

		}
	  })
	 newBtn.addEventListener('click', () =>{
	  	location.reload() 
	  })


	  function addScore(){
		  for(let i =0; i< 199; i+=width)
		  {
			  const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

			  if(row.every(index => squares[index].classList.contains('taken'))) {
				  score +=10*(ch++)
				  scoreDisplay.innerHTML = score
				  row.forEach(index => {
					  squares[index].classList.remove('taken')
					  squares[index].classList.remove('tetromino')
					  squares[index].style.backgroundColor=''
					  squares[index].style.backgroundImage="url('img_tree.png')"
				  })
				  const squaresRemoved = squares.splice(i, width)
				  squares = squaresRemoved.concat(squares)
				  squares.forEach(cell => grid.appendChild(cell))
			  }
		  }
	  }

	  function gameOver(){
		  if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
			  gameOverDisplay.innerHTML ='GAME OVER'
			  clearInterval(timerId)
		  }
	  }
	  	
})