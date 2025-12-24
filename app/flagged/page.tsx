"use client"

import React, { useEffect, useState } from "react"

type FlaggedReview = {
  _id?: { $oid?: string }
  id: string
  teaching?: number
  leniency?: number
  correction?: number
  daQuiz?: number
  remarks?: string
  submittedById?: string
  submittedByName?: string
  submittedAt?: { $date?: string } | string,
  pwd?: string
}

export default function FlaggedPage() {
  const [reviews, setReviews] = useState<FlaggedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState<string>(""); 
  useEffect(() => {
    let mounted = true
    if (typeof window !== "undefined") {
      const p = window.prompt("Enter password to view flagged reviews:")
      console.log(p)
      if (!p) {
        setError("Password is required to view flagged reviews.")
        // prevent state updates from the fetch if user cancels
       
      } else {
        setPassword(p)
      }
    }
    ;(async () => {
      try {
        const res = await fetch("/api/flagged")
        if (!res.ok) throw new Error(`fetch /api/flagged failed: ${res.status}`)
        const data = await res.json()
        if (!mounted) return
        // normalize: ensure each item has `id` and `remarks`
        const list: FlaggedReview[] = (Array.isArray(data) ? data : []).map((r: any) => ({
          _id: r._id,
          id: r.id ?? (r._id?.$oid ?? r.id),
          teaching: r.teaching,
          leniency: r.leniency,
          correction: r.correction,
          daQuiz: r.daQuiz ?? r.daQuiz,
          remarks: r.remarks ?? "",
          submittedById: r.submittedById,
          submittedByName: r.submittedByName,
          submittedAt: r.submittedAt ?? r.submittedAt,
          pwd: password
        }))
        setReviews(list)
      } catch (err: any) {
        console.error(err)
        setError(String(err?.message ?? err))
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const formatDate = (d?: { $date?: string } | string) => {
    if (!d) return "-"
    const s = typeof d === "string" ? d : d.$date ?? String(d)
    try {
      const dt = new Date(s)
      if (isNaN(dt.getTime())) return s
      return dt.toLocaleString()
    } catch {
      return s
    }
  }

  async function submitReview(updated: FlaggedReview) {
    setError(null)
    setSavingId(updated.id)
    try {
       updated.pwd=password;
      // send to api. We'll call PUT /api/flagged/:id
      const res = await fetch(`/api/flagged`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       
        body: JSON.stringify(updated),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`save failed: ${res.status} ${text}`)
      }
      const saved = await res.json()
      // update local list with server response if provided
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? { ...r, remarks: updated.remarks } : r)))
    } catch (err: any) {
      console.error(err)
      setError(String(err?.message ?? err))
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <div className="p-6">Loading flagged reviews…</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="mx-auto max-w-[90vw] px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Flagged Reviews</h1>
      {reviews.length === 0 ? (
        <div className="text-tertiary">No flagged reviews found.</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-xl border bg-card p-2 shadow-sm">
            <table className="min-w-full">
              <thead>
                <tr className="text-left bg-muted">
                  <th className="p-3 text-xs font-semibold text-tertiary uppercase tracking-wide">ID</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Teaching</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Leniency</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Correction</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">DA/Quiz</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Remarks</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Submitted By</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Submitted At</th>
                  <th className="p-3 text-xs font-semibold text-tertiary">Action</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {reviews.map((r) => {
                  return (
                    <tr key={r.id ?? r._id?.$oid ?? Math.random().toString(36).slice(2, 9)} className="align-top border-b last:border-b-0">
                      <td className="p-3 align-top text-sm max-w-[12rem] break-words text-tertiary">{r.id}</td>
                      <td className="p-3 text-sm">{r.teaching ?? "-"}</td>
                      <td className="p-3 text-sm">{r.leniency ?? "-"}</td>
                      <td className="p-3 text-sm">{r.correction ?? "-"}</td>
                      <td className="p-3 text-sm">{r.daQuiz ?? "-"}</td>
                      <td className="p-3 text-tertiary w-[40%]">
                        <EditableRemarks
                          initial={r.remarks ?? ""}
                          onSave={(val) => setReviews((prev) => prev.map((x) => (x._id == r._id ? { ...x, remarks: val } : x)))}
                        />
                      </td>
                      <td className="p-3">{r.submittedByName ?? r.submittedById ?? "-"}</td>
                      <td className="p-3 text-sm">{formatDate(r.submittedAt)}</td>
                      <td className="p-3">
                        <button
                          className="bg-green-800 text-white px-3 py-1 rounded-md disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
                          disabled={savingId === r.id}
                          onClick={async () => {
                            const current = reviews.find((x) => x.id === r.id)
                            if (!current) return
                            await submitReview(current)
                          }}
                        >
                          {savingId === r.id ? "Saving…" : "Submit"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {reviews.map((r) => (
              <div key={r.id ?? r._id?.$oid ?? Math.random().toString(36).slice(2, 9)} className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="text-sm text-tertiary break-words font-medium">{r.id}</div>
                  <div className="text-xs text-tertiary">{formatDate(r.submittedAt)}</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-tertiary">Teaching</span>
                    <span className="inline-flex items-center justify-center mt-1 px-2 py-0.5 rounded-full bg-muted text-sm font-medium">{r.teaching ?? "-"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-tertiary">Leniency</span>
                    <span className="inline-flex items-center justify-center mt-1 px-2 py-0.5 rounded-full bg-muted text-sm font-medium">{r.leniency ?? "-"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-tertiary">Correction</span>
                    <span className="inline-flex items-center justify-center mt-1 px-2 py-0.5 rounded-full bg-muted text-sm font-medium">{r.correction ?? "-"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-tertiary">DA/Quiz</span>
                    <span className="inline-flex items-center justify-center mt-1 px-2 py-0.5 rounded-full bg-muted text-sm font-medium">{r.daQuiz ?? "-"}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-tertiary mb-1">Submitted by</div>
                  <div className="text-sm">{r.submittedByName ?? r.submittedById ?? "-"}</div>
                </div>

                <div className="mt-3">
                  <EditableRemarks
                    initial={r.remarks ?? ""}
                    onSave={(val) => setReviews((prev) => prev.map((x) => (x._id == r._id ? { ...x, remarks: val } : x)))}
                  />
                </div>

                <div className="mt-3 text-right">
                  <button
                    className="bg-primary text-white px-3 py-1 rounded-md disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/50"
                    disabled={savingId === r.id}
                    onClick={async () => {
                      const current = reviews.find((x) => x.id === r.id)
                      if (!current) return
                      await submitReview(current)
                    }}
                  >
                    {savingId === r.id ? "Saving…" : "Submit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EditableRemarks({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [value, setValue] = useState(initial)
  useEffect(() => setValue(initial), [initial])
  return (
    <div>
      <textarea
        className=" p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 text-black focus:ring-primary/50 resize-vertical"
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-2 text-right">
        <button
          className="text-sm bg-green-400 font-bold text-gray-800 px-3 py-1 rounded-md"
          onClick={() => onSave(value)}
        >
          Set
        </button>
      </div>
    </div>
  )
}
