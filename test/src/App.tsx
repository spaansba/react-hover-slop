import useHoverSlop from "react-hover-slop"
import { useRef } from "react"

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { isHovered } = useHoverSlop(buttonRef, { top: 100, left: 80, right: 80, bottom: 100 }, {})
  return (
    <div className="bg-amber-200 h-screen w=screen">
      <button ref={buttonRef}>hover {isHovered}</button>
    </div>
  )
}

export default App
