'use client'
import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { propertyApi, searchApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { City, Locality } from '@/types'
import { Upload, X } from 'lucide-react'

const schema = z.object({
  title:            z.string().min(1, 'Title is required'),
  description:      z.string().optional(),
  listingType:      z.enum(['SALE','RENT','PG']),
  propertyType:     z.enum(['APARTMENT','INDEPENDENT_HOUSE','VILLA','PLOT','COMMERCIAL_OFFICE','COMMERCIAL_SHOP','BUILDER_FLOOR','PG_HOSTEL']),
  localityId:       z.string().uuid('Please select a locality'),
  price:            z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be greater than 0'),
  priceUnit:        z.enum(['TOTAL','PER_MONTH','PER_SQFT']).optional(),
  priceNegotiable:  z.boolean().optional(),
  bedrooms:         z.number().int().min(0).max(20).optional(),
  bathrooms:        z.number().int().min(0).max(20).optional(),
  areaSqft:         z.number().positive('Area must be greater than 0'),
  furnishing:       z.enum(['UNFURNISHED','SEMI_FURNISHED','FULLY_FURNISHED']).optional(),
  parkingAvailable: z.boolean().optional(),
  addressLine:      z.string().optional(),
})
type FormData = z.infer<typeof schema>

const STEPS = ['Basic info', 'Location', 'Details', 'Photos']

export default function PostPropertyPage() {
  const router  = useRouter()
  const { isLoggedIn, _hasHydrated } = useAuthStore()
  const [step,       setStep]       = useState(0)
  const [cities,     setCities]     = useState<City[]>([])
  const [localities, setLocalities] = useState<Locality[]>([])
  const [cityId,     setCityId]     = useState('')
  const [images,        setImages]        = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const urls = images.map(f => URL.createObjectURL(f))
    setImagePreviews(urls)
    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [images])
  const [, setCreatedId]  = useState<string | null>(null)
  const [loading,    setLoading]    = useState(false)

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { listingType: 'SALE', propertyType: 'APARTMENT', priceUnit: 'TOTAL', furnishing: 'UNFURNISHED', parkingAvailable: false, priceNegotiable: false },
  })
  const listingType = watch('listingType')

  useEffect(() => { if (_hasHydrated && !isLoggedIn) router.push('/auth/login') }, [_hasHydrated, isLoggedIn, router])
  useEffect(() => { searchApi.cities().then(r => setCities(r.data)) }, [])
  useEffect(() => {
    if (cityId) searchApi.localities(cityId).then(r => setLocalities(r.data))
  }, [cityId])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await propertyApi.create(data)
      const id  = res.data.id
      setCreatedId(id)

      // Upload images if any
      for (let i = 0; i < images.length; i++) {
        await propertyApi.uploadImage(id, images[i], i === 0)
      }

      toast.success('Property listed! It will go live after admin review.')
      router.push('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; fieldErrors?: Record<string, string> } } })?.response?.data
      const msg = data?.message || (data?.fieldErrors ? Object.values(data.fieldErrors)[0] : null)
      toast.error(msg || 'Failed to post property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleImageDrop(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const files = Array.from(e.target.files).slice(0, 20 - images.length)
    setImages(prev => [...prev, ...files])
  }

  function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
  const selectCls = inputCls + " bg-white"

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Post your property</h1>
      <p className="text-sm text-gray-500 mb-8">Fill in the details below. Your listing goes live after a quick review.</p>

      {/* Step progress */}
      <div className="flex items-start mb-10">
        {STEPS.map((s, i) => (
          <Fragment key={s}>
            <button type="button" onClick={() => { if (i <= step) setStep(i) }}
              className="flex flex-col items-center group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                ${i < step ? 'bg-green-500 text-white group-hover:bg-green-600 cursor-pointer' : i === step ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400 cursor-default'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1.5 whitespace-nowrap ${i === step ? 'text-brand-600 font-medium' : i < step ? 'text-green-600 group-hover:underline' : 'text-gray-400'}`}>{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mt-4 mx-2 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </Fragment>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, () => toast.error('Please complete all required fields'))}
        onKeyDown={e => { if (e.key === 'Enter' && step < STEPS.length - 1) e.preventDefault() }}
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {/* STEP 0: Basic info */}
          {step === 0 && (
            <>
              <Field label="Listing type" error={errors.listingType?.message}>
                <div className="flex gap-2">
                  {(['SALE','RENT','PG'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setValue('listingType', t)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors
                        ${listingType === t ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                      {t === 'SALE' ? 'Sale' : t === 'RENT' ? 'Rent' : 'PG'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Property type" error={errors.propertyType?.message}>
                <select {...register('propertyType')} className={selectCls}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="INDEPENDENT_HOUSE">Independent house</option>
                  <option value="VILLA">Villa</option>
                  <option value="PLOT">Plot</option>
                  <option value="BUILDER_FLOOR">Builder floor</option>
                  <option value="COMMERCIAL_OFFICE">Commercial office</option>
                  <option value="COMMERCIAL_SHOP">Commercial shop</option>
                  <option value="PG_HOSTEL">PG / Hostel</option>
                </select>
              </Field>

              <Field label="Property title" error={errors.title?.message}>
                <input {...register('title')} placeholder="e.g. 3 BHK apartment in RS Puram with parking" className={inputCls} />
              </Field>

              <Field label="Description (optional)">
                <textarea {...register('description')} rows={4} placeholder="Describe the property, nearby landmarks, special features..." className={inputCls + ' resize-none'} />
              </Field>
            </>
          )}

          {/* STEP 1: Location */}
          {step === 1 && (
            <>
              <Field label="City">
                <select value={cityId} onChange={e => { setCityId(e.target.value); setValue('localityId', '') }} className={selectCls}>
                  <option value="">Select city</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <Field label="Locality / Area" error={errors.localityId?.message}>
                <select {...register('localityId')} className={selectCls} disabled={!cityId}>
                  <option value="">Select locality</option>
                  {localities.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </Field>

              <Field label="Full address (optional)">
                <textarea {...register('addressLine')} rows={2} placeholder="Flat no, street name, landmark..." className={inputCls + ' resize-none'} />
              </Field>
            </>
          )}

          {/* STEP 2: Property details */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (₹)" error={errors.price?.message}>
                  <input type="number" {...register('price', { valueAsNumber: true })} placeholder="e.g. 5000000" className={inputCls} />
                </Field>
                <Field label="Price unit">
                  <select {...register('priceUnit')} className={selectCls}>
                    <option value="TOTAL">Total price</option>
                    <option value="PER_MONTH">Per month</option>
                    <option value="PER_SQFT">Per sqft</option>
                  </select>
                </Field>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('priceNegotiable')} className="accent-brand-600 w-4 h-4 rounded" />
                <span className="text-sm text-gray-600">Price is negotiable</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Bedrooms">
                  <select {...register('bedrooms', { valueAsNumber: true })} className={selectCls}>
                    {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 0 ? 'Studio' : `${n} BHK`}</option>)}
                  </select>
                </Field>
                <Field label="Bathrooms">
                  <select {...register('bathrooms', { valueAsNumber: true })} className={selectCls}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Area (sqft)" error={errors.areaSqft?.message}>
                <input type="number" {...register('areaSqft', { valueAsNumber: true })} placeholder="e.g. 1200" className={inputCls} />
              </Field>

              <Field label="Furnishing">
                <select {...register('furnishing')} className={selectCls}>
                  <option value="UNFURNISHED">Unfurnished</option>
                  <option value="SEMI_FURNISHED">Semi-furnished</option>
                  <option value="FULLY_FURNISHED">Fully furnished</option>
                </select>
              </Field>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('parkingAvailable')} className="accent-brand-600 w-4 h-4 rounded" />
                <span className="text-sm text-gray-600">Parking available</span>
              </label>
            </>
          )}

          {/* STEP 3: Photos */}
          {step === 3 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Upload up to 20 photos. First photo will be the cover image.</p>
              <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-300 transition-colors">
                <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag photos here</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP — max 10MB each</p>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageDrop} />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded">Cover</span>
                      )}
                      <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow">
                        <X size={12} className="text-gray-600" />
                      </button>
                    </div>
                  ))}

                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={async () => {
              const stepFields: Record<number, (keyof FormData)[]> = {
                0: ['title', 'listingType', 'propertyType'],
                1: ['localityId'],
                2: ['price', 'areaSqft'],
              }
              const valid = await trigger(stepFields[step] ?? [])
              if (valid) setStep(s => s + 1)
            }}
              className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
              Continue →
            </button>
          ) : (
            <button type="button" disabled={loading}
              onClick={() => handleSubmit(onSubmit, () => toast.error('Please complete all required fields'))()}
              className="flex-1 bg-accent-400 hover:bg-accent-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit listing'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
