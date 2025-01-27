
# SCADOT (Smart Contract and API Integrated Documentation Tool) 


### Prequisites

1. Install NodeJS v18.19.0
2. Setup Entrust Token:
    Prepare Entrust Token: https://account.pwc.com/mfareg/  The Entrust token is required to login into JFrog website.
3. If you don't have curl installed in your computer, please refer to Curl installation page to install it: https://curl.haxx.se/download.html

### Appkit Installation

PwC Appkit comes in two flavors - angular and react. It is hosted on a private repository and the following steps are required to be able to install the appkit packages. For this project we will be using Appkit 4 - React version To learn more about AppKit 4 React visit https://appkit.pwc.com/appkit4/content/getting-started?version=react (note: you may need to retype the version=react if auto redirected to angular after login)

#### Step 1
Login on JFrog's website(https://artifacts-west.pwc.com) by SSO.
#### Step 2
Navigate to your jfrog profile page and copy the API Key
#### Step 3
Generate .npmrc file, this will be used to authenticate your private packages installation request.
#### Step 3.1 
##### For Linux or MacOS user to create .npmrc file
`curl -u<your GUID>:<JFROG_API_KEY> https://artifacts-west.pwc.com/artifactory/api/npm/auth >> ~/.npmrc`
##### For Windows user to create .npmrc file
`curl -u<your GUID>:<JFROG_API_KEY> https://artifacts-west.pwc.com/artifactory/api/npm/auth >> %USERPROFILE%/.npmrc`

##### Note:
    1. [GUID] can be also found on the top right of JFrog's website after login.
    2. [JFROG_API_KEY] is the one which you get from JFrog(Get the "API Key" by clicking on [Edit Profile] on right top of JFrog's website).
    3. If you have an existing .npmrc file, the better to back up it at another place, remove the current one and execute the curl command to re-generate.
    4. There is no space between "-u" and [GUID];
    5. Once the .npmrc file is generated, it should be like:
                always-auth=true
                //artifacts-west.pwc.com/artifactory/api/npm/g00020-pwc-gx-digital-appkit-npm/:_auth="xxxxxxx……"

#### Step 4
##### Install appkit NPM packages
`npm install --registry=https://artifacts-west.pwc.com/artifactory/api/npm/g00020-pwc-gx-digital-appkit-npm/ @appkit4/react-components @appkit4/styles --save` 


### Install Other Dependencies
After installing Appkit, other dependencies can be installed with the usual `npm install` command.

### Running the App on Local
1. create a .env file and copy the contents from example.env file.
    - update the .env file with correct login token from "http://localhost:8080"
    - this is a temp solution till the login functionality is working.
2. Run the server:
`npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
