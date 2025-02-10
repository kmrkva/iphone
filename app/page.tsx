"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [learnMoreStates, setLearnMoreStates] = useState([false, false, false])
  const [learnMoreClicks, setLearnMoreClicks] = useState<string[]>([])
  const [mouseoverData, setMouseoverData] = useState<string[]>([])
  const mouseoverStartTime = useRef<number | null>(null)
  const currentMouseover = useRef<string | null>(null)
  const [showCompletionPage, setShowCompletionPage] = useState(false)
  const [qualtricsParms, setQualtricsParms] = useState<Record<string, string>>({})

  useEffect(() => {
    // Store Qualtrics parameters on initial load
    setQualtricsParms(getQueryParams())
  }, [])

  const phones = [
    {
      name: "iPhone 16 Pro Max",
      shortName: "iPhone16ProMax",
      buyParam: "16promax",
      image: "/iPhone-16-Pro-Max.png",
      imageHeight: 280,
      price: "From $1199 or $49.95/mo. for 24 mo.*",
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
        iphoneSize: "6.9 inches",
        transferSpeeds: "Supports USB 3 for up to 20x faster transfers",
      },
    },
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

  const handleRedirect = (buyParam: string = '', exitValue: number = 0) => {
    // For Pro Max and Pro models, show completion page
    if (buyParam === '16promax' || buyParam === '16pro') {
      setShowCompletionPage(true)
      return
    }

    // Construct URL with original and Qualtrics parameters
    const lmclicks = learnMoreClicks.join(",")
    const moData = mouseoverData.map(item => {
      const [phoneName, feature, duration] = item.split("-")
      const phone = phones.find(p => p.name === phoneName)
      if (!phone) return item
      const shortFeature = feature.slice(0, 3)
      return `${phone.shortName}-${shortFeature}-${duration}`
    }).join(",").slice(0, 4000)

    // Construct URL with existing Qualtrics parameters and new parameters
    const baseUrl = 'https://baylor.qualtrics.com/jfe/form/SV_7VOYibk5CAELbYW/'
    const queryParams = new URLSearchParams({
      ...qualtricsParms,
      lmclicks2: lmclicks,
      mo2: moData,
      exit: exitValue.toString(),
      buy2: buyParam
    })

    router.push(`${baseUrl}?${queryParams.toString()}`)
  }

  const handleTopImageClick = () => {
    handleRedirect('', 1)  // Pass exit=1 directly here
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
        setMouseoverData((prevData) => [...prevData, `${currentMouseover.current}-${duration}`])
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
          setMouseoverData((prevData) => [...prevData, `${currentMouseover.current}-${duration}`])
        }
      }
    }
  }, [])

  if (showCompletionPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <p className="mb-4">Thank you for your time taking this survey. Some participants (including you) were given a short survey, without follow-up questions. You will still receive payment for this survey.</p>
          
          <p className="text-2xl font-bold bg-yellow-200 inline-block p-2 mb-4">
            Completion code: DENZY91
          </p>
          
          <p className="mt-4">To receive payment, please enter the above completion code on Cloudresearch.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
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
      <div className="px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">MODEL. Which is best for you? </h1>
		  <p className="text-base mt-2">To choose, select Buy next to the one that is best for you. On this screen, you can choose any option (any of the 3 iPhones) or you can click learn more or other buttons.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    onClick={() => handleRedirect(phone.buyParam)}
                  >
                    Buy
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
              </div>

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
            </div>
          ))}
        </div>
      </div>
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
        <div className="w-full h-full min-h-[80px] opacity-0 group-hover:opacity-100 absolute inset-0 transition-opacity duration-200 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-md">
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