import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 px-6">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Blogify</h2>
          <p className="leading-7 text-slate-400">
            Blogify makes it easy to write, publish, and grow your vlog content. Build a readership and share your story with confidence.
          </p>
          <p className="text-sm text-slate-500">Questions? Reach out anytime.</p>
          <a href="mailto:himanshubhagat0801@gmail.com" className="text-cyan-400 hover:text-cyan-300">
            himanshubhagat0801@gmail.com
          </a>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <ul className="space-y-3 text-slate-400">
            <li><a href="/createblog" className="hover:text-white">Start a Blog</a></li>
            <li><a href="/readblog" className="hover:text-white">Explore Vlogs</a></li>
            <li><a href="/signup" className="hover:text-white">Create Account</a></li>
            <li><a href="/login" className="hover:text-white">Log In</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Updates</h3>
          <p className="text-slate-400 leading-7">
            New templates, faster publishing, and smarter discovery are coming soon. Subscribe and stay on top of every update.
          </p>
          <div className="rounded-3xl bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Newsletter</p>
            <p className="mt-3 text-slate-400">Send your email to get new feature announcements and creator tips.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
