export const HOST = import.meta.env.VITE_REACT_SERVER_URL;

export const AUTH_ROUTE = `${HOST}/api/auth`;
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`;
export const GET_USER_INFO = `${AUTH_ROUTE}/userInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/updateProfile`;
export const UPDATE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/updateProfileImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/removeProfileImage`;
export const USER_LOG_OUT = `${AUTH_ROUTE}/logOut`;





export const CONTACT_ROUTE = `${HOST}/api/contacts`;

export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_ALL_CONTACT_LIST_OF_FRIENDS_ROUTE = `${CONTACT_ROUTE}/getContactsListOfFriends`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTE}/getAllContacts`;

// export const MESSAGES_ROUTE = `api/messages`;
export const MESSAGES_ROUTE = `${HOST}/api/messages`;

export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/getMessages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/uploadFile`;


export const CHANNEL_ROUTE = `${HOST}/api/channel`;


// export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/createChannel`;
export const CREATE_CHANNEL_ROUTE = `${HOST}/api/channel/createChannel`;
export const USER_CHANNELS_ROUTE = `${HOST}/api/channel/getChannels`;
export const CHANNEL_MESSAGES = `${HOST}/api/channel/getChannelMessages`;


