import React, { useState, useEffect, useRef } from 'react'
import keyPressSound from '/keyPressSound.mp3' // Import the sound file

import './App.css'

const App = React.memo(() => {
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0)
  const [correctKeys, setCorrectKeys] = useState(0)
  const [incorrectKeys, setIncorrectKeys] = useState(0)
  const [timer, setTimer] = useState(0) // 5-minute timer in seconds
  const inputRef = useRef(null)
  const audioRef = useRef(new Audio(keyPressSound)) // Create an Audio object with the sound file

  const keysToType = 'asdfjkl;'
  let interval

  useEffect(() => {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    if (timer === 0) {
      clearInterval(interval)
      if ((timer === 0 && correctKeys > 0) || incorrectKeys > 0) {
        inputRef.current.value = 'Time is over...'
      }
    }

    inputRef.current.focus()
  }, [timer])

  const handleInputChange = (e) => {
    const randomIndex = Math.floor(Math.random() * 8)
    const typedKey = e.target.value
    e.target.value = ''
    const lastTypedKey = typedKey.charAt(typedKey.length - 1)

    if (lastTypedKey === keysToType[currentKeyIndex]) {
      setCorrectKeys((prevCorrectKeys) => prevCorrectKeys + 1)
      setCurrentKeyIndex(randomIndex)
      inputRef.current.style.backgroundColor = '#37b24d'
    } else {
      setIncorrectKeys((prevIncorrectKeys) => prevIncorrectKeys + 1)
      inputRef.current.style.backgroundColor = '#e03131'
    }

    e.target.value = lastTypedKey // Override previous input with the new key
    audioRef.current.play() // Play the key press sound
  }

  const renderNextKey = () => {
    if (currentKeyIndex < keysToType.length) {
      return <span>{keysToType[currentKeyIndex]}</span>
    }
    return null
  }

  const restartHandler = () => {
    inputRef.current.placeholder = 'Enter next key...'
    inputRef.current.value = ''
    inputRef.current.style.backgroundColor = 'black'
    setCurrentKeyIndex(0)
    setCorrectKeys(0)
    setIncorrectKeys(0)
    setTimer(300)
  }

  return (
    <>
      <span className="credit">Created By : Santosh Yadav</span>
      <div className="container">
        <h1>
          {' '}
          <span>
            {' '}
            <img src="/typing.svg" alt="" />
          </span>{' '}
          Touch Typing Practice
        </h1>

        <p className="timer">Time remaining: {timer > 0 ? timer : 0} seconds</p>
        <p className="correctkeys">Correct keys: {correctKeys}</p>
        <p className="incorrectkeys">Incorrect keys: {incorrectKeys}</p>
        <p className="accuracy">
          Accuracy:{' '}
          {((correctKeys / (correctKeys + incorrectKeys)) * 100 || 0).toFixed(
            2,
          )}
          %
        </p>

        <input
          type="text"
          onChange={handleInputChange}
          autoFocus
          disabled={timer <= 0}
          ref={inputRef}
          placeholder="Enter next key..."
        />

        <p className="next">Next key: {renderNextKey()}</p>

        {timer <= 0 && (
          <button onClick={restartHandler} className="restart">
            {(timer <= 0 && correctKeys) || incorrectKeys ? 'RESTART' : 'START'}
          </button>
        )}
      </div>

      <audio ref={audioRef} src={keyPressSound} />
    </>
  )
})

export default App
