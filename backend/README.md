This project is built using Django Framework.
# Django environment setup

1. Create a virtual environment. 
    ```
    virtualenv venv
    ```
    
    Activate virtual environment
    ```
    venv\Scripts\activate
    ```

2. Install all the dependencies from the requirements.txt
    ```
    pip install -r requirements.txt
    ```
    (or pip3, if python3 is used)

3. For models migrations.

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Create superuser and setup username and password

    ```
    python manage.py createsuperuser
    ```

    The above steps are one time process. Only when new models are created repeat step 3.  
    If it is first time, make sure above all steps are completed.

## To up the django server

- Activate the virtual environment using following command.
    ```
    source venv/bin/activate
    ```
  
- Run the below command to up the django server.

    `python manage.py runserver`

 The app will be running on localhost:8000

## To upload a quiz

There is a quiz template 'quiz.txt', a format for adding questions, answers, justifications and explainations.
Once the quiz template is ready, run the following command
```
python manage.py add_quiz.py quiz.txt
```
Running the above command creates a new quiz in the database with all the questions, answers, justifications and explainations added in quiz.txt

## Local Settings

There is an option to switch to different settings, e.g. concerning logging, database setup, and allowed hosts. Also, a secret key must provided (used for token generation). Please refer to 'lsqserver/local_settings.py.template'.  
Initially the app looks for settings in the file pointed to by the environment variable QUIZ_SETTINGS. If this is not present, it picks the settings from 'lqserver/local_settings.py', and if this is not present either, 'lqserver/settings.py' is used (however, the latter preferably should not be changed, since it is under git version control, and local credentials should not be put under version control).

## Logging

Per default, logging information is written to /tmp/quiz.log. This can be changed using the variable `LOGFILE` in the local settings.


