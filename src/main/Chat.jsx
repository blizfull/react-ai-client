import React from 'react'
import './CSS/index.css'
import microphone from './image/icons8-microphone-30.png'
import send from './image/icons8-paper-plane-64.png'
import typing from './image/typing-dots.gif'
import axios from 'axios'
import LogoCali from './image/LogoCali.png'
import Speech from './Speech'
import Mute from './image/muteUser.png'
import Bot from './Bot'

export default class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userInput: [],
      botInput: '',
      gif: null,
      click: false,
      recogImg: microphone,
      record: false,
      res: false
    }
    this.userInput = this.userInput.bind(this)
    this.recognition = this.recognition.bind(this)
  }
  componentDidMount () {
    axios.get('https://server-v62z.onrender.com/')
    // axios
      // .get('http://localhost:8080/', {})
      .then(dat => {})
      .catch(err => {
        console.log(err)
      })
  }
  userInput (e) {
    const val = e.target[1].value
    if (!val) {
      e.preventDefault()
    } else {
        this.setState({ gif: typing })
setTimeout(()=>{
  this.setState({ gif: null })
},4800)
      
      this.setState({ userInput: [...this.state.userInput, val] })
      const userObject = {
        userinput: val
      }
      axios
        .post('https://server-v62z.onrender.com/api', userObject)
        // .post('http://localhost:8080/api', userObject)
        .then(res => {
          // this.setState({ gif: null })
          this.setState({ botInput:  res.data })
        })
        .catch(error => {
          // this.setState({ gif: typing })
        })
      e.preventDefault()
    }
  }
  recognition () {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    if (this.state.recogImg === microphone) {
      this.setState({
        recogImg: Mute
      })
      recognition.start()
      recognition.onstart = () => {
        this.setState({ record: true })
        recognition.onresult = e => {
          this.setState({
            recogImg: microphone
          })
          recognition.stop()
          let current = e.resultIndex
          let transcript = e.results[current][0].transcript
          this.setState({ userInput: [...this.state.userInput, transcript] })
          const userObject = {
            userinput: transcript
          }
          setTimeout(()=>{
            this.setState({ gif: null })
          },4800)
          axios
            .post('https://server-v62z.onrender.com/api', userObject)
            //  .post('http://localhost:8080/api', userObject)
            .then(res => {
              this.setState({ botInput:  res.data })
            })
            .catch(error => {})
        }
      }
    } else {
      this.setState({
        recogImg: microphone
      })
      recognition.stop()
    }
  }

  render () {
    const user = this.state.userInput.map((data, i) => {
      return (
        <div>
          <div className='user' key={i}>
            <p key={i}>{data}</p>
          </div>
         
          <Bot test={this.state.botInput} data={this.state.gif} /> 
          {(document.querySelector('.test').value = '')}
        </div>
      )
    })

    return (
      <div className='container'>
        <div className='nav'>
          <img
            className='logocali'
            onClick={() => {
              window.location.reload(false)
            }}
            src={LogoCali}
            alt=''
          />
        </div>
        <div className='displaySpace'>
          <div className='bot' style={{ backgroundColor: 'white' }}>
            <p>
              Good day, I'm AURA. Your AI assistant, I'm here to assist you with
              any questions you may have.
            </p>
            <Speech msg="Good day, I'm Aura. Your AI assistant, I'm here to assist you with any questions you may have." />
          </div>

          {user}

          <img className='typing' src={this.state.gif} alt='' />
        </div>
        <div className='app'>
          <form onSubmit={this.userInput}>
            <button type='button' onClick={this.recognition} className='mic'>
              <img src={this.state.recogImg} alt='' />
            </button>
            <input
              type='text'
              className='test'
              name='text'
              placeholder='Type something.....'
            />
            <button type='submit' className='send'>
              <img src={send} alt='' />
            </button>
          </form>
        </div>
      </div>
    )
  }
}


