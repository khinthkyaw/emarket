import { useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>

      <button className='btn btn-primary'>Click me</button>
      <button className='btn btn-secondary'>Click me</button>
      <button className='btn btn-outline'>Click me</button>
    </>
  )
}

export default App
