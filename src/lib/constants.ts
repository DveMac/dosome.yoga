type TagKey =
  | 'core'
  | 'lower_back'
  | 'butt'
  | 'back_pain'
  | 'upper_body'
  | 'full_body'
  | 'wrists'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'hip'
  | 'knee'
  | 'weight_loss'
  | 'relaxing'
  | 'stress_and_anxiety'
  | 'pain_relief'
  | 'illness'
  | 'flexibility'
  | 'balance'
  | 'stretch'
  | 'energizing'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'intense'
  | 'gentle'
  | 'vinyasa'
  | 'ashtanga'
  | 'prenatal'
  | 'power'
  | 'breath'
  | 'hatha'
  | 'chair'
  | 'restorative'
  | 'morning'
  | 'posture'
  | 'focus'
  | 'evening';

export type TagGroupKey = 'body' | 'goal' | 'difficulty' | 'style';

export const TAG_MAPPINGS: { [key in TagKey]: string[] } = {
  core: ['core', 'abs', 'lower abs', 'abdominal', 'flat stomach'],
  lower_back: ['lower back'],
  butt: ['butt'],
  back_pain: ['back reflief', 'back pain', 'siatica', 'backpain'],
  upper_body: ['upper body'],
  full_body: ['full body', 'total body', 'body'],
  wrists: ['wrists', 'wrist'],
  shoulders: ['shoulders', 'shoulder', 'shoulder pain', 'shoulder stretch'],
  legs: ['legs', 'leg', 'lower body'],
  arms: ['arms'],
  hip: ['hip', 'hips'],
  knee: ['knee', 'knees', 'knee pain'],

  weight_loss: ['fat burning', 'weight loss', 'weight lose', 'burn calories', 'lose belly fat', 'slim body'],
  relaxing: ['relaxing', 'anger release', 'relax', 'wind-down', 'chill', 'relaxation', 'calming'],
  stress_and_anxiety: ['stress relief', 'stress', 'anxiety'],
  pain_relief: ['pain relief', 'pain'],
  illness: ['sick', 'headache', 'flu'],
  flexibility: ['flexibility', 'flexible', 'flexibility exercises', 'mobility'],
  balance: ['balance'],
  posture: ['posture'],
  stretch: ['stretch', 'streching', 'stretches', 'dynamic stretching', 'static stretching'],
  energizing: ['energizing', 'mood boost', 'feel good', 'for energy'],
  focus: ['focus'],

  beginner: ['beginner', 'beginners', 'easy', 'simple'],
  intermediate: ['intermediate'],
  advanced: ['advanced', 'difficult', 'advance'],

  intense: ['hiit', 'intense', 'sweaty'],
  gentle: ['gentle', 'slow flow'],

  vinyasa: ['vinyasa', 'vinyasa flow'],
  ashtanga: ['ashtanga', 'ashtanga flow'],
  prenatal: ['prenatal'],
  power: ['power'],
  breath: ['breath', 'breathing'],
  hatha: ['hatha'],
  chair: ['chair', 'seated'],
  restorative: ['restorative'],

  morning: ['morning', 'sunrise', 'wake up', 'wake-up'],
  evening: ['evening', 'sleep', 'bedtime'],
};

export const TAG_GROUPS: { [key in TagGroupKey]: TagKey[] } = {
  body: [
    'core',
    'lower_back',
    'butt',
    'back_pain',
    'upper_body',
    'full_body',
    'wrists',
    'shoulders',
    'legs',
    'arms',
    'hip',
    'knee',
  ],
  goal: [
    'weight_loss',
    'relaxing',
    'stress_and_anxiety',
    'illness',
    'flexibility',
    'balance',
    'stretch',
    'pain_relief',
    'energizing',
    'posture',
    'focus',
  ],
  difficulty: ['beginner', 'intermediate', 'advanced'],
  style: ['ashtanga', 'vinyasa', 'power', 'hatha', 'breath', 'chair', 'restorative', 'prenatal'],
};

export const OFFSET = 4;

export const APP_NAME = 'Yoga';
export const APP_VERSION = 2;
export const COMPLETE_PERC = 0.9;
export const MAIN_PADDING = [8, 8, 12];
export const HALF_PADDING = [2, 4, 6];
export const TIME_INTERVALS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 80, 100];
