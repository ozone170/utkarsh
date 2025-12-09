import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import landingContent from '../data/landing_content.json';
import Navbar from '../components/Navbar';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hero, sections, schedule } = landingContent;

  return (
    <>
      <Navbar />
      <div className="landing-page">
      {/* Hero Section with Background Image */}
      <section className="hero-section" style={{
        backgroundImage: 'url(https://www.guidanceforever.org/wp-content/uploads/2023/11/visvesvaraya-technological-university-belgaum-featured.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%)',
          zIndex: 1
        }}></div>
        
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title">{hero.title}</h1>
          <h2 className="hero-subtitle">{hero.subtitle}</h2>
          <p className="hero-description">{hero.description}</p>
          
          {/* Student Registration CTA Only */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <button 
              className="cta-button" 
              onClick={() => navigate('/register')}
              style={{ minWidth: '250px', fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              <span style={{ fontSize: '28px', marginRight: '12px' }}>🎓</span>
              Student Registration
            </button>
          </div>

          {/* Role-based Quick Links */}
          {user && (
            <div style={{ 
              marginTop: '30px',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {user.role === 'ADMIN' && (
                <button 
                  className="cta-button-secondary" 
                  onClick={() => navigate('/admin')}
                >
                  📊 Go to Dashboard
                </button>
              )}
              {(user.role === 'SCANNER' || user.role === 'VOLUNTEER') && (
                <button 
                  className="cta-button-secondary" 
                  onClick={() => navigate('/scanner')}
                >
                  📱 Go to Scanner
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Event Schedule Section - Moved to top */}
      {schedule && (
        <section className="schedule-section">
          <div className="schedule-header">
            <div className="section-icon" style={{ fontSize: '4rem' }}>{schedule.icon}</div>
            <h2 className="schedule-title">{schedule.title}</h2>
            <p className="schedule-subtitle">3-Day Event Program</p>
          </div>

          <div className="schedule-days">
            {schedule.days.map((day, dayIndex) => (
              <div key={dayIndex} className="schedule-day">
                <div className="day-header">
                  <h3 className="day-title">{day.day}</h3>
                  <p className="day-date">{day.date}</p>
                </div>
                
                <div className="events-list">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="event-item">
                      <div className="event-time">{event.timing}</div>
                      <div className="event-details">
                        <div className="event-name">{event.event}</div>
                        <div className="event-responsible">{event.responsible}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Sections - About, Features, Contact */}
      <div className="sections-container">
        {sections.map((section) => (
          <section key={section.id} className="content-section">
            <div className="section-icon">{section.icon}</div>
            <h3 className="section-title">{section.title}</h3>
            
            {section.content && (
              <p className="section-content">{section.content}</p>
            )}
            
            {section.items && (
              <ul className="section-items">
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 UTKARSH - MBA Fresher Event. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
}

export default LandingPage;
