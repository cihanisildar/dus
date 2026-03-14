# DUS Dental Placement Tracker - Complete App Prompt

## App Overview
Create a comprehensive web application for dentistry students in Turkey who are taking the DUS (Diş Hekimliği Uzmanlık Sınavı) exam. The app helps students make informed decisions about their specialty placement preferences by showing real-time selection data and calculating placement probabilities based on ÖSYM's official Merkezi Yerleştirme Sistemi (Central Placement System) algorithm.

---

## Core Features Required

### 1. User Registration & Authentication
**Registration Requirements:**
- Personal information (name, email, phone number)
- **ÖSYM exam result code** (to verify DUS exam participation and retrieve score)
- Payment processing before full access
- Verification system to validate ÖSYM result codes

**Authentication:**
- Secure login system
- Password recovery mechanism
- Session management
- Automatic DUS score retrieval from ÖSYM system

---

### 2. Payment Integration
**Payment System:**
- One-time access fee payment gateway
- Support for Turkish payment methods:
  - Credit/debit cards (Visa, Mastercard, Troy)
  - Bank transfer option
  - Mobile payment integration
- Payment confirmation and digital receipt generation
- Secure payment processing (PCI DSS compliant)
- Subscription/access management system
- Refund policy implementation

---

### 3. Hospital Cadre (Placement Spots) Database
**Data Management:**
- Fetch and maintain available cadre positions for each city's dental hospitals
- Database should include:
  - City name
  - Hospital name
  - Specialty department (8 DUS specialties):
    - Ağız, Diş ve Çene Cerrahisi
    - Ağız, Diş ve Çene Radyolojisi
    - Endodonti
    - Ortodonti
    - Pedodonti (Çocuk Diş Hekimliği)
    - Periodontoloji
    - Protetik Diş Tedavisi
    - Restoratif Diş Tedavisi
  - Number of available positions (kontenjan)
  - University affiliation
  - Any specific requirements

**Update Mechanism:**
- Regular synchronization with official ÖSYM/YÖK announcements
- Admin panel for manual cadre updates
- Historical data storage for trend analysis
- Real-time notification system for cadre changes

---

### 4. Advanced Preference Selection System (Up to 30 Choices)
**Selection Interface:**
- Each verified user can select **up to 30 preferences** in ranked order
- Drag-and-drop interface for easy reordering
- Search and filter functionality:
  - By city
  - By specialty
  - By university
  - By competition level
- Save draft preferences
- Edit preferences until submission deadline

**Real-time Statistics Display:**
- Total available spots for each option
- Number of students who selected this option (at any rank)
- Average preference rank for this option
- Competition ratio (applicants per spot)
- Historical taban puan (minimum score) from previous years

---

### 5. ÖSYM Merkezi Yerleştirme Sistemi Algorithm Implementation

#### Official ÖSYM Algorithm Rules
Based on ÖSYM's Merkezi Yerleştirme Sistemi, the placement algorithm follows these **exact principles**:

**Primary Principle:**
The most important priority in placement is the placement score (yerleştirme puanı). Among candidates who prefer the same program, regardless of preference order, priority is given to the candidate with the highest placement score (including any additional points).

**Key Rule:** 
**A candidate with a lower score can NEVER be placed in a program before a candidate with a higher score, regardless of preference order.**

**Tie-Breaking Rules (in order):**
When two candidates have equal placement scores:
1. Higher TYT/SAY/SÖZ/EA/DİL exam score
2. Candidate who listed the program at a higher preference rank
3. Higher OBP (Ortaöğretim Başarı Puanı)
4. Younger candidate (more recent birth date)

#### Algorithm Implementation

```
ÖSYM Merkezi Yerleştirme Algorithm for DUS:

FOR each placement program (in any order):
  1. Collect all candidates who listed this program in their preferences
  2. Sort candidates by:
     a) Placement score (DUS + additional points) - DESCENDING
     b) If tied: TYT/SAY score - DESCENDING
     c) If tied: Preference rank for this program - ASCENDING (higher preference = lower number)
     d) If tied: OBP - DESCENDING
     e) If tied: Age - DESCENDING (younger = higher birth date)
  
  3. FOR each candidate in sorted order:
     IF candidate not yet placed AND positions available:
       - Place candidate in this program
       - Mark candidate as placed
       - Reduce available positions by 1
     ELSE IF candidate already placed in a higher preference:
       - Skip (candidate keeps better placement)
     ELSE:
       - Skip (program full or candidate placed elsewhere)

RESULT: Each candidate is placed in their highest-preference program where:
  - They have sufficient score to compete
  - A position is available after higher-scoring candidates
```

#### Probability Calculation Model

The app calculates placement probability for each of a user's 30 preferences:

