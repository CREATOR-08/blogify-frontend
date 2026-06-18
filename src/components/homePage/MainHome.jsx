import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Typed from 'typed.js'

const MainHome = () => {
  const el = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "BLOGIFY",
        "Share Your Latest Vlog",
        "Write About Your Journey",
        "Publish Stories People Love",
      ],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
<section className="w-full min-h-screen bg-slate-950 text-white px-6 md:px-20 flex items-center">

      <div className="mx-auto space-y-12">
        <div className="space-y-8 ">
          <div className="text-6xl md:text-7xl font-extrabold tracking-tight text-cyan-300">
            <span ref={el}></span>
          </div>
          <p className="text-lg leading-8 text-slate-300 text-center max-w-3xl mx-auto">
            Blogify helps creators publish powerful vlogs and stories with a simple editor, fast discovery, and a community that cares.
            Start your blog, explore random vlogs, and grow your voice online.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row  justify-center">
            <button
              onClick={() => navigate('/editor')}
              className="rounded-full bg-cyan-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Start a Blog
            </button>
            <button
              onClick={() => navigate('/readblog')}
              className="rounded-full border border-cyan-500 bg-transparent px-8 py-4 text-sm font-semibold text-white transition hover:bg-cyan-500/10"
            >
              Explore Random Vlogs
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainHome