const dataString = localStorage.getItem('authenticationData');
const data = dataString ? JSON.parse(dataString) : null;
const emailValue = localStorage.getItem('email');



export const account = {
  displayName: data && data.name ? data.name : "",
  email: emailValue,
  photoURL: '../assets/avatar/avatar_6.jpg',
};
