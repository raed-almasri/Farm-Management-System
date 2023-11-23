# Farm Management System

## About

This farm management system is designed to efficiently manage and automate a private cattle farm located in the western countryside of Hama. It contains over 130 cows, and the goal of this system is to improve the performance and efficiency of farm management and cow care. This project aims to provide a management system that facilitates and improves all aspects of farm work, from tracking and managing resources to providing healthcare for cows and improving milk productivity. [Source 7]

## Features

The project includes several features that facilitate the work of farm workers, such as quick search in all farm records, sorting, organizing, saving, and editing records. It also includes several features that benefit the farm investor by enabling them to track the performance of their farm accurately and make clear decisions based on accurate information. Here are some of the main features:

1. **Resource Tracking and Management**: Record and monitor cow details such as offspring, feeding, and vaccinations. This contributes to improved planning and optimal use of available resources.

2. **Health Monitoring**: Monitor the health of cows continuously and identify any existing health problems on the farm.

3. **Productivity Increase**: Analyze data and information to improve production processes and increase production efficiency, whether in increasing milk production or controlling feed consumption.

4. **Reports and Analysis**: Generate detailed reports and analyses about the performance of the farm and cows, contributing to better strategic decisions.

5. **Quality and Safety Improvement**: By improving cow care and better resource management, the quality of agricultural products can be improved.

## Endpoints

The system provides several endpoints for managing different aspects of the farm. Here are some of them:

-   Login: `{{URL}}/auth/login`
-   Logout: `{{URL}}/auth/logout`
-   Home Page: `{{URL}}/farm/home`
-   Add Insemination: `{{URL}}/farm/Insemination/add`
-   Update Insemination: `{{URL}}/farm/Insemination/update/7`
-   Delete Insemination: `{{URL}}/farm/Insemination/delete/3`
-   View all Inseminations: `{{URL}}/farm/Insemination/all`
-   Confirm Pregnancy: `{{URL}}/farm/Insemination/donePregnant/23?InseminationDate=2023-05-04&InseminatedBullId=23132`
-   Confirm Birth: `{{URL}}/farm/Insemination/BornCow/23?InseminationDate=2023-05-04&InseminatedBullId=23132`
-   Confirm Pregnancy Failure: `{{URL}}/farm/Insemination/notDonePregnant/23?InseminationDate=2023-05-04&InseminatedBullId=23132`
-   Add Animal: `{{URL}}/farm/animals/add`
-   Update Animal: `{{URL}}/farm/animals/update/321`
-   Delete Animal: `{{URL}}/farm/animals/delete/3501`
-   Disable Animal: `{{URL}}/farm/animals/disable/3501`
-   View all Animals: `{{URL}}/farm/animals/all`

## Installation

1. Clone the repo
2. Open Terminal, and write: `npm i` after that create a `.env` file in the root directory
3. Add environment variables:
    - `PORT`: the port number that you want to start the api on
    - `USER`: for login to database connection
    - `PASSWORD`: password of user for database connection
    - `HOST`: like `localHost`
    - `DATABASE`: name of database
    - `DIALECT`: is "MYSQL"
    - `PORT_DB`: port for connection with database mysql
    - `CHARSET`: = "utf8mb4"
    - `COLLATE`: = "utf8mb4_general_ci"
    - `SECRET_KEY`: the private key to generate tokens for users
    - `JWT_EXPIRES_IN`: to generate a key for expires like 90d

## Usage

In this API, there are the following endpoints:

(Continue with the rest of the usage instructions)

## Authentication

For the authentication, I used JSON Web Token (JWT), Bearer Token. When you log in or register an account, you will get a token in the response header "authorization". Use the same header to send the token with your requests for the notes.

## Contact :

Hi, I'm Raed Al Masri, a programmer Backend Developer. You can find me on:

-   `LinkedIn`: https://www.linkedin.com/in/raed-al-masri-445b4b292/
-   `Instagram`: https://www.instagram.com/raed.almasri.tech/
-   `Telegram`: https://t.me/RAED_AL_Masri
-   `Github`: https://github.com/raedAlmasriIt
