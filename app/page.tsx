"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Battery, Camera, Cpu, ZoomIn, Maximize, Usb } from "lucide-react"
import { type LucideIcon } from 'lucide-react'

function getQueryParams(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const params: Record<string, string> = {}
    urlParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }
  return {}
}

export default function CompareIPhones() {
  const [learnMoreStates, setLearnMoreStates] = useState([false, false])
  const [learnMoreClicks, setLearnMoreClicks] = useState<string[]>([])
  const [mouseoverData, setMouseoverData] = useState<string[]>([])
  const mouseoverStartTime = useRef<number | null>(null)
  const currentMouseover = useRef<string | null>(null)
  const [qualtricsParms, setQualtricsParms] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [selectedPhone, setSelectedPhone] = useState<boolean>(false)

  useEffect(() => {
    // Store Qualtrics parameters on initial load
    setQualtricsParms(getQueryParams())
  }, [])
  
  const phones = [
    {
      name: "iPhone 16 Pro",
      shortName: "iPhone16Pro",
      buyParam: "16pro",
      image: "/iPhone-16-Pro.png",
      imageHeight: 256,
      price: "From $999 or $41.62/mo. for 24 mo.*",
      display: {
        label: "iPhone display",
        type: "Super Retina XDR display",
        tech: "ProMotion technology",
        extra: "Always-On display",
      },
      features: {
        opticalZoom: "Up to 5x",
        chip: "A17 Pro chip",
        camera: "Pro camera system\n48MP Main | Ultra Wide | Telephoto",
        batteryLife: "Up to 29 hours video playback",
        iphoneSize: "6.3 inches",
        transferSpeeds: "Supports USB 3 for up to 20x faster transfers",
      },
    },
    {
      name: "iPhone 16",
      shortName: "iPhone16",
      buyParam: "16",
      image: "/iPhone-16.png",
      imageHeight: 248,
      price: "From $799 or $33.29/mo. for 24 mo.*",
      display: {
        label: "iPhone display",
        type: "Super Retina XDR display",
        tech: "❌ no ProMotion technology",
        extra: "❌ no Always-On display",
      },
      features: {
        opticalZoom: "Up to 2x",
        chip: "A16 Bionic chip",
        camera: "Dual-camera system\n48MP Main | Ultra Wide",
        batteryLife: "Up to 26 hours video playback",
        iphoneSize: "6.1 inches",
        transferSpeeds: "Supports USB 2",
      },
    },
  ]

  const handleLearnMore = (index: number) => {
    setLearnMoreStates((prevState) => {
      const newState = [...prevState]
      newState[index] = true
      return newState
    })
    setLearnMoreClicks((prevClicks) => [...prevClicks, phones[index].shortName])
  }

  const updateUrlWithParams = (params: Record<string, string>) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      window.history.pushState({}, '', url)
    }
  }

  const handleAction = (buyParam: string = '', exitValue: number = 0) => {
    const lmclicks = learnMoreClicks.join(",")
    const moData = mouseoverData.map(item => {
      const [phoneName, feature, duration] = item.split("-")
      const phone = phones.find(p => p.name === phoneName)
      if (!phone) return item
      const shortFeature = feature.slice(0, 3)
      return `${phone.shortName}-${shortFeature}-${duration}`
    }).join(",").slice(0, 4000)

    // Set exit value to 2 for iPhone 16 Pro
    if (buyParam === '16pro') {
      exitValue = 2
    }

    // Construct query parameters
    const queryParams = {
      ...qualtricsParms,
      lmclicks2: lmclicks,
      mo2: moData,
      exit: exitValue.toString(),
      buy2: buyParam
    }

    // Update URL with parameters
    updateUrlWithParams(queryParams)

    // Set message based on whether it's the top image click or a select button
    if (exitValue === 1) {
      setMessage("You chose to select neither iPhone option. The redirect links have been removed for this preview, so you will not be redirected to the next screen.")
    } else {
      setMessage("This preview is identical to the initial choice webpage in the actual experiment, except that it does not redirect to the next page nor to the Qualtrics survey. It is meant to show you what the initial choice looked like.")
    }
    
    // Set selected state to hide other content
    setSelectedPhone(true)
  }

  const handleTopImageClick = () => {
    handleAction('', 1)  // Pass exit=1 directly here
  }

  const handleMouseEnter = (phoneName: string, feature: string) => {
    if (learnMoreStates[phones.findIndex((phone) => phone.name === phoneName)]) {
      mouseoverStartTime.current = Date.now()
      currentMouseover.current = `${phoneName}-${feature}`
    }
  }

  const handleMouseLeave = () => {
    if (mouseoverStartTime.current && currentMouseover.current) {
      const duration = Date.now() - mouseoverStartTime.current
      if (duration >= 20) {
        const [phoneName, feature] = currentMouseover.current.split("-")
        setMouseoverData((prevData) => {
          const newData = [...prevData]
          const phone = phones.find(p => p.name === phoneName)
          if (phone) {
            const shortFeature = feature.slice(0, 3)
            newData.push(`${phone.shortName}-${shortFeature}-${duration}`)
          }
          return newData
        })
      }
      mouseoverStartTime.current = null
      currentMouseover.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (mouseoverStartTime.current && currentMouseover.current) {
        const duration = Date.now() - mouseoverStartTime.current
        if (duration >= 20) {
          const [phoneName, feature] = currentMouseover.current.split("-")
          setMouseoverData((prevData) => {
            const newData = [...prevData]
            const phone = phones.find(p => p.name === phoneName)
            if (phone) {
              const shortFeature = feature.slice(0, 3)
              newData.push(`${phone.shortName}-${shortFeature}-${duration}`)
            }
            return newData
          })
        }
      }
    }
  }, [phones])

  const handleCloseMessage = () => {
    setMessage(null)
    setSelectedPhone(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Top browser image - always show */}
      <div className="relative w-full" onClick={handleTopImageClick}>
        <Image 
          src="/topbrowser.png" 
          alt="Top browser" 
          layout="responsive" 
          width={1200} 
          height={300} 
          className="object-cover cursor-pointer"
        />
      </div>
      
      {/* Message - show when displayed */}
      {message && (
        <div className="my-4 p-4 bg-blue-100 border border-blue-300 rounded-md">
          <p>{message}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleCloseMessage}
          >
            Close Message
          </button>
        </div>
      )}
      
      {/* Main content - hide when a phone is selected */}
      {!selectedPhone && (
        <div className="px-4 py-8 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">MODEL. Which is best for you?</h1>
            <p className="text-base mt-2">To choose, click Select next to the one that is best for you. On this screen, you can choose either option or you can click Learn more to get additional information.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phones.map((phone, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center">{phone.name}</h2>
                  <div className="flex flex-col">
                    <div className="relative" style={{ height: phone.imageHeight }}>
                      <Image src={phone.image || "/placeholder.svg"} alt={phone.name} fill className="object-contain" />
                    </div>
                    <div style={{ height: `${280 - phone.imageHeight}px` }} />
                  </div>
                  <p className="text-sm text-center">{phone.price}</p>
                  <div className="space-y-4">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      onClick={() => handleAction(phone.buyParam)}
                    >
                      Select
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-center text-gray-600">
                    If you&apos;d like to learn more information about the phone in this column, click &quot;learn more&quot;
                    directly below and then hover over the features (e.g., &quot;optical zoom&quot; or
                    &quot;chip&quot;).
                  </p>
                  <button
                    className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                    onClick={() => handleLearnMore(index)}
                  >
                    Learn more
                  </button>
                  
                  {/* Added white space that disappears when Learn More is clicked */}
                  {!learnMoreStates[index] && (
                    <div className="h-24"></div>
                  )}
                </div>

                {learnMoreStates[index] && (
                  <div className="space-y-4 pt-4">
                    <FeatureItem
                      text={phone.display.label}
                      subText={`${phone.display.type}\n${phone.display.tech}\n${phone.display.extra}`}
                      isEnabled={learnMoreStates[index]}
                      onMouseEnter={() => handleMouseEnter(phone.name, "display")}
                      onMouseLeave={handleMouseLeave}
                    />

                    <div className="space-y-4 grid grid-cols-1 gap-2">
                      {Object.entries(phone.features).map(([key, value]) => (
                        <FeatureItem
                          key={key}
                          icon={getIconForFeature(key)}
                          text={getFeatureDisplayName(key)}
                          subText={value}
                          isEnabled={learnMoreStates[index]}
                          onMouseEnter={() => handleMouseEnter(phone.name, key)}
                          onMouseLeave={handleMouseLeave}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getFeatureDisplayName(feature: string): string {
  switch (feature) {
    case "batteryLife":
      return "battery life"
    case "transferSpeeds":
      return "transfer speeds & USB"
    case "iphoneSize":
      return "iPhone size"
    case "opticalZoom":
      return "optical zoom"
    default:
      return feature
  }
}

function FeatureItem({
  icon: Icon,
  text,
  subText,
  isEnabled,
  onMouseEnter,
  onMouseLeave,
}: {
  icon?: LucideIcon
  text: string
  subText?: string
  isEnabled: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <div
      className={`group relative border border-gray-200 rounded-md ${isEnabled ? "cursor-pointer" : "cursor-not-allowed"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isEnabled && (
        <div className="w-full h-full min-h-[80px] opacity-0 group-hover:opacity-100 absolute inset-0 transition-opacity duration-200 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <p className="text-sm font-medium">{text}</p>
          {subText && <p className="text-xs text-gray-600 whitespace-pre-line">{subText}</p>}
        </div>
      )}
      <div className="text-center space-y-1 p-4">
        {Icon && (
          <div className="flex justify-center">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}

function getIconForFeature(feature: string): LucideIcon | undefined {
  switch (feature) {
    case "opticalZoom":
      return ZoomIn
    case "chip":
      return Cpu
    case "camera":
      return Camera
    case "batteryLife":
      return Battery
    case "iphoneSize":
      return Maximize
    case "transferSpeeds":
      return Usb
    default:
      return undefined
  }
}