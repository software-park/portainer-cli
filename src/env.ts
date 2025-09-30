const portainerURL = process.env.PORTAINER_URL;
const portainerUsername = process.env.PORTAINER_USERNAME;
const portainerPassword = process.env.PORTAINER_PASSWORD;

const env = {
  portainerURL,
  portainerUsername,
  portainerPassword,
}

export type Env = typeof env;
export default env;