```javascript
For each user preference (rank 1-30):
  
  1. Get all competing candidates for this program
  
  2. Score Analysis:
     - Count candidates with HIGHER DUS score than user
     - Count candidates with EQUAL DUS score (apply tie-breakers)
     - Count candidates with LOWER DUS score
  
  3. Calculate "Effective Competition":
     effectiveCompetitors = 0
     
     For each candidate with higher or equal score:
       // They will ALWAYS be considered before the user
       effectiveCompetitors += 1
     
     // Note: Preference order does NOT matter for candidates 
     // with higher scores - they get priority regardless
  
  4. Calculate Placement Probability:
     availableSpots = program.kontenjan
     
     IF effectiveCompetitors < availableSpots:
       // User's score is competitive
       probability = ((availableSpots - effectiveCompetitors) / availableSpots) * 100
     ELSE:
       // User's score is below likely cutoff
       probability = estimateProbabilityBelowCutoff(
         userScore,
         effectiveCompetitors,
         availableSpots,
         historicalData
       )
  
  5. Adjust for user's preference order:
     // If user gets placed in higher preference, 
     // lower preferences become irrelevant
     
     FOR preference_rank from 1 to current_preference:
       IF probability[preference_rank] > 50%:
         // Likely to be placed in higher preference
         current_probability *= (1 - probability[preference_rank])
  
  6. Categorize probability:
     90-100%: Very High (Güvenli)
     70-89%:  High (Yüksek İhtimal)
     40-69%:  Medium (Orta İhtimal)
     15-39%:  Low (Düşük İhtimal)
     0-14%:   Very Low (Çok Düşük)
```

**Critical Implementation Notes:**
- Score is the ONLY factor that determines initial ordering
- Preference order ONLY matters as a tie-breaker when scores are exactly equal
- Historical data helps estimate cutoffs, but real-time user data is primary
- System must recalculate probabilities as new users register and update preferences

---

### 6. Analytics Dashboard

#### Personal Analytics
**User's Placement Strategy View:**
- Complete ranked list of 30 preferences with:
  - Program name, city, university
  - User's preference rank (1-30)
  - Calculated probability percentage
  - Available spots (kontenjan)
  - Number of competitors
  - User's score vs. estimated cutoff score
  - Historical taban puan comparison

**Risk Assessment:**
- Color-coded preference list (green = safe, yellow = moderate, red = risky)
- "Expected Placement" prediction (highest probability choice)
- Strategy balance indicator:
  - Too ambitious (all low probability)
  - Too safe (missing better opportunities)
  - Well-balanced (mix of reach/target/safety)

**Personalized Recommendations:**
- "Add Safety Options": Suggest programs where user has >70% probability
- "Consider These Targets": Programs with 40-70% probability
- "Reach Options": Programs with 15-40% probability
- "Optimize Order": Suggestions to reorder preferences for better outcomes

#### Market Intelligence Dashboard

**Overall Competition Statistics:**
- Most competitive specialties (highest applicant-to-spot ratio)
- Least competitive specialties
- Most competitive cities
- Least competitive cities
- Most popular programs (by number of applicants)

**Detailed Program Analytics:**
For each program, display:
- Total applicants
- Available spots (kontenjan)
- Competition ratio (X applicants per spot)
- Score distribution of all applicants:
  - Minimum score
  - 25th percentile
  - Median score
  - 75th percentile
  - Maximum score
- Estimated cutoff score (based on spots and score distribution)
- Historical taban puan trends (previous years)

**Preference Order Heatmap:**
- Visual representation showing:
  - At which preference ranks (1-30) each program is typically selected
  - Average preference rank for each program
  - Helps users understand if they're ranking programs appropriately

**Specialty-wise Comparison:**
- Aggregate data for each of 8 specialties
- City-wise distribution of competition
- University-wise comparison

#### Trend Analysis
- Real-time updates as more students register
- Daily/weekly competition changes
- Alerts when significant shifts occur in user's selected programs

---

### 7. Dynamic Simulation & Strategy Tools

**"What-If" Scenario Testing:**
- Allow users to create multiple preference list scenarios
- Compare outcomes across different strategies
- Test reordering impact on probabilities
- Save and name different strategies

**Strategy Comparison:**
- Compare user's strategy with anonymized successful strategies from previous years
- "Similar Score" analysis: See what choices other users with similar scores made
- Success rate indicators for different preference patterns

**Real-time Updates:**
- Live probability recalculation as new users register
- Notification system for significant changes in user's programs
- Deadline countdown for preference submission

---

### 8. Data Privacy & Security

**Data Protection:**
- Secure encrypted storage of:
  - ÖSYM result codes
  - DUS scores
  - Personal information
  - Payment details
- KVKK (Turkish Personal Data Protection Law) full compliance
- GDPR-compliant data handling practices

**Privacy Features:**
- Anonymized display of all statistics (no personal data visible)
- User data is aggregated for analytics
- Option to delete account and all data
- Transparent data usage policy
- Cookie consent management

**Security Measures:**
- SSL/TLS encryption for all communications
- Two-factor authentication option
- Regular security audits
- Secure payment gateway integration
- Protection against SQL injection, XSS, CSRF attacks
- Rate limiting to prevent abuse

---

## Technical Requirements

### Frontend
- **Responsive Design**: Mobile-first approach, works on all devices
- **Framework**: Modern JavaScript framework (React, Vue, or Angular)
- **UI/UX**: Clean, intuitive interface in Turkish language
- **Real-time Updates**: WebSocket or polling for live data
- **Progressive Web App**: Installable, works offline (for viewing saved data)

