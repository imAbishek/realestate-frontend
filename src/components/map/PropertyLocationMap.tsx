'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

interface Props {
  lat: number
  lng: number
  label?: string
}

/** Read-only map pinning a listing's location (property detail page). */
export default function PropertyLocationMap({ lat, lng, label }: Props) {
  if (!KEY) return null
  return (
    <APIProvider apiKey={KEY}>
      <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
        <Map
          defaultZoom={15}
          defaultCenter={{ lat, lng }}
          gestureHandling="cooperative"
          disableDefaultUI
        >
          <Marker position={{ lat, lng }} title={label} />
        </Map>
      </div>
    </APIProvider>
  )
}
