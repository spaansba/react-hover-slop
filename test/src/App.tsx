import useHoverSlop from "react-hover-slop"
import { useRef, useState } from "react"

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  const [eventLog, setEventLog] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(true)

  const logEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEventLog((prev) => [timestamp + ": " + message, ...prev].slice(0, 10))
  }

  const { isHovered: isButtonHovered } = useHoverSlop(
    buttonRef,
    { top: 60, left: 60, right: 60, bottom: 60 },
    {
      onMouseEnter: () => logEvent("Button onMouseEnter triggered"),
      onMouseLeave: () => logEvent("Button onMouseLeave triggered"),
      onMouseOver: () => logEvent("Button onMouseOver triggered"),
    },
    { debugMode: showDebug }
  )

  const { isHovered: isLinkHovered } = useHoverSlop(
    linkRef,
    30,
    {
      onMouseEnter: () => logEvent("Link onMouseEnter triggered"),
      onMouseLeave: () => logEvent("Link onMouseLeave triggered"),
    },
    { debugMode: showDebug }
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">react-hover-slop test page</h1>
          <p className="text-slate-600 mb-4">
            Testing the hover slop behavior with different configurations. Move your mouse around
            the elements to see the extended hover areas.
          </p>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {showDebug ? "Hide" : "Show"} Debug Overlay
            </button>

            <button
              onClick={() => setEventLog([])}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Clear Event Log
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Button with Large Slop</h2>
            <div className="h-40 flex items-center justify-center relative border border-dashed border-gray-300 rounded">
              <button
                id="test-button"
                ref={buttonRef}
                className={`px-4 py-2 rounded ${
                  isButtonHovered ? "bg-green-500 text-white" : "bg-gray-200"
                } transition-colors`}
              >
                Hover Me
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Configuration: 60px slop on all sides</p>
              <p>Events: onMouseEnter, onMouseLeave, onMouseOver</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Link with Uniform Slop</h2>
            <div className="h-40 flex items-center justify-center relative border border-dashed border-gray-300 rounded">
              <a
                id="test-link"
                href="#"
                ref={linkRef}
                className={`text-lg ${
                  isLinkHovered ? "text-blue-600 underline" : "text-gray-800"
                } transition-colors`}
                onClick={(e) => e.preventDefault()}
              >
                Hover over this link
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Configuration: 30px uniform slop on all sides</p>
              <p>Events: onMouseEnter, onMouseLeave</p>
            </div>
          </div>
        </div>

        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
          <h2 className="text-white text-lg mb-2">Event Log</h2>
          {eventLog.length === 0 ? (
            <p className="text-gray-500 italic">
              No events logged yet. Hover over elements to see events.
            </p>
          ) : (
            <ul className="space-y-1">
              {eventLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
