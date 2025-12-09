import { useNavigate } from 'react-router-dom';
import landingContent from '../data/landing_content.json';
import Navbar from '../components/Navbar';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { hero, sections, schedule } = landingContent;

  return (
    <>
      <Navbar />
      <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{hero.title}</h1>
          <h2 className="hero-subtitle">{hero.subtitle}</h2>
          <p className="hero-description">{hero.description}</p>
          
          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            {hero.navigation.map((nav, index) => (
              <button 
                key={index}
                className="cta-button" 
                onClick={() => navigate(nav.link)}
                style={{ minWidth: '200px' }}
              >
                <span style={{ fontSize: '24px', marginRight: '8px' }}>{nav.icon}</span>
                {nav.label}
              </button>
            ))}
          </div>
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
