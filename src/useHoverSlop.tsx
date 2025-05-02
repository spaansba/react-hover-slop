import { useState, useEffect, useCallback, RefObject } from "react"
import { HoverslopDebug } from "./HoverSlopDebug"

type HoverslopBox =
  | {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  | number

type EventHandlers = {
  onMouseOver?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

type UseHoverslopResult = {
  isHovered: boolean
}

export default function useHoverSlop<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  hoverslopBox: HoverslopBox,
  mouseEvents: EventHandlers,
  debugMode?: boolean
): UseHoverslopResult {
  const [isHovered, setIsHovered] = useState(false)

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

  const hoverslopBoxNormalized = useCallback(() => {
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
      const normalizedslopBox = hoverslopBoxNormalized()
      return (
        clientX >= rect.left - normalizedslopBox.left &&
        clientX <= rect.right + normalizedslopBox.right &&
        clientY >= rect.top - normalizedslopBox.top &&
        clientY <= rect.bottom + normalizedslopBox.bottom
      )
    },
    [elementRef, hoverslopBoxNormalized]
  )

  const handleOnMouseEnter = useCallback(() => {
    mouseEvents.onMouseEnter?.()
    if (debugMode) {
      console.log("onMouseEnterEvent for", getElementName())
    }
  }, [mouseEvents, debugMode, getElementName])

  const handleOnMouseOver = useCallback(() => {
    mouseEvents.onMouseOver?.()
  }, [mouseEvents])

  const handleOnMouseLeave = useCallback(() => {
    mouseEvents.onMouseLeave?.()
    if (debugMode) {
      console.log("onMouseLeaveEvent for", getElementName())
    }
  }, [mouseEvents, debugMode, getElementName])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isInside = isWithinExtendedArea(e.clientX, e.clientY)
      setIsHovered((prevIsHovered) => {
        if (!prevIsHovered && isInside) {
          handleOnMouseEnter()
          handleOnMouseOver()
        } else if (prevIsHovered && !isInside) {
          handleOnMouseLeave()
        } else if (isInside && mouseEvents.onMouseOver) {
          handleOnMouseOver()
        }

        return isInside
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isWithinExtendedArea, mouseEvents, handleOnMouseEnter, handleOnMouseLeave, handleOnMouseOver])

  useEffect(() => {
    if (!debugMode) {
      return
    }

    return HoverslopDebug(elementRef, hoverslopBoxNormalized, isHovered, getElementName())
  }, [debugMode, elementRef, hoverslopBoxNormalized, isHovered, getElementName])

  return {
    isHovered,
  }
}
