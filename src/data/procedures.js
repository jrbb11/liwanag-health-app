export const procedures = [
  {
    id: 1,
    name: 'Appendectomy',
    category: 'Surgery',
    description: 'Surgical removal of the appendix',
    philhealthCoverage: 15000,
    baseCost: {
      public: 20000,
      private: 80000
    },
    additionalFees: [
      { name: 'Anesthesia', cost: 5000 },
      { name: 'Operating Room', cost: 3000 },
      { name: 'Medications', cost: 2000 }
    ]
  },
  {
    id: 2,
    name: 'Cesarean Section',
    category: 'Obstetrics',
    description: 'Surgical delivery of a baby',
    philhealthCoverage: 19000,
    baseCost: {
      public: 25000,
      private: 120000
    },
    additionalFees: [
      { name: 'Anesthesia', cost: 8000 },
      { name: 'Operating Room', cost: 5000 },
      { name: 'Medications', cost: 3000 },
      { name: 'Newborn Care', cost: 5000 }
    ]
  },
  {
    id: 3,
    name: 'Cataract Surgery',
    category: 'Ophthalmology',
    description: 'Surgical removal of cloudy lens',
    philhealthCoverage: 16000,
    baseCost: {
      public: 22000,
      private: 90000
    },
    additionalFees: [
      { name: 'Anesthesia', cost: 4000 },
      { name: 'Operating Room', cost: 3000 },
      { name: 'Intraocular Lens', cost: 15000 }
    ]
  },
  {
    id: 4,
    name: 'Hip Replacement',
    category: 'Orthopedics',
    description: 'Surgical replacement of hip joint',
    philhealthCoverage: 25000,
    baseCost: {
      public: 35000,
      private: 250000
    },
    additionalFees: [
      { name: 'Anesthesia', cost: 10000 },
      { name: 'Operating Room', cost: 8000 },
      { name: 'Prosthesis', cost: 50000 },
      { name: 'Physical Therapy', cost: 5000 }
    ]
  },
  {
    id: 5,
    name: 'Cardiac Bypass Surgery',
    category: 'Cardiology',
    description: 'Surgical procedure to improve blood flow to the heart',
    philhealthCoverage: 30000,
    baseCost: {
      public: 40000,
      private: 500000
    },
    additionalFees: [
      { name: 'Anesthesia', cost: 15000 },
      { name: 'Operating Room', cost: 20000 },
      { name: 'ICU Stay', cost: 10000 },
      { name: 'Medications', cost: 8000 }
    ]
  }
]; 