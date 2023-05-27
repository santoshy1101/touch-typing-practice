import React, { useState, useEffect, useRef } from 'react'
import keyPressSound from '/keyPressSound.mp3' // Import the sound file
import { FaExternalLinkAlt } from 'react-icons/fa'
import './App.css'

const App = () => {
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0)
  const [correctKeys, setCorrectKeys] = useState(0)
  const [incorrectKeys, setIncorrectKeys] = useState(0)
  const [timer, setTimer] = useState(0) // 5-minute timer in seconds
  const [seconds, setSeconds] = useState(300)
  const textRef = useRef(null)
  const secondsRef = useRef(null)
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
        textRef.current.value = 'Time is over...'
      }
    }
    textRef.current.focus()
  }, [timer])

  useEffect(() => {
    secondsRef.current.focus()
  }, [])

  const handleInputChange = (e) => {
    const randomIndex = Math.floor(Math.random() * 8)
    const typedKey = e.target.value
    e.target.value = ''
    const lastTypedKey = typedKey.charAt(typedKey.length - 1)

    if (lastTypedKey === keysToType[currentKeyIndex]) {
      setCorrectKeys((prevCorrectKeys) => prevCorrectKeys + 1)
      setCurrentKeyIndex(randomIndex)
      textRef.current.style.backgroundColor = '#37b24d'
    } else {
      setIncorrectKeys((prevIncorrectKeys) => prevIncorrectKeys + 1)
      textRef.current.style.backgroundColor = '#e03131'
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

  const restartHandler = (seconds) => {
    textRef.current.placeholder = 'Enter next key...'
    textRef.current.value = ''
    textRef.current.style.backgroundColor = 'black'
    setCurrentKeyIndex(0)
    setCorrectKeys(0)
    setIncorrectKeys(0)
    setTimer(seconds)
  }

  return (
    <div className="box">
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
        <p className="totalkeys">
          Total keys pressed: {correctKeys + incorrectKeys}
        </p>
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
          ref={textRef}
          placeholder="Enter next key..."
        />

        <p className="next">Next key: {renderNextKey()}</p>

        {timer <= 0 ? (
          <div className="edit-time">
            <button onClick={() => restartHandler(seconds)} className="restart">
              {(timer <= 0 && correctKeys) || incorrectKeys
                ? 'RESTART'
                : 'START'}
            </button>
            <input
              ref={secondsRef}
              onKeyUp={(e) => {
                e.key === 'Enter'
                  ? restartHandler(seconds)
                  : setSeconds(Number(e.target.value))
              }}
              type="number"
              placeholder="Enter seconds..."
            />
          </div>
        ) : (
          <button className="reset" onClick={() => setTimer(0)}>
            RESET
          </button>
        )}
      </div>
      <span className="credit">
        Created By : &nbsp;
        <a href="https://santoshy1101.github.io/" target="blank">
          {' '}
          Santosh Yadav &nbsp; <FaExternalLinkAlt />
        </a>
      </span>
      <audio ref={audioRef} src={keyPressSound} />
    </div>
  )
}

export default App