### Backend
- **API Architecture**: RESTful API or GraphQL
- **Database**: PostgreSQL or MongoDB for scalability
- **Caching**: Redis for performance optimization
- **Queue System**: For handling intensive calculations (probability updates)
- **Authentication**: JWT-based secure authentication
- **Rate Limiting**: Prevent API abuse

### Algorithm & Performance
- **Calculation Engine**: Optimized algorithm for handling thousands of users
- **Background Jobs**: Scheduled recalculation of probabilities
- **Caching Strategy**: Cache calculation results, invalidate on data changes
- **Scalability**: Design to handle concurrent users during peak times

### Admin Panel
- **Cadre Management**: CRUD operations for hospital/program data
- **User Management**: View users, handle support requests
- **Analytics**: System usage statistics
- **Payment Tracking**: Monitor payments, handle refunds
- **System Monitoring**: Server health, performance metrics

---

## User Flow

### Complete User Journey

1. **Landing Page**: User learns about the app
2. **Registration**: User creates account with basic info
3. **Payment**: User pays one-time fee
4. **ÖSYM Verification**: User enters ÖSYM result code
5. **Score Retrieval**: System fetches DUS score automatically
6. **Verification Success**: User gains full access
7. **Dashboard**: User views analytics and market intelligence
8. **Browse Programs**: User explores available cadre options
9. **Select Preferences**: User builds list of up to 30 preferences
10. **Drag to Reorder**: User optimizes preference order
11. **View Probabilities**: System calculates and displays placement probabilities
12. **Analyze Strategy**: User reviews risk assessment and recommendations
13. **What-If Scenarios**: User tests different strategies
14. **Refine Choices**: User adjusts based on insights
15. **Final Submission**: User submits preference list
16. **Monitor Changes**: User receives alerts about significant changes
17. **Placement Results**: After official results, compare predictions with actual outcome

---

## Additional Features & Considerations

### Mobile App (Optional Future Enhancement)
- Native iOS and Android apps
- Push notifications for updates
- Offline mode for viewing saved preferences

### Community Features (Optional)
- Discussion forum (anonymous)
- Success stories from previous years
- Tips and strategies sharing
- Q&A section

### Integration Possibilities
- Direct integration with ÖSYM API (if available)
- Email notifications for important updates
- SMS alerts for deadline reminders
- Export preference list to PDF

### Compliance & Legal
- Terms of Service
- Privacy Policy
- Cookie Policy
- Disclaimer: App provides estimates, not guarantees
- Clear communication that official ÖSYM placement is final

### Support System
- Help center with FAQs
- Video tutorials
- Email support
- Live chat during peak times
- Feedback mechanism

---

## Success Metrics

### For Users
- Accurate probability predictions (validated against actual results)
- User satisfaction rate
- Strategy optimization success rate
- Time saved in research and decision-making

### For Platform
- User registration and retention rates
- Payment conversion rate
- System uptime and performance
- Algorithm accuracy (compare predictions to actual results)
- User engagement metrics

---

## Development Phases

### Phase 1: MVP (Minimum Viable Product)
- User registration and authentication
- ÖSYM verification
- Payment integration
- Basic preference selection (up to 30)
- Simple probability calculation
- Basic dashboard

### Phase 2: Enhanced Features
- Advanced probability algorithm with ÖSYM rules
- Comprehensive analytics dashboard
- What-if scenarios
- Mobile responsiveness
- Historical data integration

### Phase 3: Optimization
- Performance optimization for scale
- Real-time updates
- Advanced caching
- Mobile apps
- Community features

### Phase 4: Intelligence
- Machine learning for better predictions
- Personalized recommendations engine
- Success pattern analysis
- Predictive analytics

---

## Important Notes

1. **Algorithm Accuracy**: The ÖSYM Merkezi Yerleştirme Sistemi prioritizes score above all else. This is non-negotiable and must be reflected accurately in the app.

2. **Ethical Considerations**: The app should be transparent that it provides estimates based on current data and cannot guarantee placement outcomes.

3. **Legal Disclaimer**: Make it clear that official ÖSYM placements are final and the app is an auxiliary tool for decision support.

4. **Data Freshness**: Probabilities must be recalculated frequently as new users register and update preferences.

5. **Fair Access**: Consider offering discounted or free access for students with financial difficulties.

6. **Continuous Improvement**: Collect actual placement results to validate and improve prediction accuracy for future years.

---

## Conclusion

This app aims to democratize access to placement insights, reduce anxiety around DUS preference selection, and help dentistry students make data-driven decisions about their future specializations. By implementing the official ÖSYM algorithm and providing comprehensive analytics, the platform can become an invaluable resource for the DUS community in Turkey.

## Tech Stack

- Frontend: Next.js
- Backend: Next.js API routes
- Database: PostgreSQL (Convex) + Server Actions + Axios + TanStack Query
- Authentication: NextAuth.js
- Payment: iyzico
- Queue: Bull
- Caching: Redis
- Analytics: Google Analytics
- UI/UX: Tailwind CSS + Shadcn UI