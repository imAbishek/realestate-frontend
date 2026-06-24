'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { MapPin } from 'lucide-react'

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const DEFAULT_CENTER = { lat: 11.0168, lng: 76.9558 } // Coimbatore

interface Props {
  lat: number | null
  lng: number | null
  /** Called when the user picks a point (autocomplete, tap, or drag). `address`
   *  is only present when the point came from Places Autocomplete. */
  onChange: (lat: number, lng: number, address?: string) => void
}

// Places Autocomplete bound to a text input; recenters the map on selection.
function PlacesSearch({ onPick }: { onPick: (lat: number, lng: number, address: string) => void }) {
  const map = useMap()
  const places = useMapsLibrary('places')
  const inputRef = useRef<HTMLInputElement>(null)
  const [ac, setAc] = useState<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!places || !inputRef.current) return
    setAc(new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address'],
      componentRestrictions: { country: 'in' },
    }))
  }, [places])

  useEffect(() => {
    if (!ac) return
    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc = place.geometry?.location
      if (!loc) return
      const lat = loc.lat(), lng = loc.lng()
      onPick(lat, lng, place.formatted_address ?? '')
      map?.panTo({ lat, lng })
      map?.setZoom(16)
    })
    return () => listener.remove()
  }, [ac, map, onPick])

  return (
    <input
      ref={inputRef}
      placeholder="Search address or landmark…"
      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
    />
  )
}

export default function LocationPicker({ lat, lng, onChange }: Props) {
  const handlePick = useCallback(
    (la: number, ln: number, addr: string) => onChange(la, ln, addr),
    [onChange],
  )

  if (!KEY) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
        Map unavailable — set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to pin the exact location.
      </div>
    )
  }

  const position = lat != null && lng != null ? { lat, lng } : null

  return (
    <APIProvider apiKey={KEY}>
      <div className="space-y-2">
        <PlacesSearch onPick={handlePick} />
        <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
          <Map
            defaultZoom={13}
            defaultCenter={position ?? DEFAULT_CENTER}
            gestureHandling="greedy"
            disableDefaultUI
            onClick={e => { if (e.detail.latLng) onChange(e.detail.latLng.lat, e.detail.latLng.lng) }}
          >
            {position && (
              <Marker
                position={position}
                draggable
                onDragEnd={e => { if (e.latLng) onChange(e.latLng.lat(), e.latLng.lng()) }}
              />
            )}
          </Map>
        </div>
        {position && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin size={11} /> {position.lat.toFixed(5)}, {position.lng.toFixed(5)} — drag the pin or tap the map to adjust
          </p>
        )}
      </div>
    </APIProvider>
  )
}
