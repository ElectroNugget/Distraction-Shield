//Default learning sites are set here.
export const defaultExerciseSites = [
  {
    "hostname": "www.sololearn.com",
    "href": "http://sololearn.com",
    "pathname": "/",
    "regex": "*://*.www.sololearn.com/*",
    "tld": "com",
    "domain": "sololearn",
    "subdomain": "www",
    "name": "SoloLearn"
  },
  {
    "hostname": "www.codecademy.com",
    "href": "http://codecademy.com",
    "pathname": "/",
    "regex": "*://*.www.codecademy.com/*",
    "tld": "com",
    "domain": "codecademy",
    "subdomain": "www",
    "name": "Codecademy"
  },
  {
    "hostname": "www.scrimba.com",
    "href": "http://scrimba.com",
    "pathname": "/",
    "regex": "*://*.www.scrimba.com/*",
    "tld": "com",
    "domain": "scrimba",
    "subdomain": "www",
    "name": "SCrimba"
  }
];

//Defaults for exercise duration and timeout are also set here.
export const defaultExerciseSite = defaultExerciseSites[0];

export const defaultexerciseDuration = 1 * 10 * 1000; // 10 seconds

export const defaultTimeout = 5 * 60 * 1000; // 5 minutes

export const defaultTimeoutInterval = 30 * 60 * 1000; // 30 minute- increments

export const s2 = 'https://www.google.com/s2/favicons?domain=';

export const defaultColors = 
                      ['#FF0000', '#00FF00','#0000FF', 
                      '#800000', '#4B0082', '#800080', 
                      '#FFFF00', '#00FFFF', '#FF00FF', 
                      '#C0C0C0', '#808080', '#800000', 
                      '#808000', '#008000', '#800080',
                      '#008080', '#000080', '#fff8dc'];