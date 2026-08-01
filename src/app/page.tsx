import React from 'react';

export default function Home() {
  return (
    <main className="container animate-fade-in" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--accent-color)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          ✨ Support My Work
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Fuel My <span className="gradient-text">Creativity</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          If you enjoy my content and open-source projects, consider buying me a coffee. Your support helps me keep building awesome things!
        </p>
      </section>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Support Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Buy me a Coffee ☕</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1, 3, 5].map((amount) => (
              <button key={amount} className="btn btn-outline" style={{ flex: '1', minWidth: '70px', fontSize: '1.125rem' }}>
                {amount} ☕
              </button>
            ))}
            <button className="btn btn-outline" style={{ flex: '1.5', minWidth: '100px' }}>
              Custom
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Name or @twitter (optional)"
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontFamily: 'inherit'
              }}
            />
            <textarea 
              placeholder="Leave a message..."
              rows={3}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontFamily: 'inherit', resize: 'vertical'
              }}
            />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}>
            Support $5.00
          </button>
        </div>

        {/* Recent Supporters */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Supporters 💖</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'Alex D.', message: 'Keep up the great work!', amount: 3 },
              { name: 'Sarah M.', message: 'Love the new updates.', amount: 1 },
              { name: 'Anonymous', message: 'Thanks for the helpful tutorials!', amount: 5 }
            ].map((supporter, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  {supporter.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    {supporter.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.875rem' }}>bought {supporter.amount} coffee{supporter.amount > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    "{supporter.message}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>Built with ❤️ and Next.js</p>
      </footer>
    </main>
  );
}
