import { useState, useEffect, useCallback, RefObject } from "react"
import { HoverSlopDebug } from "./HoverSlopDebug"
import { HoverSlopBox, EventHandlers, HoverSlopOptions, UseHoverSlopResult } from "./types"

export default function useHoverSlop<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  hoverslopBox: HoverSlopBox,
  mouseEvents: EventHandlers,
  options: HoverSlopOptions = {
    debugMode: false,
    eventOptions: {
      onMouseEnter: {
        once: false,
      },
      onMouseLeave: {
        once: false,
      },
    },
  }
): UseHoverSlopResult {
  const [isHovered, setIsHovered] = useState(false)
  const { onMouseLeave, onMouseEnter, onMouseOver } = mouseEvents
  const debugMode = options.debugMode
  const [fireMouseEnter, setFireMouseEnter] = useState(true)
  const [fireMouseLeave, setFireMouseLeave] = useState(true)

  const getElementName = useCallback(() => {
    if (!elementRef.current) return ""

    if (elementRef.current.id) {
      return `#${elementRef.current.id}`
    } else if (elementRef.current.className) {
      return `.${elementRef.current.className.split(" ")[0]}`
    } else {
      return elementRef.current.tagName.toLowerCase()
    }
  }, [elementRef])

  const hoverSlopBoxNormalized = useCallback(() => {
    if (typeof hoverslopBox === "number") {
      return {
        top: hoverslopBox,
        right: hoverslopBox,
        bottom: hoverslopBox,
        left: hoverslopBox,
      }
    }
    return {
      top: hoverslopBox.top ? hoverslopBox.top : 0,
      right: hoverslopBox.right ? hoverslopBox.right : 0,
      bottom: hoverslopBox.bottom ? hoverslopBox.bottom : 0,
      left: hoverslopBox.left ? hoverslopBox.left : 0,
    }
  }, [hoverslopBox])

  const isWithinExtendedArea = useCallback(
    (clientX: number, clientY: number) => {
      const element = elementRef.current
      if (!element) return false

      const rect = element.getBoundingClientRect()
      const normalizedslopBox = hoverSlopBoxNormalized()
      return (
        clientX >= rect.left - normalizedslopBox.left &&
        clientX <= rect.right + normalizedslopBox.right &&
        clientY >= rect.top - normalizedslopBox.top &&
        clientY <= rect.bottom + normalizedslopBox.bottom
      )
    },
    [elementRef, hoverSlopBoxNormalized]
  )

  const handleOnMouseEnter = useCallback(() => {
    if (!onMouseEnter) {
      return
    }
    if (options.eventOptions?.onMouseEnter?.once && !fireMouseEnter) {
      if (debugMode) {
        console.log(
          "not firing onMouseEnterEvent, event has already been fire once for ",
          getElementName()
        )
      }
      return
    }
    onMouseEnter()
    setFireMouseEnter(false)
    if (debugMode) {
      console.log("onMouseEnterEvent for", getElementName())
    }
  }, [
    onMouseEnter,
    debugMode,
    getElementName,
    fireMouseEnter,
    options.eventOptions?.onMouseEnter?.once,
  ])

  const handleOnMouseOver = useCallback(() => {
    if (onMouseOver) {
      onMouseOver()
    }
  }, [onMouseOver])

  const handleOnMouseLeave = useCallback(() => {
    if (!onMouseLeave) {
      return
    }
    if (options.eventOptions?.onMouseLeave?.once && !fireMouseLeave) {
      if (debugMode) {
        console.log(
          "not firing onMouseLeaveEvent, event has already been fire once for ",
          getElementName()
        )
      }
      return
    }
    onMouseLeave()
    setFireMouseLeave(false)
    if (debugMode) {
      console.log("onMouseLeaveEvent for", getElementName())
    }
  }, [
    onMouseLeave,
    debugMode,
    getElementName,
    options.eventOptions?.onMouseLeave?.once,
    fireMouseLeave,
  ])

  useEffect(() => {
    // if (options.debugMode) {
    //   console.log("")
    //   console.log(
    //     `%cInitializing: %c${getElementName()}`,
    //     "font-weight: bold; color: green;",
    //     "color: green; font-weight: bold;"
    //   )
    //   console.log("%coptions:", "color: gray; font-weight: bold;", options)
    //   console.log("%cevents:", "color: gray; font-weight: bold;", mouseEvents)
    // }
    const handleMouseMove = (e: MouseEvent) => {
      const isInside = isWithinExtendedArea(e.clientX, e.clientY)
      setIsHovered((prevIsHovered) => {
        if (!prevIsHovered && isInside) {
          handleOnMouseEnter()
          handleOnMouseOver()
        } else if (prevIsHovered && !isInside) {
          handleOnMouseLeave()
        } else if (isInside && onMouseOver) {
          handleOnMouseOver()
        }

        return isInside
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [
    isWithinExtendedArea,
    onMouseOver,
    handleOnMouseEnter,
    handleOnMouseLeave,
    handleOnMouseOver,
    getElementName,
  ])

  useEffect(() => {
    if (!debugMode) {
      return
    }

    return HoverSlopDebug(elementRef, hoverSlopBoxNormalized, isHovered, getElementName())
  }, [debugMode, elementRef, hoverSlopBoxNormalized, isHovered, getElementName, options])

  return {
    isHovered,
  }
}
